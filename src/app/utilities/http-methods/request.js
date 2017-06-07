import { HttpError } from './error';
import log, { eventTypes } from '../log';
import uuid from 'uuid/v4';

const baseInterval = 50;
let interval = baseInterval;
const maxRetries = 5;
let retryCount = 0;

export default function request(method, uri, willRetry, body) {

    willRetry = willRetry || true;

    return new Promise(function(resolve, reject) {
        tryFetch(resolve, reject, uri, willRetry, body);
    });

    function tryFetch(resolve, reject, uri, willRetry, body) {
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

        if (method === "POST") {
            fetchConfig.body = JSON.stringify(body || {});
        }

        log.add(eventTypes.requestSent, logEventPayload);

        fetch(uri, fetchConfig).then(response => {
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
                    setTimeout(function() { tryFetch(resolve, reject, uri, willRetry, body) }, interval);
                    retryCount++;
                    interval = interval * 2;
                    console.log(retryCount, maxRetries, interval);
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
