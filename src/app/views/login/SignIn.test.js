import React from "react";
import { LoginController } from "./SignIn";
import { mount } from "enzyme";
import { status } from "../../constants/Authentication";

jest.mock("../../utilities/notifications.js", () => {
    return {
        add: function () {
            // do nothing
        },
    };
});

jest.mock("../../utilities/websocket", () => {
    return {
        send: function () {
            // do nothing
        },
    };
});

jest.mock("../../utilities/api-clients/user.js", () => {
    return {
        setUserState: function () {
            // do nothing
        },
        logOut: function () {
            // do nothing
        },
    };
});

jest.mock("../../utilities/redirectToMainScreen.js", () => {
    return {
        redirectToMainScreen: function () {
            // do nothing
        },
    };
});

const props = {
    dispatch: function () {},
    rootPath: "/florence",
    isAuthenticated: false,
};
describe("SignIn", () => {
    describe("when a non-authenticated user hits the screen", () => {
        let component = mount(<LoginController {...props} />);
        it("should not redirect them or show any errors", () => {
            expect(component.find("h1").text()).toBe("Sign in to your Florence account");
            expect(component.find(".panel__error").length).toBe(0);
            expect(component.find(".error-msg").length).toBe(0);
        });
        describe("it is the users first time signing in", () => {
            let component = mount(<LoginController {...props} />);
            component.setState({
                firstTimeSignIn: true,
            });
            it("password change form should appear", () => {
                expect(component.find("h1").text()).toBe("Change your password");
            });
        });
        describe("and attempts to sign in", () => {
            describe("without entering a password", () => {
                const component = mount(<LoginController {...props} />);
                const state = {
                    errorsPresent: true,
                    passwordValue: "",
                    emailValue: "foo@bar.com",
                    passwordType: "password",
                    status: status.WAITING_USER_INITIAL_CREDS,
                    firstTimeSignIn: false,
                };
                component.instance().validationErrors = {
                    heading: "Fix the following: ",
                    body: [
                        <p key="error">
                            <a href="javascript:document.getElementById('password').focus()" className="colour--night-shadz">
                                Enter a password
                            </a>
                        </p>,
                    ],
                };
                component.instance().passwordErrorMsg = "Enter a password";
                component.setState(state);
                it("should show an error", () => {
                    expect(component.find(".panel__error").length).toBe(1);
                    expect(component.find(".error-msg").length).toBe(1);
                });
            });
            describe("with an invalid email", () => {
                const component = mount(<LoginController {...props} />);
                const state = {
                    errorsPresent: true,
                    passwordValue: "fooBar5BazQuxQuux",
                    emailValue: "foobar!baz",
                    passwordType: "password",
                    status: status.WAITING_USER_INITIAL_CREDS,
                    firstTimeSignIn: false,
                };
                component.instance().emailErrorMsg = "Enter a valid email address";
                component.instance().validationErrors = {
                    heading: "Fix the following: ",
                    body: [
                        <p key="email-error">
                            <a href="javascript:document.getElementById('email').focus()" className="colour--night-shadz">
                                Enter a valid email address
                            </a>
                        </p>,
                    ],
                };
                component.setState(state);
                it("should show an error", () => {
                    expect(component.find(".panel__error").length).toBe(1);
                    expect(component.find(".error-msg").length).toBe(1);
                });
            });
            describe("with an invalid email and no password", () => {
                const component = mount(<LoginController {...props} />);
                const state = {
                    errorsPresent: true,
                    passwordValue: "",
                    emailValue: "foobar!baz",
                    passwordType: "password",
                    status: status.WAITING_USER_INITIAL_CREDS,
                    firstTimeSignIn: false,
                };
                component.instance().emailErrorMsg = "Enter a valid email address";
                component.instance().passwordErrorMsg = "Enter a password";
                component.instance().validationErrors = {
                    heading: "Fix the following: ",
                    body: [
                        <p key="email-error">
                            <a href="javascript:document.getElementById('email').focus()" className="colour--night-shadz">
                                Enter a valid email address
                            </a>
                        </p>,
                        <p key="error-invalid-password">
                            <a href="javascript:document.getElementById('password').focus()" className="colour--night-shadz">
                                Enter a password
                            </a>
                        </p>,
                    ],
                };
                component.setState(state);
                it("should show multiple errors", () => {
                    expect(component.find(".panel__error").length).toBe(1);
                    expect(component.find(".error-msg").length).toBe(2);
                });
            });
            describe("with a bad email and password combination", () => {
                const component = mount(<LoginController {...props} />);
                const state = {
                    errorsPresent: true,
                    passwordValue: "aValid24Password",
                    emailValue: "foobar@ons.gov.uk",
                    passwordType: "password",
                    status: status.WAITING_USER_INITIAL_CREDS,
                    firstTimeSignIn: false,
                };
                component.instance().validationErrors = {
                    heading: "Fix the following: ",
                    body: [<p key="error">Email address or password are incorrect</p>],
                };
                component.setState(state);
                it("should show an error", () => {
                    expect(component.find(".panel__error").length).toBe(1);
                    expect(component.find(".error-msg").length).toBe(0);
                });
            });
        });
    });
});
