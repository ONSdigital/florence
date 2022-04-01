import React from "react";
import { render, fireEvent, screen, createMockUser } from "../../utilities/tests/test-utils";
import { InteractivesFormController } from "./InteractivesFormController";
import { prettyDOM } from "@testing-library/dom";
import { shallow } from "enzyme";

describe("Collections", () => {
    const defaultProps = {
        resetSuccessMessage: jest.fn(),
        taxonomies: [],
        getTaxonomies: jest.fn(),
        getInteractive: jest.fn(),
        editInteractive: jest.fn(),
        deleteInteractive: jest.fn(),
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
            expect(screen.getByText("Title")).toBeInTheDocument();
            expect(screen.getByText("Interactive file")).toBeInTheDocument();
            expect(screen.getByText("Primary topic")).toBeInTheDocument();
            expect(screen.getByText("Surveys")).toBeInTheDocument();
            expect(screen.getByText("Topics")).toBeInTheDocument();
            expect(screen.getByText("URL")).toBeInTheDocument();
            // one button to create, one link to scape
            expect(screen.getAllByRole("button")).toHaveLength(1);
            expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
        });

        it("renders the initial content as edit/delete mode", () => {
            defaultProps.params.interactiveId = "2ab8d731-e3ec-4109-a573-55e12951b704";
            render(<InteractivesFormController {...defaultProps} />);
            expect(screen.getByTestId("interactive-form")).toBeInTheDocument();
            expect(screen.getByText("Title")).toBeInTheDocument();
            expect(screen.getByText("Interactive file")).toBeInTheDocument();
            expect(screen.getByText("Primary topic")).toBeInTheDocument();
            expect(screen.getByText("Surveys")).toBeInTheDocument();
            expect(screen.getByText("Topics")).toBeInTheDocument();
            // two buttons, edit and delete
            expect(screen.getByText("URL")).toBeInTheDocument();
            expect(screen.getAllByRole("button")).toHaveLength(2);
        });

        it("should fetch taxonomies on render", () => {
            render(<InteractivesFormController {...defaultProps} />);
            expect(defaultProps.getTaxonomies).toHaveBeenCalled();
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
            expect(defaultProps.getTaxonomies).toHaveBeenCalled();
            const titleInput = screen.getByTestId("title-input");
            const urlInput = screen.getByTestId("url-input");
            expect(titleInput.value).toBe("");
            expect(urlInput.value).toBe("");
            expect(titleInput).toBeInTheDocument();
        });

        it("should fetch an interactive if detects an interactiveId", async () => {
            defaultProps.params.interactiveId = "2ab8d731-e3ec-4109-a573-55e12951b704";
            render(<InteractivesFormController {...defaultProps} />);
            expect(defaultProps.getTaxonomies).toHaveBeenCalled();
            expect(defaultProps.getInteractive).toHaveBeenCalled();
        });

        it("should delete an interactive when clicks the delete interactive button", () => {
            defaultProps.params.interactiveId = "2ab8d731-e3ec-4109-a573-55e12951b704";
            render(<InteractivesFormController {...defaultProps} />);
            expect(defaultProps.getTaxonomies).toHaveBeenCalled();
            expect(defaultProps.getInteractive).toHaveBeenCalled();
            const deleteButton = screen.getAllByRole("button")[1];
            fireEvent.click(deleteButton);
            expect(defaultProps.deleteInteractive).toHaveBeenCalled();
        });
    });
});
