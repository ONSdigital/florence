import React from "react";
import mockAxios from "axios";
import { render, fireEvent, screen } from "../../utilities/tests/test-utils";
import { InteractivesForm } from "./InteractivesForm";
import { show } from "../../utilities/api-clients/interactives-test";

describe("Collections", () => {
    const defaultProps = {
        getInteractive: jest.fn(),
        editInteractive: jest.fn(),
        createInteractive: jest.fn(),
        resetInteractiveError: jest.fn(),
        rootPath: "/florence",
        errors: {},
        params: {
            interactiveId: null,
        },
        interactive: {},
        successMessage: {},
    };

    describe("when renders the component", () => {
        it("renders the initial content as creating mode", () => {
            render(<InteractivesForm {...defaultProps} />);
            expect(screen.getByLabelText("Internal ID")).toBeInTheDocument();
            expect(screen.getByLabelText("Title")).toBeInTheDocument();
            expect(screen.getByLabelText("Upload a file")).toBeInTheDocument();
            // one button to create, one link to scape
            expect(screen.getByText("Confirm")).toBeInTheDocument();
        });

        it("renders the initial content as edit/delete mode", () => {
            defaultProps.params.interactiveId = "2ab8d731-e3ec-4109-a573-55e12951b704";
            render(<InteractivesForm {...defaultProps} />);
            expect(screen.getByLabelText("Internal ID")).toBeInTheDocument();
            expect(screen.getByLabelText("Title")).toBeInTheDocument();
            expect(screen.getByLabelText("Upload a file")).toBeInTheDocument();
            expect(screen.getByLabelText("URL")).toBeInTheDocument();
            // Save changes, preview, delete
            expect(screen.getByText("Save changes")).toBeInTheDocument();
            expect(screen.getByText("Preview")).toBeInTheDocument();
            expect(screen.getByText("Delete interactive")).toBeInTheDocument();
        });

        it("should leave in blank the form in create mode", () => {
            render(<InteractivesForm {...defaultProps} />);
            const internalIdInput = screen.getByLabelText("Internal ID");
            const titleInput = screen.getByLabelText("Title");
            const labelInput = screen.getByLabelText("Label");
            const fileInput = screen.getByLabelText("Upload a file");
            expect(internalIdInput.value).toBe("");
            expect(titleInput.value).toBe("");
            expect(labelInput.value).toBe("");
            expect(fileInput).toBeInTheDocument();
        });
    });

    describe("when the component is rendered", () => {
        it("should submit the data when user clicks in create button", () => {
            defaultProps.params.interactiveId = null;
            render(<InteractivesForm {...defaultProps} />);
            const createButton = screen.getByText("Confirm");
            fireEvent.click(createButton);
            expect(defaultProps.createInteractive).toHaveBeenCalled();
        });

        it("should fetch an interactive if detects an interactiveId and fill the form", async () => {
            jest.clearAllMocks();
            defaultProps.params.interactiveId = "2ab8d731-e3ec-4109-a573-55e12951b704";
            const { rerender } = render(<InteractivesForm {...defaultProps} />);
            expect(defaultProps.getInteractive).toHaveBeenCalled();
            mockAxios.get.mockImplementationOnce(() =>
                Promise.resolve({
                    data: {
                        id: defaultProps.params.interactiveId,
                        archive: {
                            name: "test.zip",
                        },
                        metadata: {
                            internal_id: "internal_id",
                            title: "Title",
                            label: "Label",
                            slug: "label",
                        },
                        published: false,
                    },
                })
            );

            defaultProps.interactive = await show(defaultProps.params.interactiveId);

            // render component again with updated props (next props)
            rerender(<InteractivesForm {...defaultProps} />);

            const internalIdInput = screen.getByLabelText("Internal ID");
            const titleInput = screen.getByLabelText("Title");
            const labelInput = screen.getByLabelText("Label");
            const slugInput = screen.getByLabelText("URL");

            expect(internalIdInput.value).toBe("internal_id");
            expect(titleInput.value).toBe("Title");
            expect(labelInput.value).toBe("Label");
            expect(slugInput.value).toBe("label");
        });

        it("should update an interactive when clicks the update interactive button", async () => {
            defaultProps.params.interactiveId = "2ab8d731-e3ec-4109-a573-55e12951b704";
            render(<InteractivesForm {...defaultProps} />);
            expect(defaultProps.getInteractive).toHaveBeenCalled();
            const saveChangesButton = screen.getByText("Save changes");
            fireEvent.click(saveChangesButton);
            expect(defaultProps.editInteractive).toHaveBeenCalled();
        });
    });
});
