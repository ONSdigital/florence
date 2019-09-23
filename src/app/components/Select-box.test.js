import React from "react";
import Select from "./Select-box.jsx";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";

const contentsList = ["a", "b", "c"];

test("Renders a select element when override is false", () => {
    const props = {
        override: false,
        contents: contentsList
    };
    const component = renderer.create(<Select {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
});

test("Renders an input element when override is true", () => {
    const props = {
        override: true
    };
    const component = renderer.create(<Select {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
});
