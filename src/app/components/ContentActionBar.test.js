import React from "react";
import ContentActionBar from "./ContentActionBar.jsx";
import renderer from "react-test-renderer";
import { mount } from "enzyme";

describe("ContentActionBar", () => {
    describe("is created stuck at bottom with a single action button, cancel and with unsaved changes", () => {
        const contentActionBarProps = {
            buttons: [
                {
                    id: "foo-id",
                    text: "foo",
                    interactionCallback: () => {},
                    style: "positive",
                    disabled: false
                }
            ],
            cancelCallback: () => {},
            stickToBottom: true,
            unsavedChanges: true
        };

        const component = mount(<ContentActionBar {...contentActionBarProps} />);
        it("should display 2 buttons, be attached at the bottom and have a warning that there are unsaved changes", () => {
            expect(component.find(".content-action-bar--bottom-fixed").length).toBe(1);
            expect(component.find(".btn").length).toBe(2);
            expect(component.find("#btn-cancel").exists()).toBe(true);
            const fooButton = component.find("#foo-id");
            expect(fooButton.exists()).toBe(true);
            expect(fooButton.hasClass("btn--positive")).toEqual(true);
            expect(component.find(".content-action-bar__warn").exists()).toBe(true);
        });
        const componentForSnapshot = renderer.create(<ContentActionBar {...contentActionBarProps} />);
        expect(componentForSnapshot.toJSON()).toMatchSnapshot();
    });
    describe("is created floating with two links", () => {
        const contentActionBarProps = {
            buttons: [
                {
                    id: "bar-id",
                    text: "bar",
                    link: "/",
                    style: "warning",
                    disabled: false
                },
                {
                    id: "baz-id",
                    text: "baz",
                    link: "/",
                    style: "primary",
                    disabled: false
                }
            ],
            stickToBottom: false,
            unsavedChanges: false
        };
        const component = mount(<ContentActionBar {...contentActionBarProps} />);
        it("should display 2 anchors and be floating", () => {
            expect(component.find(".content-action-bar--bottom-fixed").length).toBe(0);
            expect(component.find(".btn").length).toBe(2);
            expect(component.find("a").length).toBe(2);
            expect(component.find("#btn-cancel").exists()).toBe(false);
            const barButton = component.find("#bar-id");
            const bazButton = component.find("#baz-id");
            expect(barButton.exists()).toBe(true);
            expect(bazButton.exists()).toBe(true);
            expect(barButton.hasClass("btn--warning")).toEqual(true);
            expect(bazButton.hasClass("btn--primary")).toEqual(true);
            expect(component.find("#baz-id").exists()).toBe(true);
            expect(component.find(".content-action-bar__warn").exists()).toBe(false);
        });
        const componentForSnapshot = renderer.create(<ContentActionBar {...contentActionBarProps} />);
        expect(componentForSnapshot.toJSON()).toMatchSnapshot();
    });
});
