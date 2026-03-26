import React from "react";
import { shallow } from "enzyme";
import { Link } from "react-router";
import { createMockUser } from "../../utilities/tests/test-utils";
import SystemNavBar from "./SystemNavBar";

const notLoggedUser = createMockUser();
const authenticatedUser = createMockUser("user@test.com", true, true, "ADMIN");

const defaultProps = {
    rootPath: "/florence",
    user: notLoggedUser,
};

describe("SystemNavBar", () => {
    describe("when user is not authenticated", () => {
        it("should render descriptor without links", () => {
            const component = shallow(<SystemNavBar {...defaultProps} />);

            expect(component.find(".system-nav__descriptor").text()).toBe("Dissemination services");
            expect(component.find(".system-nav__list").exists()).toBe(false);
            expect(component.find(Link)).toHaveLength(0);
            expect(component.find("a")).toHaveLength(0);
        });
    });

    describe("when user is authenticated", () => {
        it("should render system links", () => {
            const component = shallow(<SystemNavBar {...defaultProps} user={authenticatedUser} />);

            expect(component.find(".system-nav__descriptor").text()).toBe("Dissemination services:");
            expect(component.find(Link)).toHaveLength(1);
            expect(component.find("Link[to='/florence/collections']").exists()).toBe(true);
            expect(component.find("a[href='/wagtail-admin/']").exists()).toBe(true);
            expect(component.find("a[href='/data-admin']").exists()).toBe(true);
        });
    });
});
