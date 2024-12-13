import user from "./api-clients/user";
import notifications from "./notifications";
import { errCodes as errorCodes } from "./errorCodes";
import { store } from "../config/store";
import { addPopout, removePopouts } from "../config/actions";
import { getAuthState, updateAuthState } from "./auth";
import fp from "lodash/fp";

import { startRefeshAndSession } from "../config/user/userActions";

const config = window.getEnv();

// Warning: for testing only
function __TEST_TIMERS(name, match, i, mins = 57) {
    const minutes = 60 * 1000;
    if (name === match) {
        const now = new Date();
        // interval will be less than a minute
        const interval = now.setTime(now.getTime() - mins * minutes);
        console.debug("[TEST] Updating " + name + " interval of " + interval + " : " + new Date(interval));
        return new Date(interval);
    }
    return i;
}

export default class sessionManagement {
    static timers = {};
    static eventsToMonitor = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    static timeOffsets = {
        passiveRenewal: 300000,
        invasiveRenewal: 120000,
    };

    static createDefaultExpireTimes(hours) {
        console.log("[sessionManagement] Creating default expire times for", hours, "hours");
        const now = new Date();
        const expiry = now.setHours(now.getHours() + hours);
        return {
            session_expiry_time: new Date(expiry),
            refresh_expiry_time: new Date(expiry),
        };
    }

    // There are two tokens, Session and Refresh that manage the users access. Refresh is a long life token that can be
    // used to get a new session token. The session token is what gives the user access to the system and has a very
    // short life. If the user is active then we extend their session. The refresh token has a long life but also
    // expires and can't be renewed. So we extend it one last timse and let the user know they will be kicked out and
    // need to sign back in manually
    static setSessionExpiryTime = (sessionExpiryTime, refreshExpiryTime) => {
        console.log("[sessionManagement] Setting session expiry time:", sessionExpiryTime, "and refresh expiry time:", refreshExpiryTime);
        this.initialiseSessionExpiryTimers(sessionExpiryTime, refreshExpiryTime);
    };

    static removeTimers = () => {
        console.log("[sessionManagement] Removing all timers");
        this.removeInteractionMonitoring();
        this.removeWarnings();
        for (const [key] of Object.entries(this.timers)) {
            clearTimeout(this.timers[key]);
        }
        this.timers = {};
    };

    static startSessionTimer(sessionExpiryTime) {
        console.log("[sessionManagement] Starting session timer with expiry time:", sessionExpiryTime);
        updateAuthState({ session_expiry_time: sessionExpiryTime });
        if (config.enableNewSignIn) {
            console.log("[sessionManagement] New sign-in enabled, starting passive session timer");
            // Timer to start monitoring user interaction to add additional time to their session
            this.startExpiryTimer("sessionTimerPassive", sessionExpiryTime, this.timeOffsets.passiveRenewal, this.monitorInteraction);
        } else {
            // Display a popup passiveRenewal ms before manual refresh expire interval.
            console.log("[sessionManagement] New sign-in not enabled, starting manual session timers");
            this.startExpiryTimer(
                "warnManaulSessionTimerExpiry",
                sessionExpiryTime,
                this.timeOffsets.passiveRenewal,
                this.warnManaulRefreshTimerExpiry
            );
            // Logout the user on invasiveRenewal expire interval.
            this.startExpiryTimer("endManaulSessionTimerExpiry", sessionExpiryTime, this.timeOffsets.invasiveRenewal, this.endManualSession);
        }
    }

    static startRefreshTimer(refreshExpiryTime) {
        console.log("[sessionManagement] Starting refresh timer with expiry time:", refreshExpiryTime);
        if (config.enableNewSignIn) {
            updateAuthState({ refresh_expiry_time: refreshExpiryTime });
            // Timer to start monitoring user interaction to add a final extra amount of time to their session
            this.startExpiryTimer("refreshTimerPassive", refreshExpiryTime, this.timeOffsets.passiveRenewal, this.monitorInteraction);
        }
    }

    static initialiseSessionExpiryTimers = (sessionExpiryTime, refreshExpiryTime) => {
        console.log("[sessionManagement] Initialising session expiry timers");
        if (sessionExpiryTime) {
            console.log("[sessionManagement] Session expiry time provided:", sessionExpiryTime);
            sessionManagement.startSessionTimer(sessionExpiryTime);
        }
        if (refreshExpiryTime) {
            console.log("[sessionManagement] Refresh expiry time provided:", refreshExpiryTime);
            sessionManagement.startRefreshTimer(refreshExpiryTime);
        }
    };

    static convertUTCToJSDate(expiryTime) {
        console.log("[sessionManagement] Converting UTC expiry time to JS Date:", expiryTime);
        if (expiryTime) {
            const expireTimeInUTCString = expiryTime.replace(" +0000 UTC", "Z");
            return new Date(expireTimeInUTCString);
        }
        return null;
    }

