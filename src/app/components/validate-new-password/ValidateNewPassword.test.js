import React from "react";
import { mount } from "enzyme";
import ValidateNewPassword from "./ValidateNewPassword";
import renderer from "react-test-renderer";

let updateValidity = jest.fn(isValid => {
    // do nothing
});

const props = {
    updateValidity: updateValidity
};
describe("When the validate new password component is added", () => {
    const component = mount(<ValidateNewPassword {...props} />);
    it("have an initial state with no password typed yet", () => {
        expect(component.state().password.value).toBe("");
    });
    it("should have a character limit validation checkbox which is unchecked", () => {
        const minCharCheckbox = component.find("#minimum-character-limit");
        expect(minCharCheckbox.exists()).toBe(true);
        expect(minCharCheckbox.props()["checked"]).toBe(false);
        expect(component.state().validationRules[0].checked).toBe(false);
    });
    it("should have a required uppercase character validation checkbox which is unchecked", () => {
        const upperCharCheckbox = component.find("#uppercase-character-validation");
        expect(upperCharCheckbox.exists()).toBe(true);
        expect(upperCharCheckbox.props()["checked"]).toBe(false);
        expect(component.state().validationRules[1].checked).toBe(false);
    });
    it("should have a required lowercase character validation checkbox which is unchecked", () => {
        const lowerCharCheckbox = component.find("#lowercase-character-validation");
        expect(lowerCharCheckbox.exists()).toBe(true);
        expect(lowerCharCheckbox.props()["checked"]).toBe(false);
        expect(component.state().validationRules[2].checked).toBe(false);
    });
    it("should have a required numerical character validation checkbox which is unchecked", () => {
        const numCharCheckbox = component.find("#minimum-number-limit");
        expect(numCharCheckbox.exists()).toBe(true);
        expect(numCharCheckbox.props()["checked"]).toBe(false);
        expect(component.state().validationRules[3].checked).toBe(false);
    });
    it("should have an input field", () => {
        // Check it exists
        const inputBox = component.find("#password-input");
        expect(inputBox.exists()).toBe(true);
        expect(inputBox.prop("value")).toBe("");
        expect(component.find("#password-checkbox").exists()).toBe(true);
    });
});

