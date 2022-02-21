import React from "react";
import user from "../../utilities/api-clients/user";
import renderer from "react-test-renderer";
import { mount } from "enzyme";
import { render, screen, createMockUser, within } from "../../utilities/tests/test-utils";
import UsersList from "./UsersList";

const admin = createMockUser("admin@test.com", true, true, "ADMIN");
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

const props = {
    users: [],
    isLoading: false,
    params: {},
    rootPath: "test",
    routes: [],
    loggedInUser: admin,
    dispatch: jest.fn(),
    loadUsers: jest.fn(),
};
describe("UserList", () => {
    it("renders empty list with message if no users ", () => {
        render(<UsersList {...props} />);
        expect(screen.getByText(/Users/i)).toBeInTheDocument();
        expect(screen.getByText(/Nothing to show/i)).toBeInTheDocument();
        expect(screen.getByText(/Create new user/i)).toBeInTheDocument();
    });
    it.only("renders list of users", () => {
        const newProps = {
            ...props,
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
        render(<UsersList {...newProps} />);
        expect(screen.getByPlaceholderText(/Search user by name or email/i)).toBeInTheDocument();
    });
});
