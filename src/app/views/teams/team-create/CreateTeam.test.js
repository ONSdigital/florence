import React from "react";
import { initialState } from "../../../config/newTeam/newTeamReducer";
import { mount } from "enzyme";
import CreateTeam from "./createTeam";

const rootPath = "/florence";
let dispatchedActions = [];
const mockDispatch = event => {
    dispatchedActions.push(event);
};

describe("CreateTeam", () => {
    describe("Given valid props and a list of users in the store", () => {
        const CreateTeamProps = {
            dispatch: mockDispatch,
            rootPath: rootPath,
            params: {
                userID: "",
            },
            newTeam: { ...initialState },
        };

        const component = mount(<CreateTeam {...CreateTeamProps} />);
        it("renders the relevant components to screen", () => {
            expect(component.find("h1").text).toBe("Create a preview team");
            expect(component.find("team-name-id").length).toBe(1);
            expect(component.find("dynamic-list__title").length).toBe(1);
            expect(component.find("content-action-bar__warn__text").length).toBe(0);
        });
    });
});
