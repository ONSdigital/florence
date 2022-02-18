import React from "react";
import renderer from "react-test-renderer";
import { render, screen, within, getByTestId } from "../../../utilities/tests/test-utils";
import AddGroupsToUser from "./AddGroupsToUser";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";

const user = {
    active: true,
    email: "bill.hicks@ons.gov.uk",
    forename: "Bill",
    id: "bill.hicks@ons.gov.uk",
    lastname: "Hicks",
    groups: [],
};

const defaultProps = {
    user: null,
    groups: [],
    isAdding: false,
    loading: false,
    params: { userID: "bill.hicks@ons.gov.uk" },
    addGroupsToUser: jest.fn(),
    loadUser: jest.fn(),
    loadGroups: jest.fn(),
};

describe("AddGroupsToUser", () => {
    it("matches the snapshot", () => {
        const wrapper = renderer.create(<AddGroupsToUser {...defaultProps} />);
        expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it("requests user data on component load", () => {
        render(<AddGroupsToUser {...defaultProps} />);
        expect(defaultProps.loadUser).toHaveBeenCalledWith("bill.hicks@ons.gov.uk");
    });

    it("requests groups on component load", () => {
        render(<AddGroupsToUser {...defaultProps} />);
        expect(defaultProps.loadGroups).toHaveBeenCalled();
    });

    it("shows spinner when loading user data", () => {
        const props = { ...defaultProps, loading: true };
        render(<AddGroupsToUser {...props} />);

        expect(screen.getByText(/Back/i)).toBeInTheDocument();
        expect(screen.getByTestId("loader")).toBeInTheDocument();
    });

    it("shows Back Button", () => {
        render(<AddGroupsToUser {...defaultProps} />);
        expect(screen.getByText(/Back/i)).toBeInTheDocument();
    });

    it("shows Groups heard, search and message if no groups", () => {
        render(<AddGroupsToUser {...defaultProps} />);

        expect(screen.getByText(/add a team for the user to join/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Search teams by name")).toHaveValue("");
    });

    it("shows Footer Section with Buttons", () => {
        render(<AddGroupsToUser {...defaultProps} />);

        expect(screen.getByTestId("form-footer")).toBeInTheDocument();
        expect(screen.getByText(/Save changes/i)).toBeInTheDocument();
        expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
    });

    it("shows user details", () => {
        const props = { ...defaultProps, user: user };
        render(<AddGroupsToUser {...props} />);

        expect(screen.getByText(/Back/i)).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Bill Hicks/i);
        expect(screen.getByText("bill.hicks@ons.gov.uk")).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/bill hicks/i);
        expect(within(screen.getByTestId("user")).getByRole("heading", { level: 2 })).toHaveTextContent(/Team Member/i);
    });

    it("shows groups", () => {
        const props = { ...defaultProps, user: user, groups: [{ group_name: "boo" }, { group_name: "test name" }] };
        render(<AddGroupsToUser {...props} />);

        const GroupsSection = screen.getByTestId("groups-table");

        expect(screen.getByText(/add a team for the user to join/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Search teams by name")).toHaveValue("");
        expect(screen.getByText(/boo/i)).toBeInTheDocument();
        expect(screen.getByText(/test name/i)).toBeInTheDocument();
        expect(screen.getAllByRole("button", { name: "Add" })).toHaveLength(2);
    });

    it("adds user to groups", () => {
        const props = { ...defaultProps, user: user, groups: [{ group_name: "boo" }, { group_name: "test name" }] };
        render(<AddGroupsToUser {...props} />);

        const GroupsSection = screen.getByTestId("groups-table");

        expect(screen.getByText(/add a team for the user to join/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Search teams by name")).toHaveValue("");
        expect(screen.getByText(/boo/i)).toBeInTheDocument();
        expect(screen.getByText(/test name/i)).toBeInTheDocument();
        const add_buttons = screen.getAllByRole("button", { name: "Add" });

        userEvent.click(add_buttons[0]);

        expect(screen.getByTestId("form-footer")).toBeInTheDocument();
        expect(within(screen.getByTestId("user")).getByText("boo")).toBeInTheDocument();
        expect(within(screen.getByTestId("form-footer")).getByText("You have unsaved changes")).toBeInTheDocument();

        userEvent.click(screen.getByText(/save changes/i));
        expect(props.addGroupsToUser).toHaveBeenCalledWith("bill.hicks@ons.gov.uk", ["boo"]);
    });

    it("shows filtered groups", () => {
        const props = { ...defaultProps, user: user, groups: [{ group_name: "boo" }, { group_name: "test name" }] };
        render(<AddGroupsToUser {...props} />);

        expect(screen.getByText(/add a team for the user to join/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Search teams by name")).toHaveValue("");

        userEvent.paste(screen.getByPlaceholderText("Search teams by name"), "test");

        expect(screen.getByPlaceholderText("Search teams by name")).toHaveValue("test");
        expect(screen.queryByText(/boo/i)).not.toBeInTheDocument();
        expect(screen.getByText(/test name/i)).toBeInTheDocument();
    });
});
