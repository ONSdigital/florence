import { browserHistory } from 'react-router';
import storage from '../storage';
import websocket from '../websocket';

const client_loaded_at = new Date(Date.now()).toISOString();

export default class log {

    static initialise() {
        this.event("App initialised");
        browserHistory.listen(location => {
            log.event("Route change", log.data({...location}));
        });
    }

    /**
     * @param {string} event - tells us what event is being logged
     * @param {*} opts - log method
     */
    static event = (event, ...opts) => {
        const eventData = {
            event: event,
            created_at: new Date(Date.now()).toISOString(),
            namespace: "florence",
            client_loaded_at: client_loaded_at,
            severity: 3
        }

        if (opts) {
            opts.map(opt => {
                opt.attach(eventData)
            })
        }
        storage.add(eventData);
        websocket.send(`log:${JSON.stringify(eventData)}`);
        return eventData;
    }

    /**
     * @param {string} requestID - unique ID for request being made
     * @param {string} method - HTTP request method
     * @param {string} url - full URL of request
     * @param {string} startedAt - ISOstring of time request started
     * @param {number} statusCode 
     * @param {string} endedAt - ISOstring time request finished
     * @returns {Http} - class with attach method 
     */
    static http = (requestID, method, url, startedAt, statusCode, endedAt) => {
        return new Http(requestID, method, url, startedAt, statusCode, endedAt);
    }
    static data = dataEvent => {
        return new Data(dataEvent);
    }
    static fatal = error => { 
        return new FatalEvent(error) 
    }
    static error = error => { 
        return new ErrorEvent(error) 
    }
    static warn = error => { 
        return new WarnEvent(error) 
    }
    static info = () => new InfoEvent()

    /**
     * 
     * @param {number} skip - (Optional) start point of the items we'd like to receive
     * @param {number} limit - (Optional) the number of items we'd like to receive
     * @param {number} requestTimestamp - (Optional) a Unix timestamp that 
     */
    static getAll(skip, limit, requestTimestamp) {
        return storage.getAll(skip, limit, requestTimestamp);
    }

    /**
     * @returns {Promise} - Which resolves to am integer
     */
    static length() {
        return storage.length();
    }

    /**
     * @returns {Promise}
     */
    static removeAll() {
        return storage.removeAll();
    }
}

class Http {
    constructor(requestID, method, url, startedAt, statusCode, endedAt) {
        this.requestID = requestID,
        this.method = method,
        this.url = url,
        this.statusCode = statusCode, 
        this.startedAt = startedAt, 
        this.endedAt = endedAt
    }

    attach = (event) => {
        const duration = Date.parse(this.endedAt) - Date.parse(this.startedAt);
        const url = new URL(this.url);
        event.trace_id = this.requestID;
        event.http = {
            method: this.method,
            // set url methods and duration to undefined so these are omitted 
            // when JSON.strinify'ing them to send over the websocket
            path: url.pathname || undefined,
            query: url.search || undefined,
            scheme: url.protocol || undefined,
            host: url.hostname || undefined,
            port: url.port ? parseInt(url.port) : undefined,
            status_code: this.statusCode,
            started_at: this.startedAt,
            ended_at: this.endedAt,
            duration: duration || undefined
        }
        return event;
    }
}

class Data {
    constructor(dataEvent) {
        this.dataEvent = dataEvent;
    }
    attach = (event) => {
        event.data = this.dataEvent
        return event;
    }
}

class FatalEvent {
    constructor(error) {
        this.error = error;
    }
    attach = (event) => {
        event.severity = 0
        event.error = this.error ? constructEventError(this.error) : undefined
        return event;
    }
}

class ErrorEvent {
    constructor(error) {
        this.error = error;
    }
    attach = (event) => {
        event.severity = 1
        event.error = this.error ? constructEventError(this.error) : undefined
        return event;
    }
}

class WarnEvent   {
    constructor(error) {
        this.error = error;
    }
    attach = (event) => {
        event.severity = 2
        event.error = this.error ? constructEventError(this.error) : undefined
        return event;
    }
}

class InfoEvent   {
    attach = (event) => {
        event.severity = 3
        return event;
    }
}

export function constructEventError(error) {
    let stackTrace = undefined;
    if (error.stack) {
        try {
            const splitStackTrace = error.stack.split('\n');
            stackTrace = splitStackTrace.map(line => {
                return {
                    line: line.trim()
                }
            })
        } catch (err) {
            console.error(err)
            stackTrace = error.stack;
        }
    }
    return {
        message: error.message,
        stack_trace: stackTrace
    }
}