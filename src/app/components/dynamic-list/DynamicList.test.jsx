import React from "react";
import DynamicList from "./DynamicList";
import renderer from "react-test-renderer";
import { mount } from "enzyme";

describe("DynamicList", () => {
    const filteredList = [
        {
            title: "Simon Davies",
            desc: " Simon.davies@ons.gov.uk",
            icon: "Person",
            iconName: "Viewer",
            buttonName: "Add",
            buttonCallback: () => {},
        },
        {
            title: "Michael Miller",
            desc: " Michael.miller@ons.gov.uk",
            icon: "Person",
            iconName: "Viewer",
            buttonName: "Add",
            buttonCallback: () => {},
        },
    ];
    describe("given props does it create a list", () => {
        const dynamicListProps = {
            title: "Add member to team",
            listItems: filteredList,
            listHeightClass: "fifthHeight",
            noResultsText: "No viewers found",
            filterPlaceholder: "Search viewers by name or email",
            headingLevel: "1",
            handleSearchInput: () => {},
        };
        const component = mount(<DynamicList {...dynamicListProps} />);
        it("should display a dynamic list", () => {
            expect(component.find(".dynamic-list__title").exists()).toBe(true);
            expect(component.find(".dynamic-list-item").length).toBe(2);
            expect(component.find(".dynamic-list-item__btn").length).toBe(2);
        });
        it("matches the snapshot", () => {
            const componentForSnapshot = renderer.create(<DynamicList {...dynamicListProps} />);
            expect(componentForSnapshot.toJSON()).toMatchSnapshot();
        });
    });
});
