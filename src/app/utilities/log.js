import { browserHistory } from 'react-router';

const instanceID = Math.floor(Math.random() * 10000) + 1;

export const eventTypes = {
    shownNotification: "SHOWN_NOTIFICATION",
    shownWarning: "SHOWN_WARNING",
    changedRoute: "CHANGED_ROUTE",
    appInitialised: "APP_INITIALISED",
    requestSent: "REQUEST_SENT",
    requestReceived: "REQUEST_RECEIVED"
}

browserHistory.listen(location => {
    log.add(eventTypes.changedRoute, {...location})
});

const socket = new WebSocket('ws://localhost:8081/florence/websocket');

socket.onopen = () => {
    log.add(eventTypes.appInitialised);
}

export default class log {

    static add(eventType, payload)  {
        const event = {
            type: eventType,
            location: location.href,
            instanceID,
            clientTimestamp: new Date().toISOString(),
            payload: payload || null
        }

        // console.log(event);

        // Socket isn't open yet but something has been loged, wait until it is open to send it
        if (socket.readyState === 0) {
            socket.onopen = () => {
                socket.send(`event:${JSON.stringify(event)}`);
            }
            return;
        }

        socket.send(`event:${JSON.stringify(event)}`);
        
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