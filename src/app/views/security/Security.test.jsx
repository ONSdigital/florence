import React from "react";
import { render, screen } from "@testing-library/react";
import renderer from "react-test-renderer";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import Security from "./Security";

const defaultProps = {
    signOutAllUsers: jest.fn(),
    openModal: jest.fn(),
    closeModal: jest.fn(),
    isLoading: false,
};
const handleSubmit = jest.fn();

describe("Security", () => {
    it("matches the snapshot", () => {
        const tree = renderer.create(<Security {...defaultProps} />);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    it("when loading matches the snapshot", () => {
        const props = { ...defaultProps, isLoading: true };
        const tree = renderer.create(<Security {...props} />);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    it("requests to open Modal", () => {
        render(<Security {...defaultProps} />);

        userEvent.click(screen.getByText(/sign out all users/i));

        expect(defaultProps.openModal).toBeCalledTimes(1);
        expect(defaultProps.openModal).toBeCalledWith(
            expect.objectContaining({
                body: "Users will need to sign in to Florence again and may lose unsaved changes.",
                id: "sign-out",
                title: "Are you sure you want to sign out all users?",
            })
        );
    });
});
