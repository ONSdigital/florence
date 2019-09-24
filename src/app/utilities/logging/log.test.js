import log, { constructEventError } from "./log";
import websocket from "../websocket";

console.error = () => {};

jest.mock("../websocket", () => {
    return {
        send: jest.fn(() => {})
    };
});

jest.mock("../storage", () => {
    return {
        add: jest.fn(() => {})
    };
});

const currentDate = new Date(Date.now());
const currentDateISO = new Date(Date.now()).toISOString();
const currentDatePlus5 = new Date(Date.now()).setSeconds(currentDate.getSeconds() + 5);
const currentDateISOPlus5 = new Date(currentDatePlus5).toISOString();
const testUrl = "http://www.test.com/?search=test";

const simpleLogEvent = {
    event: "A test log",
    created_at: currentDateISO,
    namespace: "florence",
    client_loaded_at: currentDateISO,
    severity: 3
};

const httpLogEvent = {
    ...simpleLogEvent,
    http: {
        method: "GET",
        path: "/",
        query: "?search=test",
        scheme: "http:",
        host: "www.test.com",
        port: undefined,
        status_code: 200,
        started_at: "2017-10-06T13:45:28.975Z",
        ended_at: "2017-10-06T13:45:33.975Z",
        duration: 5000
    }
};

const mockError = new Error("Test error");
const mockSplitStackTrace = mockError.stack.split("\n");
const mockStackTrace = mockSplitStackTrace.map(line => {
    return {
        line: line.trim()
    };
});

const errorLogEvent = {
    ...simpleLogEvent,
    severity: 1,
    error: {
        message: "Test error",
        stack_trace: mockStackTrace
    }
};

const dataLogEvent = {
    ...simpleLogEvent,
    data: {
        test: "test"
    }
};

const complexLogEvent = {
    ...httpLogEvent,
    ...dataLogEvent,
    ...errorLogEvent
};

describe("calling log.event", () => {
    beforeEach(() => {
        websocket.send.mock.calls = [];
    });

    it("creates correct log event", () => {
        const logEvent = log.event(simpleLogEvent.event);
        expect(logEvent).toMatchObject(simpleLogEvent);
    });

    it("creates correct http log event", () => {
        const logEvent = log.event(httpLogEvent.event, log.http("1234", "GET", testUrl, currentDateISO, 200, currentDateISOPlus5));
        expect(logEvent).toMatchObject(httpLogEvent);
    });

    it("creates correct error log event", () => {
        const logEvent = log.event(errorLogEvent.event, log.error(mockError));
        expect(logEvent).toMatchObject(errorLogEvent);
    });

    it("creates correct data log event", () => {
        const logEvent = log.event(errorLogEvent.event, log.data({ test: "test" }));
        expect(logEvent).toMatchObject(dataLogEvent);
    });

    it("creates correct complex (HTTP, error and date) log event", () => {
        const logEvent = log.event(
            errorLogEvent.event,
            log.http("1234", "GET", testUrl, currentDateISO, 200, currentDateISOPlus5),
            log.error(mockError),
            log.data({ test: "test" })
        );
        expect(logEvent).toMatchObject(complexLogEvent);
    });

    it("adds log event to websocket", () => {
        log.event(simpleLogEvent.event);
        expect(websocket.send.mock.calls.length).toBe(1);
        expect(websocket.send.mock.calls[0][0]).toMatch(`log:${JSON.stringify(simpleLogEvent)}`);
    });
});

describe("construct error event", () => {
    it("returns correct error object", () => {
        expect(constructEventError(mockError)).toMatchObject({
            message: "Test error",
            stack_trace: mockStackTrace
        });
    });

    it("returns raw type if error on split", () => {
        const mockError = {
            message: "Test error",
            stack: { test: "test" }
        };
        expect(constructEventError(mockError)).toMatchObject({
            message: "Test error",
            stack_trace: {
                test: "test"
            }
        });
    });
});
