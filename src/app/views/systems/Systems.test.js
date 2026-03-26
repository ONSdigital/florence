import React from "react";
import PropTypes from "prop-types";
import { mount } from "enzyme";
import Systems from "./Systems";

const routerContext = {
    router: {
        createHref: jest.fn(),
        push: jest.fn(),
        replace: jest.fn(),
        go: jest.fn(),
        goBack: jest.fn(),
        goForward: jest.fn(),
        setRouteLeaveHook: jest.fn(),
        isActive: jest.fn(),
        location: {},
    },
};

const mountWithRouter = node =>
    mount(node, {
        context: routerContext,
        childContextTypes: {
            router: PropTypes.object,
        },
    });

describe("Systems", () => {
    describe("when page loads", () => {
        const component = mountWithRouter(<Systems />);

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
