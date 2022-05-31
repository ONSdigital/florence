import React from "react";
import { screen } from "@testing-library/dom";
import { MemoryRouter, Route, Router } from "react-router";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { routerReducer } from "react-router-redux";
import thunkMiddleware from "redux-thunk";

import { appRoutes } from "./app";
import { history } from "./config/store";
import reducer from "./config/reducer";
import userReducer from "./config/user/userReducer";
import interactives from "./reducers/interactives";
import taxonomies from "./reducers/taxonomies";

const rootPath = "/florence";
const token = `access_token="Bearer <TOKEN>"`;
// Local Storage
var localStorageMock = (function () {
    var store = {
        ons_auth_state: `{"email":"19e913a3-51db-47bb-bec7-e2b7c578e9da","admin":true,"editor":true}`,
        loggedInAs: "19e913a3-51db-47bb-bec7-e2b7c578e9da",
        userType: "PUBLISHING_SUPPORT",
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

jest.mock("minimongo", () => ({ IndexedDb: jest.fn().mockImplementation((obj, func) => {}) }));
jest.mock("./utilities/api-clients/user", () => {
    const actual = jest.requireActual("./utilities/api-clients/user");
    return {
        ...actual.default,
        getPermissions: () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve({ email: "19e913a3-51db-47bb-bec7-e2b7c578e9da", admin: true, editor: true });
                }, 300);
            });
        },
    };
});

beforeEach(() => {
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
    // Cookies
    Object.defineProperty(document, "cookie", {
        writable: true,
        value: token,
    });
});

afterEach(() => {
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
    // Cookies
    Object.defineProperty(document, "cookie", {
        writable: true,
        value: "",
    });
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

function createTestApp(testStore, history) {
    return (
        <Provider store={testStore}>
            <Router history={history}>{appRoutes(testStore.getState().state.config)}</Router>
        </Provider>
    );
}

describe("App", () => {
    describe("App authentication", () => {
        // TODO remove when ENABLE_NEW_SIGN_IN feature is stable
        it("should render the /login route", () => {
            const testStore = createTestStore();
            history.push(`${rootPath}/login`);
            render(createTestApp(testStore, history));
            const element = screen.getByTestId("login");
            expect(element).toBeInTheDocument;
        });
        it("should render the /login route with enableNewSignIn", () => {
            const testStore = createTestStore({ enableNewSignIn: true });
            history.push(`${rootPath}/login`);
            render(createTestApp(testStore, history));
            const element = screen.getByTestId("signin");
            expect(element).toBeInTheDocument;
        });
        // TODO remove when ENABLE_NEW_SIGN_IN feature is stable
        it("should render the / route which is the collections route", async () => {
            const testStore = createTestStore();
            history.push(`${rootPath}/`);
            render(createTestApp(testStore, history));
            const element = screen.getByTestId("collections");
            expect(element).toBeInTheDocument;
        });
        it("should render the / route which is the collections route with enableNewSignIn", async () => {
            const testStore = createTestStore({ enableNewSignIn: true });
            history.push(`${rootPath}/`);
            render(createTestApp(testStore, history));
            const element = screen.getByTestId("collections");
            expect(element).toBeInTheDocument;
        });
        // TODO remove when ENABLE_NEW_SIGN_IN feature is stable
        it("should render the /collections page", async () => {
            const testStore = createTestStore();
            history.push(`${rootPath}/collections`);
            render(createTestApp(testStore, history));
            const element = screen.getByTestId("collections");
            expect(element).toBeInTheDocument;
        });
        it("should render the /collections route with enableNewSignIn", async () => {
            const testStore = createTestStore({ enableNewSignIn: true });
            history.push(`${rootPath}/collections`);
            render(createTestApp(testStore, history));
            const element = screen.getByTestId("collections");
            expect(element).toBeInTheDocument;
        });
        // TODO remove when ENABLE_NEW_SIGN_IN feature is stable
        it("should render the /teams page", async () => {
            const testStore = createTestStore();
            history.push(`${rootPath}/teams`);
            render(createTestApp(testStore, history));
            const element = screen.getByTestId("teams");
            expect(element).toBeInTheDocument;
        });
        it("should render the /groups route with enableNewSignIn", async () => {
            const testStore = createTestStore({ enableNewSignIn: true });
            history.push(`${rootPath}/groups`);
            render(createTestApp(testStore, history));
            const element = screen.getByTestId("groups");
            expect(element).toBeInTheDocument;
        });
        // TODO remove when ENABLE_NEW_SIGN_IN feature is stable
        it("should render the /users page", async () => {
            const testStore = createTestStore();
            history.push(`${rootPath}/users`);
            render(createTestApp(testStore, history));
            const element = screen.getByTestId("users");
            expect(element).toBeInTheDocument;
        });
        it("should render the /users route with enableNewSignIn", async () => {
            const testStore = createTestStore({ enableNewSignIn: true });
            history.push(`${rootPath}/users`);
            render(createTestApp(testStore, history));
            const element = screen.getByTestId("users");
            expect(element).toBeInTheDocument;
        });
    });
});