describe("When a lowercase character is entered into the text input field", () => {
    const component = mount(<ValidateNewPassword {...props} />);
    const numCharCheckbox = component.find("#minimum-number-limit");
    const upperCharCheckbox = component.find("#uppercase-character-validation");
    const lowerCharCheckbox = component.find("#lowercase-character-validation");
    const minCharCheckbox = component.find("#minimum-character-limit");
    component.instance().handleInputChange({
        target: {
            id: "password-input",
            value: "a"
        }
    });
    it("Should update the validation rule states", () => {
        expect(component.state().validationRules[0].checked).toBe(false);
        expect(component.state().validationRules[1].checked).toBe(false);
        expect(component.state().validationRules[2].checked).toBe(true);
        expect(component.state().validationRules[3].checked).toBe(false);
    });
    it("Should pass validation for lowercase character required", () => {
        expect(numCharCheckbox.props()["checked"]).toBe(false);
        expect(upperCharCheckbox.props()["checked"]).toBe(false);
        expect(lowerCharCheckbox.props()["checked"]).toBe(true);
        expect(minCharCheckbox.props()["checked"]).toBe(false);
    });
    it("Should fail overall validation check", () => {
        expect(component.props().updateValidity).toHaveBeenCalledWith(false);
    });
    it("should match the snapshot", () => {
        const props = {
            override: true
        };
        const component = renderer.create(<ValidateNewPassword {...props} />);
        expect(component.toJSON()).toMatchSnapshot();
    });
});
describe("When an uppercase character is entered into the text input field", () => {
    const component = mount(<ValidateNewPassword {...props} />);
    const numCharCheckbox = component.find("#minimum-number-limit");
    const upperCharCheckbox = component.find("#uppercase-character-validation");
    const lowerCharCheckbox = component.find("#lowercase-character-validation");
    const minCharCheckbox = component.find("#minimum-character-limit");
    component.instance().handleInputChange({
        target: {
            id: "password-input",
            value: "A"
        }
    });
    it("Should update the validation rule states", () => {
        expect(component.state().validationRules[0].checked).toBe(false);
        expect(component.state().validationRules[1].checked).toBe(true);
        expect(component.state().validationRules[2].checked).toBe(false);
        expect(component.state().validationRules[3].checked).toBe(false);
    });
    it("Should pass validation for Upper Case character required", () => {
        expect(numCharCheckbox.props()["checked"]).toBe(false);
        expect(upperCharCheckbox.props()["checked"]).toBe(true);
        expect(lowerCharCheckbox.props()["checked"]).toBe(false);
        expect(minCharCheckbox.props()["checked"]).toBe(false);
    });
    it("Should fail overall validation check", () => {
        expect(component.props().updateValidity).toHaveBeenCalledWith(false);
    });
    it("should match the snapshot", () => {
        const props = {
            override: true
        };
        const component = renderer.create(<ValidateNewPassword {...props} />);
        expect(component.toJSON()).toMatchSnapshot();
    });
});
describe("When a numerical character is entered into the text input field", () => {
    const component = mount(<ValidateNewPassword {...props} />);
    const numCharCheckbox = component.find("#minimum-number-limit");
    const upperCharCheckbox = component.find("#uppercase-character-validation");
    const lowerCharCheckbox = component.find("#lowercase-character-validation");
    const minCharCheckbox = component.find("#minimum-character-limit");
    component.instance().handleInputChange({
        target: {
            id: "password-input",
            value: "1"
        }
    });
    it("Should update the validation rule states", () => {
        expect(component.state().validationRules[0].checked).toBe(false);
        expect(component.state().validationRules[1].checked).toBe(false);
        expect(component.state().validationRules[2].checked).toBe(false);
        expect(component.state().validationRules[3].checked).toBe(true);
    });
    it("Should pass validation for numerical character required", () => {
        expect(numCharCheckbox.props()["checked"]).toBe(true);
        expect(upperCharCheckbox.props()["checked"]).toBe(false);
        expect(lowerCharCheckbox.props()["checked"]).toBe(false);
        expect(minCharCheckbox.props()["checked"]).toBe(false);
    });
    it("Should fail overall validation check", () => {
        expect(component.props().updateValidity).toHaveBeenCalledWith(false);
    });
    it("should match the snapshot", () => {
        const props = {
            override: true
        };
        const component = renderer.create(<ValidateNewPassword {...props} />);
        expect(component.toJSON()).toMatchSnapshot();
    });
});

describe("When fourteen numerical and upper as well as lower characters are entered into the text input field", () => {
    const component = mount(<ValidateNewPassword {...props} />);
    const numCharCheckbox = component.find("#minimum-number-limit");
    const upperCharCheckbox = component.find("#uppercase-character-validation");
    const lowerCharCheckbox = component.find("#lowercase-character-validation");
    const minCharCheckbox = component.find("#minimum-character-limit");
    component.instance().handleInputChange({
        target: {
            id: "password-input",
            value: "aB1cD2eF3gH4iJ"
        }
    });
    it("Should update the validation rule states", () => {
        // Check that the state has been updated
        expect(component.state().password.value).toBe("aB1cD2eF3gH4iJ");
        expect(component.state().validationRules[0].checked).toBe(true);
        expect(component.state().validationRules[1].checked).toBe(true);
        expect(component.state().validationRules[2].checked).toBe(true);
        expect(component.state().validationRules[3].checked).toBe(true);
    });
    it("Should pass validation for minimum character limit required and all others", () => {
        // Check that the character limit requirement checkbox is now checked
        expect(numCharCheckbox.props()["checked"]).toBe(true);
        expect(upperCharCheckbox.props()["checked"]).toBe(true);
        expect(lowerCharCheckbox.props()["checked"]).toBe(true);
        expect(minCharCheckbox.props()["checked"]).toBe(true);
    });
    it("Should pass overall validation check", () => {
        expect(component.props().updateValidity).toHaveBeenCalledWith(true);
    });
    it("should match the snapshot", () => {
        const props = {
            override: true
        };
        const component = renderer.create(<ValidateNewPassword {...props} />);
        expect(component.toJSON()).toMatchSnapshot();
    });
});
