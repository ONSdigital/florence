import React from "react";
import mockAxios from "axios";
import { render, fireEvent, screen } from "../../utilities/tests/test-utils";
import { InteractivesDelete } from "./InteractivesDelete";
import {show} from "../../utilities/api-clients/interactives-test";

describe("Collections", () => {
    const defaultProps = {
        getInteractive: jest.fn(),
        deleteInteractive: jest.fn(),
        resetInteractiveError: jest.fn(),
        rootPath: "/florence",
        errors: {},
        params: {
            interactiveId: null,
        },
        successMessage: {}
    };

    describe("when renders the component", () => {
        it("renders the initial content as creating mode", () => {
            render(<InteractivesDelete {...defaultProps} />);
            expect(screen.getByText(/Name/i)).toBeInTheDocument();
            expect(screen.getByText(/Published date/i)).toBeInTheDocument();
            expect(screen.getByText(/Topic/i)).toBeInTheDocument();
            // // one button to create, one link to scape
            expect(screen.getByText("Continue")).toBeInTheDocument();
            expect(screen.getByText("Cancel")).toBeInTheDocument();
        });

        it("should fetch the interactive", async () => {
            jest.clearAllMocks();
            defaultProps.params.interactiveId = "2ab8d731-e3ec-4109-a573-55e12951b704";
            const {rerender} = render(<InteractivesDelete {...defaultProps} />);
            expect(defaultProps.getInteractive).toHaveBeenCalled();
            mockAxios.get.mockImplementationOnce(() =>
                Promise.resolve({
                    data: {
                        id: defaultProps.params.interactiveId,
                        archive: {
                            name: "test.zip",
                        },
                        metadata: {
                            internal_id: 'internal_id',
                            title: "Title",
                            label: "Label",
                            slug: "label",
                        },
                        published: false,
                    },
                })
            );

            defaultProps.interactive = await show(defaultProps.params.interactiveId);

            rerender(<InteractivesDelete {...defaultProps} />)

            // Testing text inside, excluding HTML tags
            expect(screen.getByText(/Name/i)).toHaveTextContent(`Name - Title`)
        });

        it("should delete an interactive when clicks the delete interactive button", () => {
            defaultProps.params.interactiveId = "2ab8d731-e3ec-4109-a573-55e12951b704";
            render(<InteractivesDelete {...defaultProps} />);
            expect(defaultProps.getInteractive).toHaveBeenCalled();
            const deleteButton = screen.getByText("Continue");
            fireEvent.click(deleteButton);
            expect(defaultProps.deleteInteractive).toHaveBeenCalled();
        });
    });
});
