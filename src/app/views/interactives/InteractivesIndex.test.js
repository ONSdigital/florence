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
            published: false,
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
            published: false,
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

            const interactivesForStatus = [
                {
                    // not published, ArchiveUploaded = "Uploading"
                    id: "65a93ed2-31a1-4bd5-89dd-9d44b8cda05b",
                    archive: {
                        name: "test1.zip",
                    },
                    metadata: {
                        title: "Title 1",
                        label: "Label",
                        internal_id: "internal_id_1",
                        slug: "label-1",
                    },
                    published: false,
                    state: "ArchiveUploaded",
                    last_updated: "2022-03-21T13:29:49.901Z",
                },
                {
                    // not published, ArchiveDispatchedToImporter = "Uploading"
                    id: "65a93ed2-31a1-4gd5-89dd-9d44b2cda05b",
                    archive: {
                        name: "test2.zip",
                    },
                    metadata: {
                        title: "Title 2",
                        label: "Label 2",
                        internal_id: "internal_id_2",
                        slug: "label-2",
                    },
                    published: false,
                    state: "ArchiveDispatchedToImporter",
                    last_updated: "2022-03-21T13:29:49.901Z",
                },
                {
                    // not published, ImportSuccess = "Uploaded"
                    id: "65a93ed2-31a1-4bd5-89dd-9d44b8cda05c",
                    archive: {
                        name: "test3.zip",
                    },
                    metadata: {
                        title: "Title 3",
                        label: "Label 3",
                        internal_id: "internal_id_3",
                        slug: "label-3",
                    },
                    published: false,
                    state: "ImportSuccess",
                    last_updated: "2022-04-20T13:10:48.107Z",
                },
                {
                    // not published, ArchiveDispatchFailed = "Error"
                    id: "65a93ed2-31a1-4bd5-89dd-9d44b8cda05c",
                    archive: {
                        name: "test4.zip",
                    },
                    metadata: {
                        title: "Title 4",
                        label: "Label 4",
                        internal_id: "internal_id_4",
                        slug: "label-4",
                    },
                    published: false,
                    state: "ArchiveDispatchFailed",
                    last_updated: "2022-04-20T13:10:48.107Z",
                },
                {
                    // not published, ImportFailure = "Error"
                    id: "65a93ed2-31a1-4bd5-89dd-9d44b8rgu05c",
                    archive: {
                        name: "test5.zip",
                    },
                    metadata: {
                        title: "Title 5",
                        label: "Label 5",
                        internal_id: "internal_id_5",
                        slug: "label-5",
                    },
                    published: false,
                    state: "ImportFailure",
                    last_updated: "2022-03-30T13:29:49.901Z",
                },

                {
                    // published, ArchiveUploaded = "Published + Uploading"
                    id: "65a93ed2-31a1-4bd5-89dd-9d44b8cda05b",
                    archive: {
                        name: "test6.zip",
                    },
                    metadata: {
                        title: "Title 6",
                        label: "Label 6",
                        internal_id: "internal_id_6",
                        slug: "label-6",
                    },
                    published: true,
                    state: "ArchiveUploaded",
                    last_updated: "2022-03-21T13:29:49.901Z",
                },
                {
                    // published, ArchiveDispatchedToImporter = "Published + Uploading"
                    id: "65a93ed2-31a1-4gd5-89dd-9d44b2cda05b",
                    archive: {
                        name: "test7.zip",
                    },
                    metadata: {
                        title: "Title 7",
                        label: "Label 7",
                        internal_id: "internal_id_7",
                        slug: "label-7",
                    },
                    published: true,
                    state: "ArchiveDispatchedToImporter",
                    last_updated: "2022-03-21T13:29:49.901Z",
                },
                {
                    // published, ImportSuccess = "Published + Uploaded"
                    id: "65a93ed2-31a1-4bd5-89dd-9d44b8cda05c",
                    archive: {
                        name: "test8.zip",
                    },
                    metadata: {
                        title: "Title 8",
                        label: "Label 8",
                        internal_id: "internal_id_8",
                        slug: "label-8",
                    },
                    published: true,
                    state: "ImportSuccess",
                    last_updated: "2022-04-20T13:10:48.107Z",
                },
                {
                    // published, ArchiveDispatchFailed = "Published + Error"
                    id: "65a93ed2-31a1-4bd5-89dd-9d44b8cda05c",
                    archive: {
                        name: "test9.zip",
                    },
                    metadata: {
                        title: "Title 9",
                        label: "Label 9",
                        internal_id: "internal_id_9",
                        slug: "label-9",
                    },
                    published: true,
                    state: "ArchiveDispatchFailed",
                    last_updated: "2022-04-20T13:10:48.107Z",
                },
                {
                    // published, ImportFailure = "Published + Error"
                    id: "65a93ed2-31a1-4bd5-89dd-9d44b8rgu05c",
                    archive: {
                        name: "test10.zip",
                    },
                    metadata: {
                        title: "Title 10",
                        label: "Label 10",
                        internal_id: "internal_id_10",
                        slug: "label-10",
                    },
                    published: true,
                    state: "ImportFailure",
                    last_updated: "2022-03-30T13:29:49.901Z",
                },

                {
                    // metadata contains collection_id, ArchiveUploaded = "Linked to collection + Uploading"
                    id: "65a93ed2-31a1-4bd5-89dd-9d44b8cda05b",
                    archive: {
                        name: "test11.zip",
                    },
                    metadata: {
                        title: "Title 11",
                        label: "Label",
                        internal_id: "internal_id_11",
                        collection_id: "internal_id_11",
                        slug: "label-11",
                    },
                    published: false,
                    state: "ArchiveUploaded",
                    last_updated: "2022-03-21T13:29:49.901Z",
                },
                {
                    // metadata contains collection_id, ArchiveDispatchedToImporter = "Linked to collection + Uploading"
                    id: "65a93ed2-31a1-4gd5-89dd-9d44b2cda05b",
                    archive: {
                        name: "test12.zip",
                    },
                    metadata: {
                        title: "Title 12",
                        label: "Label",
                        internal_id: "internal_id_12",
                        collection_id: "internal_id_12",
                        slug: "label-12",
                    },
                    published: false,
                    state: "ArchiveDispatchedToImporter",
                    last_updated: "2022-03-21T13:29:49.901Z",
                },
                {
                    // metadata contains collection_id, ImportSuccess = "Linked to collection + Uploaded"
                    id: "65a93ed2-31a1-4bd5-89dd-9d44b8cda05c",
                    archive: {
                        name: "test13.zip",
                    },
                    metadata: {
                        title: "Title 13",
                        label: "Label 13",
                        internal_id: "internal_id_13",
                        collection_id: "internal_id_13",
                        slug: "label-13",
                    },
                    published: true,
                    state: "ImportSuccess",
                    last_updated: "2022-04-20T13:10:48.107Z",
                },
                {
                    // metadata contains collection_id, ArchiveDispatchFailed = "Linked to collection + Error"
                    id: "65a93ed2-31a1-4bd5-89dd-9d44b8cda05c",
                    archive: {
                        name: "test14.zip",
                    },
                    metadata: {
                        title: "Title 14",
                        label: "Label 14",
                        internal_id: "internal_id_14",
                        collection_id: "internal_id_14",
                        slug: "label-14",
                    },
                    published: true,
                    state: "ArchiveDispatchFailed",
                    last_updated: "2022-04-20T13:10:48.107Z",
                },
                {
                    // metadata contains collection_id, ImportFailure = "Linked to collection + Error"
                    id: "65a93ed2-31a1-4bd5-89dd-9d44b8rgu05c",
                    archive: {
                        name: "test15.zip",
                    },
                    metadata: {
                        title: "Title 15",
                        label: "Label 15",
                        internal_id: "internal_id_15",
                        collection_id: "internal_id_15",
                        slug: "label-15",
                    },
                    published: true,
                    state: "ImportFailure",
                    last_updated: "2022-03-30T13:29:49.901Z",
                },
            ];

            mockAxios.get.mockImplementationOnce(() =>
                Promise.resolve({
                    data: {
                        items: interactivesForStatus,
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
            expect(newItems.length).toBe(15);

            const textContent = newItems.map(item => item.textContent);

            expect(textContent[0]).toEqual("Title 1 - 21 March 2022UPLOADING");
            expect(textContent[1]).toEqual("Title 2 - 21 March 2022UPLOADING");
            expect(textContent[2]).toEqual("Title 3 - 20 April 2022UPLOADED");
            expect(textContent[3]).toEqual("Title 4 - 20 April 2022ERROR");
            expect(textContent[4]).toEqual("Title 5 - 30 March 2022ERROR");
            expect(textContent[5]).toEqual("Title 6 - 21 March 2022PUBLISHEDUPLOADING");
            expect(textContent[6]).toEqual("Title 7 - 21 March 2022PUBLISHEDUPLOADING");
            expect(textContent[7]).toEqual("Title 8 - 20 April 2022PUBLISHEDUPLOADED");
            expect(textContent[8]).toEqual("Title 9 - 20 April 2022PUBLISHEDERROR");
            expect(textContent[9]).toEqual("Title 10 - 30 March 2022PUBLISHEDERROR");
            expect(textContent[10]).toEqual("Title 11 - 21 March 2022LINKED TO COLLECTIONUPLOADING");
            expect(textContent[11]).toEqual("Title 12 - 21 March 2022LINKED TO COLLECTIONUPLOADING");
            expect(textContent[12]).toEqual("Title 13 - 20 April 2022LINKED TO COLLECTIONUPLOADED");
            expect(textContent[13]).toEqual("Title 14 - 20 April 2022LINKED TO COLLECTIONERROR");
            expect(textContent[14]).toEqual("Title 15 - 30 March 2022LINKED TO COLLECTIONERROR");
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
            expect(textContent[0]).toEqual("A Title 1 - 21 April 2022UPLOADING");
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
            expect(textContent[0]).toEqual("A Title 1 - 21 March 2022UPLOADING");
            expect(textContent[1]).toEqual("Z Title 2 - 20 April 2022UPLOADING");
            expect(textContent[2]).toEqual("T Title 3 - 30 March 2022UPLOADING");

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
            expect(textContent1[0]).toEqual("Z Title 2 - 20 April 2022UPLOADING");
            expect(textContent1[1]).toEqual("T Title 3 - 30 March 2022UPLOADING");
            expect(textContent1[2]).toEqual("A Title 1 - 21 March 2022UPLOADING");

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
            expect(textContent2[0]).toEqual("A Title 1 - 21 March 2022UPLOADING");
            expect(textContent2[1]).toEqual("T Title 3 - 30 March 2022UPLOADING");
            expect(textContent2[2]).toEqual("Z Title 2 - 20 April 2022UPLOADING");
        });
    });
});
