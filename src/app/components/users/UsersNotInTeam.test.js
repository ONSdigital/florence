import React from "react";
import UsersNotInTeam from "./UsersNotInTeam";
import { mount } from "enzyme";
import renderer from "react-test-renderer";
import { WrapperComponent } from "../../utilities/tests/test-utils";

let dispatchedActions = [];
const mockDispatch = event => {
    dispatchedActions.push(event);
};

const addUsersToTeam = jest.fn(() => {
    // do nothing
});

describe("UsersNotInTeam", () => {
    const usersNotInTeamProps = {
        dispatch: mockDispatch,
        loading: false,
        addUserToTeam: addUsersToTeam,
        usersNotInTeam: [
            {
                forename: "foo",
                lastname: "bar",
                email: "foobar@ons.gov.uk",
                groups: [],
                status: "CONFIRMED",
                active: true,
                id: "d5c7cab6-aaaf-42ca-8ecf-afd54d5bbb61",
                status_notes: "",
            },
            {
                forename: "baz",
                lastname: "qux",
                email: "baz.qux@ons.gov.uk",
                groups: [],
                status: "FORCE_CHANGE_PASSWORD",
                active: true,
                id: "ae14d689-a58e-4c5e-a23e-ecd1abebd96d",
                status_notes: "",
            },
        ],
        allPreviewUsers: [
            {
                forename: "foo",
                lastname: "bar",
                email: "foobar@ons.gov.uk",
                groups: [],
                status: "CONFIRMED",
                active: true,
                id: "d5c7cab6-aaaf-42ca-8ecf-afd54d5bbb61",
                status_notes: "",
            },
            {
                forename: "baz",
                lastname: "qux",
                email: "baz.qux@ons.gov.uk",
                groups: [],
                status: "FORCE_CHANGE_PASSWORD",
                active: true,
                id: "ae14d689-a58e-4c5e-a23e-ecd1abebd96d",
                status_notes: "",
            },
            {
                forename: "alpha",
                lastname: "a",
                email: "alpha.a@ons.gov.uk",
                groups: [],
                status: "CONFIRMED",
                active: true,
                id: "qm24p686-h52g-5c1v-e83r-iyb4hwibr25x",
                status_notes: "",
            },
        ],
    };
    describe("Given some preview users not in the team", () => {
        const component = mount(
            <WrapperComponent>
                <UsersNotInTeam {...usersNotInTeamProps} />
            </WrapperComponent>
        );
        it("renders the list of users in alphabetical order that are not in the basket to be added to the team yet", () => {
            expect(component.find('[data-testid="dynamic-list-title"]').text()).toBe("Add member to team");
            expect(component.find("input#add-member-to-team-search-content-types")).toHaveLength(1);
            expect(component.find('[data-testid="dynamic-list-container"]').children()).toHaveLength(2);
            expect(component.find('[data-testid="dynamic-list-no-results"]')).toHaveLength(0);
            const firstPreviewUserInList = component.find('[data-testid="dynamic-list-container"]').children().first();
            expect(firstPreviewUserInList.find(".dynamic-list-item__title").text()).toBe("baz qux");
        });

        it("matches snapshot", () => {
            const componentForSnapshot = renderer.create(
                <WrapperComponent>
                    <UsersNotInTeam {...usersNotInTeamProps} />
                </WrapperComponent>
            );
            expect(componentForSnapshot.toJSON()).toMatchSnapshot();
        });
        describe("Given valid props on initial load but with no preview users available", () => {
            const noPreviewUsersAvailableProps = {
                dispatch: mockDispatch,
                loading: false,
                addUserToTeam: addUsersToTeam,
                usersNotInTeam: [],
                allPreviewUsers: [],
            };
            const component = mount(
                <WrapperComponent>
                    <UsersNotInTeam {...noPreviewUsersAvailableProps} />
                </WrapperComponent>
            );
            it("renders an empty list with info that no users found", () => {
                expect(component.find('[data-testid="dynamic-list-title"]').text()).toBe("Add member to team");
                expect(component.find("input#add-member-to-team-search-content-types")).toHaveLength(1);
                expect(component.find('[data-testid="dynamic-list-container"]').children()).toHaveLength(0);
                expect(component.find('[data-testid="dynamic-list-no-results"]')).toHaveLength(1);
            });
            it("matches snapshot", () => {
                const componentForSnapshot = renderer.create(
                    <WrapperComponent>
                        <UsersNotInTeam {...noPreviewUsersAvailableProps} />
                    </WrapperComponent>
                );
                expect(componentForSnapshot.toJSON()).toMatchSnapshot();
            });
        });
    });

    describe("Given some preview users not yet in the team basket", () => {
        const component = mount(
            <WrapperComponent>
                <UsersNotInTeam {...usersNotInTeamProps} />
            </WrapperComponent>
        );
        describe("Given a filter term is provided to the search input", () => {
            component.find("input#add-member-to-team-search-content-types").simulate("change", { target: { value: "foo" } });
            it("filters the list of users not in the team hiding users that do not match the search term", () => {
                expect(component.find('[data-testid="dynamic-list-container"]').children()).toHaveLength(1);
                const firstPreviewUserInList = component.find('[data-testid="dynamic-list-container"]').children().first();
                expect(firstPreviewUserInList.find(".dynamic-list-item__title").text()).toBe("foo bar");
            });
        });
    });
});
