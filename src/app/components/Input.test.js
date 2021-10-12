import React from "react";
import Input from "./Input.jsx";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";

test("Input without type renders a text input", () => {
    const props = {
        id: "test-input",
        label: "Test input",
    };
    const component = renderer.create(<Input id={props.id} label={props.label} />);
    expect(component.toJSON()).toMatchSnapshot();
});

test("Password prop creates a password input", () => {
    const props = {
        id: "test-password-input",
        label: "Password",
        type: "password",
    };
    const component = renderer.create(<Input {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
});

test("Password show/hide button text toggles on click", () => {
    const props = {
        id: "test-password-input",
        label: "Password",
        type: "password",
    };
    const component = shallow(<Input {...props} />);
    const buttonText = component.find(".btn--password").text();
    component.find(".btn--password").simulate("click", {
        stopPropagation: () => undefined,
        preventDefault: () => {},
    });
    expect(component.find(".btn--password").text()).not.toEqual(buttonText);
});

test('Password show/hide button toggles input type state between "password" and "text"', () => {
    const props = {
        id: "test-password-input",
        label: "Password",
        type: "password",
    };
    const component = shallow(<Input {...props} />);
    expect(component.state("type")).toEqual("password");
    component.find(".btn--password").simulate("click", {
        stopPropagation: () => undefined,
        preventDefault: () => {},
    });
    expect(component.state("type")).toEqual("text");
});
