var log = {
    add: function(eventType, payload) {
        var timestamp = new Date();
        var event = {
            type: eventType,
            instanceID: Florence.instanceID,
            created: timestamp.toISOString(),
            timestamp: timestamp.getTime(),
            payload: payload || null
        }
        websocket.send("log:" + JSON.stringify(event));
    },
    eventTypes: {
        appInitialised: "APP_INITIALISED",
        requestSent: "REQUEST_SENT",
        requestReceived: "REQUEST_RECEIVED",
        requestFailed: "REQUEST_FAILED",
        pingSent: "PING_SENT",
        pingReceived: "PING_RECEIVED",
        pingFailed: "PING_FAILED",
        socketOpen: "SOCKET_OPEN",
        socketBufferFull: "SOCKET_BUFFER_FULL",
        socketError: "SOCKET_ERROR",
        unexpectedRuntimeError: "UNEXPECTED_RUNTIME_ERROR",
        runtimeWarning: "RUNTIME_WARNING"
    }
}
