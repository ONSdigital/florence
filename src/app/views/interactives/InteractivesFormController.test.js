import React from "react";
import { render, fireEvent, screen, createMockUser } from "../../utilities/tests/test-utils";
import { InteractivesFormController } from "./InteractivesFormController";

describe("Collections", () => {
    const defaultProps = {
        resetSuccessMessage: jest.fn(),
        getInteractive: jest.fn(),
        editInteractive: jest.fn(),
        createInteractive: jest.fn(),
        resetInteractiveError: jest.fn(),
        rootPath: "/florence",
        errors: {},
        params: {
            interactiveId: null,
        },
    };

    describe("when renders the component", () => {
        it("renders the initial content as creating mode", () => {
            render(<InteractivesFormController {...defaultProps} />);
            expect(screen.getByLabelText("Internal ID")).toBeInTheDocument();
            expect(screen.getByLabelText("Title")).toBeInTheDocument();
            expect(screen.getByLabelText("Upload a file")).toBeInTheDocument();
            // one button to create, one link to scape
            expect(screen.getAllByRole("button")).toHaveLength(1);
        });

        it("renders the initial content as edit/delete mode", () => {
            defaultProps.params.interactiveId = "2ab8d731-e3ec-4109-a573-55e12951b704";
            render(<InteractivesFormController {...defaultProps} />);
            expect(screen.getByLabelText("Internal ID")).toBeInTheDocument();
            expect(screen.getByLabelText("Title")).toBeInTheDocument();
            expect(screen.getByLabelText("Upload a file")).toBeInTheDocument();
            expect(screen.getByLabelText("URL")).toBeInTheDocument();
            // Save changes, preview, delete
            expect(screen.getAllByRole("button")).toHaveLength(3);
        });

        it("should submit the data when user clicks in create button", () => {
            defaultProps.params.interactiveId = null;
            render(<InteractivesFormController {...defaultProps} />);
            const createButton = screen.getAllByRole("button")[0];
            fireEvent.click(createButton);
            expect(defaultProps.createInteractive).toHaveBeenCalled();
        });

        it("should leave in blank the form in create mode", () => {
            render(<InteractivesFormController {...defaultProps} />);
            const internalIdInput = screen.getByTestId("internal-id-input");
            const titleInput = screen.getByTestId("title-input");
            const labelInput = screen.getByTestId("label-input");
            const fileInput = screen.getByTestId("file-input");
            expect(internalIdInput.value).toBe("");
            expect(titleInput.value).toBe("");
            expect(labelInput.value).toBe("");
            expect(fileInput).toBeInTheDocument();
        });

        it("should fetch an interactive if detects an interactiveId", async () => {
            defaultProps.params.interactiveId = "2ab8d731-e3ec-4109-a573-55e12951b704";
            render(<InteractivesFormController {...defaultProps} />);
            expect(defaultProps.getInteractive).toHaveBeenCalled();
        });

        it("should update an interactive when clicks the update interactive button", async () => {
            defaultProps.params.interactiveId = "2ab8d731-e3ec-4109-a573-55e12951b704";
            render(<InteractivesFormController {...defaultProps} />);
            expect(defaultProps.getInteractive).toHaveBeenCalled();
            const titleInput = screen.getByTestId("save-changes-button");
            fireEvent.click(titleInput);
            expect(defaultProps.editInteractive).toHaveBeenCalled();
        });
    });
});
