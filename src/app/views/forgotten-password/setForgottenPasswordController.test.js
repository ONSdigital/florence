import { mount } from "enzyme";
import { SetForgottenPasswordController } from "./setForgottenPasswordController";

import React from "react";

describe("When the user first lands on the page", () => {
    const props = {
        dispatch: function() {},
        location: {
            query: {
                uid: "123456&uid=1234a12b-c1de-123f-g123-1hijkl1234m1",
                vid: "123456"
            }
        }
    };
    const component = mount(<SetForgottenPasswordController {...props} />);
    it("Load the correct child component setForgottenPasswordRequest", () => {
        expect(component.find("h1").text()).toBe("Create a new password");
    });
    it("Password field should be empty and not in an errored state", () => {
        expect(component.find("#password-input").prop("value")).toBe("");
        expect(
            component
                .find(".form__input")
                .at(0)
                .hasClass("form__input--error")
        ).toBe(false);
    });
    it("Validation rules should all be in a state that is unchecked", () => {
        expect(component.find("#minimum-character-limit").props()["checked"]).toBe(false);
        expect(component.find("#uppercase-character-validation").props()["checked"]).toBe(false);
        expect(component.find("#lowercase-character-validation").props()["checked"]).toBe(false);
        expect(component.find("#minimum-number-limit").props()["checked"]).toBe(false);
    });
});

describe("After the user has attempted to submit a password change without meeting the validation rules", () => {
    const props = {
        dispatch: function() {}
    };

    const component = mount(<SetForgottenPasswordController {...props} />);
    component.setState({
        hasSubmitted: false,
        isSubmitting: false,
        passwordIsValid: false,
        password: "",
        showInputError: true
    });
    it("They should have an 'errored' input box and still be on the 'request' screen", async () => {
        expect(component.find("h1").text()).toBe("Create a new password");
        expect(
            component
                .find(".form__input")
                .at(0)
                .hasClass("form__input--error")
        ).toBe(true);
    });
});

describe("After the user submits their new password successfully ", () => {
    const props = {
        dispatch: function() {}
    };
    const component = mount(<SetForgottenPasswordController {...props} />);
    component.setState({
        hasSubmitted: true,
        isSubmitting: false,
        passwordIsValid: true,
        password: "Foo1Bar2Baz3Qux4",
        showInputError: false
    });
    it("Show the password changed conformation page", () => {
        expect(component.find("h1").text()).toBe("Your password has been changed");
    });
});
