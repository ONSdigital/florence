import React from "react";
import { TeamsController } from "./TeamsController";
import renderer from "react-test-renderer";
import { mount } from "enzyme";

const listOfTeams = [
    {
        name: "Team 1",
        id: 1,
        path: "team_1_1"
    },
    {
        name: "Team 2",
        id: 2,
        path: "team_2_2"
    },
    {
        name: "Team 2",
        id: 3,
        path: "team_3_3"
    }
];

jest.mock("../../utilities/api-clients/teams.js", () => ({
    getAll: jest.fn().mockImplementation(() => {
        return Promise.resolve([
            {
                name: "Team 1",
                id: 1,
                path: "team_1_1"
            },
            {
                name: "Team 2",
                id: 2,
                path: "team_2_2"
            },
            {
                name: "Team 2",
                id: 3,
                path: "team_3_3"
            }
        ]);
    })
}));

jest.mock("../../utilities/api-clients/user.js", () => ({
    getAll: jest.fn().mockImplementation(() => {
        return Promise.resolve([
            {
                name: "User 1",
                email: "user.1@test.com"
            },
            {
                name: "User 2",
                email: "user.2@test.com"
            },
            {
                name: "User 3",
                email: "user.3@test.com"
            }
        ]);
    })
}));

jest.mock("../../utilities/notifications.js", () => ({
    add: jest.fn().mockImplementation(() => {
        return Promise.resolve([]);
    }),
    eventTypes: {
        editedTeamMembers: ""
    }
}));

jest.mock("../../utilities/websocket", () => {
    return {
        send: jest.fn(() => {})
    };
});

jest.mock("../../utilities/logging/log", () => {
    return {
        event: jest.fn().mockImplementation(() => {
            // do nothing
        })
    };
});

test("Loading state shown when fetching all teams", () => {
    const props = {
        dispatch: function() {},
        rootPath: "/florence",
        allTeams: listOfTeams,
        params: {},
        userIsAdmin: false,
        routes: [
            {
                path: "florence"
            },
            {
                path: "teams"
            }
        ]
    };
    const component = mount(<TeamsController {...props} />);
    expect(component.find(".loader").length).toBe(1);
    component.setState({ isUpdatingAllTeams: false });
    expect(component.find(".loader").length).toBe(0);
});

test("Renders updated list of teams", () => {
    const props = {
        dispatch: function() {},
        rootPath: "/florence",
        allTeams: [],
        params: {},
        userIsAdmin: false,
        routes: [
            {
                path: "florence"
            },
            {
                path: "teams"
            }
        ]
    };
    const component = mount(<TeamsController {...props} />);
    expect(component.find("li").length).toBe(0);
    component.setProps({ allTeams: listOfTeams });
    component.setState({ isUpdatingAllTeams: false });
    expect(component.find("li").length).toBe(3);
});

test("Correctly renders when the active team is changed", () => {
    const props = {
        dispatch: function() {},
        rootPath: "/florence",
        allTeams: listOfTeams,
        params: {},
        activeTeam: {},
        userIsAdmin: false,
        routes: [
            {
                path: "florence"
            },
            {
                path: "teams"
            }
        ]
    };
    const component = mount(<TeamsController {...props} />);
    component.setState({ isUpdatingAllTeams: false });
    expect(component.find(".selected").length).toBe(0);
    component.setProps({
        activeTeam: {
            name: "Team 1",
            id: 1,
            members: ["tester 1", "tester 2"]
        }
    });
    expect(component.find(".selected").length).toBe(1);
    component.setProps({ activeTeam: {} });
    expect(component.find(".selected").length).toBe(0);
});

test("Non-admin users can't view option to edit teams", () => {
    const props = {
        dispatch: function() {},
        rootPath: "/florence",
        allTeams: listOfTeams,
        params: {
            team: "team_1_1"
        },
        activeTeam: {
            name: "Team 1",
            id: 1,
            members: ["tester 1", "tester 2"]
        },
        userIsAdmin: false,
        routes: [
            {
                path: "florence"
            },
            {
                path: "teams"
            }
        ]
    };
    const component = renderer.create(<TeamsController {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
});

test("Admin users have option to edit teams", () => {
    const props = {
        dispatch: function() {},
        rootPath: "/florence",
        allTeams: listOfTeams,
        params: {
            team: "team_1_1"
        },
        activeTeam: {
            name: "Team 1",
            id: 1,
            members: ["tester 1", "tester 2"]
        },
        userIsAdmin: true,
        routes: [
            {
                path: "florence"
            },
            {
                path: "teams"
            }
        ]
    };
    const component = renderer.create(<TeamsController {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
});
