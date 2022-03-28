import React from "react";
import { render, screen } from "@testing-library/react";
import renderer from "react-test-renderer";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import Delete from "./Delete";

const defaultProps = {
    id: "0",
    deleteGroup: jest.fn(),
    openModal: jest.fn(),
    closeModal: jest.fn(),
    loading: false,
};
const handleSubmit = jest.fn();

describe("Delete", () => {
    it("matches the snapshot", () => {
        const tree = renderer.create(<Delete {...defaultProps} />);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    it("when deleting is in progress matches the snapshot", () => {
        const props = { ...defaultProps, isLoading: true };
        const tree = renderer.create(<Delete {...props} />);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    it("requests to open Modal", () => {
        render(<Delete {...defaultProps} />);

        userEvent.click(screen.getByRole("button", { name: "Delete team" }));

        expect(defaultProps.openModal).toBeCalledWith(
            expect.objectContaining({
                body: "Team members cannot view content linked to this preview team after it has been deleted.",
                id: "delete",
                title: "Are you sure you want to delete this preview team?",
            })
        );
    });
});
