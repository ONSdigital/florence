import React from "react";
import mockAxios from "axios";
import * as reactRedux from "react-redux";
import { render, fireEvent, screen } from "../../utilities/tests/test-utils";
import InteractivesForm from "./InteractivesForm";
import { show } from "../../utilities/api-clients/interactives-test";
import * as interactivesActions from "../../actions/interactives";
import collections from "../../utilities/api-clients/collections";

const initialState = {
    interactives: [],
    interactive: {},
    filteredInteractives: [],
    errors: {},
    successMessage: {
        type: null,
        success: false,
    },
};

describe("Create/Edit an Interactives", () => {
    const useSelectorMock = jest.spyOn(reactRedux, "useSelector");
    const useDispatchMock = jest.spyOn(reactRedux, "useDispatch");

    const createInteractive = jest.fn();
    const editInteractive = jest.spyOn(interactivesActions, "editInteractive");
    const getInteractive = jest.spyOn(interactivesActions, "getInteractive");
    const resetInteractiveError = jest.fn();

    const setInteractiveStatusToComplete = jest.spyOn(collections, "setInteractiveStatusToComplete");
    const setInteractiveStatusToReviewed = jest.spyOn(collections, "setInteractiveStatusToReviewed");

    beforeEach(() => {
        const dispatch = jest.fn();
        useDispatchMock.mockReturnValue(dispatch);

        useSelectorMock.mockReturnValue(initialState);

        useSelectorMock.mockClear();
        useDispatchMock.mockClear();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const defaultProps = {
        params: {
            interactiveId: null,
        },
    };

    describe("when renders the component", () => {
        it("renders the initial content as creating mode", async () => {
            useDispatchMock.mockReturnValue(resetInteractiveError);
            render(<InteractivesForm {...defaultProps} />);
            expect(resetInteractiveError).toHaveBeenCalled();
            expect(screen.getByLabelText("Internal ID")).toBeInTheDocument();
            expect(screen.getByLabelText("Title")).toBeInTheDocument();
            expect(screen.getByLabelText("Upload a file")).toBeInTheDocument();
            // one button to create, one link to scape
            expect(screen.getByText("Confirm")).toBeInTheDocument();
        });

        it("renders the initial content as edit/delete mode", () => {
            defaultProps.params.interactiveId = "2ab8d731-e3ec-4109-a573-55e12951b704";
            // Clear errors
            useDispatchMock.mockReturnValue(resetInteractiveError);
            render(<InteractivesForm {...defaultProps} />);
            expect(resetInteractiveError).toHaveBeenCalled();
            expect(screen.getByLabelText("Internal ID")).toBeInTheDocument();
            expect(screen.getByLabelText("Title")).toBeInTheDocument();
            expect(screen.getByLabelText("Upload a file")).toBeInTheDocument();
            expect(screen.getByLabelText("URL")).toBeInTheDocument();
            // Save changes, preview, delete
            expect(screen.getByText("Save and submit for approval")).toBeInTheDocument();
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
            useDispatchMock.mockReturnValue(createInteractive);
            defaultProps.params.interactiveId = null;
            render(<InteractivesForm {...defaultProps} />);
            const createButton = screen.getByText("Confirm");
            fireEvent.click(createButton);
            expect(createInteractive).toHaveBeenCalled();
        });

        it("should fetch an interactive if detects an interactiveId and fill the form", async () => {
            useDispatchMock.mockReturnValue(getInteractive);
            defaultProps.params.interactiveId = "2ab8d731-e3ec-4109-a573-55e12951b704";

            const baseUrl = window.location.origin;
            const resourceType = "interactives";

            const { rerender } = render(<InteractivesForm {...defaultProps} />);
            expect(getInteractive).toHaveBeenCalled();
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
                            slug: "test-slug",
                            resource_id: "resource_id",
                        },
                        published: false,
                    },
                })
            );

            const interactive = await show(defaultProps.params.interactiveId);

            const updatedState = Object.assign({}, initialState, {
                interactive,
            });

            // updating state
            useSelectorMock.mockReturnValue(updatedState);
            // render component again with updated props (next props)
            rerender(<InteractivesForm {...defaultProps} />);

            const internalIdInput = screen.getByLabelText("Internal ID");
            const titleInput = screen.getByLabelText("Title");
            const labelInput = screen.getByLabelText("Label");
            const urlInput = screen.getByLabelText("URL");

            expect(internalIdInput.value).toBe("internal_id");
            expect(titleInput.value).toBe("Title");
            expect(labelInput.value).toBe("Label");
            expect(urlInput.value).toBe(`${baseUrl}/${resourceType}/${interactive.metadata.slug}-${interactive.metadata.resource_id}/embed`);
        });

        it("User can review the interactive and move to REVIEW status if there is not any change", async () => {
            useDispatchMock.mockReturnValue(getInteractive);
            setInteractiveStatusToComplete.mockImplementation(() => {
                return Promise.resolve({ data: "" });
            });
            defaultProps.params.interactiveId = "2ab8d731-e3ec-4109-a573-55e12951b704";

            const { rerender } = render(<InteractivesForm {...defaultProps} />);
            expect(getInteractive).toHaveBeenCalled();
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
                            slug: "test-slug",
                            resource_id: "resource_id",
                        },
                        published: false,
                    },
                })
            );

            const interactive = await show(defaultProps.params.interactiveId);

            const updatedState = Object.assign({}, initialState, {
                interactive,
            });

            useSelectorMock.mockReturnValue(updatedState);
            rerender(<InteractivesForm {...defaultProps} />);

            const saveChangesButton = screen.getByText("Save and submit for approval");
            expect(saveChangesButton).toBeInTheDocument();
            fireEvent.click(saveChangesButton);
            await expect(setInteractiveStatusToReviewed).toHaveBeenCalled();
        });

        it("User can update an interactive when edits any field and clicks the SAVE CHANGES button", async () => {
            getInteractive.mockImplementationOnce(() =>
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
                            slug: "test-slug",
                            resource_id: "resource_id",
                        },
                        published: false,
                    },
                })
            );

            useDispatchMock.mockReturnValue(getInteractive);
            defaultProps.params.interactiveId = "2ab8d731-e3ec-4109-a573-55e12951b704";

            const { rerender } = render(<InteractivesForm {...defaultProps} />);
            expect(getInteractive).toHaveBeenCalled();
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
                            slug: "test-slug",
                            resource_id: "resource_id",
                        },
                        published: false,
                    },
                })
            );

            const interactive = await show(defaultProps.params.interactiveId);

            const updatedState = Object.assign({}, initialState, {
                interactive,
            });

            useSelectorMock.mockReturnValue(updatedState);
            rerender(<InteractivesForm {...defaultProps} />);

            const internalIdInput = screen.getByLabelText("Internal ID");
            expect(internalIdInput.value).toBe("internal_id");

            fireEvent.change(internalIdInput, {
                target: { value: "new value" },
            });

            // input has changed, so SAVE CHANGES button appears instead
            expect(internalIdInput).toHaveValue("new value");

            const saveChangesButton = screen.getByText("Save changes");
            expect(saveChangesButton).toBeInTheDocument();
            fireEvent.click(saveChangesButton);
            expect(editInteractive).toHaveBeenCalled();
        });
    });
});
