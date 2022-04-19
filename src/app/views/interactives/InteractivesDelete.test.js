import React from "react";
import mockAxios from "axios";
import { render, fireEvent, screen } from "../../utilities/tests/test-utils";
import InteractivesDelete from "./InteractivesDelete";
import { show } from "../../utilities/api-clients/interactives-test";
import * as reactRedux from "react-redux";

const initialState = {
    interactives: [],
    interactive: {},
    filteredInteractives: [],
    errors: {
        msg: {}
    },
    successMessage: {
        type: null,
        success: false,
    },
};

describe("Delete an interactive", () => {
    const useSelectorMock = jest.spyOn(reactRedux, "useSelector")
    const useDispatchMock = jest.spyOn(reactRedux, "useDispatch")

    const deleteInteractive = jest.fn();
    const getInteractive = jest.fn();

    beforeEach(() => {
        const dispatch = jest.fn();
        useDispatchMock.mockReturnValue(dispatch);

        useSelectorMock.mockReturnValue(initialState);

        useSelectorMock.mockClear()
        useDispatchMock.mockClear()
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    const defaultProps = {
        params: {
            interactiveId: null,
        },
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
            defaultProps.params.interactiveId = "2ab8d731-e3ec-4109-a573-55e12951b704";
            useDispatchMock.mockReturnValue(getInteractive)
            const { rerender } = render(<InteractivesDelete {...defaultProps} />);
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
                            slug: "label",
                        },
                        published: false,
                    },
                })
            );

            const interactive = await show(defaultProps.params.interactiveId);

            const updatedState = Object.assign({}, initialState, {
                interactive
            })

            // updating state
            useSelectorMock.mockReturnValue(updatedState);
            rerender(<InteractivesDelete {...defaultProps} />);

            // Testing text inside, excluding HTML tags
            expect(screen.getByText(/Name/i)).toHaveTextContent(`Name - Title`);
        });

        it("should delete an interactive when clicks the delete interactive button", () => {
            useDispatchMock.mockReturnValue(deleteInteractive);
            defaultProps.params.interactiveId = "2ab8d731-e3ec-4109-a573-55e12951b704";
            render(<InteractivesDelete {...defaultProps} />);
            const deleteButton = screen.getByText("Continue");
            fireEvent.click(deleteButton);
            expect(deleteInteractive).toHaveBeenCalled();
        });
    });
});
