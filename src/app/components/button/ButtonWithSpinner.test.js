import React from "react";
import ButtonWithSpinner from "./ButtonWithSpinner";
import renderer from "react-test-renderer";
import { mount } from "enzyme";

test("Button to be enabled, and spinner to not be present when not submitting", () => {
    const props = {
        isSubmitting: false,
        buttonText: "foo",
    };
    let component = mount(<ButtonWithSpinner {...props} />);
    let btn = component.find(".btn");
    expect(btn.length).toBe(1);
    expect(btn.props().disabled).toBe(false);
    expect(btn.text()).toEqual(props.buttonText);
    expect(component.find(".loader").length).toBe(0);

    component = renderer.create(<ButtonWithSpinner {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
});

test("Button to be enabled, and spinner to be present when submitting", () => {
    const props = {
        isSubmitting: true,
        buttonText: "foo",
    };
    let component = mount(<ButtonWithSpinner {...props} />);
    let btn = component.find(".btn");
    expect(btn.length).toBe(1);
    expect(btn.props().disabled).toBe(true);
    expect(btn.text()).toEqual("");

    expect(component.find(".loader").length).toBe(1);

    component = renderer.create(<ButtonWithSpinner {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
});
