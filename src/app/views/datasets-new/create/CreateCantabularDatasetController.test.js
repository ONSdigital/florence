import React from "react";
import { CreateCantabularDatasetController } from "./CreateCantabularDatasetController";
import { shallow } from "enzyme";
import datasets from "../../../utilities/api-clients/datasets";
import recipes from "../../../utilities/api-clients/recipes";

console.error = () => {};

jest.mock("../../../utilities/notifications", () => {
    return {
        add: jest.fn(notification => {
            mockNotifications.push(notification);
        }),
        remove: () => {},
    };
});

jest.mock("../../../utilities/api-clients/datasets", () => {
    return {
        create: jest.fn(() => {
            return Promise.resolve();
        }),
    };
});

jest.mock("../../../utilities/api-clients/recipes", () => {
    return {
        get: jest.fn(() => {
            return Promise.resolve(mockedRecipeCall);
        }),
    };
});

let mockNotifications = [];
let dispatchedActions = [];

const defaultProps = {
    dispatch: event => {
        dispatchedActions.push(event);
    },
    location: {
        pathname: "florence/collections/12345/datasets/create",
    },
    params: {
        datasetID: "test-id",
        recipeID: "2943f3c5-c3f1-4a9a-aa6e-14d21c33524c",
    },
};

const component = shallow(<CreateCantabularDatasetController {...defaultProps} />);

const mockedRecipeCall = {
    id: "2943f3c5-c3f1-4a9a-aa6e-14d21c33524c",
    alias: "TEST5",
    format: "cantabular_flexible_table",
    files: [],
    cantabular_blob: "test_blob",
    output_instances: [
        {
            dataset_id: "test-dataset-5",
            editions: ["time-series"],
            title: "Test dataset 5",
            code_lists: [
                {
                    id: "mmm-yy",
                    href: "http://localhost:22400/code-lists/mmm-yy",
                    name: "time",
                    is_hierarchy: false,
                },
            ],
        },
    ],
};

const mockedState = {
    format: mockedRecipeCall.format,
    isBasedOn: mockedRecipeCall.cantabular_blob,
};

beforeEach(() => {
    mockNotifications = [];
    dispatchedActions = [];
});

test("makeCreateDatasetPostBody returns correct model", () => {
    component.setState({
        format: mockedState.format,
        isBasedOn: mockedState.isBasedOn,
    });
    const postBody = component.instance().makeCreateDatasetPostBody();
    expect(postBody).toMatchObject({
        type: mockedState.format,
        is_based_on: {
            id: mockedState.isBasedOn,
            type: mockedState.format,
        },
    });
});

describe("calling getRecipe", () => {
    it("returns recipe on success", async () => {
        expect(component.state("isGettingRecipe")).toBe(false);
        await component.instance().getRecipe();
        expect(component.state("format")).toMatch(mockedState.format);
        expect(component.state("isBasedOn")).toMatch(mockedState.isBasedOn);
        expect(component.state("isGettingRecipe")).toBe(false);
    });

    it("shows notification on fail", async () => {
        recipes.get.mockImplementationOnce(() => Promise.reject({ status: 500 }));
        await component.instance().getRecipe();
        expect(mockNotifications.length).toBe(1);
        // create button is still disabled
        expect(component.state("isGettingRecipe")).toBe(true);
    });
});

describe("Calling handleCreateClick", () => {
    const mockEvent = { preventDefault: () => {} };

    it("updates isPosting state to show post of new dataset", () => {
        expect(component.state("isPosting")).toBe(false);

        // Tests that state is set correctly before asynchronous requests have finished
        component.instance().handleCreateClick(mockEvent);
        expect(component.state("isPosting")).toBe(true);
    });

    describe("on success", () => {
        it("displays notification", async () => {
            await component.instance().handleCreateClick(mockEvent);
            expect(mockNotifications.length).toBe(1);
        });

        it("routes back to list of datasets page", async () => {
            await component.instance().handleCreateClick(mockEvent);
            expect(dispatchedActions[0].type).toBe("@@router/CALL_HISTORY_METHOD");
        });

        it("updates isPosting state to show it has created dataset", async () => {
            // Tests that state is set correctly after asynchronous requests were successful
            await component.instance().handleCreateClick(mockEvent);
            expect(component.state("isPosting")).toBe(false);
        });
    });
    describe("on failure", () => {
        it("shows notification", async () => {
            datasets.create.mockImplementationOnce(() => Promise.reject({ status: 404 }));
            await component.instance().handleCreateClick(mockEvent);
            expect(mockNotifications.length).toBe(1);
            expect(component.state("isPosting")).toBe(false);
        });
    });
});
