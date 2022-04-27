import React from "react";
import mockAxios from "axios";
import { render, fireEvent, screen } from "../../utilities/tests/test-utils";
import InteractivesIndex from "./InteractivesIndex";
import { within } from "@testing-library/react";
import { getAll, get } from "../../utilities/api-clients/interactives-test";
import * as reactRedux from "react-redux";
import userEvent from "@testing-library/user-event";
import * as interactivesMock from "../../actions/interactives";

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

describe("Interactives index", () => {
    const useSelectorMock = jest.spyOn(reactRedux, "useSelector");
    const useDispatchMock = jest.spyOn(reactRedux, "useDispatch");

    const filterInteractivesMock = jest.spyOn(interactivesMock, "filterInteractives").mockImplementation(() => Promise.resolve({ data: "foo1" }));
    const getInteractivesMock = jest.spyOn(interactivesMock, "getInteractives").mockImplementation(() => Promise.resolve({ data: "foo2" }));
    const sortInteractivesMock = jest.spyOn(interactivesMock, "sortInteractives").mockImplementation(() => Promise.resolve({ data: "foo3" }));
    const dispatch = jest.fn();

    const allInteractives = [
        {
            id: "65a93ed2-31a1-4bd5-89dd-9d44b8cda05b",
            archive: {
                name: "test1.zip",
            },
            metadata: {
                title: "A Title 1",
                label: "Label",
                internal_id: "internal_id_1",
                slug: "label-1",
            },
            published: false,
            state: "ArchiveUploaded",
            last_updated: "2022-03-21T13:29:49.901Z",
        },
        {
            id: "65a93ed2-31a1-4bd5-89dd-9d44b8cda05c",
            archive: {
                name: "test2.zip",
            },
            metadata: {
                title: "Z Title 2",
                label: "Label",
                internal_id: "internal_id_2",
                slug: "label-2",
            },
            published: true,
            state: "ArchiveUploaded",
            last_updated: "2022-04-20T13:10:48.107Z",
        },
        {
            id: "65a93ed2-31a1-4bd5-89dd-9d44b8rgu05c",
            archive: {
                name: "test3.zip",
            },
            metadata: {
                title: "T Title 3",
                label: "Label",
                internal_id: "internal_id_3",
                slug: "label-3",
            },
            published: true,
            state: "ArchiveUploaded",
            last_updated: "2022-03-30T13:29:49.901Z",
        },
    ];

    beforeEach(() => {
        useSelectorMock.mockReturnValue(initialState);
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
        it("renders the initial content", () => {
            useDispatchMock.mockReturnValue(getInteractivesMock);
            render(<InteractivesIndex {...defaultProps} />);
            // Filters
            expect(screen.getByLabelText("Internal ID")).toBeInTheDocument();
            expect(screen.getByLabelText("Title")).toBeInTheDocument();
            expect(screen.getByText("Interactive type")).toBeInTheDocument();
            // expect(screen.getByLabelText("Primary topic")).toBeInTheDocument();
            // expect(screen.getByLabelText("Data source")).toBeInTheDocument();
            // filter action buttons
            expect(screen.getByText("Apply")).toBeInTheDocument();
            expect(screen.getByText("Reset all")).toBeInTheDocument();
            // Table
            expect(screen.getByLabelText("Sort by")).toBeInTheDocument();
            expect(screen.getByText("Upload interactive")).toBeInTheDocument();
            expect(screen.getByRole("list")).toBeInTheDocument();
        });

        it("should fetch data when component is mounted and show the interactives in the list component", async () => {
            useDispatchMock.mockReturnValue(getInteractivesMock);
            const { rerender } = render(<InteractivesIndex {...defaultProps} />);
            expect(getInteractivesMock).toHaveBeenCalled();

            const list = screen.getByRole("list");
            const { queryAllByRole } = within(list);
            const oldItems = queryAllByRole("listitem");
            expect(oldItems.length).toBe(0);

            mockAxios.get.mockImplementationOnce(() =>
                Promise.resolve({
                    data: {
                        items: allInteractives,
                        count: 1,
                        offset: 0,
                        limit: 20,
                        total_count: 3,
                    },
                })
            );

            const { items } = await getAll();

            const updatedState = Object.assign({}, initialState, {
                filteredInteractives: items,
            });
            // updating state
            useSelectorMock.mockReturnValue(updatedState);

            rerender(<InteractivesIndex {...defaultProps} />);

            const newItems = queryAllByRole("listitem");
            expect(newItems.length).toBe(3);

            const textContent = newItems.map(item => item.textContent);
            const expectedContentInText = [
                "A Title 1 - 21 March 2022UPLOADED",
                "Z Title 2 - 20 April 2022PUBLISHED",
                "T Title 3 - 30 March 2022PUBLISHED",
            ];
            textContent.forEach(function (content) {
                let exist = expectedContentInText.indexOf(content) > -1;
                expect(exist).toEqual(true);
            });
        });

        it("should filter results when clicks apply button", async () => {
            useDispatchMock.mockReturnValue(dispatch).mockReturnValueOnce(getInteractivesMock).mockReturnValueOnce(filterInteractivesMock);

            const { rerender } = render(<InteractivesIndex {...defaultProps} />);

            expect(getInteractivesMock).toHaveBeenCalled();

            mockAxios.get.mockImplementationOnce(() =>
                Promise.resolve({
                    data: {
                        items: allInteractives,
                        count: 1,
                        offset: 0,
                        limit: 20,
                        total_count: 3,
                    },
                })
            );

            const { items: allItems } = await getAll();
            const list = screen.getByRole("list");
            const { queryAllByRole } = within(list);
            const updatedState = Object.assign({}, initialState, {
                filteredInteractives: allItems,
            });

            useSelectorMock.mockReturnValue(updatedState);

            rerender(<InteractivesIndex {...defaultProps} />);

            const newItems = queryAllByRole("listitem");
            expect(newItems.length).toBe(3);
            userEvent.paste(screen.getByLabelText("Title"), "Label 1");
            expect(screen.getByLabelText("Title")).toHaveValue("Label 1");

            const applyButton = screen.getByText("Apply");
            fireEvent.click(applyButton);

            const filters = {
                label: "Label 1",
            };

            expect(filterInteractivesMock).toHaveBeenCalledTimes(1);
            expect(filterInteractivesMock).toHaveBeenCalledWith(filters);

            mockAxios.get.mockImplementationOnce(() =>
                Promise.resolve({
                    data: {
                        items: [
                            {
                                id: "65a93ed2-31a1-4bd5-89dd-9d44b8cda05b",
                                archive: {
                                    name: "test1.zip",
                                },
                                metadata: {
                                    title: "A Title 1",
                                    label: "A Label 1",
                                    internal_id: "internal_id_1",
                                    slug: "label-1",
                                },
                                published: false,
                                state: "ArchiveUploaded",
                                last_updated: "2022-04-21T13:29:49.901Z",
                            },
                        ],
                        count: 1,
                        offset: 0,
                        limit: 20,
                        total_count: 1,
                    },
                })
            );

            const { items: filteredItems } = await get(filters);
            const updatedFilteredState = Object.assign({}, initialState, {
                filteredInteractives: filteredItems,
            });

            useSelectorMock.mockReturnValue(updatedFilteredState);

            rerender(<InteractivesIndex {...defaultProps} />);

            const newFilteredItems = queryAllByRole("listitem");
            expect(newFilteredItems.length).toBe(1);

            const textContent = newFilteredItems.map(item => item.textContent);
            const expectedContentInText = ["A Title 1 - 21 April 2022UPLOADED"];
            textContent.forEach(function (content) {
                let exist = expectedContentInText.indexOf(content) > -1;
                expect(exist).toEqual(true);
            });
        });

        it("Should sort list if user select a value from sort by", async () => {
            useDispatchMock.mockReturnValue(sortInteractivesMock);

            const { rerender } = render(<InteractivesIndex {...defaultProps} />);

            mockAxios.get.mockImplementationOnce(() =>
                Promise.resolve({
                    data: {
                        items: allInteractives,
                        count: 1,
                        offset: 0,
                        limit: 20,
                        total_count: 3,
                    },
                })
            );

            const { items: filteredInteractives } = await getAll();
            const updatedState = Object.assign({}, initialState, {
                filteredInteractives,
            });

            useSelectorMock.mockReturnValue(updatedState);
            rerender(<InteractivesIndex {...defaultProps} />);

            const items = screen.queryAllByRole("listitem");
            const textContent = items.map(item => item.textContent);
            //default order
            expect(textContent[0]).toEqual("A Title 1 - 21 March 2022UPLOADED");
            expect(textContent[1]).toEqual("Z Title 2 - 20 April 2022PUBLISHED");
            expect(textContent[2]).toEqual("T Title 3 - 30 March 2022PUBLISHED");

            userEvent.selectOptions(screen.getByLabelText("Sort by"), ["date"]);
            expect(screen.getByLabelText("Sort by")).toHaveValue("date");
            expect(sortInteractivesMock).toHaveBeenCalledWith("date");

            const sortedByDate = Object.assign({}, initialState, {
                filteredInteractives: filteredInteractives.sort((a, b) => b.last_updated.localeCompare(a.last_updated)),
            });
            useSelectorMock.mockReturnValue(sortedByDate);
            rerender(<InteractivesIndex {...defaultProps} />);

            const items1 = screen.queryAllByRole("listitem");
            const textContent1 = items1.map(item => item.textContent);
            // Order by date desc
            expect(textContent1[0]).toEqual("Z Title 2 - 20 April 2022PUBLISHED");
            expect(textContent1[1]).toEqual("T Title 3 - 30 March 2022PUBLISHED");
            expect(textContent1[2]).toEqual("A Title 1 - 21 March 2022UPLOADED");

            userEvent.selectOptions(screen.getByLabelText("Sort by"), ["title"]);
            expect(screen.getByLabelText("Sort by")).toHaveValue("title");
            expect(sortInteractivesMock).toHaveBeenCalledWith("title");

            const sortedByTitleInteractives = Object.assign({}, initialState, {
                filteredInteractives: filteredInteractives.sort((a, b) => a.metadata.title.localeCompare(b.metadata.title)),
            });
            useSelectorMock.mockReturnValue(sortedByTitleInteractives);
            rerender(<InteractivesIndex {...defaultProps} />);

            const items2 = screen.queryAllByRole("listitem");
            const textContent2 = items2.map(item => item.textContent);
            // Order by title
            expect(textContent2[0]).toEqual("A Title 1 - 21 March 2022UPLOADED");
            expect(textContent2[1]).toEqual("T Title 3 - 30 March 2022PUBLISHED");
            expect(textContent2[2]).toEqual("Z Title 2 - 20 April 2022PUBLISHED");
        });
    });
});
