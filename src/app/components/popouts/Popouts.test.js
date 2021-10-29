import React from "react";
import Popouts from "./Popouts";
import PopoutItem from "./PopoutItem.jsx";
import { mount } from "enzyme";

describe("Popouts", () => {
    describe("when no Popouts props", () => {
        it("do not render", () => {
            const component = mount(<Popouts popouts={[]} />);
            expect(component.isEmptyRender()).toBe(true);
        });
    });

    describe("when props are passed to Popouts", () => {
        const popouts = [
            {
                id: "foo",
                title: "bar",
                body: "baz",
                buttons: [
                    {
                        onClick: () => {},
                        text: "Qux",
                        style: "primary",
                    },
                ],
            },
        ];

        const component = mount(<Popouts popouts={popouts} />);

        it("it renders PopoutItem", () => {
            expect(component.find("h1").hasClass("modal__title")).toBe(true);
            expect(component.find(PopoutItem)).toHaveLength(popouts.length);
        });
    });
});
