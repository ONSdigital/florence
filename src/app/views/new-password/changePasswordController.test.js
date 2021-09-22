import {mount} from "enzyme";
import {ChangePasswordController} from "./ChangePasswordController";
import {status} from "../../constants/changePassword";

import React from "react";
import ChangePasswordConfirmed from "./changePasswordConfirmed";
import renderer from "react-test-renderer";
import ButtonWithSpinner from "../../components/button/ButtonWithSpinner";

let checkValidity = jest.fn((isValid, password) => ({}));

let setPermissions = jest.fn(() => ({}));

let createComponent = (password, showInputError, statusToSet) => {
    const props = {
        changeConformation: <ChangePasswordConfirmed handleClick={setPermissions}/>,
        requestPasswordChange: checkValidity,
        status: statusToSet,
        buttonText: "Confirm password",
        heading: "Create a new password"
    };

    let component = mount(<ChangePasswordController {...props} />);
    component.setState({
        password: password,
        showInputError: showInputError
    });

    return component;
}

describe("On initial load", () => {
    let component = createComponent("", false, status.WAITING_USER_NEW_PASSWORD)
    it("They should not have an 'errored' input box", async () => {
        expect(component.find("h1").text()).toBe("Create a new password");
        expect(
            component
                .find(".form__input")
                .at(0)
                .hasClass("form__input--error")
        ).toBe(false);
    });

});

describe("After the user has attempted to submit a password change without meeting the validation rules", () => {
    let component = createComponent("", true, status.WAITING_USER_NEW_PASSWORD)
    it("They should have an 'errored' input box", async () => {
        expect(component.find("h1").text()).toBe("Create a new password");
        expect(
            component
                .find(".form__input")
                .at(0)
                .hasClass("form__input--error")
        ).toBe(true);
    });

});

describe("When submitting a valid password", () => {
    let component = createComponent("a1B123456abcdefg", false, status.SUBMITTING_PASSWORD_CHANGE)
    it("They should not have an 'errored' input box", async () => {
        expect(component.find("h1").text()).toBe("Create a new password");
        expect(
            component
                .find(".form__input")
                .at(0)
                .hasClass("form__input--error")
        ).toBe(false);
    });

});
