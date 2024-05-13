import React from "react";
import renderer from "react-test-renderer";
// import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom/extend-expect";
import { render, screen, createMockUser } from "../../../utilities/tests/test-utils";
import { group, specialGroup } from "../../../utilities/tests/mockData";
import EditGroup from "./EditGroup";

const users = [
    {
        active: true,
        email: "foo@ons.gov.uk",
        forename: "Test",
        groups: [],
        id: "0234",
        lastname: "Foo",
        status: "CONFIRMED",
        status_notes: "",
    },
    {
        active: true,
        email: "test.user@ons.gov.uk",
        forename: "test",
        groups: [],
        id: "1234",
        lastname: "user",
        status: "CONFIRMED",
        status_notes: "",
    },
    {
        active: true,
        email: "john.doe@ons.gov.uk",
        forename: "John",
        groups: [],
        id: "0456",
        lastname: "Doe",
        status: "CONFIRMED",
        status_notes: "",
    },
];

const admin = createMockUser("admin@test.com", true, true, "ADMIN");
const editor = createMockUser("editor@test.com", false, true, "EDITOR");
const props = {
    group: group,
    loading: false,
    params: { id: "0", router: setRouteLeaveHook },
    rootPath: "test",
    router: { setRouteLeaveHook: jest.fn() },
    loadingUsers: false,
    members: [
        {
            active: true,
            email: "test.user-199@ons.gov.uk",
            forename: "test",
            groups: [],
            id: "test-user-199",
            lastname: "user-199",
            status: "CONFIRMED",
            status_notes: "",
        },
    ],
    loadingMembers: false,
    users: users,
    loadGroup: jest.fn(),
    loadingMembers: jest.fn(),
    loadMembers: jest.fn(),
    loadUsers: jest.fn(),
    loggedInUser: admin,
    updateGroup: jest.fn(),
    updateGroupMembers: jest.fn(),
};

const setRouteLeaveHook = jest.fn();
jest.mock("../delete", () => "div"); // faking connected component

describe("EditGroup", () => {
    it("matches the snapshot", () => {
        const tree = renderer.create(<EditGroup.WrappedComponent {...props} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("requests group on load by params", () => {
        render(<EditGroup.WrappedComponent {...props} />);
        expect(props.loadGroup).toHaveBeenCalledWith("0");
    });

    it("shows Back Button", () => {
        render(<EditGroup.WrappedComponent {...props} />);
        expect(screen.getByRole("link", { name: "Back" })).toBeInTheDocument();
    });

    it("shows message if no group has been found", () => {
        render(<EditGroup.WrappedComponent {...props} group={null} />);
        expect(screen.getByText("No group found.")).toBeInTheDocument();
    });

    it("shows loader when fetching group", () => {
        render(<EditGroup.WrappedComponent {...props} group={null} loading={true} />);
        expect(screen.getByTestId("loader")).toBeInTheDocument();
    });

    it("shows group details and name input to edit", () => {
        render(<EditGroup.WrappedComponent {...props} />);
        expect(screen.getByRole("heading", { level: 1, name: "Boo is fine" })).toBeInTheDocument();
        expect(screen.getByLabelText("Name")).toHaveValue("Boo is fine");
        expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        expect(screen.queryByText(/You have unsaved changes/i)).not.toBeInTheDocument();
    });

    describe("when editing normal group name", () => {
        it("validates for emptiness", () => {
            render(<EditGroup.WrappedComponent {...props} />);

            userEvent.clear(screen.getByLabelText(/name/i));

            expect(screen.getByLabelText("Name")).toHaveValue("");

            userEvent.click(screen.getByRole("button", { name: "Save changes" }));

            expect(screen.getByText(/Please enter a name/i)).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
        });

        it("Updates group name and members", () => {
            render(<EditGroup.WrappedComponent {...props} />);

            userEvent.clear(screen.getByLabelText(/name/i));
            userEvent.paste(screen.getByLabelText(/name/i), "Foo");

            expect(screen.getByText(/You have unsaved changes/i)).toBeInTheDocument();
            expect(screen.getByLabelText("Name")).toHaveValue("Foo");

            userEvent.click(screen.getByRole("button", { name: "Save changes" }));

            expect(props.updateGroup).toHaveBeenCalledWith("0", { name: "Foo" });
        });
    });
});

describe("EditGroup without admin permissions", () => {
    const editorProps = {
        ...props,
        loggedInUser: editor,
    };

    it("matches the snapshot", () => {
        const tree = renderer.create(
            <EditGroup.WrappedComponent {...editorProps} params={{ id: "test.user-1498@ons.gov.uk", router: setRouteLeaveHook }} />
        );
        expect(tree.toJSON()).toMatchSnapshot();
    });

    it("shows group details and no admin options", () => {
        render(<EditGroup.WrappedComponent {...editorProps} />);
        expect(screen.getByRole("heading", { level: 1, name: "Boo is fine" })).toBeInTheDocument();
        expect(editorProps.loadMembers).toBeCalled();

        expect(screen.queryByRole("input", { name: /Name/i })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /Save changes/i })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /Cancel/i })).not.toBeInTheDocument();
        expect(screen.queryByText(/You have unsaved changes/i)).not.toBeInTheDocument();
    });
});
