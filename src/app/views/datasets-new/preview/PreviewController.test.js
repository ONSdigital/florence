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
        add: jest.fn(() => {}),
        remove: () => {}
    }
});

jest.mock('../../../utilities/api-clients/datasets', () => {
    return {
        get: jest.fn(() => {
            return Promise.resolve(mockedDatasets);
        }),
    }
});

const mockedDatasets = {
    "id": "test-dataset",
    "next": {
        "collection_id": "1234567890",
        "id": "test-dataset",
        "title": "Test Dataset"
    },
};

let dispatchedActions = [];

const defaultProps = {
    dispatch: event => {
        dispatchedActions.push(event);
    },
    rootPath: "/florence",
    location: {
        pathname: "florence/collections/mockCollection/datasets/test-dataset/editions/time-series/versions/1/new-preview"
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

describe("Get datasets", () => {
    it("Geting Dataset Title", async () => {
        await component.instance().getDataset('datasetID');
        expect(component.state('datasetTitle')).toBe("Test Dataset");
    });
    it("Updateing isLoadingPreview", async () => {
        expect(component.state('isLoadingPreview')).toBe(false);
        component.instance().getDataset('datasetID');
        expect(component.state('isLoadingPreview')).toBe(true);
        await component.instance().getDataset('datasetID');
        expect(component.state('isLoadingPreview')).toBe(false);
    });
});

describe("correct data on completed", () => {
    it("Preview is Loaded", async () => {
        const expectedValue = {
            collectionID: defaultProps.params.collectionID,
            datasetID: defaultProps.params.datasetID,
            datasetTitle: "Test Dataset",
            edition: defaultProps.params.edition,
            version: defaultProps.params.version,
            errorFetchingDataset: false,
            isLoadingPreview: false,
        }
        await component.instance().componentWillMount();
        expect(component.instance().state).toEqual(expectedValue);
        console.log(component.instance().state);
    });
});
