import React from "react";
import { LoginController } from "./LoginController";
import { mount } from "enzyme";

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

test("Check redirect doesn't work if not authenticated", () => {
    const props = {
        dispatch: function () {},
        rootPath: "/florence",
        isAuthenticated: false,
    };
    const component = mount(<LoginController {...props} />);
    expect(component.find("h1").text()).toBe("Sign in to your Florence account");
});

test("Does password change form appear on state change", () => {
    const props = {
        dispatch: function () {},
        rootPath: "/florence",
        isAuthenticated: false,
    };
    const component = mount(<LoginController {...props} />);
    expect(component.find(".modal__overlay").length).toBe(0);
    component.setState({ requestPasswordChange: true });
    expect(component.find(".modal__overlay").length).toBe(1);
});
