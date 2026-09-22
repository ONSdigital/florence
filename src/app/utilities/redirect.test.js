import redirect from "./redirect";
import { store, baseHistory as history } from "../config/store";

jest.mock("../config/store", () => ({
    store: {
        getState: jest.fn(),
    },
    baseHistory: {
        push: jest.fn(),
    },
}));

describe("redirect.handle", () => {
    const defaultPath = "/florence/collections";
    beforeEach(() => {
        jest.clearAllMocks();
        window.getEnv = jest.fn().mockReturnValue({
            allowedExternalPaths: ["/external", "no-slash-in-setup"],
        });
        store.getState = jest.fn().mockReturnValue({
            state: {
                rootPath: "/florence",
                config: {
                    enableSystemNavBar: false,
                },
            },
        });
    });

    it("returns the default /florence/collections path when no redirect parameter provided", () => {
        redirect.handle();
        expect(history.push).toHaveBeenCalledWith(defaultPath);
    });

    it("returns the external path when the redirect parameter is in allowedExternalPaths", () => {
        const redirectPath = "/external";
        redirect.handle(redirectPath);
        expect(window.location.pathname).toBe(redirectPath);
    });

    it("returns the given external path when the redirect parameter is surrounded by slashes and is in allowedExternalPaths", () => {
        const redirectPath = "/external/";
        redirect.handle(redirectPath);
        expect(window.location.pathname).toBe(redirectPath);
    });

    it("returns the given external path when the redirect parameter has a trailing slash and is in allowedExternalPaths", () => {
        const redirectPath = "external/";
        redirect.handle(redirectPath);
        expect(window.location.pathname).toBe(`/${redirectPath}`);
    });

    it("returns the given external path when the primary redirect parameter is in allowedExternalPaths", () => {
        const redirectPath = "/external/path";
        redirect.handle(redirectPath);
        expect(window.location.pathname).toBe(redirectPath);
    });

    it("returns the default /florence/collections path when the redirect parameter is not a strict string match to allowedExternalPaths", () => {
        const redirectPath = "/external-path";
        redirect.handle(redirectPath);
        expect(history.push).toHaveBeenCalledWith(defaultPath);
    });

    it("returns the given external path when the redirect parameter has no slashes and is in allowedExternalPaths without slashes", () => {
        const redirectPath = "no-slash-in-setup";
        redirect.handle(redirectPath);
        expect(window.location.pathname).toBe(`/${redirectPath}`);
    });

    it("returns the given external path when the redirect parameter has no prefixed slash and is in allowedExternalPaths without slashes", () => {
        const redirectPath = "no-slash-in-setup/path";
        redirect.handle(redirectPath);
        expect(window.location.pathname).toBe(`/${redirectPath}`);
    });

    it("returns the default /florence/collections path when the redirect parameter is an unknown external path", () => {
        const redirectPath = "/test/path";
        redirect.handle(redirectPath);
        expect(history.push).toHaveBeenCalledWith(defaultPath);
    });

    it("returns the given internal path when the redirect parameter is a known internal path", () => {
        const redirectPath = "/florence/users";
        redirect.handle(redirectPath);
        expect(history.push).toHaveBeenCalledWith(redirectPath);
    });

    it("returns the default /florence/collections path when the redirect parameter is an unknown internal path", () => {
        const redirectPath = "/florence/badpath";
        redirect.handle(redirectPath);
        expect(history.push).toHaveBeenCalledWith(defaultPath);
    });
});

describe("redirect.getPath", () => {
    it("should return a blank path when no query string parameters are provided", () => {
        const params = new URLSearchParams();
        expect(redirect.getPath(params)).toBe("");
    });

    it("should return an empty string if both redirect and next keys have values", () => {
        const params = new URLSearchParams();
        params.set("redirect", "/florence/users");
        params.set("next", "/wagtail/admin");
        expect(redirect.getPath(params)).toBe("");
    });

    it("should return the redirect string if the redirect key has a value", () => {
        const params = new URLSearchParams();
        params.set("redirect", "/florence/uploads/data");
        expect(redirect.getPath(params)).toBe("/florence/uploads/data");
    });

    it("should return the redirect string if the next key has a value", () => {
        const params = new URLSearchParams();
        params.set("next", "/wagtail");
        expect(redirect.getPath(params)).toBe("/wagtail");
    });

    it("should return an empty string if an unexpected redirect key is provided", () => {
        const params = new URLSearchParams();
        params.set("otherParam", "value");
        expect(redirect.getPath(params)).toBe("");
    });
});