    static startExpiryTimer = (name, expiryTime, offsetInMilliseconds, callback) => {
        console.log("[sessionManagement] Starting expiry timer:", name, "with expiry time:", expiryTime, "and offset:", offsetInMilliseconds);
        if (expiryTime) {
            const now = new Date();
            let timerInterval = expiryTime - now.getTime() - offsetInMilliseconds;
            if (isNaN(timerInterval)) {
                console.error(`[FLORENCE] time interval for ${name} is not a valid date format.`);
            }
            if (this.timers[name] != null) {
                clearTimeout(this.timers[name]);
            }
            console.log("[FLORENCE] Interval for " + name + " set to " + timerInterval);
            console.debug("[FLORENCE] Interval for " + name + " set to " + timerInterval);
            this.timers[name] = setTimeout(callback, timerInterval);
        }
    };

    static monitorInteraction = () => {
        console.log("[sessionManagement] Monitoring user interaction");
        this.eventsToMonitor.forEach(name => {
            document.addEventListener(name, this.refreshSession);
        });
    };

    static removeInteractionMonitoring = () => {
        console.log("[sessionManagement] Removing interaction monitoring");
        this.eventsToMonitor.forEach(name => {
            document.removeEventListener(name, this.refreshSession);
        });
    };

    static warnRefreshSoonExpire = () => {
        console.log("[sessionManagement] Warning: refresh token will expire soon");
        this.removeInteractionMonitoring();
    };

    static warnManaulRefreshTimerExpiry = () => {
        console.log("[sessionManagement] Warning: manual refresh timer will expire soon");
        const popoutOptions = {
            id: "manual-refresh-expire-soon",
            title: "You will be signed out soon",
            body: "This is because you have been signed in for the maximum amount of time possible. Please save your work and sign back in to continue using Florence.",
            buttons: [
                {
                    onClick: () => {
                        store.dispatch(removePopouts(["manual-refresh-expire-soon"]));
                    },
                    text: "Ok",
                    style: "primary",
                },
            ],
        };
        store.dispatch(addPopout(popoutOptions));
    };

    static endManualSession = () => {
        console.info("[sessionManagement] Ending manual session");
        user.logOut();
    };

    static removeWarnings = () => {
        console.log("[sessionManagement] Removing warnings");
        store.dispatch(removePopouts(["session-expire-soon", "refresh-expire-soon"])); // Todo all
    };

    static refreshSession = () => {
        console.log("[sessionManagement] Refreshing session");
        this.removeInteractionMonitoring();
        this.removeWarnings();
        const renewError = error => {
            console.error("[sessionManagement] An unexpected error occurred when extending the user's session");
            if (error != null) {
                console.error(error);
            }
        };
        const refresh_expiry_time = fp.get("refresh_expiry_time")(getAuthState());
        if (config.enableNewSignIn) {
            user.renewSession()
                .then(response => {
                    if (response) {
                        console.log("[sessionManagement] Updating session timer via API");
                        const expirationTime = sessionManagement.convertUTCToJSDate(fp.get("expirationTime")(response));
                        sessionManagement.startSessionTimer(expirationTime);
                        store.dispatch(startRefeshAndSession(refresh_expiry_time, expirationTime));
                    } else {
                        renewError();
                    }
                })
                .catch(error => {
                    renewError(error);
                });
        } else {
            // refresh sessions manually for current / legacy
            console.log("[sessionManagement] Updating session timer manually");
            const expireTimes = sessionManagement.createDefaultExpireTimes(12);
            sessionManagement.startSessionTimer(expireTimes.session_expiry_time);
            store.dispatch(startRefeshAndSession(null, expireTimes.session_expiry_time));
        }
    };

    /**
     *  @param sessionExpiryTime must be in js date format (not UTC from server)
     *  @returns true if session has expired
     *  */
    static isSessionExpired(sessionExpiryTime) {
        console.log("[sessionManagement] Checking if session has expired for expiry time:", sessionExpiryTime);
        if (sessionExpiryTime == null) {
            return true;
        }
        const now = new Date();
        const nowUTCInMS = now.getTime() + now.getTimezoneOffset() * 60000;
        const nowInUTC = new Date(nowUTCInMS);

        // Get the time difference between now and the expiry time minus the timer offset
        const timerInterval = new Date(sessionExpiryTime) - nowInUTC;

        let diffInSeconds = Math.round(timerInterval / 1000);
        if (isNaN(diffInSeconds)) {
            throw new Error("encountered an error checking time interval: diffInSeconds is NaN");
        }
        if (diffInSeconds <= 0) {
            return true;
        }
        return false;
    }
}
