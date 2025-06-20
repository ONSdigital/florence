import request from "./request";
import "isomorphic-fetch";
import log from "../logging/log";
import { fail } from "assert";
import { createDefaultExpiryTimes } from "dis-authorisation-client-js";

// Mocks
function createSession() {
    const mockTimers = createDefaultExpiryTimes(1);
    return new Date(mockTimers.session_expiry_time).toISOString().replace(/Z/, " +0000 UTC");
}
const mockSessionExpiryTime = createSession();

jest.mock("../logging/log", () => {
    return {
        event: jest.fn(() => {
            // do nothing
        }),
        data: jest.fn(() => {}),
        http: jest.fn(() => {}),
        error: jest.fn(() => {}),
        warn: jest.fn(() => {}),
    };
});
jest.mock("../../utilities/api-clients/user", () => {
    class user {}
    user.renewSession = () => Promise.resolve({ expirationTime: mockSessionExpiryTime });
    user.logOut = () => Promise.resolve();
    return user;
});
console.error = jest.fn();

beforeEach(() => {
    log.event.mockClear();
    fetch.mockClear();
});

jest.useFakeTimers();

test("Request doesn't retry when the fetch resolves", async () => {
    fetch.mockResponse("{}", {
        headers: new Headers({
            "content-type": "application/json",
        }),
        status: 200,
    });
    let retries = 0;
    expect(fetch).toHaveBeenCalledTimes(0);
    await request(
        "GET",
        "/foobar",
        true,
        function () {
            jest.runOnlyPendingTimers();
            retries++;
        },
        null
    ).catch(() => {
        fail();
    });
    expect(retries).toEqual(0);
});

test("Request back-off attempts 5 retries when fetches fail", async () => {
    let retries = 0;
    fetch.mockReject("{}");
    expect(fetch).toHaveBeenCalledTimes(0);
    try {
        await request(
            "GET",
            "/foobar",
            true,
            function () {
                jest.runOnlyPendingTimers();
                retries++;
            },
            null
        );
    } catch (e) {
        expect(e);
    }
    expect(fetch).toHaveBeenCalledTimes(6);
    expect(retries).toEqual(5);
});

test("Request back-off resolves as soon as a fetch is successful", async () => {
    fetch.mockReject("{}");
    expect(fetch).toHaveBeenCalledTimes(0);
    try {
        await request(
            "GET",
            "/foobar",
            true,
            function (retryCount) {
                jest.runOnlyPendingTimers();
                // Make sure the next attempted fetch is successful so we can check that it doesn't attempt any more fetches
                if (retryCount === 2) {
                    fetch.mockResponse(JSON.stringify({}), {
                        headers: new Headers({
                            "content-type": "application/json",
                        }),
                        status: 200,
                    });
                }
            },
            null
        );
    } catch (e) {
        expect(e);
    }
    expect(fetch).toHaveBeenCalledTimes(4);
});

test("Request returns to caller to handle 401 if callerHandles401 flag is set", async () => {
    fetch.mockResponse(JSON.stringify({}), {
        headers: new Headers({
            "content-type": "application/json",
        }),
        status: 401,
    });

    expect(fetch).toHaveBeenCalledTimes(0);
    try {
        await request("POST", "/foobar", false, null, JSON.stringify({}), true);
        fail("Request with 401 handler didn't reject on 401 response");
    } catch (error) {
        expect(fetch).toHaveBeenCalledTimes(3);
        expect(error.status).toBe(401);
    }

    fetch.mockReset();
});

test("Request back-off won't retry failed fetch if willRetry flag is set to false and reject with an error status", async () => {
    fetch.mockReject("{}");
    expect(fetch).toHaveBeenCalledTimes(0);
    try {
        await request(
            "GET",
            "/foobar",
            false,
            function () {
                jest.runOnlyPendingTimers();
            },
            null
        );
    } catch (e) {
        expect(e).toMatchObject({ status: "UNEXPECTED_ERR" });
    }

    expect(fetch).toHaveBeenCalledTimes(1);
});

test("Request back-off won't retry successful fetch if willRetry flag is set to false", async () => {
    fetch.mockResponse(JSON.stringify({}), {
        headers: new Headers({
            "content-type": "application/json",
        }),
        status: 200,
    });
    expect(fetch).toHaveBeenCalledTimes(0);
    try {
        await request(
            "GET",
            "/foobar",
            false,
            function () {
                fail("A retry was attempted despite willRetry being set to false");
            },
            null
        );
    } catch (e) {
        console.error(e);
        fail("Request promise rejected");
    }

    expect(fetch).toHaveBeenCalledTimes(1);
});

test("PUT/POST request response without a JSON body but with an 'application/json' header still executes and resolves", async () => {
    fetch.mockResponse("", {
        headers: new Headers({
            "content-type": "application/json",
        }),
        status: 200,
    });

    await expect(request("PUT", "/foobar")).resolves.toBe(undefined);
    await expect(request("POST", "/foobar")).resolves.toBe(undefined);
});

test("GET request response without a 'content-type' header logs an error", async () => {
    fetch.mockResponse(JSON.stringify({}), {
        headers: new Headers({}),
        status: 200,
    });

    let runtimeErrors = log.event.mock.calls.filter(call => {
        return call[0] === "UNEXPECTED_RUNTIME_ERROR";
    });
    expect(runtimeErrors.length).toBe(0);
    try {
        await request("GET", "/foobar");
    } catch (error) {
        runtimeErrors = log.event.mock.calls.filter(call => {
            return call[0] === "UNEXPECTED_RUNTIME_ERROR";
        });
        expect(runtimeErrors.length).toBe(1);
    }
});

test("GET request response without an 'application/json' header logs a warning", async () => {
    fetch.mockResponse(JSON.stringify({}), {
        headers: new Headers({
            "content-type": "",
        }),
        status: 200,
    });
    let runtimeWarnings = log.event.mock.calls.filter(call => {
        return call[0] === "Received request response for method that didn't have the 'application/json' header";
    });
    expect(runtimeWarnings.length).toBe(0);
    await request("GET", "/foobar");
    runtimeWarnings = log.event.mock.calls.filter(call => {
        return call[0] === "Received request response for method that didn't have the 'application/json' header";
    });

    expect(runtimeWarnings.length).toBe(1);
});

test("PUT request response without an 'application/json' header doesn't log a warning", async () => {
    fetch.mockResponse(JSON.stringify({}), {
        headers: new Headers({
            "content-type": "",
        }),
        status: 200,
    });

    let runtimeWarnings = log.event.mock.calls.filter(call => {
        return call[0] === "RUNTIME_WARNING";
    });
    expect(runtimeWarnings.length).toBe(0);
    await request("PUT", "/foobar");
    runtimeWarnings = log.event.mock.calls.filter(call => {
        return call[0] === "RUNTIME_WARNING";
    });
    expect(runtimeWarnings.length).toBe(0);
});

test("GET request response with 200 status, no JSON body but an 'application/json' header rejects", async () => {
    fetch.mockResponse("", {
        headers: new Headers({
            "content-type": "application/json",
        }),
        status: 200,
    });

    const failedRequest = request("GET", "/foobar");
    try {
        await expect(failedRequest).rejects.toBeDefined();
    } catch (error) {
        console.error(error);
    }
});

// test("GET request response with 200 status, a JSON body but no 'application/json' header resolves", async () => {
//     fetch.mockResponse(JSON.stringify({}),
//         {
//             "status": 200
//         }
//     );

//     const failedRequest = request('GET', '/foobar');
//     await expect(failedRequest).resolves.toBeDefined();
// });
