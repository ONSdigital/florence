// Session Management
// Warning: for testing only
function __TEST_TIMERS(name, match, i) {
    const minutes = 60 * 1000;
    if (name === match) {
        const now = new Date();
        // interval will be less than a minute
        const interval = now.setTime(now.getTime() + -57 * minutes);
        console.debug("[TEST] Updating " + name + " interval of " + new Date(interval));
        return new Date(interval);
    }
    return i;
}

function timeOffsets() {
    return {
        passiveRenewal: 300000,
        invasiveRenewal: 120000,
    };
}

// There are two tokens, Session and Refresh that manage the users access. Refresh is a long life token that can be
// used to get a new session token. The session token is what gives the user access to the system and has a very
// short life. If the user is active then we extend their session. The refresh token has a long life but also
// expires and can't be renewed. So we extend it one last time and let the user know they will be kicked out and
// need to sign back in manually
function setSessionExpiryTime(sessionExpiryTime, refreshExpiryTime) {
    if (sessionExpiryTime != null) {
        updateAuthState({ session_expiry_time: sessionExpiryTime });
    }
    if (refreshExpiryTime != null) {
        updateAuthState({ refresh_expiry_time: refreshExpiryTime });
    }
    initialiseSessionExpiryTimers();
}

function removeTimers() {
    removeAuthItem("session_expiry_time");
    removeAuthItem("refresh_expiry_time");

    this.removeInteractionMonitoring();
    this.removeWarnings();
    for (const [key, value] of Object.entries(Florence.sessionManagement().timers)) {
        clearTimeout(this.timers[key]);
    }
    this.timers = {};
}

function initialiseSessionExpiryTimers() {
    const authState = getAuthState();
    let sessionExpiryTime;
    let refreshExpiryTime;
    if (Florence.globalVars.config.enableNewSignIn) {
        sessionExpiryTime = new Date(authState.session_expiry_time);
        refreshExpiryTime = new Date(authState.refresh_expiry_time);
    } else {
        sessionExpiryTime = new Date(authState.session_expiry_time);
        refreshExpiryTime = new Date(authState.refresh_expiry_time); // TODO
    }
    
    if (sessionExpiryTime != null) {
        // Timer to start monitoring user interaction to add additional time to their session
        startExpiryTimer("sessionTimerPassive", sessionExpiryTime, timeOffsets().passiveRenewal, monitorInteraction);
    }
    if (refreshExpiryTime != null) {
        // Timer to start monitoring user interaction to add a final extra amount of time to their session
        startExpiryTimer("refreshTimerPassive", refreshExpiryTime, timeOffsets().passiveRenewal, monitorInteraction);
    }
}

function startExpiryTimer(name, expiryTime, offsetInMilliseconds, callback) {
    if (expiryTime) {
        // Convert 'now' into UTC (new Date() returns local time (could be different country or just BST))
        const now = new Date();
        let timerInterval = expiryTime - now.getTime() - offsetInMilliseconds;
        if (isNaN(timerInterval)) {
            console.error(`[FLORENCE] time interval for ${name} is not a valid date format.`);
        }
        if (Florence.sessionManagement.timers[name] != null) {
            clearTimeout(Florence.sessionManagement.timers[name]);
        }
        console.debug("[FLORENCE] Interval for " + name + " set to " + timerInterval);
        Florence.sessionManagement.timers[name] = setTimeout(callback, timerInterval);
    }
}

function monitorInteraction() {
    ["mousedown", "mousemove", "keypress", "scroll", "touchstart"].forEach(name => {
        document.addEventListener(name, refreshSession);
    });
}

function removeInteractionMonitoring() {
    ["mousedown", "mousemove", "keypress", "scroll", "touchstart"].forEach(name => {
        document.removeEventListener(name, refreshSession);
    });
}



function warnRefreshSoonExpire() {
    removeInteractionMonitoring();
}

function removeWarnings() {
    sweetAlert.close()
}

