import handleRedirect from "./redirect";
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

describe("given call to handleRedirect", () => {
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

    it("when no redirect parameter provided then the default /florence/collections path is returned", () => {
        handleRedirect();
        expect(browserHistory.push).toHaveBeenCalledWith(defaultPath);
    });

    it("when the redirect parameter is in allowedExternalPaths then the given external path is returned", () => {
        const redirectPath = "/external/path";
        delete window.location;
        window.location = { pathname: "" };
        handleRedirect(redirectPath);
        expect(window.location.pathname).toBe(redirectPath);
    });

    it("when the redirect parameter is an unknown external path then the default /florence/collections path is returned", () => {
        const redirectPath = "/test/path";
        handleRedirect(redirectPath);
        expect(browserHistory.push).toHaveBeenCalledWith(defaultPath);
    });

    it("when the redirect parameter has a known internal path then the given internal path is returned", () => {
        const redirectPath = "/florence/users";
        handleRedirect(redirectPath);
        expect(browserHistory.push).toHaveBeenCalledWith(redirectPath);
    });

    it("when the redirect parameter has a unknown internal path then the default /florence/collections path is returned", () => {
        const redirectPath = "/florence/badpath";
        handleRedirect(redirectPath);
        expect(browserHistory.push).toHaveBeenCalledWith(defaultPath);
    });
});
