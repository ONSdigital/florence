import React from 'react';
import { PreviewController } from './PreviewController';
import { shallow, mount } from 'enzyme';
import datasets from '../../../utilities/api-clients/datasets';

console.error = () => {};

jest.mock('../../../utilities/log', () => {
    return {
        add: function() {},
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
    }
});

const mockedDataset = {
    "id": "test-dataset",
    "current": {
        "collection_id": "1234567890",
        "id": "test-dataset",
        "title": "Test Dataset"
    },
};

let dispatchedActions, mockNotifications = [];

const defaultProps = {
    dispatch: event => {
        dispatchedActions.push(event);
    },
    rootPath: "/florence",
    location: {
        pathname: "florence/collections/mockCollection/datasets/test-dataset/editions/time-series/versions/1/preview"
    },
    params: {
        collectionID: "mockCollection",
        datasetID: "test-dataset",
        edition: "time-series",
        version: "1"
    },
};

const component = shallow(
    <PreviewController {...defaultProps} />
);

beforeEach(() => {
    mockNotifications = []
})

describe("Calling getDataset", () => {

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

test("Mapping dataset to state", () => {
    const mappedDataset = component.instance().mapDatasetToState(mockedDataset);
    expect(mappedDataset).toMatchObject({ title: mockedDataset.current.title });
})
