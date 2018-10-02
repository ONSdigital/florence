import React from 'react';
import RadioButton from './RadioButton';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

const defaultProps = {
    id: "test-radio",
    value: "test-value",
    label: "Test radio",
    group: "test-group",
    onChange: ()=>{},
    checked: false,
    inline: false
};

test("Radio button matches stored snapshot", () => {

    const component = renderer.create(
        <RadioButton {...defaultProps} />
    );
    expect(component.toJSON()).toMatchSnapshot();
});

test("Handle change passes correct value to parent onChange method", () => {
    let passedToParent = {};
    const mockedOnChange = (event) => {passedToParent = event;};
    const component = shallow(
        <RadioButton {...defaultProps} checked={false} onChange={mockedOnChange}/>
    );
    expect(component.update().state().checked).toBe(false);
    component.instance().handleChange({target: {checked: true}});
    expect(passedToParent).toMatchObject({
        id: "test-radio",
        checked: true,
        value: "test-value"
    });
});

test("Handle focus updates state correctly", () => {
    const component = shallow(
        <RadioButton {...defaultProps} />
    );
    expect(component.update().state().focused).toBe(false);
    component.instance().handleFocus();
    expect(component.update().state().focused).toBe(true);
});

test("Handle blur updates state correctly", () => {
    const component = shallow(
        <RadioButton {...defaultProps} />
    );
    component.setState({ focused: true });
    expect(component.update().state().focused).toBe(true);
    component.instance().handleBlur();
    expect(component.update().state().focused).toBe(false);
});
