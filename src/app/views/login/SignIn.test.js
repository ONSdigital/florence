import React from "react";
import { LoginController } from "./SignIn";
import { mount } from "enzyme";
import { status } from "../../constants/Authentication";
import { setAuthState } from "../../utilities/auth";
import user from "../../utilities/api-clients/user";
import redirect from "../../utilities/redirect";
import { UserIDToken } from "../../utilities/token";

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
        setUserState: jest.fn(),
        logOut: jest.fn(),
        getPermissions: jest.fn(),
    };
});

jest.mock("../../utilities/redirect.js", () => ({
    getPath: jest.fn(),
    handle: jest.fn(),
}));

jest.mock("../../utilities/auth", () => ({
    setAuthState: jest.fn(),
}));

jest.mock("../../utilities/token", () => ({
    UserIDToken: {
        getPermissions: jest.fn(),
    },
}));

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

const props = {
    dispatch: function () {},
    rootPath: "/florence",
    isAuthenticated: false,
    enablePermissionsAPI: false,
    location: { query: {} },
};
describe("SignIn", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

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
                    validationErrors: {
                        heading: "Fix the following: ",
                        body: [
                            <p key="error">
                                <a href="javascript:document.getElementById('password').focus()" className="colour--night-shadz">
                                    Enter a password
                                </a>
                            </p>,
                        ],
                    },
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
                    validationErrors: {
                        heading: "Fix the following: ",
                        body: [
                            <p key="email-error">
                                <a href="javascript:document.getElementById('email').focus()" className="colour--night-shadz">
                                    Enter a valid email address
                                </a>
                            </p>,
                        ],
                    },
                };
                component.instance().emailErrorMsg = "Enter a valid email address";

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
                    validationErrors: {
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
                    },
                };
                component.instance().emailErrorMsg = "Enter a valid email address";
                component.instance().passwordErrorMsg = "Enter a password";
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
                    validationErrors: {
                        heading: "Fix the following: ",
                        body: [<p key="error">Email address or password are incorrect</p>],
                    },
                };
                component.setState(state);
                it("should show an error", () => {
                    expect(component.find(".panel__error").length).toBe(1);
                    expect(component.find(".error-msg").length).toBe(0);
                });
            });
        });
    });

    describe("setPermissions", () => {
        it("uses token permissions when enablePermissionsAPI is true", () => {
            const permissions = { email: "test@ons.gov.uk", admin: true, editor: false };
            UserIDToken.getPermissions.mockReturnValue(permissions);
            redirect.getPath.mockReturnValue("/florence/collections");

            const component = mount(<LoginController {...props} enablePermissionsAPI={true} />);
            component.instance().setPermissions();

            expect(UserIDToken.getPermissions).toHaveBeenCalled();
            expect(setAuthState).toHaveBeenCalledWith(permissions);
            expect(user.setUserState).toHaveBeenCalledWith(permissions);
            expect(redirect.handle).toHaveBeenCalledWith("/florence/collections");
            expect(user.getPermissions).not.toHaveBeenCalled();
        });

        it("uses zebedee's permissions API when enablePermissionsAPI is false", async () => {
            const permissions = { email: "test@ons.gov.uk", admin: false, editor: true };
            user.getPermissions.mockResolvedValue(permissions);
            redirect.getPath.mockReturnValue("/florence/users");

            const component = mount(<LoginController {...props} enablePermissionsAPI={false} />);
            component.instance().setPermissions();
            await flushPromises();

            expect(user.getPermissions).toHaveBeenCalled();
            expect(setAuthState).toHaveBeenCalledWith(permissions);
            expect(user.setUserState).toHaveBeenCalledWith(permissions);
            expect(redirect.handle).toHaveBeenCalledWith("/florence/users");
        });
    });
});
