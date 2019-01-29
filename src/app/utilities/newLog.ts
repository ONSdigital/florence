import websocket from './websocket';
interface Loggable {
    attach(event: EventData): EventData,
}

type EventData = {
    created_at: string,
    namespace: string,
    event: string,
    client_loaded_at: string,
    trace_id?: string,
    //span_id: string,
    severity: number,
    http?: EventHttp,
    data?: object,
    error?: EventError
}

interface EventHttp {
    method: string,
    path: string,
    query: string,
    scheme: string,
    host: string,
    port: number,
    status_code: number,
    started_at: string,
    ended_at: string,
    duration: number
}

interface EventError {
    message: string,
    stack_trace: StackTrace[]
}

interface StackTrace {
    line: string,
    file?: string,
    function?: string
}

interface Http {
    requestID: string, 
    method: string,
    url: string,
    statusCode: number, 
    startedAt: string, 
    endedAt: string
}
interface FatalEvent {
    severity: number,
    error: Error
}

interface ErrorEvent{
    severity: number,
    error: Error
}

interface WarnEvent {
    severity: number,
    error: Error
}

interface InfoEvent {
    severity: number
}

interface Data {
    dataEvent: object
}

const client_loaded_at = new Date().toISOString();

export default class log {
    static event = (event: string, ...opts: any[]): void => {
        const eventData: EventData = {
            created_at: new Date().toISOString(),
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
        console.log("LOG =>", eventData)
        websocket.send(`log:${JSON.stringify(event)}`);
        return;
    }
    static http = (requestID: string, method: string, url: string, statusCode: number, startedAt: string, endedAt: string ): Http => {
        return new Http(requestID, method, url, statusCode, startedAt, endedAt);
    }
    static data = (dataEvent: object): Data => {
        return new Data(dataEvent);
    }
    static fatal = (error: Error): FatalEvent => { 
        return new FatalEvent(error) 
    }
    static error = (error: Error): ErrorEvent => { 
        return new ErrorEvent(error) 
    }
    static warn = (error: Error): WarnEvent => { 
        return new WarnEvent(error) 
    }
    static info = (): InfoEvent => new InfoEvent()
}

class Http implements Loggable {
    constructor(requestID: string, method: string, url: string, statusCode: number, startedAt: string, endedAt: string) {
        this.requestID = requestID,
        this.method = method,
        this.url = url,
        this.statusCode = statusCode, 
        this.startedAt = startedAt, 
        this.endedAt = endedAt
    }

    attach = (event: EventData): EventData => {
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

class Data implements Loggable {
    constructor(dataEvent: object) {
        this.dataEvent = dataEvent;
    }
    attach = (event: EventData): EventData => {
        event.data = this.dataEvent
        return event;
    }
}

class FatalEvent implements Loggable {
    constructor(error: Error) {
        this.error = error;
    }
    attach = (event: EventData): EventData => {
        event.severity = 0
        event.error = constructEventError(this.error)
        return event;
    }
}

class ErrorEvent implements Loggable {
    constructor(error: Error) {
        this.error = error;
    }
    attach = (event: EventData): EventData => {
        event.severity = 1
        event.error = constructEventError(this.error)
        return event;
    }
}

class WarnEvent implements Loggable {
    constructor(error: Error) {
        this.error = error;
    }
    attach = (event: EventData): EventData => {
        event.severity = 2
        event.error = constructEventError(this.error)
        return event;
    }
}

class InfoEvent implements Loggable {
    attach = (event: EventData): EventData => {
        event.severity = 3
        return event;
    }
}

function constructEventError(error: Error): EventError {
    const splitStackTrace = error.stack.split('\n');
    const stackTrace = splitStackTrace.map(line => {
        return {
            line: line.trim()
        }
    })
    return {
        message: error.message,
        stack_trace: stackTrace
    }
}