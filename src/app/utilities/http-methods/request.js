import { HttpError } from "./error";
import log from "../logging/log";
import uuid from "uuid/v4";
import user from "../api-clients/user";
import notifications from "../notifications";
import { errCodes } from "../errorCodes";

import { store } from "../../config/store";
import { getAuthState } from "../auth";
import fp from "lodash/fp";
import sessionManagement from "../sessionManagement";
import { startRefeshAndSession } from "../../config/user/userActions";

const config = window.getEnv();
/**
 *
 * @param {string} method - must match an HTTP method (eg "GET")
 * @param {string} URI - URI to make a request to
 * @param {boolean} willRetry - (default = true) if true then this function will retry the connection on failure
 * @param {object} body - JSON of the request body (if it's an applicable HTTP method)
 * @param {function} onRetry - Runs whenever the request is going to be retried. Added for use in unit tests, so that we can run our mocked timeOuts (or else the async test breaks)
 * @param {boolean} callerHandles401 - Flag to decide whether caller or global handler is to handle 401 responses
 * @param {boolean} returnResponseHeaders - Flag to decide whether to return headers along with usual response
 *
 * @returns {Promise} which returns the response body in JSON format
 */

export default function request(method, URI, willRetry = true, onRetry = () => {}, body, callerHandles401, returnResponseHeaders) {
    const baseInterval = 50;
    let interval = baseInterval;
    const maxRetries = 5;
    let retryCount = 0;

    return new Promise(function (resolve, reject) {
        tryFetch(resolve, reject, URI, willRetry, body, returnResponseHeaders);
    });

    function tryFetch(resolve, reject, URI, willRetry, body, returnResponseHeaders) {
        const UID = uuid();
        const URL = window.location.origin + URI;

        const fetchConfig = {
            method,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Request-ID": UID,
                "internal-token": "FD0108EA-825D-411C-9B1D-41EF7727F465",
            },
        };

        if (method === "POST" || method === "PUT" || method === "PATCH") {
            fetchConfig.body = JSON.stringify(body || {});
        }

        const requestSentAt = new Date(Date.now()).toISOString();
        log.event("Request sent", log.http(UID, method, URL, requestSentAt));

        fetch(URI, fetchConfig)
            .then(response => {
                let status = response.status;
                const responseReceivedAt = new Date(Date.now()).toISOString();
                log.event("Response received", log.http(UID, method, URL, requestSentAt, status, responseReceivedAt));

                if (status >= 500) {
                    throw new HttpError(response);
                }

                if (status === 401) {
                    if (config.enableNewSignIn) {
                        // Attempt to get a new refresh the access_token
                        const authState = getAuthState();
                        const refresh_expiry_time = new Date(fp.get("refresh_expiry_time")(authState));
                        user.renewSession()
                            .then(res => {
                                // update the authState, start the session timer with the next session response value
                                // & restart the refresh timer with the existing refresh value.
                                const expirationTime = sessionManagement.convertUTCToJSDate(fp.get("expirationTime")(res));
                                sessionManagement.initialiseSessionExpiryTimers(expirationTime, refresh_expiry_time);
                                store.dispatch(startRefeshAndSession(refresh_expiry_time, expirationTime));
                                // Retry the resource request with new access_token
                                tryFetch(resolve, reject, URI, willRetry, body, returnResponseHeaders);
                            })
                            .catch(err => {
                                // log out
                                console.error(err);
                                user.logOut();
                                notifications.add(notification);
                                reject({
                                    status: status,
                                    message: response.statusText,
                                });
                                return;
                            });
                    }

                    if (callerHandles401) {
                        response.text().then(body => {
                            reject({
                                status: status,
                                message: response.statusText,
                                body: parseBodyAsJson(body),
                            });
                        });
                        return;
                    }
                    // To save doing this exact same function throughout the app we handle a 401
                    // here (ie at the lowest level possible)
                    const notification = {
                        type: "neutral",
                        message: errCodes.SESSION_EXPIRED,
                        isDismissable: true,
                        autoDismiss: 20000,
                    };
                    user.logOut();
                    notifications.add(notification);
                    reject({
                        status: status,
                        message: response.statusText,
                    });
                    return;
                }

                if (!response.ok) {
                    response.text().then(body => {
                        reject({
                            status: status,
                            message: response.statusText,
                            body: parseBodyAsJson(body),
                        });
                    });
                    return;
                }

                if (status === 204) {
                    resolve({
                        status: status,
                        message: response.statusText,
                    });
                    return;
                }

                let responseIsJSON = false;
                let responseIsText = false;
                try {
                    if (response.headers && Object.entries(response.headers).length !== 0) {
                        responseIsJSON = response.headers.get("content-type").match(/application\/json/);
                        responseIsText = response.headers.get("content-type").match(/text\/plain/);
                    }
                } catch (error) {
                    console.error(`Error trying to parse content-type header`, error);
                    log.event(
                        "Error trying to parse content-type header",
                        log.error(error),
                        log.data({
                            header_content_type: response.headers.get("content-type"),
                        })
                    );

                    // This is a temporary fix because one of our CMD APIs doesn't return a content-type header and it's break the entire journey
                    // unless we just allow 204 responses to resolve, instead of reject with an error
                    if (status >= 200) {
                        resolve();
                        return;
                    }

                    reject({
                        status: "RUNTIME_ERROR",
                        message: `Error trying to parse response's content-type header`,
                    });
                    return;
                }

                if (!responseIsJSON && method !== "POST" && method !== "PUT" && method !== "PATCH") {
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
                            returnResponseHeaders ? resolve({ body: text, headers: response.headers }) : resolve(text);
                        } catch (error) {
                            console.error("Error trying to parse request body as text: ", error);
                            log.event("Error trying to parse request body as text", log.error(error));

                            if (method === "POST" || method === "PUT" || method === "PATCH") {
                                resolve();
                                return;
                            }

                            reject({
                                status: status,
                                message: "Text response body couldn't be parsed",
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
                        returnResponseHeaders ? resolve({ body: json, headers: response.headers }) : resolve(json);
                    } catch (error) {
                        // We're not necessarily relying on a response with these methods
                        // so we should still resolve the promise, just with no response body
                        if (method === "POST" || method === "PUT" || method === "PATCH") {
                            resolve();
                            return;
                        }

                        console.error("Error trying to parse request body as JSON: ", error);
                        log.event("Error trying to parse request body as JSON", log.error(error));

                        // We're trying to get data at this point and the body can't be parsed
                        // which means this request is a failure and the promise should be rejected
                        reject({
                            status: status,
                            message: "JSON response body couldn't be parsed",
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
                        setTimeout(function () {
                            tryFetch(resolve, reject, URI, willRetry, body, returnResponseHeaders);
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
                                error: fetchError,
                            });
                        } else {
                            // unexpected error
                            reject({
                                status: "UNEXPECTED_ERR",
                                error: fetchError,
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
