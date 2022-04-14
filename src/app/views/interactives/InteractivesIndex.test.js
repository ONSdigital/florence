import React from "react";
import mockAxios from "axios";
import { render, fireEvent, screen } from "../../utilities/tests/test-utils";
import { InteractivesIndex } from "./InteractivesIndex";
import { within } from "@testing-library/react";
import { getAll } from "../../utilities/api-clients/interactives-test";

describe("Collections", () => {
    const defaultProps = {
        filteredInteractives: [],
        taxonomies: [],
        getInteractives: jest.fn(),
        filterInteractives: jest.fn(),
        rootPath: "/florence",
        successMessage: {},
    };

    describe("when renders the component", () => {
        it("renders the initial content", () => {
            render(<InteractivesIndex {...defaultProps} />);
            // Filters
            expect(screen.getByLabelText("Internal ID")).toBeInTheDocument();
            expect(screen.getByLabelText("Title")).toBeInTheDocument();
            expect(screen.getByText("Interactive type")).toBeInTheDocument();
            expect(screen.getByLabelText("Primary topic")).toBeInTheDocument();
            expect(screen.getByLabelText("Data source")).toBeInTheDocument();
            // filter action buttons
            expect(screen.getByText("Apply")).toBeInTheDocument();
            expect(screen.getByText("Reset all")).toBeInTheDocument();
            // Table
            expect(screen.getByLabelText("Sort by")).toBeInTheDocument();
            expect(screen.getByText("Upload interactive")).toBeInTheDocument();
            expect(screen.getByRole("list")).toBeInTheDocument();
        });

        it("should fetch data when component is mounted and show the interactives in the list component", async () => {
            jest.clearAllMocks();
            const { rerender } = render(<InteractivesIndex {...defaultProps} />);
            expect(defaultProps.getInteractives).toHaveBeenCalled();
            const list = screen.getByRole("list");
            const { queryAllByRole } = within(list);
            const oldItems = queryAllByRole("listitem");
            expect(oldItems.length).toBe(0);

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
                                    title: "Title 1",
                                    label: "Label 1",
                                    internal_id: "internal_id_1",
                                    slug: "label-1",
                                },
                                published: false,
                                state: "ArchiveUploaded",
                            },
                            {
                                id: "65a93ed2-31a1-4bd5-89dd-9d44b8cda05c",
                                archive: {
                                    name: "test2.zip",
                                },
                                metadata: {
                                    title: "Title 2",
                                    label: "Label 2",
                                    internal_id: "internal_id_2",
                                    slug: "label-2",
                                },
                                published: true,
                                state: "ArchiveUploaded",
                            },
                            {
                                id: "65a93ed2-31a1-4bd5-89dd-9d44b8rgu05c",
                                archive: {
                                    name: "test3.zip",
                                },
                                metadata: {
                                    title: "Title 3",
                                    label: "Label 3",
                                    internal_id: "internal_id_3",
                                    slug: "label-3",
                                },
                                published: true,
                                state: "ArchiveUploaded",
                            },
                        ],
                        count: 1,
                        offset: 0,
                        limit: 20,
                        total_count: 3,
                    },
                })
            );

            const { items } = await getAll();
            defaultProps.filteredInteractives = items;

            rerender(<InteractivesIndex {...defaultProps} />);

            const newItems = queryAllByRole("listitem");
            expect(newItems.length).toBe(3);
            const textContent = newItems.map(item => item.textContent);

            const expectedContentInText = ["Label 1- 16 March 2022", "Label 2- 16 March 2022", "Label 3- 16 March 2022"];

            textContent.forEach(function (content) {
                let exist = expectedContentInText.indexOf(content) > -1;
                expect(exist).toEqual(true);
            });
        });

        it("should filter results when clicks apply button", () => {
            render(<InteractivesIndex {...defaultProps} />);
            const applyButton = screen.getByText("Apply");
            screen.getByLabelText("Internal ID").value = "Query";
            fireEvent.click(applyButton);
            expect(defaultProps.filterInteractives.mock.calls).toHaveLength(1);
        });
    });
});
