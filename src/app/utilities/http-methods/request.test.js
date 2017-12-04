import request from './request';
import 'isomorphic-fetch';
import log from '../log';

jest.mock('../log', () => {
    return {
        add: jest.fn(() => {
            // do nothing
        }),
        eventTypes: {
            runtimeWarning: "RUNTIME_WARNING"
        }
    }
})
console.error = jest.fn();

beforeEach(() => {
    log.add.mockClear();
    fetch.mockClear();
})

jest.useFakeTimers();

test("Request back-off attempts 5 retries when fetches fail", async () => {
    fetch.mockReject();
    expect(fetch).toHaveBeenCalledTimes(0);
    try {
        await request('GET', '/foobar', true, function() {
            jest.runOnlyPendingTimers();
        }, null);
    } catch(e) {
        expect(e);
    }
    expect(fetch).toHaveBeenCalledTimes(6);
})

test("Request back-off resolves as soon as a fetch is successful", async () => {
    fetch.mockReject();
    expect(fetch).toHaveBeenCalledTimes(0);
    try {
        await request('GET', '/foobar', true, function(retryCount) {
            jest.runOnlyPendingTimers();
            // Make sure the next attempted fetch is successful so we can check that it doesn't attempt any more fetches
            if (retryCount === 2) {
                fetch.mockResponse(JSON.stringify({}), 
                    {
                        "headers": new Headers({
                            'content-type': 'application/json'
                        }),
                        "status": 200
                    }
                );
            }
        }, null)
    } catch(e) {
        expect(e);
    }
    expect(fetch).toHaveBeenCalledTimes(4);
})

test("Request returns to caller to handle 401 if callerHandles401 flag is set", async () => {
    fetch.mockResponse(JSON.stringify({}),
        {
            headers: new Headers({
                'content-type': "application/json"
            }),
            status: 401
        }        
    )
    
    expect(fetch).toHaveBeenCalledTimes(0);
    try {
        await request('POST', '/foobar', false, null, JSON.stringify({}), true);
        fail("Request with 401 handler didn't reject on 401 response");
    } catch (error) {
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(error.status).toBe(401);
    }
})

test("Request back-off won't retry failed fetch if willRetry flag is set to false and reject with an error status", async () => {
    fetch.mockReject();
    expect(fetch).toHaveBeenCalledTimes(0);
    try {
        await request('GET', '/foobar', false, function() {
                jest.runOnlyPendingTimers();
        }, null);
    } catch (e) {
        expect(e).toMatchObject({status: "UNEXPECTED_ERR"})
    }

    expect(fetch).toHaveBeenCalledTimes(1);
})


test("Request back-off won't retry successful fetch if willRetry flag is set to false", async () => {
    fetch.mockResponse(JSON.stringify({}), 
        {
            "headers": new Headers({
                'content-type': 'application/json'
            }),
            "status": 200
        }
    );
    expect(fetch).toHaveBeenCalledTimes(0);
    try {
        await request('GET', '/foobar', false, function() {
            fail("A retry was attempted despite willRetry being set to false");
        }, null);
    } catch (e) {
        console.error(e);
        fail("Request promise rejected");
    }

    expect(fetch).toHaveBeenCalledTimes(1);
})

test("PUT/POST request response without a JSON body but with an 'application/json' header still executes and resolves", async () => {
    fetch.mockResponse("", 
        {
            "headers": new Headers({
                'content-type': 'application/json'
            }),
            "status": 200
        }
    );

    await expect(request('PUT', '/foobar')).resolves.toBe(undefined);
    await expect(request('POST', '/foobar')).resolves.toBe(undefined);
});

test("GET request response without an 'application/json' header logs a warning", async () => {
    fetch.mockResponse(JSON.stringify({}), 
        {
            "headers": new Headers({
                'content-type': ''
            }),
            "status": 200
        }
    );

    let runtimeWarnings = log.add.mock.calls.filter(call => {
        return call[0] === "RUNTIME_WARNING"
    });
    expect(runtimeWarnings.length).toBe(0);
    await request('GET', '/foobar');
    runtimeWarnings = log.add.mock.calls.filter(call => {
        return call[0] === "RUNTIME_WARNING"
    });
    expect(runtimeWarnings.length).toBe(1);
});

test("PUT request response without an 'application/json' header doesn't log a warning", async () => {
    fetch.mockResponse(JSON.stringify({}), 
        {
            "headers": new Headers({
                'content-type': ''
            }),
            "status": 200
        }
    );

    let runtimeWarnings = log.add.mock.calls.filter(call => {
        return call[0] === "RUNTIME_WARNING"
    });
    expect(runtimeWarnings.length).toBe(0);
    await request('PUT', '/foobar');
    runtimeWarnings = log.add.mock.calls.filter(call => {
        return call[0] === "RUNTIME_WARNING"
    });
    expect(runtimeWarnings.length).toBe(0);
});

test("GET request response with 200 status, no JSON body but an 'application/json' header rejects", async () => {
    fetch.mockResponse("", 
        {
            "headers": new Headers({
                'content-type': 'application/json'
            }),
            "status": 200
        }
    );

    const failedRequest = request('GET', '/foobar');
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