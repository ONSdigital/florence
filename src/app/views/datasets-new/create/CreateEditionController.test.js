import React from 'react';
import { CreateEditionController } from './CreateEditionController';
import { shallow, mount } from 'enzyme';
import datasets from '../../../utilities/api-clients/datasets';
import recipes from '../../../utilities/api-clients/recipes';

console.error = () => { };

jest.mock('../../../utilities/log', () => {
    return {
        add: function () { },
        eventTypes: {}
    }
});

jest.mock('../../../utilities/notifications', () => {
    return {
        add: jest.fn((notification) => { mockNotifications.push(notification) }),
        remove: () => { }
    }
});

jest.mock('../../../utilities/api-clients/datasets', () => {
    return {
        get: jest.fn(() => {
            return Promise.resolve(mockedDataset);
        }),
        getEditions: jest.fn(() => {
            return Promise.resolve(mockedEditions);
        })
    }
});

jest.mock('../../../utilities/api-clients/recipes', () => {
    return {
        getAll: jest.fn(() => {
            return Promise.resolve(mockedRecipeCall);
        }),
    }
});

const mockedDataset = {
    id: "test-dataset-1",
        current: {
        collection_id: "1234567890",
        id: "test-dataset-1",
        title: "Test Dataset 1"
    }
};

const mockedEditions = {
    items: [
        {
            id: "test-1",
            current: {
                edition: "edition-1",
                links: {
                    latest_version: {
                        href: "test/3",
                        id: "3"
                    },
                },
                state: "published"
            },
        },
        {
            id: "test-2",
            current: {
                edition: "edition-2",
                links: {
                    latest_version: {
                        href: "test/3",
                        id: "12"
                    },
                },
                state: "published"
            },
        },
    ]
};

const mockedRecipeCall = {
    items: [
        {
            "id": "b944be78-f56d-409b-9ebd-ab2b77ffe187",
            "alias": "CPI COICOP",
            "format": "v4",
            "files": [
                {
                    "description": "CPI COICOP v4"
                }
            ],
            "output_instances": [
                {
                    "dataset_id": "test-dataset-1",
                    "editions": [
                        "time-series"
                    ],
                    "title": "UK consumer price inflation",
                    "code_lists": [
                        {
                            "id": "64d384f1-ea3b-445c-8fb8-aa453f96e58a",
                            "href": "http://localhost:22400/code-lists/64d384f1-ea3b-445c-8fb8-aa453f96e58a",
                            "name": "time",
                            "is_hierarchy": false
                        },
                        {
                            "id": "65107A9F-7DA3-4B41-A410-6F6D9FBD68C3",
                            "href": "http://localhost:22400/code-lists/65107A9F-7DA3-4B41-A410-6F6D9FBD68C3",
                            "name": "geography",
                            "is_hierarchy": false
                        },
                        {
                            "id": "e44de4c4-d39e-4e2f-942b-3ca10584d078",
                            "href": "http://localhost:22400/code-lists/e44de4c4-d39e-4e2f-942b-3ca10584d078",
                            "name": "aggregate",
                            "is_hierarchy": true
                        }
                    ]
                }
            ]
        },
        {
            "id": "2943f3c5-c3f1-4a9a-aa6e-14d21c33524c",
            "alias": "CPIH",
            "format": "v4",
            "files": [
              {
                "description": "CPIH v4"
              }
            ],
            "output_instances": [
                {
                    "dataset_id": "cpih01",
                    "editions": [
                        "time-series"
                    ],
                    "title": "Consumer Prices Index including owner occupiers’ housing costs (CPIH)",
                    "code_lists": [
                        {
                            "id": "mmm-yy",
                            "href": "http://localhost:22400/code-lists/mmm-yy",
                            "name": "time",
                            "is_hierarchy": false
                        },
                        {
                            "id": "uk-only",
                            "href": "http://localhost:22400/code-lists/uk-only",
                            "name": "geography",
                            "is_hierarchy": false
                        },
                        {
                            "id": "cpih1dim1aggid",
                            "href": "http://localhost:22400/code-lists/cpih1dim1aggid",
                            "name": "aggregate",
                            "is_hierarchy": true
                        }
                    ]
                }
            ]
          }
    ]
}

let dispatchedActions, mockNotifications = [];

const defaultProps = {
    dispatch: event => {
        dispatchedActions.push(event);
    },
    rootPath: "/florence",
    location: {
        pathname: "florence/collections/12345/datasets/6789"
    },
    params: {
        datasetID: "test-dataset-1"
    }
};

