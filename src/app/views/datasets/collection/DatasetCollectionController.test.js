import React from 'react';
import { DatasetCollectionController } from './DatasetCollectionController';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';


jest.mock('../../../utilities/notifications', () => {
    return {
        add: jest.fn(() => {
            //
        })
    }
});
jest.mock('../../../utilities/url', () => {
    return {
        resolve: function() {
            return "test"
        },
        parent: function() {}
    }
});

jest.mock('../../../utilities/api-clients/collections', () => (
    {
        addDataset: jest.fn(() => {
            return Promise.resolve();
        }),
        getAll: jest.fn(() => {
            return Promise.reject([
                {
                    name: "Collection 1",
                    id: "1",
                    path: "collection_1_1"
                },
                {
                    name: "Collection 2",
                    id: "2",
                    path: "collection_2_2"
                },
                {
                    name: "Collection 3",
                    id: "3",
                    path: "collection_3_3"
                }
            ]);
        })
    }
));

const collections = [
    {
        name: "Collection 1",
        id: "1",
        path: "collection_1_1",
        type: "manual"
    },
    {
        name: "Collection 2",
        id: "2",
        path: "collection_2_2",
        type: "manual"
    },
    {
        name: "Collection 3",
        id: "3",
        path: "collection_3_3",
        type: "manual"
    }
];

const mockEvent = {
    target: {
        value: "1"
    }
};

const desiredSelectedCollection = {
    id: "1",
    name: "Collection 1",
    releaseDate: "",
    releaseTime: "",
    type: "manual"
};

const formEvent = {
    preventDefault: () => {}
};

test('Selecting a collection updates selected collection in state', async () => {
    const props = {
        params: {
            datasetID: "dataset-1"
        }
    };
    const component = shallow(
        <DatasetCollectionController {...props}/>
    );
    component.setState({allCollections: collections});
    expect(component.state('selectedCollection')).toEqual({});
    await component.instance().handleCollectionChange(mockEvent);
    expect(component.state('selectedCollection')).toMatchObject(desiredSelectedCollection);
});

test('Back button on success screen updates hasChosen state to false to trigger a change in view', async () => {
    const props = {
        params: {
            datasetID: "dataset-1"
        }
    };
    const component = shallow(
        <DatasetCollectionController {...props}/>
    );
    component.setState({hasChosen: true});
    await component.instance().handleOnBackFromSuccess();
    expect(component.state('hasChosen')).toBe(false);
});

test('Error is returned on submit if no selection is made', async () => {
    const props = {
        params: {
            datasetID: "dataset-1"
        }
    };
    const component = shallow(
        <DatasetCollectionController {...props}/>
    );
    expect(component.state('errorMsg')).toEqual("");
    await component.instance().handleSubmit(formEvent);
    expect(component.state('errorMsg')).toEqual("You must select a collection");
});

test('Form is submitted if a collection has been selected', async () => {
    const props = {
        params: {
            datasetID: "dataset-1"
        }
    };
    const component = shallow(
        <DatasetCollectionController {...props}/>
    );
    expect(component.state('isSubmitting')).toBe(false);
    component.setState({selectedCollection: desiredSelectedCollection});
    await component.instance().handleSubmit(formEvent);
    expect(component.state('hasChosen')).toBe(true);
});



