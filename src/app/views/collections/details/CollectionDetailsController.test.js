import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import {CollectionDetailsController, mapStateToProps} from './CollectionDetailsController';
import collections from '../../../utilities/api-clients/collections';
import notifications from '../../../utilities/notifications';
import { MARK_COLLECTION_FOR_DELETE_FROM_ALL_COLLECTIONS, UPDATE_PAGES_IN_ACTIVE_COLLECTION } from '../../../config/actions';

console.error = () => {};

jest.mock('../../../utilities/notifications', () => ({
    add: jest.fn(() => {}),
    remove: jest.fn(() => {}),
}));

jest.mock('../../../utilities/log', () => ({
    add: jest.fn(() => {}),
    eventTypes: {}
}));

jest.mock('../../../utilities/cookies', () => ({
    add: jest.fn(() => {})
}));

jest.mock('../../../utilities/api-clients/collections', () => ({
    get: jest.fn(() => {
        return Promise.resolve({})
    }),
    delete: jest.fn(() => {
        return Promise.resolve({})
    })
}));

function setLocation(href) {
    Object.defineProperty(window.location, 'href', {
        writable: true,
        value: href,
    });
    Object.defineProperty(window.location, 'pathname', {
        writable: true,
        value: href.substring(href.indexOf("/florence")),
    });
}

let dispatchedActions = [];

const defaultProps = {
    dispatch: action => {
        dispatchedActions.push(action);
    },
    rootPath: '/florence',
    routes:[{}],
    collectionID: undefined,
    activePageURI: undefined,
    activeCollection: null,
    user: {
        userType: ""
    },
    location: {
        hash: ""
    },
    collections: [
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
    ]
};

const component = shallow(
    <CollectionDetailsController {...defaultProps} />
)

// Create a mounted component for when we need access to data in the component's props (e.g. the `collections` array), 
// which are only available on a full mount, not a shallow render.
const componentWithProps = mount(
    <CollectionDetailsController {...defaultProps} />
)

beforeEach(() => {
    dispatchedActions = [];
});

describe("When the active collection parameter changes", () => {
    it("from collections root to a collection ID it sets the collection details to show", () => {
        component.setProps({collectionID: "asdasdasd-04917444856fa9ade290b8847dee1f24e7726d71e1a7378c2557d949b6a6968c"});
        expect(component.state('drawerIsVisible')).toBe(true);
        expect(component.state('drawerIsAnimatable')).toBe(true);
        component.instance().handleDrawerTransitionEnd();
        expect(component.state('drawerIsAnimatable')).toBe(false);
    });
    
    it("from one collection ID to another, it keeps the collection details showing without animating", () => {
        component.setProps({collectionID: "different-collection-12345"});
        expect(component.state('drawerIsVisible')).toBe(true);
        expect(component.state('drawerIsAnimatable')).toBe(false);
    });
    
    it("from one collection ID to another, it fetches the details for the new collection", () => {
        const callsCounter = collections.get.mock.calls.length;
        component.setProps({collectionID: "test-collection-12345"});
        expect(collections.get.mock.calls.length).toBe(callsCounter + 1);
        expect(collections.get.mock.calls[callsCounter][0]).toBe("test-collection-12345");
    });
    
    it.only("from one collection ID to another, it updates collection name and date instantly", () => {
        component.setProps({collectionID: "different-collection-12345"});
        component.setProps({collectionID: "asdasdasd-04917444856fa9ade290b8847dee1f24e7726d71e1a7378c2557d949b6a6968c"});
        expect(dispatchedActions[1].collection).toBeTruthy();
        expect(dispatchedActions[1].collection.id).toBe("asdasdasd-04917444856fa9ade290b8847dee1f24e7726d71e1a7378c2557d949b6a6968c");
        expect(dispatchedActions[1].collection.name).toBe("asdasdasd");
        expect(dispatchedActions[1].collection.type).toBe("manual");
    });
    
    it("from one collection ID to `/collections`, it hides the collection details", () => {
        component.setProps({collectionID: undefined});
        expect(component.state('drawerIsVisible')).toBe(false);
        expect(component.state('drawerIsAnimatable')).toBe(true);
        component.instance().handleDrawerTransitionEnd();
        expect(component.state('drawerIsAnimatable')).toBe(false);
    });
});

