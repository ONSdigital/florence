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

describe("handleRedirect", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        window.getEnv = jest.fn().mockReturnValue({
            allowedExternalPaths: ["/external"],
        });
        store.getState = jest.fn().mockReturnValue({
            state: { rootPath: "/florence" },
        });
    });

    it("should call internalRedirect if redirectPath is not provided", () => {
        handleRedirect();
        expect(browserHistory.push).toHaveBeenCalledWith("/florence/collections");
    });

    it("should call externalRedirect if redirectPath is in allowedExternalPaths", () => {
        const redirectPath = "/external/path";
        delete window.location;
        window.location = { pathname: "" };
        handleRedirect(redirectPath);
        expect(window.location.pathname).toBe(redirectPath);
    });

    it("should call internalRedirect if redirectPath is not in allowedExternalPaths", () => {
        const redirectPath = "/florence/collections";
        handleRedirect(redirectPath);
        expect(browserHistory.push).toHaveBeenCalledWith(redirectPath);
    });

    it("should call internalRedirect if redirectPath is not in allowedExternalPaths and known internal path", () => {
        const redirectPath = "/florence/datasets";
        handleRedirect(redirectPath);
        expect(browserHistory.push).toHaveBeenCalledWith(redirectPath);
    });
});
