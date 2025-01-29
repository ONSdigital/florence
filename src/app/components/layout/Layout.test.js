import React from "react";
import { screen, getAllByTestId, getByText } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { routerReducer } from "react-router-redux";
import thunkMiddleware from "redux-thunk";

import { history, store } from "../../config/store";
import reducer from "../../config/reducer";
import userReducer from "../../config/user/userReducer";
import taxonomies from "../../reducers/taxonomies";

import Layout from "./Layout";
import { getAuthState, setAuthState } from "../../utilities/auth";
import SessionManagement, { createDefaultExpiryTimes } from "dis-authorisation-client-js";
import { startRefeshAndSession } from "../../config/user/userActions";
import { setConfig } from "../../config/actions";

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
    const mockTimers = createDefaultExpiryTimes(1);
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
    user.getUserRole = jest.fn();
    user.renewSession = () => {
        return new Promise((resolve, reject) => {
            resolve({ expirationTime: mockSessionExpiryTime });
        });
    };
    return user;
});

beforeEach(() => {
    Object.defineProperty(window, "localStorage", { value: localStorageMock, writable: true });
});

afterAll(() => {
    window.localStorage.clear();
});

function createTestStore(config = {}) {
    return createStore(
        combineReducers({
            state: reducer,
            user: userReducer,
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

it("renders <NavBar /> component", () => {
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