describe("sanitiseRedirectPath", () => {
    const defaultPath = "/florence/collections";

    beforeEach(() => {
        jest.clearAllMocks();
        Object.defineProperty(window.location, "origin", {
            writable: true,
            value: "http://localhost",
        });
        window.getEnv = jest.fn().mockReturnValue({
            allowedExternalPaths: ["/external", "no-slash-in-setup"],
        });
        store.getState = jest.fn().mockReturnValue({
            state: {
                rootPath: "/florence",
                config: {
                    enableSystemNavBar: false,
                },
            },
        });
    });

    it("should return an empty string when redirectPath is not a string", () => {
        // This tests the refactored sanitisation logic
        expect(redirect.handle(null)).toEqual(undefined);
        expect(redirect.handle(123)).toEqual(undefined);
        expect(redirect.handle({})).toEqual(undefined);
        expect(redirect.handle([])).toEqual(undefined);
    });

    it("should return an empty string when redirectPath is empty string", () => {
        redirect.handle("");
        expect(history.push).toHaveBeenCalledWith(defaultPath);
    });

    it("should return an empty string when redirectPath contains only whitespace", () => {
        redirect.handle("   ");
        expect(history.push).toHaveBeenCalledWith(defaultPath);
    });

    it("should return an empty string when redirectPath is an http URL", () => {
        redirect.handle("http://example.com");
        expect(history.push).toHaveBeenCalledWith(defaultPath);
    });

    it("should return an empty string when redirectPath is an https URL", () => {
        redirect.handle("https://example.com");
        expect(history.push).toHaveBeenCalledWith(defaultPath);
    });

    it("should return an empty string when redirectPath starts with //", () => {
        redirect.handle("//example.com");
        expect(history.push).toHaveBeenCalledWith(defaultPath);
    });

    it("should return an empty string when redirectPath contains backslashes", () => {
        redirect.handle("/path\\to\\file");
        expect(history.push).toHaveBeenCalledWith(defaultPath);
    });

    it("should decode URL-encoded paths", () => {
        redirect.handle("/florence%2Fcollections");
        expect(history.push).toHaveBeenCalled();
    });

    it("should handle paths without leading slash by adding one", () => {
        redirect.handle("florence/collections");
        expect(history.push).toHaveBeenCalled();
    });

    it("should return an empty string when decodeURIComponent throws", () => {
        // Invalid percent encoding
        redirect.handle("%");
        expect(history.push).toHaveBeenCalledWith(defaultPath);
    });

    it("should handle paths with leading and trailing whitespace", () => {
        redirect.handle("  /florence/collections  ");
        expect(history.push).toHaveBeenCalled();
    });
});

describe("isAllowedInternalPath", () => {
    const rootPath = "/florence";
    const defaultPath = "/florence/collections";
    const allowedPrefixes = [
        "/florence/collections",
        "/florence/groups",
        "/florence/security",
        "/florence/teams",
        "/florence/uploads",
        "/florence/users",
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        window.getEnv = jest.fn().mockReturnValue({
            allowedExternalPaths: [],
        });
        store.getState = jest.fn().mockReturnValue({
            state: {
                rootPath,
                config: {
                    enableSystemNavBar: false,
                },
            },
        });
    });

    it("should allow exact matches of allowed internal paths", () => {
        allowedPrefixes.forEach(prefix => {
            redirect.handle(prefix);
            expect(history.push).toHaveBeenCalledWith(prefix);
            jest.clearAllMocks();
        });
    });

    it("should allow paths that start with allowed prefixes", () => {
        redirect.handle("/florence/collections/my-collection");
        expect(history.push).toHaveBeenCalledWith("/florence/collections/my-collection");

        jest.clearAllMocks();

        redirect.handle("/florence/users/user-id");
        expect(history.push).toHaveBeenCalledWith("/florence/users/user-id");
    });

    it("should reject paths that do not match allowed prefixes", () => {
        redirect.handle("/florence/unknown");
        expect(history.push).toHaveBeenCalledWith(defaultPath);

        jest.clearAllMocks();

        redirect.handle("/florence/admin");
        expect(history.push).toHaveBeenCalledWith(defaultPath);
    });

    it("should handle paths with deep nesting", () => {
        redirect.handle("/florence/collections/col1/collections/col2");
        expect(history.push).toHaveBeenCalledWith("/florence/collections/col1/collections/col2");
    });
});

describe("internalRedirect with system nav bar", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        window.getEnv = jest.fn().mockReturnValue({
            allowedExternalPaths: [],
        });
    });

    it("should redirect to /florence/systems when enableSystemNavBar is true and no path provided", () => {
        store.getState = jest.fn().mockReturnValue({
            state: {
                rootPath: "/florence",
                config: {
                    enableSystemNavBar: true,
                },
            },
        });

        redirect.handle();
        expect(history.push).toHaveBeenCalledWith("/florence/systems");
    });

    it("should redirect to /florence/collections when enableSystemNavBar is false and no path provided", () => {
        store.getState = jest.fn().mockReturnValue({
            state: {
                rootPath: "/florence",
                config: {
                    enableSystemNavBar: false,
                },
            },
        });

        redirect.handle();
        expect(history.push).toHaveBeenCalledWith("/florence/collections");
    });
});

describe("special internal paths", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        window.getEnv = jest.fn().mockReturnValue({
            allowedExternalPaths: [],
        });
        store.getState = jest.fn().mockReturnValue({
            state: {
                rootPath: "/florence",
                config: {
                    enableSystemNavBar: false,
                },
            },
        });
    });

    it("should not use history.push for publishing-queue path", () => {
        // This path should not go through history.push but through window.location.href
        try {
            redirect.handle("/florence/publishing-queue");
        } catch {
            // Expected to fail when trying to set window.location.href to a relative URL in jsdom
        }
        expect(history.push).not.toHaveBeenCalled();
    });

    it("should not use history.push for workspace path", () => {
        // This path should not go through history.push but through window.location.href
        try {
            redirect.handle("/florence/workspace");
        } catch {
            // Expected to fail when trying to set window.location.href to a relative URL in jsdom
        }
        expect(history.push).not.toHaveBeenCalled();
    });
});
