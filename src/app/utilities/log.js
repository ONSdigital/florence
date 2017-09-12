import { browserHistory } from 'react-router';
import websocket from './websocket';
import storage from './storage';

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
    socketError: "SOCKET_ERROR"
}

const instanceID = Math.floor(Math.random() * 10000) + 1;

const excludeFromServerLogs = [
    eventTypes.pingSent,
    eventTypes.pingReceived,
    eventTypes.socketBufferFull // This has to be excluded from being sent to the server or else we could have an infinite loop
]

let counter = 0;

export default class log {

    static initialise() {
        this.add(eventTypes.appInitialised);
        browserHistory.listen(location => {
            log.add(eventTypes.changedRoute, {...location})
        });
    }

    /**
     * @param {string} eventType - tells us what event is being logged. Should be populated by a value from the eventTypes map
     * @param {*} payload - the data that is being logged
     */
    static add(eventType, payload)  {
        const event = {
            type: eventType,
            location: location.href,
            instanceID,
            clientTimestamp: new Date().toISOString(),
            payload: payload || null,
            index: counter++
        }

        // storage.add(event);

        if (!excludeFromServerLogs.includes(eventType)) {
            // Prefix the websocket message with 'log:' so that the server knows it's a log event being sent
            websocket.send(`log:${JSON.stringify(event)}`);
            return;
        }
    }

    /**
     * 
     * @param {number} fromIndex - start point of the items we'd like to get
     * @param {number} toIndex - end point of the items we'd like to get
     */
    static getAll(fromIndex, toIndex) {
        return storage.getAll(fromIndex, toIndex);
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