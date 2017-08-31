import request from './request';
import 'isomorphic-fetch';
import notifications from '../notifications';

jest.mock('../log', () => {
    return {
        add: function() {
            // do nothing
        },
        eventTypes: {
            shownNotification: "SHOWN_NOTIFICATION"
        }
    }
})

beforeEach(() => {
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
            "headers": new Headers({
                'content-type': "application/json"
            }),
            "status": 401
        }        
    ),
    fetch.mockReject();
    
    expect(fetch).toHaveBeenCalledTimes(0);
    request('POST', '/foobar', false, null, null, true);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).reject;
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