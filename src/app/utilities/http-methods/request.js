import { HttpError } from './error';
import log, { eventTypes } from '../log';
import uuid from 'uuid/v4';

/**
 * 
 * @param {string} method - must match an HTTP method (eg "GET")
 * @param {string} URI - URI to make a request to
 * @param {boolean} willRetry - (default = true) if true then this function will retry the connection on failure 
 * @param {object} body - JSON of the request body (if it's an applicable HTTP method)
 * @param {function} onRetry - Runs whenever the request is going to be retried. Added for use in unit tests, so that we can run our mocked timeOuts (or else the async test breaks)
 * 
 * @returns {Promise} which returns the response body in JSON format
 */

export default function request(method, URI, willRetry = true, onRetry = function(){}, body) {
    const baseInterval = 50;
    let interval = baseInterval;
    const maxRetries = 5;
    let retryCount = 0;

    return new Promise(function(resolve, reject) {
        tryFetch(resolve, reject, URI, willRetry, body);
    });

    function tryFetch(resolve, reject, URI, willRetry, body) {
        const UID = uuid();
        const logEventPayload = {
            method: method,
            requestID: UID,
            willRetry,
            retryCount
        };
         const fetchConfig = {
            method,
            credentials: "include",
            header: {
                'Content-Type': 'application/json',
                'Request-ID': UID
            }
        }

        if (method === "POST" || method === "PUT") {
            fetchConfig.body = JSON.stringify(body || {});
        }

        log.add(eventTypes.requestSent, logEventPayload);

        fetch(URI, fetchConfig).then(response => {
            if (response.headers.get('content-type').match(/application\/json/)) {
                return response.json().then(data => {
                    logEventPayload.status = response.status;
                    logEventPayload.message = response.message;
                    log.add(eventTypes.requestReceived, logEventPayload);
                    if (response.ok) {
                        return data;
                    } else {
                        reject({status: response.status, message: data.message});
                    }
                });
            }

            throw new HttpError(response);

        }).then(responseJSON => {
            resolve(responseJSON);
        }).catch(fetchError => {

            if (willRetry) {

                // retry post
                if (retryCount < maxRetries) {
                    setTimeout(function() { tryFetch(resolve, reject, URI, willRetry, body) }, interval);
                    retryCount++;
                    interval = interval * 2;
                    onRetry(retryCount);
                } else {

                    // pass error back to caller when max number of retries is met
                    if (fetchError instanceof TypeError) {
                        // connection failed
                        reject({status: 'FETCH_ERR', error: fetchError});
                    } else if (fetchError instanceof HttpError) {
                        // unexpected response
                        reject({status: 'RESPONSE_ERR', error: fetchError})
                    } else {
                        // unexpected error
                        reject({status: 'UNEXPECTED_ERR', error: fetchError})
                    }

                    retryCount = 0;
                    interval = baseInterval;

                }
                return;
            }

            // pass error back to caller when max number of retries is met
            if (fetchError instanceof TypeError) {
                // connection failed
                reject({status: 'FETCH_ERR', error: fetchError});
            } else if (fetchError instanceof HttpError) {
                // unexpected response
                reject({status: 'RESPONSE_ERR', error: fetchError})
            } else {
                // unexpected error
                reject({status: 'UNEXPECTED_ERR', error: fetchError})
            }

        });
    }
}
