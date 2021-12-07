import React from "react";
import {shallow, mount} from "enzyme";
import CreateTeam from "./createTeam";
import {WrapperComponent} from "../../../../tests/test-utils";
import renderer from "react-test-renderer";

const rootPath = "/florence";
let dispatchedActions = [];
const mockDispatch = event => {
    dispatchedActions.push(event);
};

const mockedAllUsers = {
    count: 45,
    users: [
        {
            forename: "Test",
            lastname: "user",
            email: "test@test.com",
            groups: [],
            status: "CONFIRMED",
            active: true,
            id: "aaa-bbb-ccc",
            status_notes: "",
        },
        {
            forename: "Test",
            lastname: "user 2",
            email: "test2@test.com",
            groups: [],
            status: "CONFIRMED",
            active: true,
            id: "ddd-eee-fff",
            status_notes: "",
        },
        {
            forename: "Test",
            lastname: "user 3",
            email: "test3@test.com",
            groups: [],
            status: "CONFIRMED",
            active: true,
            id: "ggg-hhh-iii",
            status_notes: "",
        },
    ],
};

jest.mock("../../../utilities/api-clients/user", () => {
    return {
        getAll: jest.fn(() => {
            return Promise.resolve(mockedAllUsers);
        }),
    };
});
describe("CreateTeam", () => {
    describe("Given valid props and a list of users in the store", () => {
        const CreateTeamProps = {
            dispatch: mockDispatch,
            router: {
                listenBefore: () => {},
                setRouteLeaveHook:()=>{}
            },
            // params: {
            //     userID: "",
            // },
            // state: {newTeam: x},
            // // newTeam: {...initialState, usersNotInTeam: mockedAllUsers.users, newTeam:[]},
            // newTeam: x,
        };

        // const component = mount(<CreateTeam {...CreateTeamProps} /></Provider>);
        console.log("CreateTeamProps")
        console.log(CreateTeamProps)
        const component = mount(<WrapperComponent><CreateTeam {...CreateTeamProps} /></WrapperComponent>
        );
        console.log("DEBUGGING")
        console.log("Wrapper")
        console.log(component.debug({verbose: true}))
        it("renders the relevant components to screen", () => {
            expect(component.find("Connect(CreateTeam)")).toHaveLength(1);
            expect(component.find("h1").text()).toBe("Create a preview team");
            expect(component.find("input#team-name-id").length).toBe(1);
            expect(component.find("h2.dynamic-list__title").length).toBe(1);
            expect(component.find("content-action-bar__warn__text").length).toBe(0);
        });
    });
});
