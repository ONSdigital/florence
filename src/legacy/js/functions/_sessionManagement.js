// There are two tokens, Session and Refresh that manage the users access. Refresh is a long life token that can be
// used to get a new session token. The session token is what gives the user access to the system and has a very
// short life. If the user is active then we extend their session. The refresh token has a long life but also
// expires and can't be renewed. So we extend it one last time and let the user know they will be kicked out and
// need to sign back in manually
function setSessionExpiryTime(sessionExpiryTime, refreshExpiryTime) {
    if (sessionExpiryTime != null) {
        sessionStorage.setItem("session_expiry_time", sessionExpiryTime);
    }
    if (refreshExpiryTime != null) {
        sessionStorage.setItem("refresh_expiry_time", refreshExpiryTime);
    }
    initialiseSessionExpiryTimers();
}

function removeTimers() {
    sessionStorage.removeItem("session_expiry_time");
    sessionStorage.removeItem("refresh_expiry_time");
    this.removeInteractionMonitoring();
    this.removeWarnings();
    for (const [key, value] of Object.entries(Florence.sessionManagement.timers)) {
        clearTimeout(this.timers[key]);
    }
    this.timers = {};
}

function initialiseSessionExpiryTimers() {
    const sessionExpiryTime = sessionStorage.getItem("session_expiry_time");
    const refreshExpiryTime = sessionStorage.getItem("refresh_expiry_time");
    if (sessionExpiryTime != null) {
        // Timer to start monitoring user interaction to add additional time to their session
        startExpiryTimer("sessionTimerPassive", sessionExpiryTime, 300000, monitorInteraction);
        // Timer to tell the user their session is about to expire unless they interact with the page
        startExpiryTimer("sessionTimerInvasive", sessionExpiryTime, 120000, warnSessionSoonExpire);
    }
    if (refreshExpiryTime != null) {
        // Timer to start monitoring user interaction to add a final extra amount of time to their session
        startExpiryTimer("refreshTimerPassive", refreshExpiryTime, 300000, monitorInteraction);
        // Timer to notify user they are on their last two minutes of using Florence and will need to sign out and back in
        startExpiryTimer("refreshTimerInvasive", refreshExpiryTime, 120000, warnRefreshSoonExpire);
    }
}

function startExpiryTimer(name, expiryTime, offsetInMilliseconds, callback) {
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
        if (Florence.sessionManagement.timers[name] != null) {
            clearTimeout(Florence.sessionManagement.timers[name]);
        }
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

function warnSessionSoonExpire() {
    removeInteractionMonitoring();
    sweetAlert({
        type: "warning",
        title: "Your session will end in 1 minute",
        text: "This is because you have been inactive. If you want to continue using Florence you must stay signed in. If not, you will be signed out and will need to sign in again.",
        confirmButtonText: "Stay signed in"
    }, function () {
        refreshSession();
    });
}

function warnRefreshSoonExpire() {
    removeInteractionMonitoring();
    sweetAlert({
        type: "warning",
        title: "Sorry, you need to sign back in again",
        text: "This is because you have been signed in for the maximum amount of time possible. Please save your work and sign back in to continue using Florence.",
        confirmButtonText: "Ok"
    }, function () {
        // One final refresh before it expires to give the user as much time as possible to save their work
        refreshSession();
    });
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
        sweetAlert({
            type: "warning",
            title: "An unexpected error has occurred when extending the users session",
            text: "Please sign out and back in",
            confirmButtonText: "Ok"
        })
    };
    fetch("/tokens/self", {method: "PUT", headers: {"Content-Type": "application/json"}}).then(response => {
        response = response.json()
        if (response.expirationTime != null) {
            setSessionExpiryTime(response.expirationTime);
        } else {
            renewError();
        }
    }).catch(error => {
        renewError(error);
    });
}
