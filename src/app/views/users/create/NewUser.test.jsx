import React from "react";
import { render, screen, within } from "@testing-library/react";
import renderer from "react-test-renderer";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import NewUser from "./NewUser";
import { debug } from "request";

const props = {
    createUser: jest.fn(),
    pushToUsers: jest.fn(),
    loading: false,
    rootPath: "test",
};

describe("NewUser", () => {
    it("matches the snapshot", () => {
        const tree = renderer.create(<NewUser {...props} />);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    it("shows the form with default values", () => {
        render(<NewUser {...props} />);
        expect(screen.getByLabelText(/First name/i)).toHaveValue("");
        expect(screen.getByLabelText(/Last name/i)).toHaveValue("");
        expect(screen.getByLabelText(/Email address/i)).toHaveValue("");
        expect(screen.getByText(/Save changes/i)).toBeInTheDocument();
        expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
        expect(screen.queryByText(/You have unsaved changes/i)).not.toBeInTheDocument();
    });

    it("allows adding fields ans shows unsaved changes message", () => {
        render(<NewUser {...props} />);

        userEvent.paste(screen.getByLabelText(/First name/i), "My test First name");
        expect(screen.getByLabelText(/First name/i)).toHaveValue("My test First name");

        userEvent.paste(screen.getByLabelText(/Last name/i), "My test Last name");
        expect(screen.getByLabelText(/Last name/i)).toHaveValue("My test Last name");

        userEvent.paste(screen.getByLabelText(/Email address/i), "test@test.com");
        expect(screen.getByLabelText(/Email address/i)).toHaveValue("test@test.com");

        expect(screen.getByText(/You have unsaved changes/i)).toBeInTheDocument();
    });

    it("validates form and display errors in panel and within input", () => {
        render(<NewUser {...props} />);

        userEvent.click(screen.getByText(/save changes/i));

        expect(screen.getByText(/Fix the following:/i)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /Please enter a first name/i })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /Please enter a last name/i })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /Please enter an email address/i })).toBeInTheDocument();

        within(screen.getByTestId("forename")).getByText(/Please enter a first name/i);
        within(screen.getByTestId("lastname")).getByText(/Please enter a last name/i);
        within(screen.getByTestId("email")).getByText(/Please enter an email address/i);
    });

    it("shows loader when creating in progress", () => {
        const newProps = {
            ...props,
            loading: true,
        };
        render(<NewUser {...newProps} />);
        expect(screen.getByTestId("loader")).toBeInTheDocument();
    });
});
