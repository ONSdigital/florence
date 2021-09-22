import React from "react";
import {LoginController} from "./SignInController";
import {mount} from "enzyme";
import {status} from "../../constants/changePassword";

jest.mock("../../utilities/notifications.js", () => {
    return {
        add: function () {
            // do nothing
        }
    };
});

jest.mock("../../utilities/websocket", () => {
    return {
        send: function () {
            // do nothing
        }
    };
});

jest.mock("../../utilities/api-clients/user.js", () => {
    return {
        setUserState: function () {
            // do nothing
        },
        logOut: function () {
            // do nothing
        }
    };
});

jest.mock("../../utilities/redirectToMainScreen.js", () => {
    return {
        redirectToMainScreen: function () {
            // do nothing
        }
    };
});

test("Check redirect doesn't work if not authenticated", () => {
    const props = {
        dispatch: function () {
        },
        rootPath: "/florence",
        isAuthenticated: false
    };
    const component = mount(<LoginController {...props} />);
    expect(component.find("h1").text()).toBe("Sign in to your Florence account");
});

test("Does password change form appear on first time sign in", () => {
    const props = {
        dispatch: function () {
        },
        rootPath: "/florence",
        isAuthenticated: false
    };
    const component = mount(<LoginController {...props} />);
    expect(component.find("h1").text()).toBe("Sign in to your Florence account");
    component.setState({
        firstTimeSignIn: true,
    });
    expect(component.find("h1").text()).toBe("Change your password");
});

test("Given a missing password validation error do the warnings appear", () => {
    const props = {
        dispatch: function () {
        },
        rootPath: "/florence",
        isAuthenticated: false,
        enableNewSignIn: true
    };
    const state = {
        errorsPresent: true,
        passwordValue: "",
        emailValue: "foo@bar.com",
        passwordType: "password",
        status: status.WAITING_USER_INITIAL_CREDS,
        firstTimeSignIn: false
    };
    const component = mount(<LoginController {...props} />);
    expect(component.find(".panel__error").length).toBe(0);
    expect(component.find(".error-msg").length).toBe(0);
    component.instance().validationErrors = {
        heading: "Fix the following: ",
        body: [
            <p key="error">
                <a href="javascript:document.getElementById('password').focus()" className="colour--night-shadz">
                    Enter a password
                </a>
            </p>
        ]
    }
    component.instance().passwordErrorMsg = "Enter a password";
    component.setState(state);
    expect(component.find(".panel__error").length).toBe(1);
    expect(component.find(".error-msg").length).toBe(1);
});

xtest("Given a bad email validation error do the warnings appear", () => {
    const props = {
        dispatch: function () {
        },
        rootPath: "/florence",
        isAuthenticated: false
    };
    const state = {
        validationErrors: {
            heading: "Fix the following: ",
            body: [
                <p key="email-error">
                    <a href="javascript:document.getElementById('email').focus()" className="colour--night-shadz">
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

xtest("Given a bad email and no password validation error do the warnings appear", () => {
    const props = {
        dispatch: function () {
        },
        rootPath: "/florence",
        isAuthenticated: false
    };
    const state = {
        validationErrors: {
            heading: "Fix the following: ",
            body: [
                <p key="email-error">
                    <a href="javascript:document.getElementById('email').focus()" className="colour--night-shadz">
                        Enter a valid email address
                    </a>
                </p>,
                <p key="email-error-2">
                    <a href="javascript:document.getElementById('email').focus()" className="colour--night-shadz">
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

xtest("Given a bad email and password combination validation error do the warnings appear", () => {
    const props = {
        dispatch: function () {
        },
        rootPath: "/florence",
        isAuthenticated: false
    };
    const state = {
        validationErrors: {
            heading: "Fix the following: ",
            body: [<p key="error">Email address or password are incorrect</p>]
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

xtest("Given too many attempts to sign in does validation error appear", () => {
    const props = {
        dispatch: function () {
        },
        rootPath: "/florence",
        isAuthenticated: false
    };
    const state = {
        validationErrors: {
            heading: "Fix the following: ",
            body: [<p key="error">You've tried to sign in to your account too many times. Please try again later.</p>]
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
