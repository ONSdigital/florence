import React from "react";
import { render, fireEvent, screen, createMockUser } from "../../utilities/tests/test-utils";
import { InteractivesController } from "./InteractivesController";
import { prettyDOM } from "@testing-library/dom";
import {shallow} from "enzyme";

describe("Collections", () => {
    const defaultProps = {
        filteredInteractives: [],
        taxonomies: [],
        getTaxonomies: jest.fn(),
        getInteractives: jest.fn(),
        filterInteractives: jest.fn(),
        rootPath: '/florence',
    };

    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<InteractivesController {...defaultProps} />);
    });

    describe("when renders the component", () => {

        it("renders the initial content", () => {
            render(<InteractivesController {...defaultProps}/>);
            // finder
            expect(screen.getByLabelText("Title")).toBeInTheDocument();
            expect(screen.getByPlaceholderText("Search by title")).toBeInTheDocument();
            // toxonomies
            expect(screen.getByText("Primary topic")).toBeInTheDocument();
            expect(screen.getByTestId("selectable-box")).toBeInTheDocument();
            // filter action buttons
            expect(screen.getAllByRole("button")).toHaveLength(2);
            // sort selector
            expect(screen.getByLabelText("Sort by")).toBeInTheDocument();
            // table
            expect(screen.getByRole("table")).toBeInTheDocument();
        });

        it("should fetch data when component is mounted", () => {
            render(<InteractivesController {...defaultProps}/>);
            expect(defaultProps.getTaxonomies).toHaveBeenCalled()
            expect(defaultProps.getInteractives).toHaveBeenCalled()
        });

        it("should filter results when clicks apply button", () => {
            render(<InteractivesController {...defaultProps}/>);
            const applyButton = screen.getAllByRole("button")[0]
            screen.getByPlaceholderText("Search by title").value = 'Query'
            fireEvent.click(applyButton)
            expect(defaultProps.filterInteractives.mock.calls).toHaveLength(1)
        });

        it("Should redirect to create an interactive page when clicks upload interactive page", async () => {
            render(<InteractivesController {...defaultProps}/>);
            const applyButton = screen.getAllByRole("button")[1]
            fireEvent.click(applyButton)
        })
    });
});
