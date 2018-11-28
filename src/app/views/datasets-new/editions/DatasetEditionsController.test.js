import React from 'react';
import { DatasetEditionsController } from './DatasetEditionsController';
import { shallow, mount } from 'enzyme';
import datasets from '../../../utilities/api-clients/datasets';

console.error = () => { };

jest.mock('../../../utilities/log', () => {
    return {
        add: function () { },
        eventTypes: {}
    }
});

jest.mock('../../../utilities/notifications', () => {
    return {
        add: jest.fn((notification) => {mockNotifications.push(notification)}),
        remove: () => { }
    }
});

jest.mock('../../../utilities/api-clients/datasets', () => {
    return {
        get: jest.fn(() => {
            return Promise.resolve(mockedDataset);
        }),
        getEditions: jest.fn(() => {
            return Promise.resolve(mockedDataset);
        }),
        getVersion: jest.fn(() => {
            return Promise.resolve(mockedDataset);
        }),
    }
});

const mockedDataset = {
    "id": "test-dataset-1",
    "current": {
        "collection_id": "1234567890",
        "id": "test-dataset-1",
        "title": "Test Dataset 1"
    }
};

const mockedEditions = [
    {
        "id": "test-1",
        "current": {
            "edition": "time-series",
            "links": {
                "latest_version": {
                    "href": "test/3",
                    "id": "3"
                },
            },
            "state": "published"
        },
    },
    {
        "id": "test-2",
        "current": {
            "edition": "time-series",
            "links": {
                "latest_version": {
                    "href": "test/3",
                    "id": "3"
                },
            },
            "state": "published"
        },
    },
];

let dispatchedActions, mockNotifications = [];

const defaultProps = {
    dispatch: event => {
        dispatchedActions.push(event);
    },
    rootPath: "/florence",
    location: {
        pathname: "florence/collections/12345/datasets/6789"
    }
};

const component = shallow(
    <DatasetEditionsController {...defaultProps} />
);

beforeEach(() => {
    mockNotifications = []
})

describe("Calling getDataset", () => {
    it("adds dataset to state", () => {
        expect(component.state().dataset).toMatchObject({})
        component.instance().getDataset(mockedDataset.id);
        expect(component.state().dataset.title).toBe(mockedDataset.title);
    })

    it("updates isFetchingDataset state to show it's fetching data for all datasets", () => {
        expect(component.state('isFetchingDataset')).toBe(false);

        // Tests that state is set correctly before asynchronous requests have finished
        component.instance().getDataset();
        expect(component.state('isFetchingDataset')).toBe(true);

    }) 

    it("updates isFetchingDatasets state to show it has fetched data for all datasets", async () => {
        // Tests that state is set correctly after asynchronous requests were successful
        await component.instance().getDataset();
        expect(component.state('isFetchingDataset')).toBe(false);
    });

    it("updates isFetchingDatasets state correctly on failure to fetch data for all datasets", async () => {
        datasets.get.mockImplementationOnce(() => (
            Promise.reject({status: 500})
        ));
        await component.instance().getDataset();
        expect(component.state('isFetchingDataset')).toBe(false);
    });

    it("Errors cause notification", async () => {
        datasets.get.mockImplementationOnce(() => (
            Promise.reject({status: 404})
        ));
        await component.instance().getDataset();
        expect(mockNotifications.length).toBe(1);
    });
});

describe("Calling getEditions", () => {
    // it("adds editions to state", async () => {
    //     expect(component.state().editions.length).toBe(1)
    //     await component.instance().getEditions(mockedDataset.id);
    //     expect(component.state().editions.length).toBe(mockedEditions.length);
    // })

    it("updates isFetchingEditions state to show it's fetching data for all editions", () => {
        expect(component.state('isFetchingEditions')).toBe(false);

        // Tests that state is set correctly before asynchronous requests have finished
        component.instance().getEditions();
        expect(component.state('isFetchingEditions')).toBe(true);
    }) 

    it("updates isFetchingEditions state to show it has fetched data for all editions", async () => {
        // Tests that state is set correctly after asynchronous requests were successful
        await component.instance().getEditions();
        expect(component.state('isFetchingEditions')).toBe(false);
    });

    it("updates isFetchingEditions state correctly on failure to fetch data for all editions", async () => {
        datasets.getEditions.mockImplementationOnce(() => (
            Promise.reject({status: 500})
        ));
        await component.instance().getEditions();
        expect(component.state('isFetchingEditions')).toBe(false);
    });

    it("Errors cause notification", async () => {
        datasets.getEditions.mockImplementationOnce(() => (
            Promise.reject({status: 404})
        ));
        await component.instance().getEditions();
        console.log(mockNotifications)
        expect(mockNotifications.length).toBe(1);
    });
});

// describe("Mapping datasets to state", () => {
//     it("maps correctly", () => {
//         const expectedValue = [
//             {
//                 title: mockedAllDatasets.items[0].current.title, 
//                 id: mockedAllDatasets.items[0].current.id,
//                 url: defaultProps.location.pathname + "/" + mockedAllDatasets.items[0].current.id
//             },
//             {
//                 title: mockedAllDatasets.items[1].current.title, 
//                 id: mockedAllDatasets.items[1].current.id,
//                 url: defaultProps.location.pathname + "/" + mockedAllDatasets.items[1].current.id
//             },
//         ]
//         const returnValue = component.instance().mapDatasetsToState(mockedAllDatasets.items);
//         expect(returnValue[0]).toMatchObject(expectedValue[0]);
//         expect(returnValue[1]).toMatchObject(expectedValue[1]);
//     })
// });

test("Mapping dataset to state", () => {
    const mappedDataset = component.instance().mapDatasetToState(mockedDataset);
    expect(mappedDataset).toMatchObject({ title: mockedDataset.current.title });
})

test("Mapping edition to state", () => {
    const expectedMappedEdition = {
        title: "Dataset Title",
        id: mockedEditions[0].current.edition,
        url:  defaultProps.location.pathname + "/editions/" + mockedEditions[0].current.edition,
        details: [
            "Edition: " + mockedEditions[0].current.edition,
            "Release date: loading..."
        ],
        latestVersion: mockedEditions[0].current.links.latest_version.id
    }
    // componenet gets dataset info and stores in state, so set it for this test
    component.setState({dataset: {title: "Dataset Title"}})
    const mappedEditions = component.instance().mapDatasetEditionsToView(mockedEditions);
    expect(mappedEditions[0]).toMatchObject(expectedMappedEdition);
})

// test("Mapping release date to edition", async () => {
//     const thing = await component.instance().mapVersionReleaseDatesToEditions(mockedDataset.id, mockedEditions);
//     console.log(thing)
// })