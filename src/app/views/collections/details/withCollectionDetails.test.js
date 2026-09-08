import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import "@testing-library/jest-dom";
import { withCollectionDetails } from "./withCollectionDetails";
import * as collectionsAPI from "../../../utilities/api-clients/collections";
import * as notifications from "../../../utilities/notifications";
import { replace } from "connected-react-router";
import { updateWorkingOn } from "../../../config/actions";

jest.mock("../../../utilities/api-clients/collections", () => ({
    get: jest.fn(),
}));

jest.mock("../../../utilities/notifications", () => ({
    add: jest.fn(),
}));

jest.mock("connected-react-router", () => ({
    replace: jest.fn(path => ({ type: "@@router/CALL_HISTORY_METHOD", payload: { method: "replace", args: [path] } })),
}));

jest.mock("../../../config/actions", () => ({
    updateWorkingOn: jest.fn((...args) => ({ type: "UPDATE_WORKING_ON", payload: args })),
}));
jest.mock("../../../utilities/logging/log", () => ({
    event: jest.fn(),
    data: jest.fn(),
    error: jest.fn(),
}));

jest.mock("../../../config/store", () => ({
    store: {
        getState: jest.fn(() => ({
            state: {
                global: {
                    workingOn: null,
                },
                rootPath: "/florence",
            },
        })),
        dispatch: jest.fn(),
        subscribe: jest.fn(),
    },
    baseHistory: {
        push: jest.fn(),
    },
}));

const mockStore = configureMockStore();

// Reset mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
    collectionsAPI.get.mockClear();
    notifications.add.mockClear();
});

const TestComponent = ({ testProp }) => <div data-testid="test-component">Test Component - {testProp}</div>;

