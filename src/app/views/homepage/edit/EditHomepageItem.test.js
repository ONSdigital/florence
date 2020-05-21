import React from "react";
import EditHomepageItem from "./EditHomepageItem";
import { shallow, mount } from "enzyme";

const nullParamProps = {
    params: {
        homepageDataField: null,
        homepageDataFieldID: null
    },
    handleSuccessClick: () => {},
    handleCancelClick: () => {}
};

const successRouteProps = {
    data: {
        id: 0,
        description: "Test description",
        uri: "/",
        title: "Test title"
    },
    params: {
        homepageDataField: "featuredContent",
        homepageDataFieldID: 0
    },
    handleSuccessClick: jest.fn(),
    handleCancelClick: jest.fn()
};

describe("different item states", () => {
    it("maps the propagated data to the fields", () => {
        const wrapper = mount(<EditHomepageItem {...successRouteProps} />);
        const inputs = wrapper.find("input");
        const textarea = wrapper.find("textarea");
        expect(inputs.length).toBe(2);
        expect(textarea.length).toBe(1);
    });
    it("renders something went wrong message when unsupported field type is passed ", () => {
        const wrapper = shallow(<EditHomepageItem {...nullParamProps} />);
        const defaultMessage = wrapper.find("p");
        expect(defaultMessage.text()).toEqual("Something went wrong: unsupported field type");
        expect(wrapper.state("id")).toBe(null);
        expect(wrapper.state("description")).toBe("");
        expect(wrapper.state("title")).toBe("");
        expect(wrapper.state("uri")).toBe("");
    });
});

describe("event handlers", () => {
    it("updates the input value when the input field is changed", () => {
        const wrapper = shallow(<EditHomepageItem {...successRouteProps} />);
        const mockEvent = {
            target: {
                value: "New value",
                name: "title"
            }
        };
        wrapper.instance().handleInputChange(mockEvent);
        expect(wrapper.state("title")).toBe("New value");
    });
    it("calls the cancel handler when clicked", () => {
        const wrapper = shallow(<EditHomepageItem {...successRouteProps} />);
        const cancelButton = wrapper.find("#cancel");
        cancelButton.simulate("click");
        expect(successRouteProps.handleCancelClick).toBeCalled();
    });
    it("calls the continue handler when clicked", () => {
        const wrapper = shallow(<EditHomepageItem {...successRouteProps} />);
        const cancelButton = wrapper.find("#continue");
        cancelButton.simulate("click");
        expect(successRouteProps.handleSuccessClick).toBeCalled();
    });
});
