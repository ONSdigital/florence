import React from "react";
import { TeamDeleteController } from "./TeamDeleteController";
import { shallow } from "enzyme";

jest.mock("../../../utilities/notifications.js", () => {
    return {
        add: function (notification) {
            mockNotifications.push(notification);
        },
    };
});

jest.mock("../../../utilities/logging/log", () => {
    return {
        event: jest.fn().mockImplementation(() => {
            // do nothing
        }),
        data: jest.fn().mockImplementation(() => {
            // do nothing
        }),
        error: jest.fn().mockImplementation(() => {
            // do nothing
        }),
    };
});

jest.mock("../../../utilities/api-clients/teams.js", () => ({
    remove: jest
        .fn(() => {
            return Promise.resolve();
        })
        .mockImplementationOnce(() => {
            return Promise.reject({ status: 500 });
        }),
}));

jest.mock("../../../config/actions.js", () => {
    return {
        loadGroupsSuccess: function (payload) {
            return payload;
        },
    };
});

const defaultProps = {
    name: "Test Team",
    teams: [
        {
            id: 25,
            name: "A new team",
            members: [],
            path: "a_new_team_25",
        },
        {
            id: 15,
            name: "crispin",
            members: ["admin@test.com", "data@vis.com"],
            path: "crispin_15",
        },
        {
            id: 23,
            name: "crumpet",
            members: [],
            path: "crumpet_23",
        },
        {
            id: 1,
            name: "Test Team",
            members: [],
            path: "test_team_1",
        },
    ],
    dispatch: action => {
        stateUpdates.push(action);
    },
    onDeleteSuccess: () => {},
    rootPath: "/florence",
    pathname: "",
};

let stateUpdates = [];
let mockNotifications = [];
beforeEach(() => {
    stateUpdates = [];
});

test("User is given a notification if the team delete fails", async () => {
    const promise = Promise.resolve();
    const component = shallow(<TeamDeleteController {...defaultProps} />);
    const inputEvent = {
        target: {
            value: "Test Team",
        },
    };
    const formEvent = {
        preventDefault: () => {},
    };

    component.instance().handleFormInput(inputEvent);
    await component.instance().handleFormSubmit(formEvent);
    setImmediate(() => {
        expect(mockNotifications.length).toBe(1);
    });
});

test("Error is displayed if team name and input value don't match", () => {
    const component = shallow(<TeamDeleteController {...defaultProps} />);
    const inputEvent = {
        target: {
            value: "Test Team 1",
        },
    };
    const formEvent = {
        preventDefault: () => {},
    };

    component.instance().handleFormInput(inputEvent);
    component.instance().handleFormSubmit(formEvent);

    expect(component.state("input").error.length).toBeGreaterThan(0);
});

test("Team removal request is sent to server and removed from state when input value and team name match", () => {
    const promise = Promise.resolve();
    const component = shallow(<TeamDeleteController {...defaultProps} />);
    const inputEvent = {
        target: {
            value: "Test Team",
        },
    };
    const formEvent = {
        preventDefault: () => {},
    };
    const testTeamIsInState = component.instance().props.teams.some(team => {
        return team.name === "Test Team";
    });

    expect(testTeamIsInState).toBe(true);
    expect(component.instance().props.teams.length).toEqual(4);

    component.instance().handleFormInput(inputEvent);

    return promise
        .then(() => {
            component.instance().handleFormSubmit(formEvent);
            expect(component.state("formIsPosting")).toBe(true);
        })
        .then(() => {
            const removedTeamIsInState = stateUpdates[0].some(team => {
                return team.name === "Test Team";
            });
            expect(stateUpdates[0].length).toEqual(3);
            expect(removedTeamIsInState).toBe(false);
        });
});

test("Parent path is the team path with '/delete' removed", () => {
    const props1 = {
        ...defaultProps,
        pathname: `/florence/teams/test-team-1/delete`,
    };
    const component1 = shallow(<TeamDeleteController {...props1} />);
    expect(component1.state("parentPath")).toBe("/florence/teams/test-team-1");

    const props2 = {
        ...defaultProps,
        pathname: `/florence/teams/delete-team-23/delete`,
    };
    const component2 = shallow(<TeamDeleteController {...props2} />);
    expect(component2.state("parentPath")).toBe("/florence/teams/delete-team-23");

    const props3 = {
        ...defaultProps,
        pathname: `/florence/teams/delete/delete`,
    };
    const component3 = shallow(<TeamDeleteController {...props3} />);
    expect(component3.state("parentPath")).toBe("/florence/teams/delete");
});