describe("Collection details are hidden", () => {
    it("when 'Close' is clicked", () => {
        component.setProps({collectionID: "asdasdasd-04917444856fa9ade290b8847dee1f24e7726d71e1a7378c2557d949b6a6968c"});
        expect(component.state('drawerIsVisible')).toBe(true);

        component.instance().handleDrawerCloseClick();
        expect(component.state('drawerIsVisible')).toBe(false);
        expect(component.state('drawerIsAnimatable')).toBe(true);
    });
});

// TODO complete these tests!
describe("Restore content to a collection", () => {
    const singleRestoredData = {
        uri: "/economy/grossdomesticproduct/bulletins/grossdomesticproduct/march2018",
        title: "Gross Domestic Product: March 2018",
        type: "bulletin"
    };

    const multiRestoredData= [
        {
            uri: "/about/test",
            description: {title: "Test Page"},
            type: "test_type"
        }, {
            uri: "/about/test/two",
            description: {title: "Test Page 2"},
            type: "test_type"
        }
    ]

    beforeAll(() => {
        component.setProps({
            activeCollection: {
                ...defaultProps.collections[0],
                inProgress: []
            }
        });
    });

    afterAll(() => {
        component.setProps({activeCollection: defaultProps.activeCollection});
    });

    describe("When restoring single file", () => {
        it("adds the correct page back into the collections", () => {
            component.instance().handleRestoreSingleDeletedContentSuccess(singleRestoredData);
            expect(dispatchedActions[0].type).toBe(UPDATE_PAGES_IN_ACTIVE_COLLECTION);
            expect(dispatchedActions[0].collection.inProgress.some(page => page.uri = singleRestoredData.uri)).toBe(true);
        });

        it("maps the page data to the structure expected in state", () => {
            component.instance().handleRestoreSingleDeletedContentSuccess(singleRestoredData);
            expect(dispatchedActions[0].type).toBe(UPDATE_PAGES_IN_ACTIVE_COLLECTION);

            const restoredPage = dispatchedActions[0].collection.inProgress.find(page => page.uri = singleRestoredData.uri);
            expect(restoredPage).toBeTruthy();
            expect(restoredPage.uri).toBe("/economy/grossdomesticproduct/bulletins/grossdomesticproduct/march2018");
            expect(restoredPage.title).toBe("Gross Domestic Product: March 2018");
            expect(restoredPage.type).toBe("bulletin");
        });
    })

    describe("When restoring multiple files", () => {
        it("adds all pages into collection", () => {
            component.instance().handleRestoreMultiDeletedContentSuccess(multiRestoredData);
            expect(dispatchedActions[0].type).toBe(UPDATE_PAGES_IN_ACTIVE_COLLECTION);
            expect(dispatchedActions[0].collection.inProgress.some(page => page.uri = multiRestoredData[0].uri)).toBe(true);
            expect(dispatchedActions[0].collection.inProgress.some(page => page.uri = multiRestoredData[1].uri)).toBe(true);
        })

        it("maps the page data to the structure expected in state", () => {
            component.instance().handleRestoreMultiDeletedContentSuccess(multiRestoredData);
            const restoredPage = dispatchedActions[0].collection.inProgress.find(page => page.uri = multiRestoredData[0].uri);
            expect(restoredPage).toBeTruthy();
            expect(restoredPage.uri).toBe("/about/test");
            expect(restoredPage.title).toBe("Test Page");
            expect(restoredPage.type).toBe("test_type");
        });

        it("correct number of pages are restored", () => {
            component.instance().handleRestoreMultiDeletedContentSuccess(multiRestoredData);
            expect(dispatchedActions[0].collection.inProgress.length).toBe(multiRestoredData.length)
        });
    })
});

