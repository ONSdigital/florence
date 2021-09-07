import React from "react";
import { CreateDatasetController } from "./CreateDatasetController";
import { shallow } from "enzyme";
import datasets from "../../../utilities/api-clients/datasets";
import recipes from "../../../utilities/api-clients/recipes";

console.error = () => {};

jest.mock("../../../utilities/logging/log", () => {
    return {
        event: () => {},
        error: () => {}
    };
});

jest.mock("../../../utilities/notifications", () => {
    return {
        add: jest.fn(notification => {
            mockNotifications.push(notification);
        }),
        remove: () => {}
    };
});

jest.mock("../../../utilities/api-clients/datasets", () => {
    return {
        getAllList: jest.fn(() => {
            return Promise.resolve(mockedAllDatasetsCall);
        })
    };
});

jest.mock("../../../utilities/api-clients/recipes", () => {
    return {
        getAll: jest.fn(() => {
            return Promise.resolve(mockedAllRecipesCall);
        })
    };
});

let mockNotifications = [];

const mockedAllDatasetsCall = [
    {
        id: "test-dataset-1"
    },
    {
        id: "test-dataset-2"
    }
];

const mockedAllRecipesCall = {
    items: [
        {
            id: "b944be78-f56d-409b-9ebd-ab2b77ffe187",
            alias: "TEST1",
            format: "v4",
            files: [
                {
                    description: "CPI COICOP v4"
                }
            ],
            output_instances: [
                {
                    dataset_id: "test-dataset-1",
                    editions: ["time-series"],
                    title: "Test dataset 1",
                    code_lists: [
                        {
                            id: "64d384f1-ea3b-445c-8fb8-aa453f96e58a",
                            href: "http://localhost:22400/code-lists/64d384f1-ea3b-445c-8fb8-aa453f96e58a",
                            name: "time",
                            is_hierarchy: false
                        }
                    ]
                },
                {
                    dataset_id: "test-dataset-2",
                    editions: ["time-series"],
                    title: "Test dataset 2",
                    code_lists: [
                        {
                            id: "64d384f1-ea3b-445c-8fb8-aa453f96e58a",
                            href: "http://localhost:22400/code-lists/64d384f1-ea3b-445c-8fb8-aa453f96e58a",
                            name: "time",
                            is_hierarchy: false
                        },
                        {
                            id: "65107A9F-7DA3-4B41-A410-6F6D9FBD68C3",
                            href: "http://localhost:22400/code-lists/65107A9F-7DA3-4B41-A410-6F6D9FBD68C3",
                            name: "geography",
                            is_hierarchy: false
                        }
                    ]
                }
            ]
        },
        {
            id: "2943f3c5-c3f1-4a9a-aa6e-14d21c33524c",
            alias: "TEST3",
            format: "v4",
            files: [
                {
                    description: "CPIH v4"
                }
            ],
            output_instances: [
                {
                    dataset_id: "test-dataset-3",
                    editions: ["time-series"],
                    title: "Test dataset 3",
                    code_lists: [
                        {
                            id: "mmm-yy",
                            href: "http://localhost:22400/code-lists/mmm-yy",
                            name: "time",
                            is_hierarchy: false
                        }
                    ]
                }
            ]
        },
        {
            id: "2943f3c5-c3f1-4a9a-aa6e-14d21c33524c",
            alias: "TEST4",
            format: "v4",
            files: [
                {
                    description: "CPIH v4"
                }
            ],
            output_instances: [
                {
                    dataset_id: "test-dataset-4",
                    editions: ["time-series"],
                    title: "Test dataset 4",
                    code_lists: [
                        {
                            id: "mmm-yy",
                            href: "http://localhost:22400/code-lists/mmm-yy",
                            name: "time",
                            is_hierarchy: false
                        }
                    ]
                }
            ]
        }
    ]
};

const mockedAllOutputs = [
    {
        dataset_id: mockedAllRecipesCall.items[0].output_instances[0].dataset_id,
        editions: mockedAllRecipesCall.items[0].output_instances[0].editions,
        title: mockedAllRecipesCall.items[0].output_instances[0].title,
        code_lists: mockedAllRecipesCall.items[0].output_instances[0].code_lists
    },
    {
        dataset_id: mockedAllRecipesCall.items[0].output_instances[1].dataset_id,
        editions: mockedAllRecipesCall.items[0].output_instances[1].editions,
        title: mockedAllRecipesCall.items[0].output_instances[1].title,
        code_lists: mockedAllRecipesCall.items[0].output_instances[1].code_lists
    },
    {
        dataset_id: mockedAllRecipesCall.items[1].output_instances[0].dataset_id,
        editions: mockedAllRecipesCall.items[1].output_instances[0].editions,
        title: mockedAllRecipesCall.items[1].output_instances[0].title,
        code_lists: mockedAllRecipesCall.items[1].output_instances[0].code_lists
    }
];

