import React from "react";
import { shallow } from "enzyme";
import { useInput } from "./useInput";
import { HookWrapper } from "../utilities/tests/test-utils";

describe("useInput", () => {
    it("should render", () => {
        let wrapper = shallow(<HookWrapper />);
        expect(wrapper.exists()).toBeTruthy();
    });

    it("should not have initial value", () => {
        let wrapper = shallow(<HookWrapper hook={() => useInput("")} />);
        let { hook } = wrapper.find("div").props();
        const [initialValue] = hook;
        expect(initialValue.value).toEqual("");
    });

    it("should set init value", () => {
        let wrapper = shallow(<HookWrapper hook={() => useInput("test")} />);
        let { hook } = wrapper.find("div").props();
        const [initialValue] = hook;
        expect(initialValue.value).toEqual("test");
    });

    it("should set the right value", () => {
        let wrapper = shallow(<HookWrapper hook={() => useInput("foo")} />);
        let { hook } = wrapper.find("div").props();
        let [initialValue, setValue] = hook;
        expect(initialValue.value).toEqual("foo");

        setValue({ target: { value: "bar" } });

        ({ hook } = wrapper.find("div").props());
        [initialValue, setValue] = hook;
        expect(initialValue.value).toEqual("foo");
    });
});
