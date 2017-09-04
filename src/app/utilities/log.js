import { browserHistory } from 'react-router';
import websocket from './websocket';

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
    socketBufferFull: "SOCKET_BUFFER_FULL"
}

const instanceID = Math.floor(Math.random() * 10000) + 1;

const excludeFromServerLogs = [
    eventTypes.pingSent,
    eventTypes.pingReceived,
    eventTypes.socketBufferFull // This has to be excluded from being sent to the server or else we'll have an infinite loop
]

export default class log {

    static initialise() {
        this.add(eventTypes.appInitialised);
        browserHistory.listen(location => {
            log.add(eventTypes.changedRoute, {...location})
        });
    }

    static add(eventType, payload)  {
        const event = {
            type: eventType,
            location: location.href,
            instanceID,
            clientTimestamp: new Date().toISOString(),
            payload: payload || null
        }

        if (!excludeFromServerLogs.includes(eventType)) {
            // Prefix the websocket message with 'log:' so that 
            // the server knows it's a log event being sent
            websocket.send(`log:${JSON.stringify(event)}`);
            return;
        }
    }
}