describe("Deleting a collection", () => {
    it("user is shown a notification if the collection isn't deleted due to an application error", async () => {
        notifications.add.mockClear();
        expect(notifications.add.mock.calls.length).toEqual(0);

        collections.delete.mockImplementationOnce(() => (
            Promise.reject({status: 500, statusText: "Unexpected error"})
        ));
        await component.instance().handleCollectionDeleteClick('test-collection-12345');
        await component.update();

        expect(notifications.add.mock.calls.length).toEqual(1);
    });

    it("marks a collection in state as ready to delete from all collections", async () => {
        await componentWithProps.instance().handleCollectionDeleteClick('test-collection-12345');
        expect(dispatchedActions[1].type).toBe(MARK_COLLECTION_FOR_DELETE_FROM_ALL_COLLECTIONS);
        expect(dispatchedActions[1].collectionID).toBe('test-collection-12345');
    });
});

describe("When fetching a collection's detail", async () => {
    component.setProps({collectionID: "asdasdasd-04917444856fa9ade290b8847dee1f24e7726d71e1a7378c2557d949b6a6968c"});
    await component.update();

    const getCollectionResponse = () => (
        Promise.resolve({id: "asdasdasd-04917444856fa9ade290b8847dee1f24e7726d71e1a7378c2557d949b6a6968c"})
    )

    it("a loading icon is shown", () => {
        collections.get.mockImplementation(getCollectionResponse)
        component.instance().fetchActiveCollection();
        expect(component.state('isFetchingCollectionDetails')).toBe(true);
    });
    
    it("the loading icon is hidden on success", async () => {
        await component.instance().fetchActiveCollection();
        await component.update()
        expect(component.state('isFetchingCollectionDetails')).toBe(false);
    });
    
    it("the loading icon is hidden on error", async () => {
        await component.instance().fetchActiveCollection();
        await component.update()
        expect(component.state('isFetchingCollectionDetails')).toBe(false);
    });

    it("shows a notification on error", async () => {
        notifications.add.mockClear();
        await component.instance().fetchActiveCollection();
        await component.update();
        expect(notifications.add.mock.calls.length).toBe(1);
    });
});

describe("Selecting a page in a collection", () => {
    component.setProps({
        collectionID: "test-sau39393uyqha8aw8y3n3",
        activePageURI: undefined,
    });

    setLocation("https://publishing.onsdigital.co.uk/florence/collections/test-sau39393uyqha8aw8y3n3");

    it("routes to the page's ID", () => {
        expect(newURL).not.toBe('/florence/collections/test-sau39393uyqha8aw8y3n3#test-page-1');
        const newURL = component.instance().handleCollectionPageClick('test-page-1');
        expect(newURL).toBe('/florence/collections/test-sau39393uyqha8aw8y3n3#test-page-1');
    });

    it("going from one page to another updates the route with the new page's ID", () => {
        component.setProps({activePageURI: "test-page-1", collectionID: "test-sau39393uyqha8aw8y3n3"});
        const newURL = component.instance().handleCollectionPageClick('test-page-2');
        expect(newURL).toBe('/florence/collections/test-sau39393uyqha8aw8y3n3#test-page-2');
    });

    it("doesn't do anything if the same page is clicked", () => {
        component.setProps({activePageURI: "test-page-2"});
        const newURL = component.instance().handleCollectionPageClick('test-page-2');
        expect(newURL).toBe(undefined);
    });
});

describe("Map state to props function", () => {
    let expectedProps = {
        activeCollection: {
            id: "a-collection-id",
            name: "A collection"
        },
        rootPath: "/florence",
        activePageURI: "",
        collections: [{
            id: "a-collection-id",
            name: "A collection"
        }]
    }
    let reduxState = {
        state: {
            user: "foobar@email.com",
            collections: {
                active: {
                    id: "a-collection-id",
                    name: "A collection"
                },
                all: [{
                    id: "a-collection-id",
                    name: "A collection"
                }]
            },
            rootPath: "/florence"
        },
        routing: {
            locationBeforeTransitions: {
                hash: ""   
            }
        }
    }

    it("maps the application state correctly", () => {
        expect(mapStateToProps(reduxState)).toMatchObject(expectedProps);
    });

    it("maps routing state correctly when a bulletin page is active in the collection", () => {
        reduxState.routing.locationBeforeTransitions.hash = "#/economy/grossdomesticproduct/bulletins/gdp/july2017";
        expectedProps.activePageURI = "/economy/grossdomesticproduct/bulletins/gdp/july2017";
        expect(mapStateToProps(reduxState)).toMatchObject(expectedProps);
    });
    
    it("maps routing state correctly when the home page is active in the collection", () => {
        reduxState.routing.locationBeforeTransitions.hash = "#/";
        expectedProps.activePageURI = "/"
        expect(mapStateToProps(reduxState)).toMatchObject(expectedProps);
    });
    
    it("maps routing state correctly when there is a trailing slash on the active page URI ", () => {
        reduxState.routing.locationBeforeTransitions.hash = "#/economy#";
        expectedProps.activePageURI = "/economy#"
        expect(mapStateToProps(reduxState)).toMatchObject(expectedProps);
    });
});

