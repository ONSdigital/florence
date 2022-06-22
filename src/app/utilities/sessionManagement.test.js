import auth, { AUTH_STATE_NAME, getAuthState } from "./auth";

import sessionManagement from "./sessionManagement";

// Local Storage
var localStorageMock = (function () {
    var store = {};
    return {
        getItem: function (key) {
            return store[key];
        },
        setItem: function (key, value) {
            store[key] = value.toString();
        },
        clear: function () {
            store = {};
        },
        removeItem: function (key) {
            delete store[key];
        },
    };
})();

beforeEach(() => {
    Object.defineProperty(window, "localStorage", { value: localStorageMock, writable: true });
});

afterEach(() => {
    sessionManagement.timers = {};
    window.localStorage.clear();
});

it("should add expire times to auth state", () => {
    // Used in the LoginController component
    const { session_expiry_time, refresh_expiry_time } = sessionManagement.createDefaultExpireTimes(12);
    sessionManagement.setSessionExpiryTime(session_expiry_time, refresh_expiry_time);
    const actual = getAuthState();
    expect(actual.session_expiry_time).toBeGreaterThan(0);
    expect(actual.refresh_expiry_time).toBeGreaterThan(0);
});

it("should add convert UTC to Date format & add to auth state", () => {
    // Used in the SignIn component
    const expirationTime = sessionManagement.convertUTCToJSDate("2022-06-14 12:23:40.216281 +0000 UTC");
    const refreshTokenExpirationTime = sessionManagement.convertUTCToJSDate("2022-06-15 11:23:40.216314 +0000 UTC");
    sessionManagement.setSessionExpiryTime(expirationTime, refreshTokenExpirationTime);
    const actual = getAuthState();
    expect(actual.session_expiry_time).toEqual("2022-06-14T11:23:40.216Z");
    expect(actual.refresh_expiry_time).toEqual("2022-06-15T10:23:40.216Z");
});

it("when no times are given to the function setSessionExpiryTime it doesn't set any timers", () => {
    window.localStorage.clear();
    window.localStorage.setItem(AUTH_STATE_NAME, "{}");
    sessionManagement.setSessionExpiryTime();
    const session_expiry_time = getAuthState().session_expiry_time;
    const refresh_expiry_time = getAuthState().refresh_expiry_time;

    expect(session_expiry_time).toBeUndefined();
    expect(refresh_expiry_time).toBeUndefined();

    expect(sessionManagement.timers["sessionTimerPassive"]).toBeUndefined();
    expect(sessionManagement.timers["sessionTimerInvasive"]).toBeUndefined();
    expect(sessionManagement.timers["refreshTimerPassive"]).toBeUndefined();
    expect(sessionManagement.timers["refreshTimerInvasive"]).toBeUndefined();
});

it("when a valid sessionExpiryTime and refreshExpiryTime are given to the function setSessionExpiryTime it sets the session timers", () => {
    let sessionExpiryTime = new Date();
    let refreshExpiryTime = new Date();
    sessionExpiryTime = sessionExpiryTime.setHours(sessionExpiryTime.getHours() + 1);
    refreshExpiryTime = refreshExpiryTime.setHours(refreshExpiryTime.getHours() + 24);
    // Convert time format to same that the server sends
    sessionExpiryTime = new Date(sessionExpiryTime).toISOString().replace(/Z/, " +0000 UTC");
    refreshExpiryTime = new Date(refreshExpiryTime).toISOString().replace(/Z/, " +0000 UTC");

    sessionExpiryTime = sessionManagement.convertUTCToJSDate(sessionExpiryTime);
    refreshExpiryTime = sessionManagement.convertUTCToJSDate(refreshExpiryTime);

    sessionManagement.setSessionExpiryTime(sessionExpiryTime, refreshExpiryTime);
    const session_expiry_time = getAuthState().session_expiry_time;
    const refresh_expiry_time = getAuthState().refresh_expiry_time;

    expect(new Date(session_expiry_time)).toEqual(sessionExpiryTime);
    expect(new Date(refresh_expiry_time)).toEqual(refreshExpiryTime);
    expect(sessionManagement.timers["sessionTimerPassive"]).toBeDefined();
    expect(sessionManagement.timers["sessionTimerInvasive"]).toBeDefined();
    expect(sessionManagement.timers["refreshTimerPassive"]).toBeDefined();
    expect(sessionManagement.timers["refreshTimerInvasive"]).toBeDefined();
});

it("given timers exist and when timers are requested to be removed they are actually removed", () => {
    sessionManagement.timers["sessionTimerPassive"] = setTimeout(() => {}, 100000);
    sessionManagement.timers["sessionTimerInvasive"] = setTimeout(() => {}, 100000);
    sessionManagement.timers["refreshTimerPassive"] = setTimeout(() => {}, 100000);
    sessionManagement.timers["refreshTimerInvasive"] = setTimeout(() => {}, 100000);
    sessionManagement.removeTimers();
    expect(sessionManagement.timers["sessionTimerPassive"]).toBeUndefined();
    expect(sessionManagement.timers["sessionTimerInvasive"]).toBeUndefined();
    expect(sessionManagement.timers["refreshTimerPassive"]).toBeUndefined();
    expect(sessionManagement.timers["refreshTimerInvasive"]).toBeUndefined();
});

describe("#isSessionExpired()", () => {
    it("should return true if session UTC time from server has not expired", () => {
        let sessionExpiryTime = new Date();
        sessionExpiryTime = sessionExpiryTime.setHours(sessionExpiryTime.getHours() - 1);
        // Convert time format to same that the server sends
        sessionExpiryTime = new Date(sessionExpiryTime).toISOString().replace(/Z/, " +0000 UTC");
        const actual = sessionManagement.isSessionExpired(sessionExpiryTime);
        const expected = true;
        expect(actual).toEqual(expected);
    });
    it("should return true if session UTC time from server has not expired", () => {
        let sessionExpiryTime = new Date();
        sessionExpiryTime = sessionExpiryTime.setHours(sessionExpiryTime.getHours() + 1);
        // Convert time format to same that the server sends
        sessionExpiryTime = new Date(sessionExpiryTime).toISOString().replace(/Z/, " +0000 UTC");
        const expirationTime = sessionManagement.convertUTCToJSDate(sessionExpiryTime);
        const actual = sessionManagement.isSessionExpired(expirationTime);
        const expected = false;
        expect(actual).toEqual(expected);
    });
    fit("should return false if client created session time has expired", () => {
        let sessionExpiryTime = new Date();
        sessionExpiryTime = sessionExpiryTime.setHours(sessionExpiryTime.getHours() - 1);
        // Convert time format to same that the server sends
        sessionExpiryTime = new Date(sessionExpiryTime).toISOString().replace(/Z/, " +0000 UTC");
        sessionExpiryTime = sessionManagement.convertUTCToJSDate(sessionExpiryTime);
        const actual = sessionManagement.isSessionExpired(sessionExpiryTime);
        const expected = true;
        expect(actual).toEqual(expected);
    });
    it("should return true if client created session time has not expired", () => {
        const seconds30 = 30 * 60 * 1000;
        let sessionExpiryTime = new Date().getTime() + seconds30;
        const actual = sessionManagement.isSessionExpired(sessionExpiryTime);
        const expected = false;
        expect(actual).toEqual(expected);
    });
});
