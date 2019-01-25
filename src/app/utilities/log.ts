
interface Loggable {
    attach(event: object): object,
}

interface LogEvent {
    created_at: string,
    namespace: string,
    event: string,
    //trace_id: string,
    //span_id: string,
    //severity: number,
    http?: HttpEvent,
    auth?: AuthEvent,
    data?: object,
    testString?: string
}

interface HttpEvent {
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

interface AuthEvent {
    identity: string,
    identity_type: string
}

export interface Http {
    httpEvent: HttpEvent
}

export interface Auth {
    authEvent: AuthEvent
}

export default class log {


    static event = (event: string, ...opts: any[]): void => {

        const eventLog: LogEvent = {
            created_at: new Date(window.performance.timing.navigationStart + window.performance.now()).toISOString(),
            namespace: "florence",
            event: event,
        }
        if (opts) {
            opts.map(opt => {
                opt.attach(eventLog)
            })
        }
        console.log("I'm logging something =>", eventLog)
    }

}

export class Http implements Loggable {
    constructor(httpEvent: HttpEvent) {
        this.httpEvent = httpEvent;
        this.attach = this.attach;
    }

    attach = (event: LogEvent) => {
        event.http = this.httpEvent
        return event
    }
}

export class Auth implements Loggable {
    constructor(authEvent: AuthEvent) {
        this.authEvent = authEvent;
        this.attach = this.attach;
    }

    attach = (event: LogEvent) => {
        event.auth = this.authEvent
        return event
    }
}
