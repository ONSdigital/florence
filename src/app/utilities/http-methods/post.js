import { HttpError } from './error';
import log, { eventTypes } from '../log';
import uuid from 'uuid/v4';

const baseInterval = 50;
let interval = baseInterval;
const maxRetries = 5;
let reTryCount = 0;

export function httpPost(uri, body, reTry) {

    if (reTry !== true) {reTry = false}

    return new Promise(function(resolve, reject) {
        doPost(resolve, reject, uri, body, reTry);
    });

    function doPost(resolve, reject, uri, body, reTry) {
        const UID = uuid();
        const logEventPayload = {
            method: "POST",
            requestID: UID,
            retry: reTry,
            retryCount: reTryCount
        };

        log.add(eventTypes.requestSent, logEventPayload);
        fetch(uri, {
            credentials: "include",
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Request-ID': UID
            },
            body: JSON.stringify((body || {}))
        }).then(response => {
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

            if (reTry) {

                // retry post
                if (reTryCount < maxRetries) {
                    setTimeout(function() { doPost(resolve, reject, uri, body, reTry) }, interval);
                    reTryCount++;
                    interval = interval * 2;
                    console.log(reTryCount, maxRetries, interval);
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

                    reTryCount = 0;
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