function refreshSession() {
    removeInteractionMonitoring();
    removeWarnings();
    const renewError = error => {
        console.error("an unexpected error has occurred when extending the users session");
        if (error != null) {
            console.error(error);
        }
    };
    if (Florence.globalVars.config.enableNewSignIn) {
        // If enableNewSignIn then update the session timers
        fetch("/tokens/self", {method: "PUT", headers: {"Content-Type": "application/json"}}).then(response => {
            return response.json()
        }).then(data => {
            if (data.expirationTime != null) {
                const authState = getAuthState();
                const refresh_expiry_time = new Date(authState.refresh_expiry_time);
                const expirationTime = convertUTCToJSDate(data.expirationTime);
                setSessionExpiryTime(expirationTime, refresh_expiry_time);
            } else {
                renewError();
            }
        }).catch(error => {
            renewError(error);
        });
    } else {
        // console.debug("[FLORENCE] Renewing session with default expiry timers");
        // const expireTimes = createDefaultExpireTimes(12);
        // setSessionExpiryTime(expireTimes.session_expiry_time, expireTimes.refresh_expiry_time);
    }
}

function createDefaultExpireTimes(hours) {
    // TODO this is used up until enableNewSignIn goes live then remove this
    const now = new Date();
    const expiry = now.setHours(now.getHours() + hours);
    return {
        session_expiry_time: new Date(expiry),
        refresh_expiry_time: new Date(expiry),
    };
}

function convertUTCToJSDate(expiryTime) {
    // Convert API time to usable JS Date object
    if (expiryTime) {
        return new Date(expiryTime);
    }
    return null;
}

function renewSession() {
    const res = fetch("/tokens/self", {method: "PUT", headers: {"Content-Type": "application/json"}})
        .then(function(res) {
            return res.json();
        })
        .catch(function(err) {
            console.error(err);
        });
        return res;
}

/**
 *  @param sessionExpiryTime must be in js date format (not UTC from server)
 *  @returns true if session has expired
 *  */
function isSessionExpired(sessionExpiryTime) {
    const now = new Date();
    let nowInUTC;
    if (!Florence.globalVars.config.enableNewSignIn) {
        nowInUTC = now;
    } else {
        nowInUTC = now.getTime()
    }
    // Get the time difference between now and the expiry time minus the timer offset
    const timerInterval = new Date(sessionExpiryTime) - nowInUTC;
    let diffInSeconds = Math.round(timerInterval / 1000);
    if (isNaN(diffInSeconds)) throw new Error("[FLORENCE] encounted an error checking time interval: diffInSeconds is NaN");
    if (!diffInSeconds) throw new Error("[FLORENCE] encounted an error checking time interval, interval is undefined");
    if (diffInSeconds <= 0) {
        return true;
    }
    return false;
}

function initialiseSessionOrUpdateTimers() {
    const authState = getAuthState();
    const session_expiry_time = authState.session_expiry_time;
    const refresh_expiry_time = new Date(authState.refresh_expiry_time);
    if (isSessionExpired(session_expiry_time)) {
        if (Florence.globalVars.config.enableNewSignIn) {
            console.debug("[FLORENCE] Timers / enableNewSignIn: requesting a new access_token");
            renewSession()
                .then(res => {
                    if (res) {
                        console.debug("[FLORENCE] Updating access_token & session timer: ", res)
                        // update the authState, start the session timer with the next session response value
                        // & restart the refresh timer with the existing refresh value.
                        const expirationTime = convertUTCToJSDate(res.expirationTime);
                        setSessionExpiryTime(expirationTime, refresh_expiry_time);
                    }
                })
                .catch(err => console.error("[FLORENCE]: ", err));
        } else {
            console.debug("[FLORENCE] Timers: extending session & refresh timers");
            // If we are not behind the enableNewSignIn then just extend the session & refresh for 12 hours
            const expireTimes = createDefaultExpireTimes(12);
            setSessionExpiryTime(expireTimes.session_expiry_time, expireTimes.refresh_expiry_time);
        }
    } else {
        console.debug("[FLORENCE] Timers: maintaining existing session & restarting timers");
        // The user has refreshed the page but the session is not expired, so just restart the timers
        // for both refresh & session.
        initialiseSessionExpiryTimers();
    }
}
