import websocket from '../websocket';

const client_loaded_at = new Date(Date.now()).toISOString();

export default class log {
    static event = (event, ...opts) => {
        const eventData = {
            created_at: new Date(Date.now()).toISOString(),
            namespace: "florence",
            event: event,
            client_loaded_at: client_loaded_at,
            severity: 3
        }

        if (opts) {
            opts.map(opt => {
                opt.attach(eventData)
            })
        }
        websocket.send(`log:${JSON.stringify(eventData)}`);
        return eventData;
    }
    static http = (requestID, method, url, statusCode, startedAt, endedAt ) => {
        return new Http(requestID, method, url, statusCode, startedAt, endedAt);
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
}

class Http {
    constructor(requestID, method, url, statusCode, startedAt, endedAt) {
        this.requestID = requestID,
        this.method = method,
        this.url = url,
        this.statusCode = statusCode, 
        this.startedAt = startedAt, 
        this.endedAt = endedAt
    }

    attach = (event) => {
        const duration = Date.parse(this.endedAt) - Date.parse(this.startedAt);
        const url = new URL(this.url)
        event.trace_id = this.requestID
        event.http = {
            method: this.method,
            path: url.pathname,
            query: url.search,
            scheme: url.protocol,
            host: url.hostname,
            port: url.port ? parseInt(url.port) : null,
            status_code: this.statusCode,
            started_at: this.startedAt,
            ended_at: this.endedAt,
            duration: duration
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
        event.error = this.error ? constructEventError(this.error) : {};
        return event;
    }
}

class ErrorEvent {
    constructor(error) {
        this.error = error;
    }
    attach = (event) => {
        event.severity = 1
        event.error = this.error ? constructEventError(this.error) : {};
        return event;
    }
}

class WarnEvent   {
    constructor(error) {
        this.error = error;
    }
    attach = (event) => {
        event.severity = 2
        event.error = this.error ? constructEventError(this.error) : {};
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
    let stackTrace = [];
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
    return {
        message: error.message,
        stack_trace: stackTrace
    }
}