describe("Approving a collection", () => {
    // const component = shallow(
    //     <CollectionsController {...defaultProps}/>
    // );
    // const collectionWithInProgressPages = {
    //     id: "in-progress-collection-123",
    //     name: "In progress collection",
    //     inProgress: [{
    //         uri: "/economy/inflationsandprices/consumerinflation/bulletins/consumerpriceinflation/july2017",
    //         type: "bulletin",
    //         description: {
    //             title: "Consumer Price Inflation",
    //             edition: "July 2017"
    //         },
    //         events: [
    //             {
    //                 email: "foobar@email.com",
    //                 date: "2017-12-14T11:36:03.402Z"
    //             }
    //         ]
    //     }],
    //     complete: [],
    //     reviewed: [{
    //         uri: "/businessindustryandtrade",
    //         type: "taxonomy_landing_page",
    //         description: {
    //             title: "Business industry and trade"
    //         },
    //         events: [
    //             {
    //                 email: "foobar@email.com",
    //                 date: "2017-12-14T11:36:03.402Z"
    //             },
    //             {
    //                 email: "foobar@email.com",
    //                 date: "2017-12-10T10:21:43.402Z"
    //             }
    //         ]
    //     }]
    // }

    // const collectionThatsReadyToApprove = {
    //     id: "ready-to-approve-collection-123",
    //     name: "Ready to approve collection",
    //     inProgress: [],
    //     complete: [],
    //     reviewed: [{
    //         uri: "/businessindustryandtrade",
    //         type: "taxonomy_landing_page",
    //         description: {
    //             title: "Business industry and trade"
    //         },
    //         events: [
    //             {
    //                 email: "foobar@email.com",
    //                 date: "2017-12-14T11:36:03.402Z"
    //             },
    //             {
    //                 email: "foobar@email.com",
    //                 date: "2017-12-10T10:21:43.402Z"
    //             }
    //         ]
    //     }]
    // };

    // it("shows a notification when an error occurs", () => {
    //     notifications.add.mockClear();
    //     expect(notifications.add.mock.calls.length).toBe(0);
    //     component.setProps({activeCollection: collectionWithInProgressPages});
    //     component.instance().handleCollectionApproveClick();
    //     expect(notifications.add.mock.calls.length).toBe(1);
    // });

    // it("exits the function if the collection isn't in the correct state to be approved", () => {
    //     component.setProps({activeCollection: collectionWithInProgressPages});
    //     expect(component.instance().handleCollectionApproveClick()).toBe(false);
    // });

    // it("shows a notification if the collection isn't in the correct state to be approved", async () => {
    //     notifications.add.mockClear();
    //     expect(notifications.add.mock.calls.length).toBe(0);
    //     component.setProps({activeCollection: collectionThatsReadyToApprove});
    //     const returnValue = await component.instance().handleCollectionApproveClick();
    //     await component.update();
    //     expect(returnValue).not.toBe(false); // confirms thats it was a valid collection to be approved but there was an issue from the API response
    //     expect(notifications.add.mock.calls.length).toBe(1);
    // });

    // it("on successful approval the state updates to show that collection's pre-publish process is in progress", async () => {
    //     const collectionsArray = component.props('collections');
    //     const props = {
    //         params: {
    //             collectionID: 'ready-to-approve-collection-123'
    //         },
    //         activeCollection: collectionThatsReadyToApprove
    //     };
    //     component.setState({collections: [
    //         ...collectionsArray, 
    //         collectionThatsReadyToApprove
    //     ]});
    //     component.setProps(props);
    //     component.instance().handleCollectionApproveClick();
    //     await component.update();
    //     expect(component.state('collections').find(collection => collection.id === 'ready-to-approve-collection-123').status.neutral).toBe(true);
    // });
});

