import { browserHistory } from "react-router";
import uuid from "uuid/v4";
import websocket from "./websocket";
import storage from "./storage";

export const eventTypes = {
    shownNotification: "SHOWN_NOTIFICATION",
    shownWarning: "SHOWN_WARNING",
    changedRoute: "CHANGED_ROUTE",
    appInitialised: "APP_INITIALISED",
    requestSent: "REQUEST_SENT",
    requestReceived: "REQUEST_RECEIVED",
    requestFailed: "REQUEST_FAILED",
    passwordChangeSuccess: "PASSWORD_CHANGE_SUCCESS",
    passwordChangeError: "PASSWORD_CHANGE_ERROR",
    editedTeamMembers: "EDITED_TEAM_MEMBERS",
    pingSent: "PING_SENT",
    pingReceived: "PING_RECEIVED",
    pingFailed: "PING_FAILED",
    socketBufferFull: "SOCKET_BUFFER_FULL",
    socketOpen: "SOCKET_OPEN",
    socketError: "SOCKET_ERROR",
    unexpectedRuntimeError: "UNEXPECTED_RUNTIME_ERROR",
    runtimeWarning: "RUNTIME_WARNING"
};

const instanceID = uuid();

const excludeFromServerLogs = [
    eventTypes.pingSent,
    eventTypes.pingReceived,
    eventTypes.socketBufferFull // This has to be excluded from being sent to the server or else we could have an infinite loop
];

export default class log {
    static initialise() {
        this.add(eventTypes.appInitialised);
        browserHistory.listen(location => {
            log.add(eventTypes.changedRoute, { ...location });
        });
    }

    /**
     * @param {string} eventType - tells us what event is being logged. Should be populated by a value from the eventTypes map
     * @param {*} payload - the data that is being logged
     */
    static add(eventType, payload) {
        const timestamp = new Date();
        const event = {
            type: eventType,
            location: location.href,
            instanceID,
            created: timestamp.toISOString(),
            timestamp: timestamp.getTime(),
            payload: payload || null
        };

        storage.add(event);

        if (!excludeFromServerLogs.includes(eventType)) {
            // Prefix the websocket message with 'log:' so that the server knows it's a log event being sent
            websocket.send(`log:${JSON.stringify(event)}`);
            return;
        }
    }

    /**
     *
     * @param {number} skip - (Optional) start point of the items we'd like to receive
     * @param {number} limit - (Optional) the number of items we'd like to receive
     * @param {number} requestTimestamp - (Optional) a Unix timestamp that
     */
    static getAll(skip, limit, requestTimestamp) {
        return storage.getAll(skip, limit, requestTimestamp);
    }

    /**
     * @returns {Promise} - Which resolves to am integer
     */
    static length() {
        return storage.length();
    }

    /**
     * @returns {Promise}
     */
    static removeAll() {
        return storage.removeAll();
    }
}
