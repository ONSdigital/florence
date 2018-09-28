import React, { Component } from 'react';
import { CollectionsController, mapStateToProps } from './CollectionsController';
import { shallow } from 'enzyme';
import { ADD_ALL_COLLECTIONS, EMPTY_ACTIVE_COLLECTION, DELETE_COLLECTION_FROM_ALL_COLLECTIONS } from '../../config/actions';
import collectionMapper from './mapper/collectionMapper';
import collections from '../../utilities/api-clients/collections';

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
        getAll: jest.fn(() => {
            return Promise.resolve(mockedAllCollections);
        }),
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
        },
        removeDataset: () => {
            return Promise.resolve();
        },
        removeDatasetVersion: () => {
            return Promise.resolve();
        },
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

// const collection = {
//     id: 'test-collection-12345',
//     name: 'Test collection',
//     type: 'manual',
//     teams: ['cpi', 'cpih'],
//     inProgress: [
//         {
//             uri: "/",
//             type: "homepage",
//             description: {
//                 title: "Home"
//             },
//             events: [
//                 {
//                     email: "foobar@email.com",
//                     date: "2017-12-14T11:36:03.402Z"
//                 }
//             ]
//         },
//         {
//             uri: "/economy/inflationsandprices/consumerinflation/bulletins/consumerpriceinflation/july2017",
//             type: "bulletin",
//             description: {
//                 title: "Consumer Price Inflation",
//                 edition: "July 2017"
//             },
//             events: [
//                 {
//                     email: "foobar@email.com",
//                     date: "2017-12-14T11:36:03.402Z"
//                 }
//             ]
//         }
//     ],
//     complete: [
//         {
//             uri: "/businessindustryandtrade",
//             type: "taxonomy_landing_page",
//             description: {
//                 title: "Business industry and trade"
//             },
//             events: [
//                 {
//                     email: "foobar@email.com",
//                     date: "2017-12-14T11:36:03.402Z"
//                 },
//                 {
//                     email: "foobar@email.com",
//                     date: "2017-12-10T10:21:43.402Z"
//                 }
//             ]
//         }
//     ],
//     reviewed: [],
//     deletes: [{
//         user: "foobar@email.com",
//         root: {
//             uri: "/about/surveys",
//             type: "generic_static_page",
//             description: {
//                 title: "Surveys"
//             },
//             children: [],
//             deleteMarker: true,
//             contentPath: "/about/surveys"
//         },
//         totalDeletes: 1
//     }],
//     datasets: [
//         {
//             id: "98261-28374-18272",
//             title: "A test dataset",
//             state: "Reviewed"
//         },
//         {
//             id: "23444-342-5666",
//             title: "A second test dataset",
//             state: "InProgress"
//         },
//         {
//             id: "457453-3453452-3334544",
//             title: "A third test dataset",
//             state: "Complete"
//         }
//     ],
//     datasetVersions: [
//         {
//             id: "98da8ah2-a8ah3-ajaj3",
//             title: "A test dataset version",
//             edition: "2017",
//             version: "1",
//             state: "Reviewed"
//         },
//         {
//             id: "ks0ttt-20aoaaoa-e83829ja",
//             title: "A second test version",
//             edition: "2015",
//             version: "3",
//             state: "InProgress"
//         },
//         {
//             id: "983hja93-asjehsd8-a92723",
//             title: "A third test version",
//             edition: "time-series",
//             state: "Complete",
//             version: "2"
//         }
//     ]
// }
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

beforeEach(() => {
    // Reset our record of the dispatched actions, so now to break future tests
    dispatchedActions = [];
});

