import React, { Component } from 'react';
import { CollectionsController } from './CollectionsController';
import { shallow } from 'enzyme';
import { ADD_ALL_COLLECTIONS } from '../../config/actions';
import collectionMapper from './mapper/collectionMapper';

console.error = () => {};

jest.mock('../../utilities/log', () => {
    return {
        add: function() {},
        eventTypes: {}
    }
});

jest.mock('../../utilities/notifications', () => {
    return {
        add: jest.fn(() => {}),
        remove: () => {}
    }
});

jest.mock('../../utilities/api-clients/collections', () => {
    return {
        getAll: () => {
            return Promise.resolve(mockedAllCollections);
        },
        deletePage: () => {
            return Promise.resolve();
        },
        approve: jest.fn().mockImplementationOnce(() => {
            return Promise.reject({status: 500});
        }).mockImplementation(() => {
            return Promise.resolve()
        }),
        delete: jest.fn().mockImplementationOnce(() => {
            return Promise.reject({status: 500})
        }).mockImplementation(() => {
            return Promise.resolve()
        }),
        get: () => {
            return Promise.reject({status: 404});
        }
    }
});

jest.mock('./mapper/collectionMapper.js', () => ({
    collectionResponseToState: jest.fn(collection => ({
        id: collection.id
    }))
}));

const mockedAllCollections = [
    {
        "approvalStatus": "NOT_STARTED",
        "publishComplete": false,
        "isEncrypted": false,
        "collectionOwner": "hello",
        "timeseriesImportFiles": [],
        "id": "anothercollection-91bc818cff240fa546c84b0cc4c3d32f0667de3068832485e254c17655d5b4ad",
        "name": "Another collection",
        "type": "manual",
        "teams": []
    },
    {
        "approvalStatus": "IN_PROGRESS",
        "publishComplete": false,
        "isEncrypted": false,
        "collectionOwner": "PUBLISHING_SUPPORT",
        "timeseriesImportFiles": [],
        "id": "asdasdasd-04917444856fa9ade290b8847dee1f24e7726d71e1a7378c2557d949b6a6968c",
        "name": "asdasdasd",
        "type": "manual",
        "teams": []
    },
    {
        "approvalStatus": "IN_PROGRESS",
        "publishComplete": false,
        "isEncrypted": false,
        "collectionOwner": "PUBLISHING_SUPPORT",
        "timeseriesImportFiles": [],
        "id": "test-collection-12345",
        "name": "Test collection",
        "type": "manual",
        "teams": ['cpi', 'cpih']
    },
    {
        "approvalStatus": "ERROR",
        "publishComplete": false,
        "isEncrypted": false,
        "collectionOwner": "PUBLISHING_SUPPORT",
        "timeseriesImportFiles": [ ],
        "id": "different-collection-12345",
        "name": "Test",
        "type": "manual",
        "teams": [
            "Team 2"
        ]
    },
    {
        "approvalStatus": "COMPLETE",
        "publishComplete": false,
        "isEncrypted": false,
        "collectionOwner": "PUBLISHING_SUPPORT",
        "timeseriesImportFiles": [ ],
        "id": "test-sau39393uyqha8aw8y3n3",
        "name": "Complete collection",
        "type": "manual",
        "teams": [
            "Team 2"
        ]
    }
];

const collection = {
    id: 'testcollection-12345',
    name: 'Test collection',
    type: 'manual',
    teams: ['cpi', 'cpih'],
    inProgress: [
        {
            uri: "/",
            type: "homepage",
            description: {
                title: "Home"
            },
            events: [
                {
                    email: "foobar@email.com",
                    date: "2017-12-14T11:36:03.402Z"
                }
            ]
        },
        {
            uri: "/economy/inflationsandprices/consumerinflation/bulletins/consumerpriceinflation/july2017",
            type: "bulletin",
            description: {
                title: "Consumer Price Inflation",
                edition: "July 2017"
            },
            events: [
                {
                    email: "foobar@email.com",
                    date: "2017-12-14T11:36:03.402Z"
                }
            ]
        }
    ],
    complete: [
        {
            uri: "/businessindustryandtrade",
            type: "taxonomy_landing_page",
            description: {
                title: "Business industry and trade"
            },
            events: [
                {
                    email: "foobar@email.com",
                    date: "2017-12-14T11:36:03.402Z"
                },
                {
                    email: "foobar@email.com",
                    date: "2017-12-10T10:21:43.402Z"
                }
            ]
        }
    ],
    reviewed: [],
    deletes: [{
        user: "foobar@email.com",
        root: {
            uri: "/about/surveys",
            type: "generic_static_page",
            description: {
                title: "Surveys"
            },
            children: [],
            deleteMarker: true,
            contentPath: "/about/surveys"
        },
        totalDeletes: 1
    }],
    datasets: [],
    datasetVersion: []
};

let dispatchedActions = [];

const defaultProps = {
    dispatch: event => {
        dispatchedActions.push(event);
    },
    rootPath: "/florence",
    params: {},
    user: {
        userType: "ADMIN"
    },
    collections: [],
    activeCollection: null,
    collectionsToDelete: {},
    routes: [{}]
};

const component = shallow(
    <CollectionsController {...defaultProps} />
);

describe("On creation of a collection", () => {

    beforeEach(() => {
        // Reset our record of the dispatched actions, so now to break future tests
        dispatchedActions = [];
    });

    const createdCollection = {
        approvalStatus: "NOT_STARTED",
        events: [{}],
        id: "anewtestcollection-12345",
        name: "A new test collection",
        publishComplete: false,
        teams: [],
        timeseriesImportFiles: [],
        type: "manual"
    };

    it("adds the new collection to the list of all collections in state", () => {
        component.instance().handleCollectionCreateSuccess(createdCollection);
        const action = dispatchedActions[0];
        expect(action.type).toBe(ADD_ALL_COLLECTIONS);
        expect(action.collections.some(collection => collection.id === "anewtestcollection-12345")).toBe(true);
    });
    
    it("maps the new collection to the structure expected for adding to state", () => {
        const mapperCalls = collectionMapper.collectionResponseToState.mock.calls.length;
        component.instance().handleCollectionCreateSuccess(createdCollection);

        expect(dispatchedActions[0].type).toBe(ADD_ALL_COLLECTIONS);
        expect(collectionMapper.collectionResponseToState.mock.calls.length).toBe(mapperCalls+1);
    });
    
    it("routes to the URL of the new collection", () => {
        component.instance().handleCollectionCreateSuccess(createdCollection);
        expect(dispatchedActions[1].type).toBe("@@router/CALL_HISTORY_METHOD");
        expect(dispatchedActions[1].payload.method).toBe("push");
        expect(dispatchedActions[1].payload.args[0]).toBe("/florence/collections/anewtestcollection-12345");
    });
});


// TODO: 
// - on create it adds new collection to state [DONE]
// - on create it maps the new collection to the expected structure
// - on create it routes to the URL of the new collection
// - fetches all collections on load
// - changes state to show that all collections are being fetched
// - excludes collections that are in the publish queue or published
// - removes the active collection on unmount
// - routes to the URL when a collection is selected from the list
// - test case for removing collections 
// - test case for not removing collections until collections are fetched
