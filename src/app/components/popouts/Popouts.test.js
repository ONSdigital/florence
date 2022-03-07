import React from "react";
import Popouts from "./Popouts";
import PopoutItem from "./PopoutItem.jsx";
import { mount } from "enzyme";
import renderer from "react-test-renderer";

describe("Popouts", () => {
    describe("when empty popouts array given as prop", () => {
        it("do not render", () => {
            const component = mount(<Popouts popouts={[]} />);
            expect(component.isEmptyRender()).toBe(true);
        });
    });

    describe("when popouts props given to Popout", () => {
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
        it("matches the snapshot", () => {
            const componentForSnapshot = renderer.create(<Popouts popouts={popouts} />);
            expect(componentForSnapshot.toJSON()).toMatchSnapshot();
        });
    });
});
