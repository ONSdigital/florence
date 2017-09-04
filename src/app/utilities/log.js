import { browserHistory } from 'react-router';
import websocket from './websocket';

const instanceID = Math.floor(Math.random() * 10000) + 1;

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
    pingFailed: "PING_FAILED"
}

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

        websocket.send(`log:${JSON.stringify(event)}`);

        // console.log(event);

        // Socket isn't open yet but something has been logged, wait until it is open to send it
        // if (socket.readyState === 0) {
        //     socket.onopen = () => {
        //         socket.send(`event:${JSON.stringify(event)}`);
        //     }
        //     return;
        // }
        

        // socket.send(`event:${JSON.stringify(event)}`);
        
        // Send across with a top level type because other data, not just events, will be sent too e.g.
        /*
        {
            type: "LOG_EVENT",
            payload: {
                event
            }
        }
        */
    }
}