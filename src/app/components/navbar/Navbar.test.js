import React from "react";
import { shallow } from "enzyme";
import { Link } from "react-router";
import Navbar from "./Navbar";
import { createMockUser } from "../../tests/test-utils";

const notLoggedUser = createMockUser();
const authenticatedUser = createMockUser("user@test.com", true, true, "ADMIN");

let dispatchedActions = [];

const defaultProps = {
    config: {
        enableDatasetImport: false
    },
    user: notLoggedUser,
    rootPath: "/florence",
    location: {},
    dispatch: action => dispatchedActions.push(action)
};

const NavbarItems = ["Collections", "Users and access", "Teams", "Sign out"];

describe("Navbar", () => {
    describe("when user is not authenticated", () => {
        it("should render only one link to Sign in", () => {
            const component = shallow(<Navbar {...defaultProps} />);
            expect(component.hasClass("global-nav__list")).toBe(true);
            expect(component.find(Link)).toHaveLength(1);
            expect(component.find("Link[to='/florence/login']").exists()).toBe(true);
        });
    });

    describe("when user is authenticated", () => {
        it("should render navigation with links", () => {
            const component = shallow(<Navbar {...defaultProps} user={authenticatedUser} />);
            const nav = component.find(Link);
            expect(component.hasClass("global-nav__list")).toBe(true);
            expect(component.find(Link)).toHaveLength(NavbarItems.length);
            nav.forEach((n, i) => expect(n.getElement().props.children).toBe(NavbarItems[i]));
        });

        it("should not render Sign in link", () => {
            const component = shallow(<Navbar {...defaultProps} user={authenticatedUser} />);
            expect(component.hasClass("sign-in")).toBe(false);
        });

        it("should not display Datasets", () => {
            const component = shallow(<Navbar {...defaultProps} user={authenticatedUser} />);
            expect(component.find("Link[to='/florence/uploads/data']").exists()).toBe(false);
        });

        describe("when enabled dataset import", () => {
            it("should display Datasets", () => {
                const props = {
                    ...defaultProps,
                    user: authenticatedUser,
                    config: {
                        ...defaultProps.config,
                        enableDatasetImport: true
                    }
                };
                const component = shallow(<Navbar {...props} />);
                expect(component.find("Link[to='/florence/uploads/data']").exists()).toBe(true);
            });
        });

        describe("when enabled dataset import", () => {
            it("should display Datasets", () => {
                const props = {
                    ...defaultProps,
                    user: authenticatedUser,
                    config: {
                        ...defaultProps.config,
                        enableDatasetImport: true
                    }
                };
                const component = shallow(<Navbar {...props} />);
                expect(component.find("Link[to='/florence/uploads/data']").exists()).toBe(true);
            });
        });
    });
});
