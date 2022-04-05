import React from "react";
import { render, fireEvent, screen, createMockUser } from "../../utilities/tests/test-utils";
import { InteractivesController } from "./InteractivesController";
import { shallow } from "enzyme";

describe("Collections", () => {
    const defaultProps = {
        filteredInteractives: [],
        taxonomies: [],
        getInteractives: jest.fn(),
        filterInteractives: jest.fn(),
        rootPath: "/florence",
    };

    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<InteractivesController {...defaultProps} />);
    });

    describe("when renders the component", () => {
        it("renders the initial content", () => {
            render(<InteractivesController {...defaultProps} />);
            // finder
            expect(screen.getByLabelText("Internal ID")).toBeInTheDocument();
            expect(screen.getByLabelText("Title")).toBeInTheDocument();
            // toxonomies
            expect(screen.getByText("Interactive type")).toBeInTheDocument();
            expect(screen.getByTestId("data-input")).toBeInTheDocument();
            expect(screen.getByTestId("publications-input")).toBeInTheDocument();
            // filter action buttons
            expect(screen.getByTestId("apply-button")).toBeInTheDocument();
            expect(screen.getByTestId("reset-all-button")).toBeInTheDocument();
            expect(screen.getByTestId("upload-interactive-button")).toBeInTheDocument();
            // sort selector
            expect(screen.getByLabelText("Sort by")).toBeInTheDocument();
            // List
            expect(screen.getByTestId("interactives-content-list")).toBeInTheDocument();
        });

        it("should fetch data when component is mounted", () => {
            render(<InteractivesController {...defaultProps} />);
            expect(defaultProps.getInteractives).toHaveBeenCalled();
        });

        it("should filter results when clicks apply button", () => {
            render(<InteractivesController {...defaultProps} />);
            const applyButton = screen.getByTestId("apply-button");
            screen.getByTestId("internal-id-input").value = "Query";
            fireEvent.click(applyButton);
            expect(defaultProps.filterInteractives.mock.calls).toHaveLength(1);
        });
    });
});
