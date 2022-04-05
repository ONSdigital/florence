import React from "react";
import { render, fireEvent, screen, createMockUser } from "../../utilities/tests/test-utils";
import { InteractivesDeleteController } from "./InteractivesDeleteController";

describe("Collections", () => {
    const defaultProps = {
        getInteractive: jest.fn(),
        deleteInteractive: jest.fn(),
        rootPath: "/florence",
        errors: {},
        params: {
            interactiveId: null,
        },
    };

    describe("when renders the component", () => {
        it("renders the initial content as creating mode", () => {
            render(<InteractivesDeleteController {...defaultProps} />);
            expect(screen.getByTestId("interactive-title")).toBeInTheDocument();
            expect(screen.getByTestId("interactive-date")).toBeInTheDocument();
            expect(screen.getByTestId("interactive-topic")).toBeInTheDocument();
            // // one button to create, one link to scape
            expect(screen.getAllByRole("button")).toHaveLength(2);
        });

        it("should fetch the interactive", async () => {
            defaultProps.params.interactiveId = "2ab8d731-e3ec-4109-a573-55e12951b704";
            render(<InteractivesDeleteController {...defaultProps} />);
            expect(defaultProps.getInteractive).toHaveBeenCalled();
        });

        it("should delete an interactive when clicks the delete interactive button", () => {
            defaultProps.params.interactiveId = "2ab8d731-e3ec-4109-a573-55e12951b704";
            render(<InteractivesDeleteController {...defaultProps} />);
            expect(defaultProps.getInteractive).toHaveBeenCalled();
            const deleteButton = screen.getAllByRole("button")[0];
            fireEvent.click(deleteButton);
            expect(defaultProps.deleteInteractive).toHaveBeenCalled();
        });
    });
});
