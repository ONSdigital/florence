import React from "react";
import { TeamEditController } from "./TeamEditController";
import { mount, shallow } from "enzyme";

jest.mock("../../../utilities/notifications.js", () => ({
    add: jest.fn().mockImplementation(() => {}),
}));

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

jest.mock("../../../utilities/api-clients/user.js", () => ({
    getAll: jest.fn().mockImplementation(() => {
        return Promise.resolve([
            {
                name: "User 1",
                email: "user.1@test.com",
            },
            {
                name: "User 3",
                email: "user.3@test.com",
            },
            {
                name: "User 2",
                email: "user.2@test.com",
            },
            {
                name: "User 5",
                email: "user.5@test.com",
            },
            {
                name: "User 4",
                email: "user.4@test.com",
            },
        ]);
    }),
}));

jest.mock("../../../utilities/api-clients/teams.js", () => ({
    addMember: jest.fn().mockImplementation(() => {
        return Promise.resolve();
    }),
    removeMember: jest.fn().mockImplementation(() => {
        return Promise.resolve();
    }),
}));

const users = [
    {
        name: "User 1",
        email: "user.1@test.com",
    },
    {
        name: "User 2",
        email: "user.2@test.com",
    },
    {
        name: "User 4",
        email: "user.4@test.com",
    },
    {
        name: "User 5",
        email: "user.5@test.com",
    },
    {
        name: "User 3",
        email: "user.3@test.com",
    },
];
const name = "A test team";
const isUpdatingMembers = false;
const members = [];
const defaultProps = {
    users,
    members,
    dispatch,
    name,
    isUpdatingMembers,
};

function dispatch() {}

test("Add/remove functionality for user is disabled whilst that user is being added/removed from team", () => {
    const component = shallow(<TeamEditController {...defaultProps} />);
    const promise = Promise.resolve();

    return promise
        .then(() => {
            component.instance().handleMembersChange({ email: "user.1@test.com", action: "add" });
            expect(component.state("disabledUsers").indexOf("user.1@test.com")).toBe(0);
        })
        .then(() => {
            expect(component.state("disabledUsers").indexOf("user.1@test.com")).toBe(-1);
        });
});

test("Updating the search term filters displayed users correctly", () => {
    const component = mount(<TeamEditController {...defaultProps} />);

    expect(component.state("editedUsers")).toBe(null);

    const newEditedUsers = users.slice(0, users.length - 1);
    component.setState({ editedUsers: newEditedUsers });
    expect(component.state("editedUsers").length).toBe(4);
    component.instance().handleUsersSearch({ target: { value: "User.2" } });
    expect(component.state("editedUsers").length).toBe(1);
});

test("Adding and removing a user to/from a team updates the 'All users' list accordingly", async () => {
    const component = shallow(<TeamEditController {...defaultProps} />);

    component.setState({ editedUsers: users });
    expect(component.state("editedUsers").length).toBe(5);
    await component.instance().handleMembersChange({ email: "user.1@test.com", action: "add" });
    expect(component.update().state("editedUsers").length).toBe(4);

    await component.instance().handleMembersChange({ email: "user.1@test.com", action: "remove" });
    expect(component.update().state("editedUsers").length).toBe(5);
});

test("Lists of members and users are sorted into alphanumerical order", () => {
    const unsortedMembers = ["user.3@test.com", "user.1@test.com", "user.2@test.com"];
    const props = Object.assign({}, defaultProps, {
        members: unsortedMembers,
    });
    const component = shallow(<TeamEditController {...props} />);

    const sortedUsers = component.instance().sortUsers(users);
    const sortedMembers = component.instance().sortMembers(unsortedMembers);

    sortedUsers.forEach((value, index) => {
        expect(value.email).toBe(`user.${index + 1}@test.com`);
    });

    sortedMembers.forEach((value, index) => {
        expect(value).toBe(`user.${index + 1}@test.com`);
    });
});

test("List of 'All users' doesn't show users that are already a member of the team", async () => {
    const props = Object.assign({}, defaultProps, {
        members: ["user.3@test.com", "user.1@test.com", "user.2@test.com"],
    });
    const component = mount(<TeamEditController {...props} />);

    await component.update();
    const editedUsersList = component.state("editedUsers");
    expect(editedUsersList.length).toBe(2);

    editedUsersList.forEach(user => {
        expect(members.indexOf(user.email)).toBe(-1);
    });
    expect(editedUsersList.some(user => user.email === "user.4@test.com")).toBe(true);
    expect(editedUsersList.some(user => user.email === "user.5@test.com")).toBe(true);
});
