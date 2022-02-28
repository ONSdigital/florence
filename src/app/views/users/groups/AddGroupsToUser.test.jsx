import React from "react";
import renderer from "react-test-renderer";
import { render, screen, within, getByTestId } from "../../../utilities/tests/test-utils";
import AddGroupsToUser from "./AddGroupsToUser";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { groups, user } from "../../../utilities/tests/mockData";

const defaultProps = {
    user: null,
    groups: [],
    isAdding: false,
    loading: false,
    addGroupsToUser: jest.fn(),
    loadUser: jest.fn(),
    loadGroups: jest.fn(),
    router: { setRouteLeaveHook: jest.fn() },
};
const props = {
    ...defaultProps,
    user: user,
    groups: groups,
};
const setRouteLeaveHook = jest.fn();

describe("AddGroupsToUser", () => {
    it("matches the snapshot", () => {
        const wrapper = renderer.create(<AddGroupsToUser.WrappedComponent {...defaultProps} params={{ router: setRouteLeaveHook }} />);
        expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it("requests user data on component load", () => {
        render(<AddGroupsToUser.WrappedComponent {...defaultProps} params={{ userID: "test.user-1498@ons.gov.uk", router: setRouteLeaveHook }} />);
        expect(defaultProps.loadUser).toHaveBeenCalledWith("test.user-1498@ons.gov.uk");
    });

    it("requests groups on component load", () => {
        render(<AddGroupsToUser.WrappedComponent {...defaultProps} params={{ userID: "test.user-1498@ons.gov.uk", router: setRouteLeaveHook }} />);
        expect(defaultProps.loadGroups).toHaveBeenCalled();
    });

    it("shows Back Button", () => {
        render(<AddGroupsToUser.WrappedComponent {...defaultProps} params={{ userID: "test.user-1498@ons.gov.uk", router: setRouteLeaveHook }} />);
        expect(screen.getByText(/Back/i)).toBeInTheDocument();
    });

    it("shows Groups heard, search and message if no groups", () => {
        render(<AddGroupsToUser.WrappedComponent {...defaultProps} params={{ userID: "test.user-1498@ons.gov.uk", router: setRouteLeaveHook }} />);
        expect(screen.getByText(/add a team for the user to join/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Search teams by name")).toHaveValue("");
    });

    it("shows Footer Section with Buttons", () => {
        render(<AddGroupsToUser.WrappedComponent {...defaultProps} params={{ userID: "test.user-1498@ons.gov.uk", router: setRouteLeaveHook }} />);
        expect(screen.getByTestId("form-footer")).toBeInTheDocument();
        expect(screen.getByText(/Save changes/i)).toBeInTheDocument();
        expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
    });

    describe("when loading data", () => {
        it("shows spinner", () => {
            const props = { ...defaultProps, loading: true };
            render(<AddGroupsToUser.WrappedComponent {...props} params={{ userID: "", router: setRouteLeaveHook }} />);

            expect(screen.getByTestId("loader")).toBeInTheDocument();
        });
    });

    describe("where user and groups fetched", () => {
        it("shows user details", () => {
            render(<AddGroupsToUser.WrappedComponent {...props} params={{ userID: "test.user-1498@ons.gov.uk", router: setRouteLeaveHook }} />);
            expect(screen.getByText(/Back/i)).toBeInTheDocument();
            expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/test user-1498/i);
            expect(screen.getByText("test.user-1498@ons.gov.uk")).toBeInTheDocument();
            expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/test user-1498/i);
            expect(within(screen.getByTestId("user")).getByRole("heading", { level: 2 })).toHaveTextContent(/Team Member/i);
        });

        it("shows groups", () => {
            render(<AddGroupsToUser.WrappedComponent {...props} params={{ userID: "test.user-1498@ons.gov.uk", router: setRouteLeaveHook }} />);
            const GroupsSection = screen.getByTestId("groups-table");

            expect(screen.getByText(/add a team for the user to join/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText("Search teams by name")).toHaveValue("");
            expect(screen.getByText(/my test group/i)).toBeInTheDocument();
            expect(screen.getByText(/my test group/i)).toBeInTheDocument();
            expect(screen.getAllByRole("button", { name: "Add" })).toHaveLength(3);
        });

        it("adds user to groups", () => {
            render(<AddGroupsToUser.WrappedComponent {...props} params={{ userID: "test.user-1498@ons.gov.uk", router: setRouteLeaveHook }} />);
            const GroupsSection = screen.getByTestId("groups-table");

            expect(screen.getByRole("heading", { level: 2, name: "Add a team for the user to join" })).toBeInTheDocument();
            expect(screen.getByPlaceholderText("Search teams by name")).toHaveValue("");
            expect(screen.getByText(/admins/i)).toBeInTheDocument();
            expect(screen.getByText(/my first group/i)).toBeInTheDocument();
            const add_buttons = screen.getAllByRole("button", { name: "Add" });

            userEvent.click(add_buttons[0]);

            expect(screen.getByTestId("form-footer")).toBeInTheDocument();
            expect(within(screen.getByTestId("user")).getByText("my test group")).toBeInTheDocument();
            expect(within(screen.getByTestId("form-footer")).getByText("You have unsaved changes")).toBeInTheDocument();

            userEvent.click(screen.getByText(/save changes/i));
            expect(props.addGroupsToUser).toHaveBeenCalledWith("test.user-1498@ons.gov.uk", ["my test group"]);
        });
    });
});
