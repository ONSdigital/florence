import React from "react";
import Chip from "./Chip";
import renderer from "react-test-renderer";
import { mount } from "enzyme";

describe("Chip", () => {
    describe("given a non interactive chip ", () => {
        const chipProps = {};
        component = mount(<Chip {...chipProps} />);
        it("should display just text", () => {});
    });

    describe("given a chip with close, link and an icon ", () => {
        const chipProps = {};
        component = mount(<Chip {...chipProps} />);
        it("should display an icon, text, close button and the text should be a link", () => {});
    });
});
