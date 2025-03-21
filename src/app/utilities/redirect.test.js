import redirect from "./redirect";
import { browserHistory } from "react-router";
import { store } from "../config/store";

jest.mock("react-router", () => ({
    browserHistory: {
        push: jest.fn(),
    },
}));

jest.mock("../config/store", () => ({
    store: {
        getState: jest.fn(),
    },
}));

describe("redirect.handle", () => {
    const defaultPath = "/florence/collections";
    beforeEach(() => {
        jest.clearAllMocks();
        window.getEnv = jest.fn().mockReturnValue({
            allowedExternalPaths: ["/external"],
        });
        store.getState = jest.fn().mockReturnValue({
            state: { rootPath: "/florence" },
        });
    });

    it("returns the default /florence/collections path when no redirect parameter provided", () => {
        redirect.handle();
        expect(browserHistory.push).toHaveBeenCalledWith(defaultPath);
    });

    it("returns the external path when the redirect parameter is in allowedExternalPaths", () => {
        const redirectPath = "/external/path";
        delete window.location;
        window.location = { pathname: "" };
        redirect.handle(redirectPath);
        expect(window.location.pathname).toBe(redirectPath);
    });

    it("returns the default /florence/collections path when the redirect parameter is an unknown external path", () => {
        const redirectPath = "/test/path";
        redirect.handle(redirectPath);
        expect(browserHistory.push).toHaveBeenCalledWith(defaultPath);
    });

    it("returns the given internal path when the redirect parameter is a known internal path", () => {
        const redirectPath = "/florence/users";
        redirect.handle(redirectPath);
        expect(browserHistory.push).toHaveBeenCalledWith(redirectPath);
    });

    it("returns the default /florence/collections path when the redirect parameter is an unknown internal path", () => {
        const redirectPath = "/florence/badpath";
        redirect.handle(redirectPath);
        expect(browserHistory.push).toHaveBeenCalledWith(defaultPath);
    });
});

describe("redirect.getPath", () => {
    it("should return a blank path when no query string parameters are provided", () => {
        expect(redirect.getPath(null)).toBe("");
        expect(redirect.getPath(undefined)).toBe("");
    });

    it("should return a blank path when an empty object is provided", () => {
        expect(redirect.getPath({})).toBe("");
    });

    it("should return an empty string if both redirect and next keys have values", () => {
        const queryStr = { redirect: "/florence/users", next: "/wagtail/admin" };
        expect(redirect.getPath(queryStr)).toBe("");
    });

    it("should return the redirect string if the redirect key has a value", () => {
        const queryStr = { redirect: "/florence/uploads/data" };
        expect(redirect.getPath(queryStr)).toBe("/florence/uploads/data");
    });

    it("should return the redirect string if the next key has a value", () => {
        const queryStr = { next: "/wagtail" };
        expect(redirect.getPath(queryStr)).toBe("/wagtail");
    });

    it("should return an empty string if an unexpected redirect key is provided", () => {
        const queryStr = { otherParam: "value" };
        expect(redirect.getPath(queryStr)).toBe("");
    });
});
