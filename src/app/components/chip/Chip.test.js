import React from "react";
import Chip from "./Chip";
import renderer from "react-test-renderer";
import {mount} from "enzyme";

describe("Chip", () => {
    describe("given a non interactive blue chip ", () => {
        const chipProps = {
            style: "blue",
            text: "foo"
        };
        const component = mount(<Chip {...chipProps} />);
        it("should display a blue chip with just text", () => {
            expect(component.find(".chip__text").text).toBe("foo")
            expect(component.find(".chip--blue").length).toBe(1)
            expect(component.find(".chip__remove").length).toBe(0)
            expect(component.find(".chip__icon").length).toBe(0)
        });
    });

    describe("given a red chip with close, link and an icon ", () => {
        const chipProps = {
            removeFunc: () => {
                console.log("removeFunc hit");
            },
            icon: "shield-person",
            link: "/",
            style: "red",
            text: "bar"
        };
        const component = mount(<Chip {...chipProps} />);
        it("should display an icon, text, close button and the text should be a link", () => {
            expect(component.find(".chip__text").text).toBe("bar")
            expect(component.find(".chip--red").length).toBe(1)
            expect(component.find(".chip__remove").length).toBe(1)
            expect(component.find(".chip__icon").length).toBe(1)
        });
    });
});
