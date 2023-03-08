import React from "react";
import { render, screen, createMockUser, within } from "../../utilities/tests/test-utils";
import Collections from "./Collections";
import userEvent from "@testing-library/user-event";
import { setAuthState } from "../../utilities/auth";

const admin = createMockUser("admin@test.com", true, true, "ADMIN");
const viewer = createMockUser("viewer@test.com", true, true, "VIEWER");

// Local Storage
var localStorageMock = (function () {
    var store = {};
    return {
        getItem: function (key) {
            return store[key];
        },
        setItem: function (key, value) {
            store[key] = value.toString();
        },
        clear: function () {
            store = {};
        },
        removeItem: function (key) {
            delete store[key];
        },
    };
})();

beforeEach(() => {
    Object.defineProperty(window, "localStorage", { value: localStorageMock, writable: true });
    window.localStorage.setItem("ons_auth_state", {});
});

afterEach(() => {
    window.localStorage.clear();
});

describe("Collections", () => {
    const defaultProps = {
        collections: [],
        isLoading: false,
        params: {},
        rootPath: "test",
        routes: [],
        search: "",
        user: admin,
        updateWorkingOn: jest.fn(),
        dispatch: jest.fn(),
        loadCollections: jest.fn(),
    };

    describe("when there are no collections", () => {
        it("has two headings", () => {
            setAuthState({
                admin: true,
                editor: true,
            });
            render(<Collections {...defaultProps} />);

            expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(2);
            expect(screen.getByRole("heading", { name: "Select a collection" })).toBeInTheDocument();
            expect(screen.getByRole("heading", { name: "Create a collection" })).toBeInTheDocument();
        });

        it("has Create Collection form", () => {
            setAuthState({
                admin: true,
                editor: true,
            });
            render(<Collections {...defaultProps} />);

            expect(screen.getByLabelText("Collection name")).toHaveValue("");
            expect(screen.getByLabelText("Select a team(s) that can view this collection")).toHaveValue("Loading teams...");

            expect(screen.getByRole("group", { name: "Publish type" })).toBeInTheDocument();
            expect(screen.getByLabelText("Scheduled publish")).toBeChecked();
            expect(screen.getByLabelText("Manual publish")).not.toBeChecked();

            expect(screen.getByRole("group", { name: "Schedule type" })).toBeInTheDocument();
            expect(screen.getByLabelText("Custom schedule")).toBeChecked();
            expect(screen.getByLabelText("Calendar entry schedule")).not.toBeChecked();

            expect(screen.getByLabelText("Publish date")).toHaveValue("");
            expect(screen.getByLabelText("Publish time")).toHaveValue("09:30");
            expect(screen.getByRole("button", { name: "Create collection" })).toBeInTheDocument();
        });

        it("has Search", () => {
            render(<Collections {...defaultProps} />);

            expect(screen.getByLabelText("Search collections")).toHaveValue("");
        });

        it("shows empty collection list table with heading and sort buttons", () => {
            render(<Collections {...defaultProps} />);

            expect(screen.getByText("No items to display")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Sort by name" })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Sort by publishDate" })).toBeInTheDocument();
        });
    });

    describe("when there are collections", () => {
        const propsWithCollections = {
            ...defaultProps,
            collections: [
                {
                    approvalStatus: "NOT_STARTED",
                    canBeApproved: false,
                    canBeDeleted: false,
                    complete: undefined,
                    datasetVersions: [],
                    datasets: [],
                    deletes: [],
                    id: "Test-1",
                    inProgress: undefined,
                    isForcedManualType: false,
                    name: "Test collection name",
                    publishDate: "2022-01-29T09:30:00.000Z",
                    release: undefined,
                    reviewed: undefined,
                    selectableBox: { firstColumn: "Test collection name", secondColumn: "Sat, 29/01/2022 9:30AM" },
                    status: { neutral: false, warning: false, success: false, message: "" },
                    teams: [],
                    type: "scheduled",
                },
                {
                    approvalStatus: "COMPLETE",
                    canBeApproved: false,
                    canBeDeleted: false,
                    complete: undefined,
                    datasetVersions: [],
                    datasets: [],
                    deletes: [],
                    id: "Test-2",
                    inProgress: undefined,
                    isForcedManualType: false,
                    name: "Approved collection name",
                    publishDate: "2022-02-29T09:30:00.000Z",
                    release: undefined,
                    reviewed: undefined,
                    selectableBox: { firstColumn: "Approved collection name", secondColumn: "Sat, 29/02/2022 9:30AM" },
                    status: { neutral: false, warning: false, success: false, message: "" },
                    teams: [],
                    type: "scheduled",
                },
            ],
            user: admin,
        };

        describe("when admin user", () => {
            it("shows list of not approved collections", () => {
                setAuthState({
                    admin: true,
                    editor: true,
                });
                render(<Collections {...propsWithCollections} />);

                expect(screen.queryByText("No items to display")).not.toBeInTheDocument();
                expect(screen.getByRole("button", { name: "Sort by name" })).toBeInTheDocument();
                expect(screen.getByRole("button", { name: "Sort by publishDate" })).toBeInTheDocument();

                const box = screen.getByTestId("selectable-box");
                const list = within(box).getAllByRole("listitem");
                expect(list).toHaveLength(1);
                expect(within(box).getByText("Test collection name")).toBeInTheDocument();
                expect(within(box).getByText("Sat, 29/01/2022 9:30AM")).toBeInTheDocument();
            });

            it("dispatches push action on collection click", () => {
                setAuthState({
                    admin: true,
                    editor: true,
                });
                render(<Collections {...propsWithCollections} />);
                const box = screen.getByTestId("selectable-box");

                expect(within(box).getAllByRole("listitem")).toHaveLength(1);

                userEvent.click(within(box).getByRole("listitem", { id: "Test-1" }));

                expect(defaultProps.dispatch).toHaveBeenCalledTimes(1);
            });
        });

        describe("when viewer user", () => {
            const propsWithViewer = {
                ...propsWithCollections,
                user: viewer,
            };

            it(" shows list all collections", () => {
                render(<Collections {...propsWithViewer} />);

                expect(screen.queryByText("No items to display")).not.toBeInTheDocument();
                expect(screen.getByRole("button", { name: "Sort by name" })).toBeInTheDocument();
                expect(screen.getByRole("button", { name: "Sort by publishDate" })).toBeInTheDocument();

                const box = screen.getByTestId("selectable-box");
                const list = within(box).getAllByRole("listitem");
                expect(list).toHaveLength(2);
                expect(within(list[1]).getByText("Test collection name")).toBeInTheDocument();
                expect(within(list[1]).getByText("Sat, 29/01/2022 9:30AM")).toBeInTheDocument();
                expect(within(list[0]).getByText("Approved collection name")).toBeInTheDocument();
                expect(within(list[0]).getByText("Sat, 29/02/2022 9:30AM")).toBeInTheDocument();
            });

            it("dispatches push and updateWorkingOn actions on collection click", () => {
                render(<Collections {...propsWithViewer} />);
                setAuthState({
                    admin: true,
                    editor: true,
                });
                const box = screen.getByTestId("selectable-box");

                expect(within(box).getAllByRole("listitem")).toHaveLength(2);

                userEvent.click(screen.getByTestId("Test-2"));

                expect(defaultProps.dispatch).toHaveBeenCalled();
                expect(defaultProps.updateWorkingOn).toHaveBeenCalledWith("Test-2");
            });
        });
    });
});