const component = shallow(
    <CreateEditionController {...defaultProps} />
);

beforeEach(() => {
    mockNotifications = []
})

describe("Calling getDataset", () => {
    it("returns mapped dataset", async() => {
        const dataset = await component.instance().getDataset(mockedDataset.id);
        expect(dataset).toMatchObject({title: mockedDataset.current.title});
    })

    it("updates isFetchingDataset state to show it's fetching data for all datasets", () => {
        expect(component.state('isFetchingDataset')).toBe(false);

        // Tests that state is set correctly before asynchronous requests have finished
        component.instance().getDataset(mockedDataset.id);
        expect(component.state('isFetchingDataset')).toBe(true);
    })

    it("updates isFetchingDatasets state to show it has fetched data for all datasets", async () => {
        // Tests that state is set correctly after asynchronous requests were successful
        await component.instance().getDataset(mockedDataset.id);
        expect(component.state('isFetchingDataset')).toBe(false);
    });

    it("updates isFetchingDatasets state correctly on failure to fetch data for all datasets", async () => {
        datasets.get.mockImplementationOnce(() => (
            Promise.reject({ status: 500 })
        ));
        await component.instance().getDataset(mockedDataset.id);
        expect(component.state('isFetchingDataset')).toBe(false);
    });

    it("Errors cause notification", async () => {
        datasets.get.mockImplementationOnce(() => (
            Promise.reject({ status: 404 })
        ));
        await component.instance().getDataset(mockedDataset.id);
        expect(mockNotifications.length).toBe(1);
    });
});

describe("Calling getListOfEditions", () => {
    it("returns mapped editions", async() => {
        const editions = await component.instance().getListOfEditions();
        expect(editions[0]).toMatchObject(
            {
                id: mockedRecipeCall.items[0].output_instances[0].editions[0],
                name: mockedRecipeCall.items[0].output_instances[0].editions[0]
            }
        );
    })

    it("updates isFetchingEditions state to show it's fetching data for all editions", () => {
        expect(component.state('isFetchingEditions')).toBe(false);

        // Tests that state is set correctly before asynchronous requests have finished
        component.instance().getListOfEditions();
        expect(component.state('isFetchingEditions')).toBe(true);
    })

    it("updates isFetchingEditions state to show it has fetched data for all editions", async () => {
        // Tests that state is set correctly after asynchronous requests were successful
        await component.instance().getListOfEditions();
        expect(component.state('isFetchingEditions')).toBe(false);
    });

    it("updates isFetchingEditions state correctly on failure to fetch data for all editions", async () => {
        datasets.getEditions.mockImplementationOnce(() => (
            Promise.reject({ status: 500 })
        ));
        await component.instance().getListOfEditions();
        expect(component.state('isFetchingEditions')).toBe(false);
    });

    it("Errors cause notification", async () => {
        recipes.getAll.mockImplementationOnce(() => (
            Promise.reject({ status: 404 })
        ));
        await component.instance().getListOfEditions();
        expect(mockNotifications.length).toBe(1);
    });
});

test("Mapping dataset to state", () => {
    const mappedDataset = component.instance().mapDatasetToState(mockedDataset);
    expect(mappedDataset).toMatchObject({ title: mockedDataset.current.title });
})

describe("Mapping edition to state", () => {
    it("returns correct value", () => {
        const mappedEditions = component.instance().mapEditionsToState(mockedRecipeCall.items);
        expect(mappedEditions[0]).toMatchObject({
            id: mockedRecipeCall.items[0].output_instances[0].editions[0],
            name: mockedRecipeCall.items[0].output_instances[0].editions[0]
            }
        );
    })

    it("displays error if no matches between dataset and recipe found", () => {
        component.setProps({params: {datasetID: "12345"}})
        component.instance().mapEditionsToState(mockedRecipeCall.items);
        expect(mockNotifications.length).toBe(1);
    })
});

test("Map recipe to state", () => {
    const mappedRecipe = component.instance().filterEditionsListFromRecipe(mockedRecipeCall.items[0])
    expect(mappedRecipe[0]).toMatchObject({
        id: mockedRecipeCall.items[0].output_instances[0].editions[0],
        name: mockedRecipeCall.items[0].output_instances[0].editions[0]
        }
    );
})

test("Handle selection updates state correctly", () => {
    expect(component.state().selectedEdition).toBe(null);
    component.instance().handleEditionSelection({target: {value: "test-edition"}})
    expect(component.state().selectedEdition).toBe("test-edition");
})