import React from "react";
import UsersNotInTeam from "./UsersNotInTeam";
import { mount } from "enzyme";
import renderer from "react-test-renderer";
import { WrapperComponent } from "../../../tests/test-utils";

let dispatchedActions = [];
const mockDispatch = event => {
    dispatchedActions.push(event);
};

describe("UsersNotInTeam", () => {
    const UsersNotInTeamProps = {
        dispatch: mockDispatch,
        loading: false,
    };
    describe("Given valid props on initial load", () => {
        const component = mount(
            <WrapperComponent>
                <UsersNotInTeam {...UsersNotInTeamProps} />
            </WrapperComponent>
        );
        it("renders the relevant components to screen", () => {
            expect(component.find("h2.dynamic-list__title")).toHaveLength(1);
            expect(component.find("input#add-member-to-team-search-content-types")).toHaveLength(1);
        });
        it("matches snapshot", () => {
            const componentForSnapshot = renderer.create(
                <WrapperComponent>
                    <UsersNotInTeam {...UsersNotInTeamProps} />
                </WrapperComponent>
            );
            expect(componentForSnapshot.toJSON()).toMatchSnapshot();
        });
    });
});
