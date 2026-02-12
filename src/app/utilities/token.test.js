import { UserIDToken } from "./token";
import cookies from "./cookies";

jest.mock("./cookies", () => ({
    get: jest.fn(),
}));

const toBase64Url = value => Buffer.from(JSON.stringify(value)).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

const makeToken = payload => `${toBase64Url({ alg: "HS256", typ: "JWT" })}.${toBase64Url(payload)}.signature`;

describe("UserIDToken", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        if (typeof atob === "undefined") {
            global.atob = base64 => Buffer.from(base64, "base64").toString("utf8");
        }
    });

    it("returns admin/editor permissions based on groups", () => {
        const token = makeToken({
            email: "user@ons.gov.uk",
            "cognito:groups": ["role-admin", "role-publisher"],
        });
        cookies.get.mockReturnValue(token);

        expect(UserIDToken.getPermissions()).toEqual({
            email: "user@ons.gov.uk",
            admin: true,
            editor: true,
        });
    });

    it("returns false when groups do not contain required roles", () => {
        const token = makeToken({ email: "user@ons.gov.uk", "cognito:groups": ["role-other"] });
        cookies.get.mockReturnValue(token);

        expect(UserIDToken.getPermissions()).toEqual({
            email: "user@ons.gov.uk",
            admin: false,
            editor: false,
        });
    });

    it("returns permissions object from token payload", () => {
        const token = makeToken({
            email: "editor@ons.gov.uk",
            "cognito:groups": ["role-publisher"],
        });
        cookies.get.mockReturnValue(token);

        expect(UserIDToken.getPermissions()).toEqual({
            email: "editor@ons.gov.uk",
            admin: false,
            editor: true,
        });
    });

    it("handles invalid token payloads", () => {
        cookies.get.mockReturnValue("not-a.jwt");

        expect(UserIDToken.getPermissions()).toEqual(undefined);
    });
});