describe("Deleting a page from a collection", () => {
    it("calls mapper function to exclude removed pages from collection details state");
    // const props = {
    //     ...defaultProps,
    //     activeCollection: collection
    // }
    // const component = shallow(
    //     <CollectionsController {...props} />
    // )

    // expect(component.instance().mapPagesAndPendingDeletes('inProgress')).toEqual(collection.inProgress);
    
    // it("removes the page from the collection details", () => {
    //     component.instance().handleCollectionPageDeleteClick(
    //         collection.inProgress[0].uri, collection.inProgress[0].description.title, 'inProgress'
    //     );
    //     expect(component.instance().mapPagesAndPendingDeletes('inProgress')).toEqual([collection.inProgress[1]]);
    // });

    // it("redirects the user to the collection details", () => {
    //     setLocation("https://publishing.onsdigital.co.uk/florence/collections/test-collection-12345#test-page-1");
    //     const newURL = component.instance().handleCollectionPageDeleteClick(
    //         "test-page-1", "Test page 1", 'inProgress'
    //     );
    //     expect(newURL).toBe('/florence/collections/test-collection-12345');
    // });

    // it("undo puts the page back into the collection details", () => {
    //     component.instance().handleCollectionPageDeleteUndo(() => {}, collection.inProgress[0].uri, '12345');
    //     expect(component.instance().mapPagesAndPendingDeletes('inProgress')).toEqual(collection.inProgress);
    // });
    
    // it("undo redirects the user to the undeleted page", () => {
    //     const newURL = component.instance().handleCollectionPageDeleteUndo(() => {}, 'test-page-1', '12345');
    //     expect(newURL).toBe("/florence/collections/test-collection-12345#test-page-1");
    // });

    // it("a timer deletes the page from the server after the click of 'delete'", async () => {
    //     await component.instance().handleCollectionPageDeleteClick(
    //         collection.inProgress[0].uri, collection.inProgress[0].description.title, 'inProgress'
    //     );
    //     await jest.runOnlyPendingTimers();
    //     expect(dispatchedAction.collection.inProgress.some(page => page.uri === collection.inProgress[0].uri)).toBe(false);
    //     expect(dispatchedAction.collection.complete.some(page => page.uri === collection.inProgress[0].uri)).toBe(false);
    //     expect(dispatchedAction.collection.reviewed.some(page => page.uri === collection.inProgress[0].uri)).toBe(false);
    //     expect(dispatchedAction.collection.inProgress.length).toBe(1);
    // });

    // it("updates whether the collection can be approved", async () => {
    //     const customActiveCollection = {
    //         ...collection,
    //         inProgress: [collection.inProgress[0]],
    //         complete: [],
    //         reviewed: [collection.inProgress[1]]
    //     }
    //     component.setProps({activeCollection: customActiveCollection});
    //     await component.instance().handleCollectionPageDeleteClick(
    //         collection.inProgress[0].uri, collection.inProgress[0].description.title, 'inProgress'
    //     );
    //     await jest.runOnlyPendingTimers();
    //     expect(dispatchedAction.collection.canBeApproved).toEqual(true);
    //     expect(dispatchedAction.collection.canBeDeleted).toEqual(false);
    // });
    
    // it("updates whether the collection can be deleted", async () => {
    //     const customActiveCollection = {
    //         ...collection,
    //         inProgress: [collection.inProgress[0]],
    //         complete: [],
    //         reviewed: [],
    //         deletes: []
    //     }
    //     component.setProps({activeCollection: customActiveCollection});
    //     await component.instance().handleCollectionPageDeleteClick(
    //         collection.inProgress[0].uri, collection.inProgress[0].description.title, 'inProgress'
    //     );
    //     await jest.runOnlyPendingTimers();
    //     expect(dispatchedAction.collection.canBeApproved).toEqual(false);
    //     expect(dispatchedAction.collection.canBeDeleted).toEqual(true);
    // });
});