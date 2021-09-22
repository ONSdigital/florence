import {mount} from "enzyme";
import {ForgottenPasswordController} from "./forgottenPasswordController";

import React from "react";

describe("When the user first lands on the forgotten-password url", () => {
    const props = {
        dispatch: function () {
        }
    };
    const component = mount(<ForgottenPasswordController {...props}/>);
    it("Load the correct child component forgottenPasswordRequest", () => {
        expect(component.find("h1").text()).toBe("Forgotten password");
    });
    it("Hide all validation error components as there are no errors yet", () => {
        expect(component.find(".panel__error").length).toBe(0);
        expect(component.find(".error-msg").length).toBe(0);
    });
    it("Hide the spinning loading icon as nothing has been submitted yet", () => {
        expect(component.find(".loader").length).toBe(0);
    });
});

describe("When the user submits their email for a password request whilst waiting a response", () => {
    const props = {
        dispatch: function () {
        }
    };
    const component = mount(<ForgottenPasswordController  {...props}/>);
    component.setState({
        validationErrors: {},
        email: {
            value: "",
            errorMsg: ""
        },
        hasSubmitted: false,
        isSubmitting: true
    });
    it("Continue to show the forgottenPasswordRequest component", () => {
        expect(component.find("h1").text()).toBe("Forgotten password");
    });
    it("Show the spinning loading icon", () => {
        expect(component.find(".loader").length).toBe(1);
    });
});

describe("When the user submits their email for a password request but the server returns a validation error", () => {
    const props = {
        dispatch: function () {
        }
    };
    const component = mount(<ForgottenPasswordController {...props}/>);
    component.setState({
        validationErrors: {
            heading: "Fix the following: ",
            body: [
                <p key="error">
                    <a href="javascript:document.getElementById('email').focus()" className="colour--night-shadz">
                        Enter a valid email address
                    </a>
                </p>
            ]
        },
        email: {
            value: "foo@bar.com",
            errorMsg: "Enter a valid email address"
        },
        hasSubmitted: false,
        isSubmitting: false
    });
    it("Continue to show the forgottenPasswordRequest component", () => {
        expect(component.find("h1").text()).toBe("Forgotten password");
    });
    it("Stop showing the loading icon", () => {
        expect(component.find(".loader").length).toBe(0);
    });
    it("Show the error", () => {
        expect(component.find(".panel__error").length).toBe(1);
        expect(component.find(".error-msg").length).toBe(1);
    });
});

describe("When the user submits their email for a password request and the process is a success", () => {
    const props = {
        dispatch: function () {
        }
    };
    const component = mount(<ForgottenPasswordController {...props}/>);
    component.setState({
        validationErrors: {},
        email: {
            value: "foo@bar.com",
            errorMsg: ""
        },
        hasSubmitted: true,
        isSubmitting: false
    });
    it("Show the forgottenPasswordEmailSent component", () => {
        expect(component.find("h1").text()).toBe("We sent you an email");
    });
    it("Show the users email", () => {
        expect(
            component
                .find("strong")
                .at(0)
                .text()
        ).toBe("foo@bar.com");
    });
});
