import React from 'react';
import { CreateVersionController } from './CreateVersionController';
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
        getEdition: jest.fn(() => {
            return Promise.resolve(mockedEdition);
        }),
        getVersion: jest.fn(() => {
            return Promise.resolve(mockedVersions[0]);
        }),
        getAllVersions: jest.fn(() => {
            return Promise.resolve(mockedVersions);
        }),
        getCompletedInstancesForDataset: jest.fn(() => {
            return Promise.resolve(mockedCompletedInstancesCall);
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

const mockedEdition = {
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
};

const mockedVersions = [
    {
        alerts: [],
        edition: "edition-1",
        id: "6b59a885-f4ca-4b78-9b89-4e9a8e939d55",
        release_date: "2018-09-07T00:00:00.000Z",
        state: "published",
        version: 1
    },
    {
        alerts: [],
        edition: "edition-2",
        id: "6b59a885-f4ca-4b78-9b89-4e9a8e939d55",
        release_date: "2018-09-07T00:00:00.000Z",
        state: "published",
        version: 2
    }
]

const mockedCompletedInstancesCall = {
    "items": [
        {
            "dimensions": [
                {
                    "links": {
                        "code_list": {},
                        "options": {},
                        "version": {}
                    },
                    "href": "http://localhost:22400/code-lists/mmm-yy",
                    "id": "mmm-yy",
                    "name": "time"
                },
                {
                    "links": {
                        "code_list": {},
                        "options": {},
                        "version": {}
                    },
                    "href": "http://localhost:22400/code-lists/uk-only",
                    "id": "uk-only",
                    "name": "geography"
                },
                {
                    "links": {
                        "code_list": {},
                        "options": {},
                        "version": {}
                    },
                    "href": "http://localhost:22400/code-lists/cpih1dim1aggid",
                    "id": "cpih1dim1aggid",
                    "name": "aggregate"
                }
            ],
            "edition": "time-series",
            "headers": [
                "V4_0",
                "time",
                "time",
                "uk-only",
                "geography",
                "cpih1dim1aggid",
                "aggregate"
            ],
            "import_tasks": {
                "build_hierarchies": [
                    {
                        "code_list_id": "cpih1dim1aggid",
                        "dimension_name": "aggregate",
                        "state": "completed"
                    }
                ],
                "build_search_indexes": [
                    {
                        "dimension_name": "aggregate",
                        "state": "completed"
                    }
                ],
                "import_observations": {
                    "total_inserted_observations": 21855,
                    "state": "completed"
                }
            },
            "id": "4fc447fe-ebaf-4c29-a363-fc0a8aefaec1",
            "last_updated": "2019-01-14T09:25:51.271Z",
            "links": {
                "dataset": {
                    "href": "http://localhost:22000/datasets/cpih01",
                    "id": "cpih01"
                },
                "job": {
                    "href": "http://localhost:21800/jobs/49863913-008c-4ee5-86e9-80b12f28a2ec",
                    "id": "49863913-008c-4ee5-86e9-80b12f28a2ec"
                },
                "self": {
                    "href": "http://localhost:22000/instances/4fc447fe-ebaf-4c29-a363-fc0a8aefaec1"
                }
            },
            "state": "completed",
            "total_observations": 21855
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
        datasetID: "test-dataset-1",
        editionID: "test-edition-1"
    }
};

const component = shallow(
    <CreateVersionController {...defaultProps} />
);

beforeEach(() => {
    mockNotifications = []
})

describe("Calling getDataset", () => {
    it("returns mapped dataset", async () => {
        const dataset = await component.instance().getDataset(mockedDataset.id);
        expect(dataset).toMatchObject({ title: mockedDataset.current.title });
    })

    it("adds mapped dataset to state", async() => {
        await component.instance().getDataset(mockedDataset.id);
        expect(component.state().dataset).toMatchObject({ title: mockedDataset.current.title });
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

describe("Get edition", () => {
    it("returns mapped edition", async () => {
        const edition = await component.instance().getEdition(mockedEdition.id);
        expect(edition).toMatchObject({ title: mockedEdition.current.edition });
    })

    it("adds mapped edition to state", async() => {
        await component.instance().getEdition(mockedEdition.id);
        expect(component.state().edition).toMatchObject({ title: mockedEdition.current.edition });
    })

    it("updates isFetchingDataset state to show it's fetching data for all datasets", () => {
        expect(component.state('isFetchingEdition')).toBe(false);

        // Tests that state is set correctly before asynchronous requests have finished
        component.instance().getEdition(mockedDataset.id, mockedEdition.id);
        expect(component.state('isFetchingEdition')).toBe(true);
    })

    it("updates isFetchingDatasets state to show it has fetched data for all datasets", async () => {
        // Tests that state is set correctly after asynchronous requests were successful
        await component.instance().getEdition(mockedDataset.id, mockedEdition.id);
        expect(component.state('isFetchingEdition')).toBe(false);
    });

    it("updates isFetchingDatasets state correctly on failure to fetch data for all datasets", async () => {
        datasets.get.mockImplementationOnce(() => (
            Promise.reject({ status: 500 })
        ));
        await component.instance().getEdition(mockedDataset.id, mockedEdition.id);
        expect(component.state('isFetchingEdition')).toBe(false);
    });
});

test("Mapping dataset to state", () => {
    const mappedDataset = component.instance().mapDatasetToState(mockedDataset);
    expect(mappedDataset).toMatchObject({ title: mockedDataset.current.title });
})

test("Mapping edition to state", () => {
    const mappedEdition = component.instance().mapDatasetEditionToState(mockedEdition);
    expect(mappedEdition).toMatchObject({ title: mockedEdition.current.edition });
});


