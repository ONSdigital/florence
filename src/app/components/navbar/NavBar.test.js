import React from "react";
import { shallow } from "enzyme";
import { Link } from "react-router";
import { createMockUser } from "../../utilities/tests/test-utils";
import NavBar from "./NavBar";

const notLoggedUser = createMockUser();
const authenticatedEditor = createMockUser("user@test.com", true, true, "EDITOR");
const authenticatedUser = createMockUser("user@test.com", true, true, "ADMIN");
const authenticatedViewer = createMockUser("user@test.com", true, true, "VIEWER");

const defaultProps = {
    user: notLoggedUser,
    rootPath: "/florence",
    location: {},
};

const withPreviewNavProps = {
    ...defaultProps,
    location: {
        ...defaultProps.location,
        pathname: "/florence/collections/foo-1234/preview",
    },
    workingOn: {
        id: "foo-1234",
        name: "foo",
    },
};

describe("NavBar", () => {
    describe("when user is not authenticated", () => {
        it("should render only one link to Sign in", () => {
            const component = shallow(<NavBar {...defaultProps} />);

            expect(component.hasClass("global-nav__list")).toBe(true);
            expect(component.find(Link)).toHaveLength(1);
            expect(component.find("Link[to='/florence/login']").exists()).toBe(true);
        });
    });

    describe("when user is authenticated as Admin", () => {
        it("should not render Sign in link", () => {
            const component = shallow(<NavBar {...defaultProps} user={authenticatedUser} />);
            expect(component.hasClass("sign-in")).toBe(false);
        });

        it("datasets, preview teams, and security option should be present", () => {
            const component = shallow(<NavBar {...defaultProps} user={authenticatedUser} />);
            expect(component.find(Link)).toHaveLength(6);
            expect(component.find(Link).getElements()[0].props.children).toBe("Collections");
            expect(component.find(Link).getElements()[1].props.children).toBe("Datasets");
            expect(component.find(Link).getElements()[2].props.children).toBe("Users and access");
            expect(component.find(Link).getElements()[3].props.children).toBe("Preview teams");
            expect(component.find(Link).getElements()[4].props.children).toBe("Security");
            expect(component.find(Link).getElements()[5].props.children).toBe("Sign out");
        });

        describe("when on collections", () => {
            it("should display Working On: ", () => {
                const props = {
                    ...defaultProps,
                    user: authenticatedUser,
                    location: {
                        pathname: "/florence/collections/foo-1234",
                    },
                    workingOn: {
                        id: "foo-1234",
                        name: "foo",
                    },
                };
                const wrapper = shallow(<NavBar {...props} />);
                const link = wrapper.find("Link[to='/florence/collections/foo-1234']");

                link.getElement().props.children[0].includes("Working on:");
                link.getElement().props.children[0].includes("foo");
            });
        });
    });

    describe("when user is authenticated as Editor", () => {
        it("should display Users and access", () => {
            const component = shallow(<NavBar {...defaultProps} user={authenticatedEditor} />);
            expect(component.find("Link[to='/florence/users']").exists()).toBe(true);
        });
    });

    describe("when user is authenticated as Viewer", () => {
        it("should only render navigation with accessible links", () => {
            const component = shallow(<NavBar {...defaultProps} user={authenticatedViewer} />);

            expect(component.hasClass("global-nav__list")).toBe(true);
            expect(component.find(Link)).toHaveLength(2);
            expect(component.find(Link).getElements()[0].props.children).toBe("Collections");
            expect(component.find(Link).getElements()[1].props.children).toBe("Sign out");
        });

        it("should not display Users and access", () => {
            const component = shallow(<NavBar {...defaultProps} user={authenticatedViewer} />);
            expect(component.find("Link[to='/florence/users']").exists()).toBe(false);
        });

        describe("when on collections url", () => {
            it("should render PreviewNav component", () => {
                const component = shallow(<NavBar {...withPreviewNavProps} user={authenticatedViewer} />);
                expect(component.find("Connect(PreviewNav)")).toHaveLength(1);
            });
        });
    });
});
