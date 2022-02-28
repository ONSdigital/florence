import React from "react";
import { render, screen, createMockUser } from "../../utilities/tests/test-utils";
import UsersList from "./UsersList";

const admin = createMockUser("admin@test.com", true, true, "ADMIN");
const mockedAllUsers = [
    {
        active: true,
        details: ["test.user-1498@ons.gov.uk"],
        email: "test.user-1498@ons.gov.uk",
        forename: "Test1",
        groups: [],
        id: "test.user-1498@ons.gov.uk",
        lastname: "Surname 1498",
        status: "CONFIRMED",
        status_notes: "This user was nice ",
        title: "Test1 Surname 1498",
        url: "/florence/users/test.user-1498@ons.gov.uk",
    },
    {
        active: true,
        details: ["test.user-642@ons.gov.uk"],
        email: "test.user-642@ons.gov.uk",
        forename: "Test2",
        groups: [],
        id: "test.user-642@ons.gov.uk",
        lastname: "Surname 642",
        status: "CONFIRMED",
        status_notes: "this user was ok ",
        title: "Test2 Surname 642",
        url: "/florence/users/test.user-642@ons.gov.uk",
    },
];

const props = {
    users: [],
    loading: false,
    params: {},
    rootPath: "test",
    routes: [],
    loggedInUser: admin,
    loadUsers: jest.fn(),
};

describe("UserList", () => {
    it("renders empty list with message if no users found", () => {
        render(<UsersList {...props} />);
        expect(screen.getByRole("link", { name: "Back" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Users/i);
        expect(screen.getByRole("link", { name: "Create new user" })).toBeInTheDocument();
        expect(screen.getByText(/Nothing to show/i)).toBeInTheDocument();
    });

    it("fetches users on load", async () => {
        render(<UsersList {...props} />);
        expect(props.loadUsers).toBeCalled();
    });

    it("renders loader when fetching users", () => {
        const newProps = {
            ...props,
            loading: true,
        };
        render(<UsersList {...newProps} />);
        expect(screen.getByTestId("loader")).toBeInTheDocument();
    });

    it("renders list of users", () => {
        const newProps = {
            ...props,
            users: mockedAllUsers,
        };
        render(<UsersList {...newProps} />);

        const items = screen.getAllByRole("listitem");

        expect(screen.getByPlaceholderText(/Search users by name/i)).toBeInTheDocument();
        expect(items).toHaveLength(2);
        expect(items[0]).toHaveTextContent("Test1 Surname 1498test.user-1498@ons.gov.uk");
        expect(items[1]).toHaveTextContent("Test2 Surname 642test.user-642@ons.gov.uk");
    });
});
