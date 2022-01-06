import React from "react";
import { WrapperComponent } from "../../../tests/test-utils";
import Search from "./Search";
import { mount, shallow } from "enzyme";
import renderer from "react-test-renderer";

describe("Search", () => {
    it("matches the snapshot", () => {
        const wrapper = renderer.create(
            <WrapperComponent>
                <Search />
            </WrapperComponent>
        );
        expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it("updates value on change", () => {
        const wrapper = mount(
            <WrapperComponent>
                <Search />
            </WrapperComponent>
        );
        const event = { target: { value: "test" } };
        const onChange = jest.fn();
        wrapper.find("input#search_input").simulate("change", event);
        expect(wrapper.find("input#search_input").getElement().props.value).toBe("test");
    });
});
