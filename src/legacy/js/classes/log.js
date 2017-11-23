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

        // Add unrecognised log type to log event
        if (!log.eventTypesMap[eventType]) {
            console.log("Unrecognised log type: ", eventType, payload);
            event.type = log.eventTypes.unrecognisedLogType;
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
        runtimeWarning: "RUNTIME_WARNING",
        unrecognisedLogType: "UNRECOGNISED_LOG_TYPE"
    },
    eventTypesMap: {}
}

// Create a map for event type values to property name 
// so that we can detect when we're logging an unrecognised event
for (var eventType in log.eventTypes) {
    log.eventTypesMap[log.eventTypes[eventType]] = eventType;
}

$.ajaxSetup({
    beforeSend: function(request) {
        var requestID = (S4() + S4());
        request.setRequestHeader("X-Request-ID", requestID);
        request.uniqueID = requestID;
        log.add(
            log.eventTypes.requestSent, {
                requestID
            }
        );
    }
});

$(document).ajaxSuccess(function(event, request, settings) {
    log.add(
        log.eventTypes.requestReceived, {
            requestID: request.uniqueID,
            status: request.statusText
        }
    );
});

$(document).ajaxError(function(event, request, settings) {
    log.add(
        log.eventTypes.requestReceived, {
            requestID: request.uniqueID,
            status: request.statusText
        }
    );
});
