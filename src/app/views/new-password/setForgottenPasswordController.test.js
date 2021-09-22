import { mount } from "enzyme";
import { SetForgottenPasswordController } from "./setForgottenPasswordController";
import { status } from "../../constants/Authentication";

import React from "react";

describe("When the user first lands on the page", () => {
    const component = mount(<SetForgottenPasswordController />);
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

describe("After the user submits their new password successfully ", () => {
    const component = mount(<SetForgottenPasswordController />);
    component.setState({
        status: status.COMPLETED
    });
    it("Show the password changed conformation page", () => {
        expect(component.find("h1").text()).toBe("Your password has been changed");
    });
});
