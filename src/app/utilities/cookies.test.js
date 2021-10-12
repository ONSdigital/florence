import cookies from "./cookies";

function setLocation(href) {
    jsdom.reconfigure({
        url: href,
    });
}

function resetCookie() {
    Object.defineProperty(window.document, "cookie", {
        writable: true,
        value: "",
    });
}

setLocation("http://qux/quux/quuz");
resetCookie();
afterEach(() => {
    resetCookie();
});

describe("given cookie options to the add function", () => {
    var cookieToAdd = {
        name: "foo",
        value: "bar",
        cookieAttributes: {
            sameSite: "Strict",
            secure: true,
            path: "/",
            domain: "baz",
        },
    };
    it("should add the cookie to client", () => {
        cookies.add(cookieToAdd.name, cookieToAdd.value, cookieToAdd.cookieAttributes);
        expect(document.cookie).toBe(`foo=bar;path=/;domain=baz; SameSite=Strict; Secure`);
    });
});

describe("given cookie minimum options to the add function", () => {
    var cookieToAdd = {
        name: "foo",
        value: "bar",
        cookieAttributes: {},
    };
    it("should add the cookie to client", () => {
        cookies.add(cookieToAdd.name, cookieToAdd.value, cookieToAdd.cookieAttributes);
        expect(document.cookie).toBe(`foo=bar;path=/;domain=qux`);
    });
});

describe("given cookie options with a missing mandatory field 'value' passed to the add function", () => {
    var cookieToAdd = {
        name: "foo",
        cookieAttributes: {},
    };
    it("no cookies should be set but false returned from add function", () => {
        const result = cookies.add(cookieToAdd.name, cookieToAdd.value, cookieToAdd.cookieAttributes);
        expect(document.cookie).toBe(``);
        expect(result).toBe(false);
    });
});

describe("given cookie options with a missing mandatory field 'name' passed to the add function", () => {
    var cookieToAdd = {
        value: "bar",
        cookieAttributes: {},
    };
    it("no cookies should be set but false returned from add function", () => {
        const result = cookies.add(cookieToAdd.name, cookieToAdd.value, cookieToAdd.cookieAttributes);
        expect(document.cookie).toBe(``);
        expect(result).toBe(false);
    });
});

describe("given cookie options with but attribute object set to null, passed to the add function", () => {
    var cookieToAdd = {
        name: "foo",
        value: "bar",
        cookieAttributes: null,
    };
    it("should add the cookie to client", () => {
        cookies.add(cookieToAdd.name, cookieToAdd.value, cookieToAdd.cookieAttributes);
        expect(document.cookie).toBe(`foo=bar;path=/;domain=qux`);
    });
});
