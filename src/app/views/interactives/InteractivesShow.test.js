import React from "react";
import mockAxios from "axios";
import { render, screen } from "../../utilities/tests/test-utils";
import InteractivesShow from "./InteractivesShow";
import { show } from "../../utilities/api-clients/interactives-test";
import * as reactRedux from "react-redux";

const initialState = {
    interactives: [],
    interactive: {},
    filteredInteractives: [],
    errors: {
        msg: {},
    },
    successMessage: {
        type: null,
        success: false,
    },
};

describe("Delete an interactive", () => {
    const useSelectorMock = jest.spyOn(reactRedux, "useSelector");
    const useDispatchMock = jest.spyOn(reactRedux, "useDispatch");

    const getInteractive = jest.fn();

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
        it("should display the right content it the view", async () => {
            defaultProps.params.interactiveId = "2ab8d731-e3ec-4109-a573-55e12951b704";
            useDispatchMock.mockReturnValue(getInteractive);
            const { rerender } = render(<InteractivesShow {...defaultProps} />);
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
                        last_updated: "2022-04-27T03:56:48.57Z",
                        url: "https://interactives.co.uk/embed",
                    },
                })
            );

            const interactive = await show(defaultProps.params.interactiveId);

            const updatedState = Object.assign({}, initialState, {
                interactive,
            });

            // updating state
            useSelectorMock.mockReturnValue(updatedState);
            rerender(<InteractivesShow {...defaultProps} />);
            //Title
            expect(screen.getByText(/Your interactive has been uploaded/i)).toBeInTheDocument();
            //Iframe
            const iframe = screen.getByTitle("Embed website");
            expect(iframe).toBeInTheDocument;
            expect(iframe).toHaveAttribute("src", "https://interactives.co.uk/embed");
            //Text and link
            expect(screen.getByText(/Embedded preview of uploaded interactive -/i)).toBeInTheDocument();
            expect(screen.getByText("https://interactives.co.uk/embed")).toBeInTheDocument;
        });
    });
});
