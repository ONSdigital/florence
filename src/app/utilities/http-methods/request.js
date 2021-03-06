import { HttpError } from "./error";
import log from "../logging/log";
import uuid from "uuid/v4";
import user from "../api-clients/user";
import notifications from "../notifications";

/**
 *
 * @param {string} method - must match an HTTP method (eg "GET")
 * @param {string} URI - URI to make a request to
 * @param {boolean} willRetry - (default = true) if true then this function will retry the connection on failure
 * @param {object} body - JSON of the request body (if it's an applicable HTTP method)
 * @param {function} onRetry - Runs whenever the request is going to be retried. Added for use in unit tests, so that we can run our mocked timeOuts (or else the async test breaks)
 * @param {boolean} callerHandles401 - Flag to decide whether caller or global handler is to handle 401 responses
 *
 * @returns {Promise} which returns the response body in JSON format
 */

export default function request(method, URI, willRetry = true, onRetry = () => {}, body, callerHandles401) {
    const baseInterval = 50;
    let interval = baseInterval;
    const maxRetries = 5;
    let retryCount = 0;

    return new Promise(function(resolve, reject) {
        tryFetch(resolve, reject, URI, willRetry, body);
    });

    function tryFetch(resolve, reject, URI, willRetry, body) {
        const UID = uuid();
        const URL = window.location.origin + URI;

        const fetchConfig = {
            method,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Request-ID": UID,
                "internal-token": "FD0108EA-825D-411C-9B1D-41EF7727F465"
            }
        };

        if (method === "POST" || method === "PUT") {
            fetchConfig.body = JSON.stringify(body || {});
        }

        const requestSentAt = new Date(Date.now()).toISOString();
        log.event("Request sent", log.http(UID, method, URL, requestSentAt));

        fetch(URI, fetchConfig)
            .then(response => {
                const responseReceivedAt = new Date(Date.now()).toISOString();
                log.event("Response received", log.http(UID, method, URL, requestSentAt, response.status, responseReceivedAt));

                if (response.status >= 500) {
                    throw new HttpError(response);
                }

                if (response.status === 401) {
                    if (callerHandles401) {
                        reject({
                            status: response.status,
                            message: response.statusText
                        });
                        return;
                    }

                    // To save doing this exact same function throughout the app we handle a 401
                    // here (ie at the lowest level possible)
                    const notification = {
                        type: "neutral",
                        message: "Your session has expired so you've been redirected to the login screen",
                        isDismissable: true,
                        autoDismiss: 20000
                    };
                    user.logOut();
                    notifications.add(notification);
                    reject({
                        status: response.status,
                        message: response.statusText
                    });
                    return;
                }

                if (!response.ok) {
                    response.text().then(body => {
                        reject({
                            status: response.status,
                            message: response.statusText,
                            body: parseBodyAsJson(body)
                        });
                    });
                    return;
                }

                if (response.status === 204) {
                    resolve({
                        status: response.status,
                        message: response.statusText
                    });
                    return;
                }

                let responseIsJSON = false;
                let responseIsText = false;
                try {
                    responseIsJSON = response.headers.get("content-type").match(/application\/json/);
                    responseIsText = response.headers.get("content-type").match(/text\/plain/);
                } catch (error) {
                    console.error(`Error trying to parse content-type header`, error);
                    log.event(
                        "Error trying to parse content-type header",
                        log.error(error),
                        log.data({
                            header_content_type: response.headers.get("content-type")
                        })
                    );

                    // This is a temporary fix because one of our CMD APIs doesn't return a content-type header and it's break the entire journey
                    // unless we just allow 204 responses to resolve, instead of reject with an error
                    if (response.status >= 200) {
                        resolve();
                        return;
                    }

                    reject({
                        status: "RUNTIME_ERROR",
                        message: `Error trying to parse response's content-type header`
                    });
                    return;
                }

                if (!responseIsJSON && method !== "POST" && method !== "PUT") {
                    log.event(
                        `Received request response for method that didn't have the 'application/json' header`,
                        log.warn(),
                        log.data({ method: method })
                    );
                }

                // We've detected a text response so we should try to parse as text, not JSON
                if (responseIsText) {
                    (async () => {
                        try {
                            const text = await response.text();
                            resolve(text);
                        } catch (error) {
                            console.error("Error trying to parse request body as text: ", error);
                            log.event("Error trying to parse request body as text", log.error(error));

                            if (method === "POST" || method === "PUT") {
                                resolve();
                                return;
                            }

                            reject({
                                status: response.status,
                                message: "Text response body couldn't be parsed"
                            });
                        }
                    })();
                    return;
                }

                // We're wrapping this try/catch in an async function because we're using 'await'
                // which requires being executed inside an async function (which the 'fetch' can't be set as)
                (async () => {
                    try {
                        const json = await response.json();
                        resolve(json);
                    } catch (error) {
                        // We're not necessarily relying on a response with these methods
                        // so we should still resolve the promise, just with no response body
                        if (method === "POST" || method === "PUT") {
                            resolve();
                            return;
                        }

                        console.error("Error trying to parse request body as JSON: ", error);
                        log.event("Error trying to parse request body as JSON", log.error(error));

                        // We're trying to get data at this point and the body can't be parsed
                        // which means this request is a failure and the promise should be rejected
                        reject({
                            status: response.status,
                            message: "JSON response body couldn't be parsed"
                        });
                    }
                })();
            })
            .catch((fetchError = { message: "No error message given" }) => {
                const requestFailedAt = new Date(Date.now()).toISOString();
                log.event("Request failed", log.http(UID, method, URL, requestSentAt, undefined, requestFailedAt), log.error(fetchError));
                if (willRetry) {
                    // retry post
                    if (retryCount < maxRetries) {
                        setTimeout(function() {
                            tryFetch(resolve, reject, URI, willRetry, body);
                        }, interval);
                        retryCount++;
                        interval = interval * 2;
                        onRetry(retryCount);
                    } else {
                        // pass error back to caller when max number of retries is met
                        if (fetchError instanceof TypeError) {
                            // connection failed
                            reject({ status: "FETCH_ERR", error: fetchError });
                        } else if (fetchError instanceof HttpError) {
                            // unexpected response
                            reject({
                                status: "RESPONSE_ERR",
                                error: fetchError
                            });
                        } else {
                            // unexpected error
                            reject({
                                status: "UNEXPECTED_ERR",
                                error: fetchError
                            });
                        }

                        retryCount = 0;
                        interval = baseInterval;
                    }
                    return;
                }

                // pass error back to caller when max number of retries is met
                if (fetchError instanceof TypeError) {
                    // connection failed
                    reject({ status: "FETCH_ERR", error: fetchError });
                } else if (fetchError instanceof HttpError) {
                    // unexpected response
                    reject({ status: "RESPONSE_ERR", error: fetchError });
                } else {
                    // unexpected error
                    reject({ status: "UNEXPECTED_ERR", error: fetchError });
                }
            });
    }

    function parseBodyAsJson(body) {
        if (!body) {
            return null;
        }
        try {
            return JSON.parse(body);
        } catch (error) {
            console.warn(`Error parsing request body as JSON, returned body as ${typeof body}`);
            return body;
        }
    }
}
