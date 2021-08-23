import React from "react";
import { mount, shallow } from "enzyme";
import ValidateNewPassword from "./ValidateNewPassword";

// set props (define the checkPasswordValidityFunction (or whatever it was called)

describe("When the validate new password component is added", () => {
    const component = mount(<ValidateNewPassword {...props} />);
    it("have an initial state", () => {
        // Check the state
        // expect(component.state("newPassword")).toEqual({});
    });
    it("should have a character limit validation checkbox which is unchecked", () => {
        // Check it exists e.g. expect(component.find(#id).exists()).toBe(true); or expect(component.find(#id).length.toBe(1);
        // Check it is now checked expect(component.find().enableDatasetImport).toBe(false);
        // Check state of validationRule e.g. expect(component.state().validationRules[0]).toBe());
    });
    it("should have a required lowercase character validation checkbox which is unchecked", () => {
        // Check it exists
        // Check it is now checked
        // Check state of validationRule e.g. component.state().validationRules[1]).toBe();
    });
    it("should have a required uppercase character validation checkbox which is unchecked", () => {
        // Check it exists
        // Check it is now checked
        // Check state of validationRule e.g. component.state().validationRules[2]).toBe();
    });
    it("should have a required numerical character validation checkbox which is unchecked", () => {
        // Check it exists
        // Check it is now checked
        // Check state of validationRule e.g. component.state().validationRules[3]).toBe();
    });
    it("should have an input field", () => {
        // Check it exists
        // Check it is empty
        // Check state of password e.g. component.state().password).toBe();
    });

    // component.setState({ newPassword: { value: "a valid pass phrase", errorMsg: "" } });
});

describe("When a lowercase character is entered into the text input field", () => {
    it("Should pass validation for lowercase character required", () => {
        // Check that the state has been updated
        // Check that the lowercase requirement checkbox is now checked
        // Check that the validityCheck function is called and false is passed into it
    });
});

describe("When an uppercase character is entered into the text input field", () => {
    it("Should pass validation for uppercase character required", () => {
        // Check that the state has been updated
        // Check that the lowercase requirement checkbox is now checked
        // Check that the validityCheck function is called and false is passed into it
    });
});
describe("When a numerical character is entered into the text input field", () => {
    it("Should pass validation for numerical character required", () => {
        // Check that the state has been updated
        // Check that the lowercase requirement checkbox is now checked
        // Check that the validityCheck function is called and false is passed into it
    });
});

describe("When fourteen lowercase characters are entered into the text input field", () => {
    it("Should pass validation for minimum character limit required", () => {
        // Check that the state has been updated
        // Check that the character limit requirement checkbox is now checked
        // Check that the validityCheck function is called and false is passed into it
    });
});

describe("When fourteen characters are entered including numbers, lowercase and uppercase into the text input field", () => {
    it("Should pass validation all validation", () => {
        // Check that the state has been updated
        // Check that all validation checkboxes are now checked
        // Check that the validityCheck function is called and true is passed into it
    });
});

// Remember to add snapshots
