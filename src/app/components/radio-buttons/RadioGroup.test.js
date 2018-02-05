import React from 'react';
import RadioGroup from './RadioGroup';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

const defaultProps = {
    radioData: [
        {
            id: "test-radio1",
            value: "test-value1",
            label: "Test radio 1",
        },
        {
            id: "test-radio2",
            value: "test-value2",
            label: "Test radio 2",
        }
    ],
    legend: "Select a test radio",
    groupName: "test-group",
    onChange: ()=>{},
    selectedValue: "test-value1",
    inline: false
};

const mockedEvent = {id: "test-radio2", checked: true, value: "test-value2"};

test("Radio button matches stored snapshot", () => {

    const component = renderer.create(
        <RadioGroup {...defaultProps} />
    );
    expect(component.toJSON()).toMatchSnapshot();
});

test("Handle change passes correct value caller onChange method", () => {
    let passedToParent = {};
    const mockedOnChange = (event) => {passedToParent = event;};
    const component = shallow(
        <RadioGroup {...defaultProps} checked={false} onChange={mockedOnChange}/>
    );
    component.instance().handleChange(mockedEvent);
    expect(passedToParent).toMatchObject({
        id: "test-radio2",
        checked: true,
        value: "test-value2"
    });
});


