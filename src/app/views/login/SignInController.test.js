import React from "react";
import { LoginController } from "./SignInController";
import { mount } from "enzyme";

jest.mock("../../utilities/notifications.js", () => {
    return {
        add: function() {
            // do nothing
        }
    };
});

jest.mock("../../utilities/websocket", () => {
    return {
        send: function() {
            // do nothing
        }
    };
});

jest.mock("../../utilities/api-clients/user.js", () => {
    return {
        setUserState: function() {
            // do nothing
        },
        logOut: function() {
            // do nothing
        }
    };
});
jest.mock("../../utilities/redirectToMainScreen.js", () => {
    return {
        redirectToMainScreen: function() {
            // do nothing
        }
    };
});

test("Check redirect doesn't work if not authenticated", () => {
    const props = {
        dispatch: function() {},
        rootPath: "/florence",
        isAuthenticated: false
    };
    const component = mount(<LoginController {...props} />);
    expect(component.find("h1").text()).toBe("Sign in to your Florence account");
});

test("Does password change form appear on state change", () => {
    const props = {
        dispatch: function() {},
        rootPath: "/florence",
        isAuthenticated: false
    };
    const component = mount(<LoginController {...props} />);
    expect(component.find(".modal__overlay").length).toBe(0);
    component.setState({ requestPasswordChange: true });
    expect(component.find(".modal__overlay").length).toBe(1);
});

test("Given a missing password validation error do the warnings appear", () => {
    const props = {
        dispatch: function() {},
        rootPath: "/florence",
        isAuthenticated: false
    };
    const state = {
        validationErrors: {
            heading: "Fix the following: ",
            body: (
                <p>
                    <a href="javascript:document.getElementById('password').focus()" className={"colour--night-shadz"}>
                        Enter a password
                    </a>
                </p>
            )
        },
        email: {
            value: "foo@bar.com",
            errorMsg: ""
        },
        password: {
            value: "",
            errorMsg: "Enter a password",
            type: "password"
        },
        requestPasswordChange: false,
        isSubmitting: false
    };
    const component = mount(<LoginController {...props} />);
    expect(component.find(".panel__error").length).toBe(0);
    expect(component.find(".error-msg").length).toBe(0);
    component.setState(state);
    expect(component.find(".panel__error").length).toBe(1);
    expect(component.find(".error-msg").length).toBe(1);
});

test("Given a bad email validation error do the warnings appear", () => {
    const props = {
        dispatch: function() {},
        rootPath: "/florence",
        isAuthenticated: false
    };
    const state = {
        validationErrors: {
            heading: "Fix the following: ",
            body: (
                <p>
                    <a href="javascript:document.getElementById('email').focus()" className={"colour--night-shadz"}>
                        Enter a valid email address
                    </a>
                </p>
            )
        },
        email: {
            value: "foobar!baz",
            errorMsg: "Enter a valid email address"
        },
        password: {
            value: "foobar",
            errorMsg: "",
            type: "password"
        },
        requestPasswordChange: false,
        isSubmitting: false
    };
    const component = mount(<LoginController {...props} />);
    expect(component.find(".panel__error").length).toBe(0);
    expect(component.find(".error-msg").length).toBe(0);
    component.setState(state);
    expect(component.find(".panel__error").length).toBe(1);
    expect(component.find(".error-msg").length).toBe(1);
});

test("Given a bad email and no password validation error do the warnings appear", () => {
    const props = {
        dispatch: function() {},
        rootPath: "/florence",
        isAuthenticated: false
    };
    const state = {
        validationErrors: {
            heading: "Fix the following: ",
            body: [
                <p>
                    <a href="javascript:document.getElementById('email').focus()" className={"colour--night-shadz"}>
                        Enter a valid email address
                    </a>
                </p>,
                <p>
                    <a href="javascript:document.getElementById('email').focus()" className={"colour--night-shadz"}>
                        Enter a valid email address
                    </a>
                </p>
            ]
        },
        email: {
            value: "foobar!baz",
            errorMsg: "Enter a valid email address"
        },
        password: {
            value: "",
            errorMsg: "Enter a password",
            type: "password"
        },
        requestPasswordChange: false,
        isSubmitting: false
    };
    const component = mount(<LoginController {...props} />);
    expect(component.find(".panel__error").length).toBe(0);
    expect(component.find(".error-msg").length).toBe(0);
    component.setState(state);
    expect(component.find(".panel__error").length).toBe(1);
    expect(component.find(".error-msg").length).toBe(2);
});

test("Given a bad email and password combination validation error do the warnings appear", () => {
    const props = {
        dispatch: function() {},
        rootPath: "/florence",
        isAuthenticated: false
    };
    const state = {
        validationErrors: {
            heading: "Fix the following: ",
            body: [<p>Email address or password are incorrect</p>]
        },
        email: {
            value: "foobar!baz",
            errorMsg: ""
        },
        password: {
            value: "foo",
            errorMsg: "",
            type: "password"
        },
        requestPasswordChange: false,
        isSubmitting: false
    };
    const component = mount(<LoginController {...props} />);
    expect(component.find(".panel__error").length).toBe(0);
    expect(component.find(".error-msg").length).toBe(0);
    component.setState(state);
    expect(component.find(".panel__error").length).toBe(1);
    expect(component.find(".error-msg").length).toBe(0);
});

test("Given too many attempts to sign in does validation error appear", () => {
    const props = {
        dispatch: function() {},
        rootPath: "/florence",
        isAuthenticated: false
    };
    const state = {
        validationErrors: {
            heading: "Fix the following: ",
            body: [<p>You've tried to sign in to your account too many times. Please try again later.</p>]
        },
        email: {
            value: "foobar!baz",
            errorMsg: ""
        },
        password: {
            value: "foo",
            errorMsg: "",
            type: "password"
        },
        requestPasswordChange: false,
        isSubmitting: false
    };
    const component = mount(<LoginController {...props} />);
    expect(component.find(".panel__error").length).toBe(0);
    expect(component.find(".error-msg").length).toBe(0);
    component.setState(state);
    expect(component.find(".panel__error").length).toBe(1);
    expect(component.find(".error-msg").length).toBe(0);
});
