import {mount} from "enzyme";
import {SetForgottenPasswordController} from "./setForgottenPasswordController";

import React from "react";
import user from "../../utilities/api-clients/user";

function setLocation(href) {
    jsdom.reconfigure({
        // url: href,
        testURL: href
    });
}

// const oldWindowLocation = "http://localhost:8081/florence/password-reset?vid=123456&uid=1234a12b-c1de-123f-g123-1hijkl1234m1"

beforeAll(() => {
    // delete window.location
    //
    // window.location = Object.defineProperties(
    //     {},
    //     {
    //         ...Object.getOwnPropertyDescriptors(oldWindowLocation),
    //         assign: {
    //             configurable: true,
    //             value: jest.fn(),
    //         },
    //     },
    // )
    window.history.pushState({}, 'Test Title', '/florence/password-reset?vid=123456&uid=1234a12b-c1de-123f-g123-1hijkl1234m1');
})
// Object.defineProperty(window, 'location', {
//     writable: true,
//     value: "http://localhost:8081/florence/password-reset?vid=123456&uid=1234a12b-c1de-123f-g123-1hijkl1234m1",
// })
//
setLocation('http://localhost:8081/florence/password-reset?vid=123456&uid=1234a12b-c1de-123f-g123-1hijkl1234m1');

jest.mock("../../utilities/api-clients/user", () => {
    return {
        setForgottenPassword: jest.fn(() => {
            return Promise.resolve();
        })
    };
});
describe("When the user first lands on the page", () => {
    const props = {
            dispatch: function () {
            },
            location: {
                query: {
                    uid: "123456&uid=1234a12b-c1de-123f-g123-1hijkl1234m1",
                    vid: "123456"
                }
            }
        }
    ;
    const component = mount(<SetForgottenPasswordController {...props} />);
    it("Load the correct child component setForgottenPasswordRequest", () => {
        expect(component.find("h1").text()).toBe("Create a new password");
    });
    it("Password field should be empty and not in an errored state", () => {
        expect(component.find("#password-input").prop("value")).toBe("");
        expect(component.find(".form__input").at(0).hasClass("form__input--error")).toBe(false);
    });
    it("Validation rules should all be in a state that is unchecked", () => {
        expect(component.find("#minimum-character-limit").props()["checked"]).toBe(false);
        expect(component.find("#uppercase-character-validation").props()["checked"]).toBe(false);
        expect(component.find("#lowercase-character-validation").props()["checked"]).toBe(false);
        expect(component.find("#minimum-number-limit").props()["checked"]).toBe(false);
    });
});

describe("When the user attempts to submit before matching all validation rules", () => {
    const props = {
        dispatch: function () {
        }
    };
    const component = mount(<SetForgottenPasswordController {...props} />);
    it("Should not allow them to submit and they should have an 'errored' input box", async () => {
        await component.find("form").simulate("submit");
        component.update();
        expect(component.find("h1").text()).toBe("Create a new password");
        expect(component.find(".form__input").at(0).hasClass("form__input--error")).toBe(true);
        expect(component.find(".form__input").at(1).hasClass("form__input--error")).toBe(true);
    });
    it("Should update the submitting status state", () => {
        expect(component.state("hasSubmitted")).toBe(false);
        expect(component.state("isSubmitting")).toBe(false);
    });
    it("Should not have made a network request to submit the requested password", () => {
        expect(user.setForgottenPassword.mock.calls.length).toBe(0);
    });

    describe("When the user then corrects all validation issues and attempts to resubmitting", () => {
        component.setState({
            passwordIsValid: true,
            password: "Foo1Bar2Baz3Qux4",
        });
        it("Should update the submitting status state", async () => {
            // await component.find(".btn").simulate("click");
            await component.find("form").simulate("submit");
            component.update();
            expect(component.state("hasSubmitted")).toBe(false);
            expect(component.state("isSubmitting")).toBe(true);
        });
        it("Should remove the password 'errored' state, and submit the request", () => {
            expect(component.find(".form__input").at(0).hasClass("form__input--error")).toBe(false);
            expect(component.find(".form__input").at(1).hasClass("form__input--error")).toBe(false);
            expect(user.setForgottenPassword.mock.calls.length).toBe(1);
        });
    });
});

describe("When the user submits their new password successfully ", () => {
    const props = {
        dispatch: function () {
        }
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
