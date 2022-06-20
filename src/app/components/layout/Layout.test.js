import React from "react";
import { screen, getAllByTestId, getByText } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { routerReducer } from "react-router-redux";
import thunkMiddleware from "redux-thunk";

import { history } from "../../config/store";
import reducer from "../../config/reducer";
import userReducer from "../../config/user/userReducer";
import interactives from "../../reducers/interactives";
import taxonomies from "../../reducers/taxonomies";

import Layout from "./Layout";
import { getAuthState, setAuthState } from "../../utilities/auth";
import sessionManagement from "../../utilities/sessionManagement";
import { startRefeshAndSession } from "../../config/user/userActions";

// Local Storage
var localStorageMock = (function () {
    var store = {
        ons_auth_state: `{"email":"19e913a3-51db-47bb-bec7-e2b7c578e9da","admin":true,"editor":true}`,
    };
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

function createSession() {
    const mockTimers = sessionManagement.createDefaultExpireTimes(1);
    return new Date(mockTimers.session_expiry_time).toISOString().replace(/Z/, " +0000 UTC");
}
// Mocks
const mockSessionExpiryTime = createSession();
// Monkey patches
jest.mock("minimongo", () => ({ IndexedDb: jest.fn().mockImplementation((obj, func) => {}) }));
jest.mock("../../utilities/api-clients/user", () => {
    class user {}
    user.setUserState = jest.fn();
    user.getOldUserType = jest.fn();
    user.renewSession = () => {
        return new Promise((resolve, reject) => {
            // setTimeout(() => {
            // Convert time format to same that the server sends

            resolve({ expirationTime: mockSessionExpiryTime });
            // }, 300);
        });
    };
    return user;
});

beforeEach(() => {
    Object.defineProperty(window, "localStorage", { value: localStorageMock, writable: true });
});

afterAll(() => {
    sessionManagement.timers = {};
    window.localStorage.clear();
});

function createTestStore(config = {}) {
    return createStore(
        combineReducers({
            state: reducer,
            user: userReducer,
            interactives,
            taxonomies,
            routing: routerReducer,
        }),
        {
            state: {
                config,
                collections: {},
                user: {},
                global: {},
                groups: {},
                users: {},
                teams: {},
                allTeams: {},
            },
        },
        applyMiddleware(thunkMiddleware)
    );
}
const testStore = createTestStore();

// describe("Layout", () => {
const props = {
    params: [],
    location: {
        pathname: "",
    },
};

function wrapper(props = {}) {
    return render(
        <Provider store={testStore}>
            <Layout {...props} />
        </Provider>
    );
}

function addSessionTimersToAuthState() {}

it("renders <NavBar /> component", () => {
    const expTimes = sessionManagement.createDefaultExpireTimes(+1);
    // Add a session timer that is expired by 1 hour
    setAuthState({
        session_expiry_time: expTimes.session_expiry_time,
        refresh_expiry_time: expTimes.refresh_expiry_time,
    });
    wrapper({ location: { pathname: "" } });
    const element = screen.getByTestId("navbar");
    expect(element).toBeInTheDocument;
});

describe("when notifications props are passed", () => {
    const notifications = [
        {
            id: "123",
            message: "Test",
            type: "positive",
            buttons: [],
        },
    ];

    it("renders <Notifications /> component with props", () => {
        wrapper({ location: { pathname: "" }, notifications });
        const element = screen.getByTestId("notifications");
        expect(element).toBeInTheDocument;
        expect(getAllByTestId(element, "123positive")).toHaveLength(1);
        const child = getAllByTestId(element, "123positive")[0];
        expect(getByText(child, "Test")).toBeInTheDocument;
    });
});

it("should start the session timer if there is an expired access token & the session state is false", async () => {
    const expTimes = sessionManagement.createDefaultExpireTimes(-1);
    // Add a session timer that is expired by 1 hour
    setAuthState({
        session_expiry_time: expTimes.session_expiry_time,
        refresh_expiry_time: expTimes.refresh_expiry_time,
    });

    // Check that the timers are set in local storage for this test
    let authState = getAuthState();
    expect.assertions(6);
    expect(authState.session_expiry_time).toEqual(expTimes.session_expiry_time);
    expect(authState.refresh_expiry_time).toEqual(expTimes.refresh_expiry_time);
    // Create some state that has no active timers
    const user = {
        isAuthenticated: true,
        email: "19e913a3-51db-47bb-bec7-e2b7c578e9da",
        userType: "ADMIN",
        isAdmin: true,
        sessionTimer: {
            active: false,
            expire: "",
        },
        refreshTimer: {
            active: false,
            expire: "",
        },
    };
    await wrapper({ location: { pathname: "" }, notifications: [], user, config: { enableNewSignIn: true } });
    authState = getAuthState();
    // We expect that the mocked user.renewSession() returns a new expire value that is stored in the auth state & local storage
    const expected = authState.session_expiry_time;
    const actual = sessionManagement.convertUTCToJSDate(mockSessionExpiryTime);
    expect(actual).toEqual(new Date(expected));
    // refresh should not be updated
    const expectedrefresh = authState.refresh_expiry_time;
    expect(new Date(expectedrefresh)).toEqual(new Date(expTimes.refresh_expiry_time));
    // check the updated state
    // check the updated state
    const expSessionTimer = { active: true, expire: actual };
    const expRefreshTimer = { active: true, expire: new Date(expTimes.refresh_expiry_time) };
    expect(testStore.getState().user.sessionTimer).toEqual(expSessionTimer);
    expect(testStore.getState().user.refreshTimer).toEqual(expRefreshTimer);
});

it("should start the session timer if the access token is not expired & the session state is false", async () => {
    const expTimes = sessionManagement.createDefaultExpireTimes(1);
    // Add a session timer that is expired by 1 hour
    setAuthState({
        session_expiry_time: expTimes.session_expiry_time,
        refresh_expiry_time: expTimes.refresh_expiry_time,
    });

    // Check that the timers are set in local storage for this test
    let authState = getAuthState();
    expect.assertions(6);
    expect(authState.session_expiry_time).toEqual(expTimes.session_expiry_time);
    expect(authState.refresh_expiry_time).toEqual(expTimes.refresh_expiry_time);
    // Create some state that has no active timers
    const user = {
        isAuthenticated: true,
        email: "19e913a3-51db-47bb-bec7-e2b7c578e9da",
        userType: "ADMIN",
        isAdmin: true,
        sessionTimer: {
            active: false,
            expire: "",
        },
        refreshTimer: {
            active: false,
            expire: "",
        },
    };
    await wrapper({ location: { pathname: "" }, notifications: [], user });
    authState = getAuthState();
    // Sessionshould not be updated
    const expected = authState.session_expiry_time;
    expect(new Date(expected)).toEqual(new Date(expTimes.session_expiry_time));
    // refresh should not be updated
    const expectedrefresh = authState.refresh_expiry_time;
    expect(new Date(expectedrefresh)).toEqual(new Date(expTimes.refresh_expiry_time));
    // check the updated state
    const expSessionTimer = { active: true, expire: expTimes.session_expiry_time };
    const expRefreshTimer = { active: true, expire: new Date(expTimes.refresh_expiry_time) };
    expect(testStore.getState().user.sessionTimer).toEqual(expSessionTimer);
    expect(testStore.getState().user.refreshTimer).toEqual(expRefreshTimer);
});

it("should do nothing if the token is not expired & session state is true", async () => {
    const expTimes = sessionManagement.createDefaultExpireTimes(1);
    // Add a session timer that is expired by 1 hour
    setAuthState({
        session_expiry_time: expTimes.session_expiry_time,
        refresh_expiry_time: expTimes.refresh_expiry_time,
    });

    // Check that the timers are set in local storage for this test
    let authState = getAuthState();
    expect.assertions(6);
    expect(authState.session_expiry_time).toEqual(expTimes.session_expiry_time);
    expect(authState.refresh_expiry_time).toEqual(expTimes.refresh_expiry_time);
    // Create some state that has no active timers
    const user = {
        isAuthenticated: true,
        email: "19e913a3-51db-47bb-bec7-e2b7c578e9da",
        userType: "ADMIN",
        isAdmin: true,
        sessionTimer: {
            active: true,
            expire: authState.session_expiry_time,
        },
        refreshTimer: {
            active: true,
            expire: authState.refresh_expiry_time,
        },
    };
    // Update the store so we can make exceptions against it
    testStore.dispatch(startRefeshAndSession(authState.session_expiry_time, authState.refresh_expiry_time));
    await wrapper({ location: { pathname: "" }, notifications: [], user });
    authState = getAuthState();
    // Sessionshould not be updated
    const expected = authState.session_expiry_time;
    expect(expected).toEqual(expTimes.session_expiry_time);
    // refresh should not be updated
    const expectedrefresh = authState.refresh_expiry_time;
    expect(expectedrefresh).toEqual(expTimes.refresh_expiry_time);
    // check the updated state
    const expSessionTimer = { active: true, expire: expTimes.session_expiry_time };
    const expRefreshTimer = { active: true, expire: expTimes.refresh_expiry_time };
    expect(testStore.getState().user.sessionTimer).toEqual(expSessionTimer);
    expect(testStore.getState().user.refreshTimer).toEqual(expRefreshTimer);
});
