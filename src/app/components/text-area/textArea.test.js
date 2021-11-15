import React from "react";
import TextArea from "./TextArea";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";

describe("TextArea", () => {
    describe("Given props that do not include the error attribute", () => {
        const textAreaProps = {
            title: "Please provide some feedback",
            name: "feedback",
            text: "",
            descriptionHint: "For example, describe any difficulties you experienced in the use of this service",
            maxLength: 200,
            placeholder: "Please provide your feedback",
            rows: 8,
            error: "",
            handleChange: () => {},
        };
        const component = shallow(<TextArea {...textAreaProps} />);
        it("Should render the textArea", () => {
            expect(component.find("#feedback").text()).toBe(textAreaProps.text);
            expect(component.find(".form__label").text()).toBe(textAreaProps.title);
            expect(component.find(".panel--error").length).toBe(0);
            expect(component.find("#feedback-char-limit-remaining").length).toBe(1);
            expect(component.find(".form__input--error").length).toBe(0);
        });
        it("matches the snapshot", () => {
            const componentForSnapshot = renderer.create(<TextArea {...textAreaProps} />);
            expect(componentForSnapshot.toJSON()).toMatchSnapshot();
        });
    });
    describe("Given props which include the error attribute", () => {
        const textAreaProps = {
            title: "Please provide some feedback",
            name: "feedback",
            text: "Foo",
            descriptionHint: "For example, describe any difficulties you experienced in the use of this service",
            maxLength: 200,
            placeholder: "Please provide your feedback",
            rows: 8,
            error: "Something went wrong",
            handleChange: () => {},
        };
        it("matches the snapshot", () => {
            const componentForSnapshot = renderer.create(<TextArea {...textAreaProps} />);
            expect(componentForSnapshot.toJSON()).toMatchSnapshot();
        });
    });
});
