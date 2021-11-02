import user from "./api-clients/user";
import notifications from "./notifications";
import { errCodes as errorCodes } from "./errorCodes";

export default class sessionManagement {
    static timers = {};
    static eventsToMonitor = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];

    // There are two tokens, Session and Refresh that manage the users access. Refresh is a long life token that can be
    // used to get a new session token. The session token is what gives the user access to the system and has a very
    // short life. If the user is active then we extend their session. The refresh token has a long life but also
    // expires and can't be renewed. So we extend it one last time and let the user know they will be kicked out and
    // need to sign back in manually
    static setSessionExpiryTime = (sessionExpiryTime, refreshExpiryTime) => {
        if (sessionExpiryTime != null) {
            sessionStorage.setItem("session_expiry_time", sessionExpiryTime);
        }
        if (refreshExpiryTime != null) {
            sessionStorage.setItem("refresh_expiry_time", refreshExpiryTime);
        }
        this.initialiseSessionExpiryTimers();
    };

    static removeTimers = () => {
        sessionStorage.removeItem("session_expiry_time");
        sessionStorage.removeItem("refresh_expiry_time");
        this.removeInteractionMonitoring();
        this.removeWarnings();
        for (const [key, value] of Object.entries(this.timers)) {
            clearTimeout(this.timers[key]);
        }
        this.timers = {};
    };

    static initialiseSessionExpiryTimers = () => {
        const sessionExpiryTime = sessionStorage.getItem("session_expiry_time");
        const refreshExpiryTime = sessionStorage.getItem("refresh_expiry_time");
        if (sessionExpiryTime != null) {
            // Timer to start monitoring user interaction to add additional time to their session
            this.startExpiryTimer("sessionTimerPassive", sessionExpiryTime, 300000, this.monitorInteraction);
            // Timer to tell the user their session is about to expire unless they interact with the page
            this.startExpiryTimer("sessionTimerInvasive", sessionExpiryTime, 120000, this.warnSessionSoonExpire);
        }
        if (refreshExpiryTime != null) {
            // Timer to start monitoring user interaction to add a final extra amount of time to their session
            this.startExpiryTimer("refreshTimerPassive", refreshExpiryTime, 300000, this.monitorInteraction);
            // Timer to notify user they are on their last two minutes of using Florence and will need to sign out and back in
            this.startExpiryTimer("refreshTimerInvasive", refreshExpiryTime, 120000, this.warnRefreshSoonExpire);
        }
    };

    static startExpiryTimer = (name, expiryTime, offsetInMilliseconds, callback) => {
        if (expiryTime != null) {
            // Convert API time to usable JS Date object
            const expireTimeInUTCString = expiryTime.replace(" +0000 UTC", "");
            const expireTimeInUTCDate = new Date(expireTimeInUTCString);
            // Convert 'now' into UTC (new Date() returns local time (could be different country or just BST))
            const now = new Date();
            const nowUTCInMS = now.getTime() + now.getTimezoneOffset() * 60000;
            const nowInUTC = new Date(nowUTCInMS);
            // Get the time difference between now and the expiry time minus the timer offset
            const timerInterval = expireTimeInUTCDate - offsetInMilliseconds - nowInUTC;
            if (this.timers[name] != null) {
                clearTimeout(this.timers[name]);
            }
            this.timers[name] = setTimeout(callback, timerInterval);
        }
    };

    static monitorInteraction = () => {
        this.eventsToMonitor.forEach(name => {
            document.addEventListener(name, this.refreshSession);
        });
    };

    static removeInteractionMonitoring = () => {
        this.eventsToMonitor.forEach(name => {
            document.removeEventListener(name, this.refreshSession);
        });
    };

    static warnSessionSoonExpire = () => {
        this.removeInteractionMonitoring();
        // TODO function as part of a future ticket
        console.log("Session will expire soon");
    };

    static warnRefreshSoonExpire = () => {
        this.removeInteractionMonitoring();
        // TODO function as part of a future ticket
        console.log("Session will expire soon");
    };

    static removeWarnings = () => {
        // TODO function as part of a future ticket
        console.log("Remove warnings");
    };

    static refreshSession = () => {
        this.removeInteractionMonitoring();
        this.removeWarnings();
        const renewError = error => {
            console.error("an unexpected error has occurred when extending the users session");
            if (error != null) {
                console.error(error);
            }
            const notification = {
                type: "warning",
                message: errorCodes.REFRESH_SESSION_ERROR,
                isDismissable: true,
                autoDismiss: 20000,
            };
            notifications.add(notification);
        };
        user.renewSession()
            .then(response => {
                if (response.expirationTime != null) {
                    this.setSessionExpiryTime(response.expirationTime);
                } else {
                    renewError();
                }
            })
            .catch(error => {
                renewError(error);
            });
    };
}
