import React from "react";
import { UsersListController } from "./UsersListController";
import { shallow } from "enzyme";
import user from "../../utilities/api-clients/user";

console.error = () => {};

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

const defaultProps = {
    dispatch: event => {
        dispatchedActions.push(event);
    },
    rootPath: "/florence",
    params: {
        userID: "",
    },
};

const component = shallow(<UsersListController {...defaultProps} />);

describe("On mount of the users screen", () => {
    it("fetches data for all users", () => {
        const getUserCalls = user.getAll.mock.calls.length;
        component.instance().UNSAFE_componentWillMount();
        expect(user.getAll.mock.calls.length).toBe(getUserCalls + 1);
    });

    it("adds all users to state", () => {
        component.instance().UNSAFE_componentWillMount();
        expect(dispatchedActions[0].type).toBe("ADD_ALL_USERS");
        expect(dispatchedActions[0].users.length).toBe(mockedAllUsers.users.length);
    });

    it("updates isFetchingUsers state to show it's fetching data for all users", () => {
        expect(component.state("isFetchingUsers")).toBe(false);

        // Tests that state is set correctly before asynchronous requests have finished
        component.instance().UNSAFE_componentWillMount();
        expect(component.state("isFetchingUsers")).toBe(true);
    });

    it("updates isFetchingUsers state to show it has fetched data for all users", async () => {
        // Tests that state is set correctly after asynchronous requests were successful
        await component.instance().UNSAFE_componentWillMount();
        expect(component.state("isFetchingUsers")).toBe(false);
    });

    it("updates isFetchingUsers state correctly on failure to fetch data for all users", async () => {
        user.getAll.mockImplementationOnce(() => Promise.reject({ status: 500 }));
        await component.instance().UNSAFE_componentWillMount();
        expect(component.state("isFetchingUsers")).toBe(false);
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
        const returnValue = component.instance().mapUserToState(mockedAllUsers.users[0]);
        expect(returnValue).toMatchObject(expectedValue);
    });
});
