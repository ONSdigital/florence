import React from "react";
import {UsersList, getAllUsers, mapUserToState} from "./UsersList";
import user from "../../utilities/api-clients/user";
import renderer from "react-test-renderer";
import {mount} from "enzyme";

console.error = () => {};

const withTimeout = (done, fn) => {
    const timeoutId = setTimeout(() => {
        fn();
        clearTimeout(timeoutId);
        done();
    });
};

jest.mock("../../utilities/logging/log", () => {
    return {
        event: jest.fn(() => {}),
        data: jest.fn(() => {}),
        error: jest.fn(() => {}),
    };
});

jest.mock("../../utilities/notifications", () => {
    return {
        add: jest.fn(() => {}),
        remove: () => {},
    };
});

jest.mock("../../utilities/api-clients/user", () => {
    return {
        getAll: jest.fn(() => {
            return Promise.resolve(mockedAllUsers);
        }),
    };
});

jest.mock("../../utilities/auth", () => {
    return {
        isAdmin: jest.fn(() => {
            return true;
        }),
    };
});

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

let dispatchedActions = [];

const mockDispatch = event => {
    dispatchedActions.push(event);
};
const rootPath = "/florence";

const defaultProps = {
    dispatch: mockDispatch,
    rootPath: rootPath,
    params: {
        userID: "",
    },
};

describe("Calling getAllUsers function", () => {
    it("fetches data for all users", (done) => withTimeout(done, () => {
        const getUserCalls = user.getAll.mock.calls.length;
        getAllUsers(mockDispatch, rootPath, () => {});
        expect(user.getAll.mock.calls.length).toBe(getUserCalls + 1);
    }));

    it("adds all users to state", () => {
        getAllUsers(mockDispatch, rootPath, () => {});
        expect(dispatchedActions[0].type).toBe("ADD_ALL_USERS");
        expect(dispatchedActions[0].users.length).toBe(mockedAllUsers.users.length);
    });
});

describe("Mapping users to state", () => {
    it("maps correctly", () => {
        const expectedValue = {
            ...mockedAllUsers.users[0],
            id: mockedAllUsers.users[0].email,
            details: [mockedAllUsers.users[0].email],
            title: `${mockedAllUsers.users[0].forename} ${mockedAllUsers.users[0].lastname}`,
            url: `/florence/users/${mockedAllUsers.users[0].email}`,
        };
        const returnValue = mapUserToState("/florence", mockedAllUsers.users[0]);
        expect(returnValue).toMatchObject(expectedValue);
    });
});

describe("UsersList", () => {
    const mappedUser1 = mapUserToState("/florence", mockedAllUsers.users[0]);
    const mappedUser2 = mapUserToState("/florence", mockedAllUsers.users[1]);
    const defaultProps = {
        dispatch: mockDispatch,
        rootPath: rootPath,
        params: {
            userID: "",
        },
        users: [mappedUser1, mappedUser2]
    };

    const component = mount(<UsersList {...defaultProps} />);
    it("should display a simple selectable list", () => {
        expect(component.find(".simple-select-list").length).toBe(1);
        expect(component.find(".simple-select-list__item").length).toBe(2);
    });

    it("matches the snapshot", () => {
        const componentForSnapshot = renderer.create(<UsersList {...defaultProps} />);
        expect(componentForSnapshot.toJSON()).toMatchSnapshot();
    });
});
