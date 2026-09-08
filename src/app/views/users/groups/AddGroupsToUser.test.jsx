import React from "react";
import renderer from "react-test-renderer";
import { render, screen, within, WrapperComponent } from "../../../utilities/tests/test-utils";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import AddGroupsToUser from "./AddGroupsToUser";
import { groups, user } from "../../../utilities/tests/mockData";

const defaultProps = {
    user: null,
    groups: [],
    isAdding: false,
    loading: false,
    addGroupsToUser: jest.fn(),
    loadUser: jest.fn(),
    loadGroups: jest.fn(),
    match: {
        params: {
            id: "test.user-1498@ons.gov.uk",
        },
    },
    rootPath: "/florence",
};
const props = {
    ...defaultProps,
    user: user,
    groups: groups,
};

describe("AddGroupsToUser", () => {
    it("matches the snapshot", () => {
        const wrapper = renderer.create(
            <WrapperComponent>
                <AddGroupsToUser.WrappedComponent {...defaultProps} />
            </WrapperComponent>
        );
        expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it("requests user data on component load", () => {
        render(
            <WrapperComponent>
                <AddGroupsToUser.WrappedComponent {...defaultProps} />
            </WrapperComponent>
        );
        expect(defaultProps.loadUser).toHaveBeenCalledWith(defaultProps.match.params.id);
    });

    it("requests groups on component load", () => {
        render(
            <WrapperComponent>
                <AddGroupsToUser.WrappedComponent {...defaultProps} />
            </WrapperComponent>
        );
        expect(defaultProps.loadGroups).toHaveBeenCalled();
    });

    it("shows Back Button", () => {
        render(
            <WrapperComponent>
                <AddGroupsToUser.WrappedComponent {...defaultProps} />
            </WrapperComponent>
        );
        expect(screen.getByText(/Back/i)).toBeInTheDocument();
    });

    it("shows Groups heard, search and message if no groups", () => {
        render(
            <WrapperComponent>
                <AddGroupsToUser.WrappedComponent {...defaultProps} />
            </WrapperComponent>
        );
        expect(screen.getByText(/add a team for the user to join/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Search teams by name")).toHaveValue("");
    });

    it("shows Footer Section with Buttons", () => {
        render(
            <WrapperComponent>
                <AddGroupsToUser.WrappedComponent {...defaultProps} />
            </WrapperComponent>
        );
        expect(screen.getByTestId("form-footer")).toBeInTheDocument();
        expect(screen.getByText(/Save changes/i)).toBeInTheDocument();
        expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
    });

    describe("when loading data", () => {
        it("shows spinner", () => {
            const props = { ...defaultProps, loading: true };
            render(
                <WrapperComponent>
                    <AddGroupsToUser.WrappedComponent {...props} match={{ params: { id: "" } }} />
                </WrapperComponent>
            );

            expect(screen.getByTestId("loader")).toBeInTheDocument();
        });
    });

    describe("where user and groups fetched", () => {
        it("shows user details", () => {
            render(
                <WrapperComponent>
                    <AddGroupsToUser.WrappedComponent {...props} />
                </WrapperComponent>
            );
            expect(screen.getByText(/Back/i)).toBeInTheDocument();
            expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/test user-1498/i);
            expect(screen.getByText("test.user-1498@ons.gov.uk")).toBeInTheDocument();
            expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/test user-1498/i);
            expect(within(screen.getByTestId("user")).getByRole("heading", { level: 2 })).toHaveTextContent(/Team Member/i);
        });

        it("shows groups", () => {
            render(
                <WrapperComponent>
                    <AddGroupsToUser.WrappedComponent {...props} />
                </WrapperComponent>
            );
            const GroupsSection = screen.getByTestId("groups-table");

            expect(screen.getByText(/add a team for the user to join/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText("Search teams by name")).toHaveValue("");
            expect(screen.getByText(/my test group/i)).toBeInTheDocument();
            expect(screen.getByText(/my test group/i)).toBeInTheDocument();
            expect(screen.getAllByRole("button", { name: "Add" })).toHaveLength(3);
        });

        it("adds user to groups and removes", async () => {
            render(
                <WrapperComponent>
                    <AddGroupsToUser.WrappedComponent {...props} />
                </WrapperComponent>
            );

            expect(screen.getByRole("heading", { level: 2, name: "Add a team for the user to join" })).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/search teams by name/i)).toHaveValue("");
            expect(screen.getByText(/admins/i)).toBeInTheDocument();
            expect(screen.getByText(/user is not a member of a team. Please add them to a team/i)).toBeInTheDocument();

            const addButtons = screen.getAllByRole("button", { name: "Add" });

            expect(addButtons).toHaveLength(3);

            await userEvent.setup().click(addButtons[1]);

            const userGroupsList = screen.getByTestId("UserGroupsList");

            expect(within(userGroupsList).getByLabelText(/person icon/i)).toBeInTheDocument();
            expect(within(userGroupsList).getByText(/my first test group description/i)).toBeInTheDocument();
            expect(screen.queryByText(/user is not a member of a team. Please add them to a team/i)).not.toBeInTheDocument();

            await userEvent.setup().click(addButtons[2]);

            expect(within(userGroupsList).getByLabelText(/tick inside shield icon/i)).toBeInTheDocument();
            expect(within(userGroupsList).getByText(/admins group description/i)).toBeInTheDocument();
            expect(within(screen.getByTestId("form-footer")).getByText(/you have unsaved changes/i)).toBeInTheDocument();

            await userEvent.setup().click(within(userGroupsList).getAllByLabelText("remove")[0]);

            expect(within(userGroupsList).queryByText(/my first test group description/i)).not.toBeInTheDocument();
        });
    });
});
