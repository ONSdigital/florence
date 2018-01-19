var websocket = {
    socket: null,
    retrySocketDelay: 1,
    buffer: new Map(),
    messageCounter: 0,
    hasConnected: false,
    reconnectAttempts: 0,
    open: function() {
        console.info("Trying to open websocket...");

        websocket.socket = new WebSocket(location.protocol.replace(/^http/, 'ws') + location.host + "/florence/websocket");
        websocket.reconnectAttempts++;

        websocket.socket.onopen = function() {
            console.info("Websocket has been opened");
            websocket.hasConnected = true;
            websocket.retrySocketDelay = 1;
            websocket.buffer.forEach(function(message) {
                websocket.socket.send(message);
            });
            // FIXME we should be logging that the socket is open - but there's a horrible cyclical dependency on startup atm
        }

        websocket.socket.onerror = function() {
            console.error("Error opening websocket");
        }

        websocket.socket.onmessage = function(message) {
            message = JSON.parse(message.data);
            if (message.type === "version") {
                // TODO Not being used yet to check version but should replace existing implementation at some point
                Florence.version = message.payload.version;
                return;
            }
            if (message.type !== "ack") {
                return;
            }
            websocket.buffer.delete(parseInt(message.payload));
        }

        websocket.socket.onclose = function() {
            console.info("Websocket has been closed");
            websocket.retrySocketDelay *= 2;
            if (websocket.retrySocketDelay >= 300000) {
                websocket.retrySocketDelay = 300000;
            }

            if (!websocket.hasConnected && websocket.reconnectAttempts >= 100) {
                console.info("Unable to connect websocket after 100 attempts, so stop retrying websocket");
                return;
            }

            setTimeout(() => {
                // setTimeout sets 'this' to window wrapping 'this.open()' in a lambda function
                // (rather than passing it inline), stops it.
                // Ref: https://stackoverflow.com/questions/2130241/pass-correct-this-context-to-settimeout-callback
                websocket.open();
            }, websocket.retrySocketDelay);
        }
    },
    send: function(message) {
        websocket.messageCounter++;
        message = websocket.messageCounter + ":" + message;

        if (websocket.buffer.size >= 50) {
            console.warn(`Websocket buffer has reached it's limit, so message will not be sent to server. Message: \n`, message);
            //log.add(log.eventTypes.socketBufferFull); // This has to be excluded from being sent to the server or else we'll have an infinite loop
            return;
        }

        websocket.buffer.set(websocket.messageCounter, message);
        
        if (websocket.socket.readyState === 1) {
            websocket.socket.send(message);
        }
    }
};