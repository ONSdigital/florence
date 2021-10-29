import sessionManagement from "./sessionManagement";

jest.useFakeTimers();
jest.spyOn(global, "setTimeout");

const sessionStorageMock = (function () {
    let store = {};
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

jest.mock("../sessionManagement", () => {
    // Require the original module to not be mocked...
    const originalModule = jest.requireActual(sessionManagement);
    return {
        // __esModule: true, // Use it when dealing with esModules
        ...originalModule,
        warnSessionSoonExpire: jest.fn(),
        warnRefreshSoonExpire: jest.fn(),
        monitorInteraction: jest.fn(),
    };
});

// jest.mock("./sessionManagement", () => ({
//     ...jest.requireActual('./sessionManagement.js'),
//     warnSessionSoonExpire: jest.fn().mockImplementation(() => {
//         // do nothing
//     }),
//     warnRefreshSoonExpire: jest.fn().mockImplementation(() => {
//         // do nothing
//     }),
//     monitorInteraction: jest.fn().mockImplementation(() => {
//         // do nothing
//     }),
// }))

Object.defineProperty(window, "sessionStorage", { value: sessionStorageMock });

test("when no times are given to the function setSessionExpiryTime, it doesn't set any timers", () => {
    sessionManagement.setSessionExpiryTime();
    expect(sessionStorage.getItem("session_expiry_time")).toBeUndefined();
    expect(sessionStorage.getItem("refresh_expiry_time")).toBeUndefined();
    expect(sessionManagement.timers["sessionTimerPassive"]).toBeUndefined();
    expect(sessionManagement.timers["sessionTimerInvasive"]).toBeUndefined();
    expect(sessionManagement.timers["refreshTimerPassive"]).toBeUndefined();
    expect(sessionManagement.timers["refreshTimerInvasive"]).toBeUndefined();
});

describe("when a valid sessionExpiryTime and refreshExpiryTime are given to the function setSessionExpiryTime, it sets the session timers", () => {
    let sessionExpiryTime = new Date();
    let refreshExpiryTime = new Date();
    sessionExpiryTime = sessionExpiryTime.setHours(sessionExpiryTime.getHours() + 1);
    refreshExpiryTime = refreshExpiryTime.setHours(refreshExpiryTime.getHours() + 24);
    // Convert time format to same that the server sends
    sessionExpiryTime = new Date(sessionExpiryTime).toISOString().replace(/Z/, " +0000 UTC");
    refreshExpiryTime = new Date(refreshExpiryTime).toISOString().replace(/Z/, " +0000 UTC");
    sessionManagement.setSessionExpiryTime(sessionExpiryTime, refreshExpiryTime);
    it("sets session storage with the expiry times", () => {
        expect(sessionStorage.getItem("session_expiry_time")).toBe(sessionExpiryTime);
        expect(sessionStorage.getItem("refresh_expiry_time")).toBe(refreshExpiryTime);
    });
    it("creates the timers", () => {
        expect(sessionManagement.timers["sessionTimerPassive"]).toBeDefined();
        expect(sessionManagement.timers["sessionTimerInvasive"]).toBeDefined();
        expect(sessionManagement.timers["refreshTimerPassive"]).toBeDefined();
        expect(sessionManagement.timers["refreshTimerInvasive"]).toBeDefined();
    });
    describe("timers expire", () => {
        jest.runOnlyPendingTimers();
        it("timer callbacks are triggered", () => {
            expect(sessionManagement.warnSessionSoonExpire).toHaveBeenCalledTimes(1);
            expect(sessionManagement.warnRefreshSoonExpire).toHaveBeenCalledTimes(1);
            expect(sessionManagement.monitorInteraction).toHaveBeenCalledTimes(2);
        });
    });
});

test("given timers exist and when timers are requested to be removed they are actually removed", () => {
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