describe("On mount of the collections screen", () => {
    it("fetches data for all collections", () => {
        const getCollectionsCalls = collections.getAll.mock.calls.length;
        component.instance().componentWillMount();
        expect(collections.getAll.mock.calls.length).toBe(getCollectionsCalls+1);
    });

    it("updates state to show it's fetching data for all collections", async () => {
        expect(component.state('isFetchingCollections')).toBe(false);

        // Tests that state is set correctly before asynchronous requests have finished
        component.instance().componentWillMount();
        expect(component.state('isFetchingCollections')).toBe(true);

        // Tests that state is set correctly after asynchronous requests were successful
        await component.instance().componentWillMount();
        expect(component.state('isFetchingCollections')).toBe(false);

        // Tests that state is set correctly when asynchronous requests failed
        collections.getAll.mockImplementationOnce(() => (
            Promise.reject({status: 500})
        ));
        await component.instance().componentWillMount();
        expect(component.state('isFetchingCollections')).toBe(false);
    });

    it("excludes adding collections to state that are in the publish queue or published", async () => {
        // Verify that the collection we expect to be excluded will be returned on mount 
        // otherwise this test could give a false positive
        expect(mockedAllCollections.some(collection => collection.id === "test-sau39393uyqha8aw8y3n3")).toBe(true);

        await component.instance().componentWillMount();
        expect(dispatchedActions[0].collections.length).toBe(mockedAllCollections.length-1);
        expect(dispatchedActions[0].collections.some(collection => collection.id === "test-sau39393uyqha8aw8y3n3")).toBe(false);
    });
});

describe("On unmount of the collections screen", () => {
    it("removes the active collection from state, if it has one", () => {
        component.setProps({activeCollection: {
            id: "test-collection-12345",
            name: "Test collection"
        }});
        component.instance().componentWillUnmount();
        expect(dispatchedActions[0].type).toBe(EMPTY_ACTIVE_COLLECTION);
    });

    it("doesn't attempt to remove the active collection from state if one isn't set", () => {
        component.setProps({activeCollection: null});
        component.instance().componentWillUnmount();
        expect(dispatchedActions).toEqual([]);
    });
});

describe("Selecting a collection", () => {
    it("routes to the collection's URL", () => {
        component.instance().handleCollectionSelection({id: "testcollection-12345"});
        expect(dispatchedActions[0].type).toBe("@@router/CALL_HISTORY_METHOD");
        expect(dispatchedActions[0].payload.method).toBe("push");
        expect(dispatchedActions[0].payload.args[0]).toBe("/florence/collections/testcollection-12345");
    });
});

describe("On creation of a collection", () => {
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

describe("Marking a collection to be deleted from list of collections", () => {
    it("removes the collection from state", () => {
        component.setProps({
            collectionsToDelete: {"test-collection-12345": null}
        });
        expect(dispatchedActions[0].type).toBe(DELETE_COLLECTION_FROM_ALL_COLLECTIONS);
        expect(dispatchedActions[0].collectionID).toBe("test-collection-12345");
    });

    it("doesn't remove the collection if all collections are still being fetched", () => {
        component.instance().componentWillMount();
        expect(component.state("isFetchingCollections")).toBe(true);
        component.setProps({
            collectionsToDelete: {"test-collection-12345": null}
        });
        expect(dispatchedActions).toMatchObject([]);
    });
});

describe("mapStateToProps function", () => {
    const state = {
        state: {
            user: {userType: "ADMIN"},
            collections: {
                all: [
                    {id: "an-example-collection-12345"},
                    {id: "deleted-example-collection-12345"}
                ],
                active: {id: "an-example-collection-12345"},
                toDelete: {"deleted-example-collection-12345": null}
            },
            rootPath: "/florence"
        }
    };

    const mappedProps = mapStateToProps(state);

    it("returns the 'user' object", () => {
        expect(mappedProps.user).toMatchObject({
            userType: "ADMIN"
        });
    });
    
    it("returns the list of collections", () => {
        expect(mappedProps.collections).toMatchObject([{id: "an-example-collection-12345"},{id: "deleted-example-collection-12345"}]);
    });

    it("returns the active collection", () => {
        expect(mappedProps.activeCollection).toMatchObject({id: "an-example-collection-12345"});
    });
    
    it("returns the map of collection to be deleted", () => {
        expect(mappedProps.collectionsToDelete).toMatchObject({"deleted-example-collection-12345": null});
    });
    
    it("returns the application's root path", () => {
        expect(mappedProps.rootPath).toBe("/florence");
    });
});