describe("when a component is wrapped withCollectionDetails", () => {
    let store;
    let wrappedComponent;

    beforeEach(() => {
        jest.clearAllMocks();
        store = mockStore({
            state: {
                global: {
                    workingOn: null,
                },
                rootPath: "/florence",
            },
        });
        wrappedComponent = withCollectionDetails(TestComponent);
    });

    it("should render the wrapped component", () => {
        const props = {
            match: {
                params: {
                    collectionID: "test-collection-123",
                },
            },
            testProp: "test value",
        };

        collectionsAPI.get.mockResolvedValue({
            id: "test-collection-123",
            name: "Test Collection",
        });

        render(<Provider store={store}>{React.createElement(wrappedComponent, props)}</Provider>);

        expect(screen.getByTestId("test-component")).toBeInTheDocument();
    });

    it("should pass through all props to wrapped component", () => {
        const props = {
            match: {
                params: {
                    collectionID: "collection-1",
                },
            },
            customProp: "custom value",
        };

        collectionsAPI.get.mockResolvedValue({
            id: "collection-1",
            name: "Test Collection",
        });

        render(<Provider store={store}>{React.createElement(wrappedComponent, props)}</Provider>);

        expect(screen.getByTestId("test-component")).toBeInTheDocument();
    });

    it("should redirect to collections if collectionID is missing", async () => {
        const props = {
            match: {
                params: {},
            },
        };

        render(<Provider store={store}>{React.createElement(wrappedComponent, props)}</Provider>);

        await waitFor(() => {
            expect(store.getActions()).toContainEqual(replace("/florence/collections"));
        });
    });

    it("should not fetch if workingOn is already cached in Redux", async () => {
        const cachedStore = mockStore({
            state: {
                global: {
                    workingOn: {
                        id: "test-collection-123",
                        name: "Test Collection",
                    },
                },
                rootPath: "/florence",
            },
        });

        const props = {
            match: {
                params: {
                    collectionID: "test-collection-123",
                },
            },
        };

        render(<Provider store={cachedStore}>{React.createElement(withCollectionDetails(TestComponent), props)}</Provider>);

        await waitFor(() => {
            expect(collectionsAPI.get).not.toHaveBeenCalled();
        });
    });

    it("should fetch and dispatch collection details on mount", async () => {
        const mockResponse = {
            id: "test-collection-123",
            name: "Test Collection",
        };

        collectionsAPI.get.mockResolvedValue(mockResponse);
        updateWorkingOn.mockReturnValue({ type: "UPDATE_WORKING_ON" });

        const props = {
            match: {
                params: {
                    collectionID: "test-collection-123",
                },
            },
        };

        render(<Provider store={store}>{React.createElement(wrappedComponent, props)}</Provider>);

        await waitFor(() => {
            expect(collectionsAPI.get).toHaveBeenCalledWith("test-collection-123");
        });

        await waitFor(() => {
            expect(updateWorkingOn).toHaveBeenCalledWith(
                "test-collection-123",
                "Test Collection",
                "/florence/collections/test-collection-123",
                mockResponse,
                false
            );
        });
    });

    describe("when errors occur", () => {
        it("should handle 404 error and redirect", async () => {
            const error = new Error("Not found");
            error.status = 404;
            collectionsAPI.get.mockRejectedValue(error);

            const props = {
                match: {
                    params: {
                        collectionID: "non-existent",
                    },
                },
            };

            render(<Provider store={store}>{React.createElement(wrappedComponent, props)}</Provider>);

            await waitFor(() => {
                expect(notifications.add).toHaveBeenCalledWith(
                    expect.objectContaining({
                        type: "neutral",
                        message: expect.stringContaining("couldn't be found"),
                    })
                );
            });

            await waitFor(() => {
                expect(store.getActions()).toContainEqual(replace("/florence/collections"));
            });
        });

        it("should handle 403 permission denied error", async () => {
            const error = new Error("Forbidden");
            error.status = 403;
            collectionsAPI.get.mockRejectedValue(error);

            const props = {
                match: {
                    params: {
                        collectionID: "restricted",
                    },
                },
            };

            render(<Provider store={store}>{React.createElement(wrappedComponent, props)}</Provider>);

            await waitFor(() => {
                expect(notifications.add).toHaveBeenCalledWith(
                    expect.objectContaining({
                        type: "neutral",
                        message: expect.stringContaining("permissions"),
                    })
                );
            });

            await waitFor(() => {
                expect(store.getActions()).toContainEqual(replace("/florence/collections"));
            });
        });

        it("should handle 401 error silently", async () => {
            const error = new Error("Unauthorized");
            error.status = 401;
            collectionsAPI.get.mockRejectedValue(error);

            const props = {
                match: {
                    params: {
                        collectionID: "test-collection-123",
                    },
                },
            };

            render(<Provider store={store}>{React.createElement(wrappedComponent, props)}</Provider>);

            await waitFor(() => {
                expect(notifications.add).not.toHaveBeenCalled();
            });
        });

        it("should handle network error (FETCH_ERR)", async () => {
            const error = new Error("Network error");
            error.status = "FETCH_ERR";
            collectionsAPI.get.mockRejectedValue(error);

            const props = {
                match: {
                    params: {
                        collectionID: "test-collection-123",
                    },
                },
            };

            render(<Provider store={store}>{React.createElement(wrappedComponent, props)}</Provider>);

            await waitFor(() => {
                expect(notifications.add).toHaveBeenCalledWith(
                    expect.objectContaining({
                        type: "warning",
                        message: expect.stringContaining("network error"),
                    })
                );
            });
        });

        it("should handle unexpected errors with default message", async () => {
            const error = new Error("Server error");
            error.status = 500;
            collectionsAPI.get.mockRejectedValue(error);

            const props = {
                match: {
                    params: {
                        collectionID: "test-collection-123",
                    },
                },
            };

            render(<Provider store={store}>{React.createElement(wrappedComponent, props)}</Provider>);

            await waitFor(() => {
                expect(notifications.add).toHaveBeenCalledWith(
                    expect.objectContaining({
                        type: "warning",
                        message: expect.stringContaining("unexpected error"),
                    })
                );
            });
        });
    });

    describe("Redux connection", () => {
        it("should correctly map rootPath from Redux state", async () => {
            const customStore = mockStore({
                state: {
                    global: {
                        workingOn: null,
                    },
                    rootPath: "/custom-root",
                },
            });

            const props = {
                match: {
                    params: {},
                },
            };

            render(<Provider store={customStore}>{React.createElement(withCollectionDetails(TestComponent), props)}</Provider>);

            await waitFor(() => {
                expect(customStore.getActions()).toContainEqual(replace("/custom-root/collections"));
            });
        });
    });

    it("should map collection response correctly to working on state", async () => {
        const mockResponse = {
            id: "collection-abc",
            name: "My Collection",
            description: "A test collection",
        };

        collectionsAPI.get.mockResolvedValue(mockResponse);
        updateWorkingOn.mockReturnValue({ type: "UPDATE_WORKING_ON" });

        const props = {
            match: {
                params: {
                    collectionID: "collection-abc",
                },
            },
        };

        render(<Provider store={store}>{React.createElement(wrappedComponent, props)}</Provider>);

        await waitFor(() => {
            expect(updateWorkingOn).toHaveBeenCalledWith(
                "collection-abc",
                "My Collection",
                "/florence/collections/collection-abc",
                mockResponse,
                false
            );
        });
    });
});
