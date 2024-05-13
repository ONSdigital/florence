import React from "react";
import { render, screen, within } from "@testing-library/react";
import renderer from "react-test-renderer";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import EditUser from "./EditUser";
import { groups, user } from "../../../utilities/tests/mockData";
import { createMockUser } from "../../../utilities/tests/test-utils";

const admin = createMockUser("admin@test.com", true, true, "ADMIN");
const editor = createMockUser("editor@test.com", false, true, "EDITOR");

const props = {
    loading: false,
    params: { id: "test.user-1498@ons.gov.uk" },
    rootPath: "test",
    user: user,
    userGroups: [],
    updateUser: jest.fn(),
    loadUser: jest.fn(),
    loadUserGroups: jest.fn(),
    router: { setRouteLeaveHook: jest.fn() },
    loggedInUser: admin,
};
const setRouteLeaveHook = jest.fn();

describe("EditUser", () => {
    it("matches the snapshot", () => {
        const tree = renderer.create(
            <EditUser.WrappedComponent {...props} params={{ id: "test.user-1498@ons.gov.uk", router: setRouteLeaveHook }} />
        );
        expect(tree.toJSON()).toMatchSnapshot();
    });

    it("fetches user details on load", () => {
        render(<EditUser.WrappedComponent {...props} params={{ id: "test.user-1498@ons.gov.uk", router: setRouteLeaveHook }} />);
        expect(props.loadUser).toBeCalledWith("test.user-1498@ons.gov.uk");
        expect(props.loadUserGroups).toBeCalled();
    });

    it("shows the form with user data", () => {
        render(<EditUser.WrappedComponent {...props} params={{ id: "test.user-1498@ons.gov.uk", router: setRouteLeaveHook }} />);

        expect(screen.getByRole("link", { name: "Back" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("test user-1498");
        expect(screen.getByText("test.user-1498@ons.gov.uk")).toBeInTheDocument();

        expect(screen.getByLabelText(/First name/i)).toHaveValue("test");
        expect(screen.getByLabelText(/Last name/i)).toHaveValue("user-1498");

        expect(screen.getByRole("group", { name: /User Access/i })).toBeInTheDocument();
        expect(screen.getByRole("radio", { name: /Active/i })).toBeChecked();
        expect(screen.getByRole("radio", { name: /Suspended/i })).not.toBeChecked();
        expect(screen.getByLabelText(/Notes/i)).toHaveValue("This user is active");

        expect(screen.getByRole("button", { name: /Save changes/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
        expect(screen.queryByText(/You have unsaved changes/i)).not.toBeInTheDocument();
    });

    it("allows editing and shows unsaved changes message", () => {
        render(<EditUser.WrappedComponent {...props} params={{ id: "test.user-1498@ons.gov.uk", router: setRouteLeaveHook }} />);

        userEvent.clear(screen.getByLabelText(/First name/i));
        userEvent.paste(screen.getByLabelText(/First name/i), "My test First name");

        expect(screen.getByLabelText(/First name/i)).toHaveValue("My test First name");
        expect(screen.getByText(/You have unsaved changes/i)).toBeInTheDocument();
    });

    it("validates form and display errors in panel and within input and disables the submit button", () => {
        render(<EditUser.WrappedComponent {...props} params={{ id: "test.user-1498@ons.gov.uk", router: setRouteLeaveHook }} />);

        expect(screen.getByLabelText(/First name/i)).toHaveValue("test");
        expect(screen.getByLabelText(/Last name/i)).toHaveValue("user-1498");

        userEvent.clear(screen.getByLabelText(/First name/i));
        userEvent.clear(screen.getByLabelText(/Last name/i));

        expect(screen.getByLabelText(/First name/i)).toHaveValue("");
        expect(screen.getByLabelText(/Last name/i)).toHaveValue("");

        userEvent.click(screen.getByText(/save changes/i));

        expect(screen.getByText(/Fix the following:/i)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /Please enter a first name/i })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /Please enter a last name/i })).toBeInTheDocument();

        within(screen.getByTestId("forename")).getByText(/Please enter a first name/i);
        within(screen.getByTestId("lastname")).getByText(/Please enter a last name/i);

        expect(screen.getByRole("button", { name: /save changes/i })).toBeDisabled();
    });

    it("shows loader when fetching user data", () => {
        const newProps = {
            ...props,
            loading: true,
        };
        render(<EditUser.WrappedComponent {...newProps} params={{ id: "test.user-1498@ons.gov.uk", router: setRouteLeaveHook }} />);
        expect(screen.getByTestId("loader")).toBeInTheDocument();
    });

    it("updates user data", async () => {
        render(<EditUser.WrappedComponent {...props} params={{ id: "test.user-1498@ons.gov.uk", router: setRouteLeaveHook }} />);

        userEvent.paste(screen.getByLabelText(/First name/i), "boo");

        expect(screen.getByLabelText(/First name/i)).toHaveValue("testboo");
        expect(screen.getByText(/You have unsaved changes/i)).toBeInTheDocument();

        await userEvent.click(screen.getByText(/save changes/i));

        expect(props.updateUser).toBeCalledWith("test.user-1498@ons.gov.uk", {
            active: true,
            email: "test.user-1498@ons.gov.uk",
            forename: "testboo",
            groups: [],
            id: "test.user-1498@ons.gov.uk",
            lastname: "user-1498",
            status: "CONFIRMED",
            status_notes: "This user is active",
        });
    });
    it("shows groups user belongs to", () => {
        const newProps = {
            ...props,
            userGroups: groups,
        };

        render(<EditUser.WrappedComponent {...newProps} params={{ id: "test.user-1498@ons.gov.uk", router: setRouteLeaveHook }} />);

        expect(screen.getByText(/my test group description/i)).toBeInTheDocument();
        expect(screen.getByText(/my first test group description/i)).toBeInTheDocument();
        expect(screen.getByText(/admins group description/i)).toBeInTheDocument();
    });
});

describe("EditUser without admin permissions", () => {
    const editorProps = {
        ...props,
        loggedInUser: editor,
    };

    it("matches the snapshot", () => {
        const tree = renderer.create(
            <EditUser.WrappedComponent {...editorProps} params={{ id: "test.user-1498@ons.gov.uk", router: setRouteLeaveHook }} />
        );
        expect(tree.toJSON()).toMatchSnapshot();
    });

    it("fetches user details on load", () => {
        render(<EditUser.WrappedComponent {...editorProps} params={{ id: "test.user-1498@ons.gov.uk", router: setRouteLeaveHook }} />);
        expect(editorProps.loadUser).toBeCalledWith("test.user-1498@ons.gov.uk");
        expect(editorProps.loadUserGroups).toBeCalled();
    });

    it("shows the form with user data and no admin fields", () => {
        render(<EditUser.WrappedComponent {...editorProps} params={{ id: "test.user-1498@ons.gov.uk", router: setRouteLeaveHook }} />);

        expect(screen.getByRole("link", { name: "Back" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("test user-1498");
        expect(screen.getByText("test.user-1498@ons.gov.uk")).toBeInTheDocument();

        expect(screen.queryByLabelText(/First name/i)).not.toBeInTheDocument();
        expect(screen.queryByLabelText(/Last name/i)).not.toBeInTheDocument();

        expect(screen.queryByRole("group", { name: /User Access/i })).not.toBeInTheDocument();
        expect(screen.queryByRole("radio", { name: /Active/i })).not.toBeInTheDocument();
        expect(screen.queryByRole("radio", { name: /Suspended/i })).not.toBeInTheDocument();
        expect(screen.queryByLabelText(/Notes/i)).not.toBeInTheDocument();

        expect(screen.queryByRole("button", { name: /Save changes/i })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /Cancel/i })).not.toBeInTheDocument();
        expect(screen.queryByText(/You have unsaved changes/i)).not.toBeInTheDocument();
    });
    it("shows loader when fetching user data", () => {
        const newProps = {
            ...editorProps,
            loading: true,
        };
        render(<EditUser.WrappedComponent {...newProps} params={{ id: "test.user-1498@ons.gov.uk", router: setRouteLeaveHook }} />);
        expect(screen.getByTestId("loader")).toBeInTheDocument();
    });
    it("shows groups user belongs to", () => {
        const newProps = {
            ...editorProps,
            userGroups: groups,
        };

        render(<EditUser.WrappedComponent {...newProps} params={{ id: "test.user-1498@ons.gov.uk", router: setRouteLeaveHook }} />);

        expect(screen.getByText(/my test group description/i)).toBeInTheDocument();
        expect(screen.getByText(/my first test group description/i)).toBeInTheDocument();
        expect(screen.getByText(/admins group description/i)).toBeInTheDocument();
    });
});
