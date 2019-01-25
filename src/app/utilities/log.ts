
interface Loggable {
    attach(event: EventData): EventData,
}

interface EventData {
    created_at: string,
    namespace: string,
    event: string,
    client_loaded_at: string,
    //trace_id: string,
    //span_id: string,
    severity: number,
    http?: EventHttp,
    auth?: EventAuth,
    data?: Map<string,string>,
    testString?: string
}

interface EventHttp {
    method: string,
    path: string,
    query: string,
    scheme: string,
    host: string,
    port: number,
    status_code: number,
    started_at: Date,
    ended_at: Date,
    duration: number
}

interface EventAuth {
    identity: string,
    identity_type: string
}

interface Http {
    httpEvent: EventHttp
}
interface Auth {
    authEvent: EventAuth
}

interface Fatal {
    severity: number
}

interface Error{
    severity: number
}

interface Warn {
    severity: number
}

interface Info {
    severity: number
}

interface Data {
    dataEvent: Map<string,string>,
}

const client_loaded_at = new Date(window.performance.timing.navigationStart + window.performance.now()).toISOString();

export default class log {
    static event = (event: string, ...opts: any[]): void => {
        const eventData: EventData = {
            created_at: new Date(window.performance.timing.navigationStart + window.performance.now()).toISOString(),
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
    }
    static http = (httpEvent: EventHttp): Http => {
        return new Http(httpEvent);
    }
    static auth = (authEvent: EventAuth): Auth => {
        return new Auth(authEvent);
    }
    static data = (dataEvent: Map<string,string>): Data => {
        return new Data(dataEvent);
    }

    static fatal = (): Fatal => new Fatal()
    static error = (): Error => new Error()
    static warn = (): Warn => new Warn()
    static info = (): Info => new Info()
}

class Http implements Loggable {
    constructor(httpEvent: EventHttp) {
        this.httpEvent = httpEvent;
    }
    attach = (event: EventData): EventData => {
        event.http = this.httpEvent
        return event;
    }
}

class Auth implements Loggable {
    constructor(authEvent: EventAuth) {
        this.authEvent = authEvent;
    }
    attach = (event: EventData): EventData => {
        event.auth = this.authEvent
        return event;
    }
}

class Data implements Loggable {
    constructor(dataEvent: Map<string,string>) {
        this.dataEvent = dataEvent;
    }
    attach = (event: EventData): EventData => {
        event.data = this.dataEvent
        return event;
    }
}

class Fatal implements Loggable {
    attach = (event: EventData): EventData => {
        event.severity = 0
        return event;
    }
}

class Error implements Loggable {
    attach = (event: EventData): EventData => {
        event.severity = 1
        return event;
    }
}

class Warn implements Loggable {
    attach = (event: EventData): EventData => {
        event.severity = 2
        return event;
    }
}

class Info implements Loggable {
    attach = (event: EventData): EventData => {
        event.severity = 3
        return event;
    }
}
