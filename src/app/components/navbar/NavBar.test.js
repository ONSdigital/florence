import React from "react";
import { shallow } from "enzyme";
import { Link } from "react-router";
import { createMockUser } from "../../utilities/tests/test-utils";
import NavBar from "./NavBar";

const notLoggedUser = createMockUser();
const authenticatedUser = createMockUser("user@test.com", true, true, "ADMIN");
const authenticatedViewer = createMockUser("user@test.com", true, true, "VIEWER");

const defaultProps = {
    config: {
        enableDatasetImport: false,
    },
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

const NavbarItems = ["Collections", "Users and access", "Teams", "Sign out"];

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
        it("should render navigation with links", () => {
            const component = shallow(<NavBar {...defaultProps} user={authenticatedUser} />);
            const nav = component.find(Link);

            expect(component.hasClass("global-nav__list")).toBe(true);
            expect(component.find(Link)).toHaveLength(NavbarItems.length);
            nav.forEach((n, i) => expect(n.getElement().props.children).toBe(NavbarItems[i]));
        });

        it("should not render Sign in link", () => {
            const component = shallow(<NavBar {...defaultProps} user={authenticatedUser} />);
            expect(component.hasClass("sign-in")).toBe(false);
        });

        it("should not display Datasets", () => {
            const component = shallow(<NavBar {...defaultProps} user={authenticatedUser} />);
            expect(component.find("Link[to='/florence/uploads/data']").exists()).toBe(false);
        });

        describe("when enableNewSignIn feature flag is enabled", () => {
            const props = {
                ...defaultProps,
                config: {
                    ...defaultProps.config,
                    enableNewSignIn: true,
                },
            };
            const component = shallow(<NavBar {...props} user={authenticatedUser} />);
            it("'Preview teams' option should be present", () => {
                expect(component.hasClass("global-nav__list")).toBe(true);
                expect(component.find(Link)).toHaveLength(NavbarItems.length);
                expect(component.find('[data-testid="preview-teams"]').getElement().props.children[0].includes("Preview teams"));
            });
        });

        describe("when enabled dataset import", () => {
            it("should display Datasets", () => {
                const props = {
                    ...defaultProps,
                    user: authenticatedUser,
                    config: {
                        ...defaultProps.config,
                        enableDatasetImport: true,
                    },
                };
                const component = shallow(<NavBar {...props} />);
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
                        enableDatasetImport: true,
                    },
                };
                const component = shallow(<NavBar {...props} />);
                expect(component.find("Link[to='/florence/uploads/data']").exists()).toBe(true);
            });
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

    describe("when user is authenticated as Viewer", () => {
        it("should render navigation with links", () => {
            const NavbarItems = ["Collections", "Sign out"];
            const component = shallow(<NavBar {...defaultProps} user={authenticatedViewer} />);
            const nav = component.find(Link);

            expect(component.hasClass("global-nav__list")).toBe(true);
            expect(component.find(Link)).toHaveLength(NavbarItems.length);
            nav.forEach((n, i) => expect(n.getElement().props.children).toBe(NavbarItems[i]));
        });
        describe("when on collections url", () => {
            it("should render PreviewNav component", () => {
                const component = shallow(<NavBar {...withPreviewNavProps} user={authenticatedViewer} />);
                expect(component.find("Connect(PreviewNav)")).toHaveLength(1);
            });
        });
    });
});
