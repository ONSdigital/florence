import React from "react";
import { render, screen, createMockUser } from "../../utilities/tests/test-utils";
import userEvent from "@testing-library/user-event";
import UsersList from "./UsersList";
import { user } from "../../utilities/tests/mockData";

const admin = createMockUser("admin@test.com", true, true, "ADMIN");
const props = {
    active: [],
    suspended: [],
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

    it("shows loader when fetching users", () => {
        const newProps = {
            ...props,
            loading: true,
        };
        render(<UsersList {...newProps} />);
        expect(screen.getByTestId("loader")).toBeInTheDocument();
    });

    it("lists active users by default", () => {
        const newProps = {
            ...props,
            active: [user],
        };
        render(<UsersList {...newProps} />);

        const items = screen.getAllByRole("listitem");

        expect(screen.getByPlaceholderText(/Search users by name/i)).toBeInTheDocument();
        expect(items).toHaveLength(1);
        expect(items[0]).toHaveTextContent("test.user-1498@ons.gov.uk");
    });

    it("renders list of active users by default", () => {
        const newProps = {
            ...props,
            active: [user],
        };
        render(<UsersList {...newProps} />);

        const items = screen.getAllByRole("listitem");

        expect(screen.getByPlaceholderText(/Search users by name/i)).toBeInTheDocument();
        expect(items).toHaveLength(1);
        expect(items[0]).toHaveTextContent("test.user-1498@ons.gov.uk");

        screen.getByLabelText("Show active users", { pressed: true });
    });

    it("renders list of inactive users when show suspended is active", () => {
        const newProps = {
            ...props,
            active: [user],
        };
        render(<UsersList {...newProps} />);

        expect(screen.getByLabelText("Show active users", { pressed: true })).toBeInTheDocument();
        expect(screen.getByLabelText("Show suspended users", { pressed: false })).toBeInTheDocument();

        userEvent.click(screen.getByRole("button", { name: /suspended/i }));

        expect(screen.getByLabelText("Show active users", { pressed: false })).toBeInTheDocument();
        expect(screen.getByLabelText("Show suspended users", { pressed: true })).toBeInTheDocument();
        expect(screen.getByText(/nothing to show/)).toBeInTheDocument();
    });
});
