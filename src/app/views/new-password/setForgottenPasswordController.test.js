import React from "react";
import { mount } from "enzyme";
import { status } from "../../constants/Authentication";
import SetForgottenPasswordController from "./setForgottenPasswordController";

describe("SetForgottenPasswordController", () => {
    const component = mount(<SetForgottenPasswordController />);
    it("displays Create a new password prompt", () => {
        expect(component.find("h1").text()).toBe("Create a new password");
    });
    it("should have empty password field and not in an errored state", () => {
        expect(component.find("input#password-input").prop("value")).toBe("");
        expect(
            component
                .find(".form__input")
                .at(0)
                .hasClass("form__input--error")
        ).toBe(false);
    });
    it("should have all validations rules unchecked", () => {
        expect(component.find("input#minimum-character-limit").props()["checked"]).toBe(false);
        expect(component.find("input#uppercase-character-validation").props()["checked"]).toBe(false);
        expect(component.find("input#lowercase-character-validation").props()["checked"]).toBe(false);
        expect(component.find("input#minimum-number-limit").props()["checked"]).toBe(false);
    });
});

describe("when the user submits their new password successfully ", () => {
    const component = mount(<SetForgottenPasswordController />);
    component.setState({
        status: status.COMPLETED
    });
    it("shows the password change conformation page", () => {
        expect(component.find("h1").text()).toBe("Your password has been changed");
    });
});
