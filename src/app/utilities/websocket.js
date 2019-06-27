import log from "./logging/log";

class Socket {
    constructor() {
        this.socket = null;
        this.openDelay = 1;
        this.buffer = new Map();
        this.messageCounter = 0;

        this.open();
    }

    open() {
        const protocol = location.protocol.replace(/^http/, "ws");
        this.socket = new WebSocket(`${protocol}${location.host}/florence/websocket`);
        console.info("Trying to open websocket...");

        this.socket.onopen = () => {
            console.info("Websocket has been opened");

            this.openDelay = 1;
            this.buffer.forEach(message => {
                // TODO we need to handle the connection breaking whilst it iterates through this loop
                // in that instance we would break the loop (which can't be done in a forEach easily)
                this.socket.send(message);
            });

            log.event("Websocket opened");
        };

        this.socket.onerror = event => {
            log.event("Websocket error", log.error(), log.data({ ...event }));
        };

        this.socket.onclose = () => {
            console.info("Websocket has been closed");
            this.openDelay *= 2;
            if (this.openDelay >= 10000) {
                this.openDelay = 10000;
            }

            setTimeout(() => {
                // setTimeout sets 'this' to window wrapping 'this.open()' in a lambda function
                // (rather than passing it inline), stops it.
                // Ref: https://stackoverflow.com/questions/2130241/pass-correct-this-context-to-settimeout-callback
                this.open();
            }, this.openDelay);
        };

        this.socket.onmessage = message => {
            message = JSON.parse(message.data);
            if (message.type !== "ack") {
                return;
            }
            this.buffer.delete(parseInt(message.payload));
        };
    }

    send(message) {
        this.messageCounter++;
        message = `${this.messageCounter}:${message}`;

        if (this.buffer.size >= 50) {
            console.warn(`Websocket buffer has reached it's limit, so message will not be sent to server. Message: \n`, message);
            //log.add(eventTypes.socketBufferFull); // This has to be excluded from being sent to the server or else we'll have an infinite loop
            return;
        }

        this.buffer.set(this.messageCounter, message);

        if (this.socket.readyState === 1) {
            this.socket.send(message);
        }
    }
}

const websocket = new Socket();
export default websocket;
