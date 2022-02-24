import React from "react";
import { render, screen, within } from "@testing-library/react";
import renderer from "react-test-renderer";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import EditUser from "./EditUser";

const user = {
    active: true,
    email: "test.user-1498@ons.gov.uk",
    forename: "test",
    groups: [],
    id: "test.user-1498@ons.gov.uk",
    lastname: "user-1498",
    status: "CONFIRMED",
    status_notes: "This user is active",
};

const props = {
    loading: false,
    params: { userID: "test.user-1498@ons.gov.uk" },
    rootPath: "test",
    user: user,
    userGroups: [],
    updateUser: jest.fn(),
    loadUser: jest.fn(),
    loadUserGroups: jest.fn(),
};

describe("EditUser", () => {
    it("matches the snapshot", () => {
        const tree = renderer.create(<EditUser {...props} />);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    it("fetches user details on load", () => {
        render(<EditUser {...props} />);
        expect(props.loadUser).toBeCalledWith("test.user-1498@ons.gov.uk");
        expect(props.loadUserGroups).toBeCalled();
    });

    it("shows the form with user data", () => {
        render(<EditUser {...props} />);

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
        render(<EditUser {...props} />);

        userEvent.clear(screen.getByLabelText(/First name/i));
        userEvent.paste(screen.getByLabelText(/First name/i), "My test First name");

        expect(screen.getByLabelText(/First name/i)).toHaveValue("My test First name");
        expect(screen.getByText(/You have unsaved changes/i)).toBeInTheDocument();
    });

    it("validates form and display errors in panel and within input and disables the submit button", () => {
        render(<EditUser {...props} />);

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
        render(<EditUser {...newProps} />);
        expect(screen.getByTestId("loader")).toBeInTheDocument();
    });

    it("updates user data", async () => {
        render(<EditUser {...props} />);

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
});
