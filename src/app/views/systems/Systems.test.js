import React from "react";
import { mount } from "enzyme";
import Systems from "./Systems";
import { WrapperComponent } from "../../utilities/tests/test-utils";

describe("Systems", () => {
    describe("when page loads", () => {
        const component = mount(
            <WrapperComponent>
                <Systems />
            </WrapperComponent>
        );

        it("shows the page heading and intro", () => {
            expect(component.find("h1").text()).toBe("Dissemination services");
            expect(component.find("p").at(0).text()).toBe("Here you can find a list of the services that make up Dissemination.");
        });

        it("renders all system rows", () => {
            expect(component.find(".simple-select-list__item")).toHaveLength(3);
            expect(component.text()).toContain("Florence");
            expect(component.text()).toContain("Wagtail");
            expect(component.text()).toContain("Dataset Catalogue Manager");
        });

        it("renders internal and external links correctly", () => {
            expect(component.find("Link[to='/florence/collections']").exists()).toBe(true);
            expect(component.find("a[href='/wagtail-admin']").exists()).toBe(true);
            expect(component.find("a[href='/data-admin']").exists()).toBe(true);
        });

        it("renders system details", () => {
            expect(component.text()).toContain("The legacy content management system");
            expect(component.text()).toContain("The new content management system for content");
            expect(component.text()).toContain("The new content management system for datasets");
        });
    });
});