const mockedMappedState = [
    {
        title: "Test output 1",
        id: "001",
        url: "/florence/collections/testcollection-6be55693d6216162fdb844cb14155f91efe1bb3f09f6a42f5740a2cc739c7f6c/datasets/create/001"
    },
    {
        title: "Test output 2",
        id: "002",
        url: "/florence/collections/testcollection-6be55693d6216162fdb844cb14155f91efe1bb3f09f6a42f5740a2cc739c7f6c/datasets/create/002"
    },
    {
        title: "Test output 3",
        id: "003",
        url: "/florence/collections/testcollection-6be55693d6216162fdb844cb14155f91efe1bb3f09f6a42f5740a2cc739c7f6c/datasets/create/001"
    }
];

const defaultProps = {
    dispatch: () => {},
    location: {
        pathname: "florence/collections/12345/datasets/create"
    }
};

const component = shallow(<CreateDatasetController {...defaultProps} />);

beforeEach(() => {
    mockNotifications = [];
});

describe("calling getRecipes", () => {
    it("returns recipes on success", async () => {
        const response = await component.instance().getRecipes();
        expect(response).toMatchObject(mockedAllRecipesCall);
    });

    it("returns error on fail", async () => {
        recipes.getAll.mockImplementationOnce(() => Promise.reject({ status: 500 }));
        await component
            .instance()
            .getRecipes()
            .catch(error => {
                console.log(error);
                expect(error).toMatchObject({
                    error: { status: 500 },
                    message: "An error occured trying to retrieve all recipes"
                });
            });
    });
});

describe("calling getDatasets", () => {
    it("returns datasets on success", async () => {
        const response = await component.instance().getDatasets();
        expect(response).toMatchObject(mockedAllDatasetsCall);
    });

    it("returns error on fail", async () => {
        datasets.getAllList.mockImplementationOnce(() => Promise.reject({ status: 404 }));
        await component
            .instance()
            .getDatasets()
            .catch(error => {
                expect(error).toMatchObject({
                    error: { status: 404 },
                    message: "An error occured trying to retrieve all datasets"
                });
            });
    });
});

describe("Calling getAllUncreatedDatasetFromRecipeOutputs", () => {
    it("updates isFetchingRecipesAndDatasets state to show loading data", () => {
        expect(component.state("isFetchingRecipesAndDatasets")).toBe(false);
        component.instance().getAllUncreatedDatasetFromRecipeOutputs();
        expect(component.state("isFetchingRecipesAndDatasets")).toBe(true);
    });

    describe("on success", () => {
        it("adds outputs to state", async () => {
            component.instance().getAllUncreatedDatasetFromRecipeOutputs();
            expect(component.state("outputs")).toHaveLength(2);
            expect(component.state("outputs")[0]).toMatchObject({
                title: "Test dataset 3",
                id: "test-dataset-3",
                url: "florence/collections/12345/datasets/create/test-dataset-3",
                format: "v4"
            });
        });
        it("updates isFetchingRecipesAndDatasets state to show it has created dataset", async () => {
            // Tests that state is set correctly after asynchronous requests were successful
            await component.instance().getAllUncreatedDatasetFromRecipeOutputs();
            expect(component.state("isFetchingRecipesAndDatasets")).toBe(false);
        });
    });

    describe("on failure", () => {
        it("updates isFetchingRecipesAndDatasets state correctly", async () => {
            recipes.getAll.mockImplementationOnce(() => Promise.reject({ status: 500 }));
            await component.instance().getAllUncreatedDatasetFromRecipeOutputs();
            expect(component.state("isFetchingRecipesAndDatasets")).toBe(false);
        });

        it("shows notification", async () => {
            recipes.getAll.mockImplementationOnce(() => Promise.reject({ status: 404 }));
            await component.instance().getAllUncreatedDatasetFromRecipeOutputs();
            expect(mockNotifications.length).toBe(1);
        });
    });
});

test("getAllOutputsFromRecipes returns correct values", () => {
    const outputs = component.instance().getAllOutputsFromRecipes(mockedAllRecipesCall);
    expect(outputs[0]).toMatchObject(mockedAllOutputs[0]);
    expect(outputs[1]).toMatchObject(mockedAllOutputs[1]);
    expect(outputs[2]).toMatchObject(mockedAllOutputs[2]);
});

test("getOutputsWithoutExistingDataset returns correct values", () => {
    const expected = component.instance().getOutputsWithoutExistingDataset(mockedAllOutputs, mockedAllDatasetsCall);
    expect(expected[0]).toMatchObject(mockedAllOutputs[2]);
});

test("handleSearchInput updates state with correct values", () => {
    component.setState({ outputs: mockedMappedState });
    component.instance().handleSearchInput({ target: { value: "Test output 1" } });
    expect(component.state("searchTerm")).toBe("test output 1");
    expect(component.state("filteredOutputs")).toMatchObject([mockedMappedState[0]]);
});
