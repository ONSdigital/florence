import React, { Component } from 'react';
import { CollectionsController, mapStateToProps } from './CollectionsController';
import { shallow } from 'enzyme';
import notifications from '../../utilities/notifications';

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
            return Promise.resolve(mockAllCollections);
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

jest.useFakeTimers();

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

let dispatchedAction;

const defaultProps = {
    dispatch: action => {
        dispatchedAction = action;
    },
    rootPath: '/florence',
    routes:['a-collection-id'],
    params: {
        collectionID: undefined,
        pageID: undefined
    },
    activeCollection: null,
    user: {
        userType: ""
    },
    location: {
        hash: ""
    }
};

const mockAllCollections = [
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
        "id": "test-2210949c5454fc9c914c74558e78b4b0cb0536cf46757707ae66b7a64086709a",
        "name": "Test",
        "type": "manual",
        "teams": [
            "Team 2"
        ]
    }
];

const collection = {
    id: 'test-collection-12345',
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
    datasets: [
        {
            id: "98261-28374-18272",
            title: "A test dataset",
            state: "Reviewed",
            uri: "http://a-valid-uri-1"
        },
        {
            id: "23444-342-5666",
            title: "A second test dataset",
            state: "InProgress",
            uri: "http://a-valid-uri-2"
        },
        {
            id: "457453-3453452-3334544",
            title: "A third test dataset",
            state: "Complete",
            uri: "http://a-valid-uri-3"
        }
    ],
    datasetVersion: [
        {
            id: "98da8ah2-a8ah3-ajaj3",
            title: "A test dataset version",
            edition: "2017",
            version: "1",
            state: "Reviewed",
            uri: "http://a-valid-version-uri-1"
        },
        {
            id: "ks0ttt-20aoaaoa-e83829ja",
            title: "A second test version",
            edition: "2015",
            version: "3",
            state: "InProgress",
            uri: "http://a-valid-version-uri-2"
        },
        {
            id: "983hja93-asjehsd8-a92723",
            title: "A third test version",
            edition: "time-series",
            state: "Complete",
            version: "2",
            uri: "http://a-valid-version-uri-3"
        }
    ]
}

describe("When the active collection parameter changes", () => {
    const props = {
        ...defaultProps
    }
    const component = shallow(
        <CollectionsController {...props} />
    )

    it("from collections root to a collection ID it sets the collection details to show", () => {
        component.setProps({
            params: {collectionID: collection.id}
        });
        expect(component.state('drawerIsVisible')).toBe(true);
        expect(component.state('drawerIsAnimatable')).toBe(true);
        component.instance().handleDrawerTransitionEnd();
        expect(component.state('drawerIsAnimatable')).toBe(false);
    });
    
    it("from one collection ID to another, it keeps the collection details to showing without animating", () => {
        component.setProps({
            params: {collectionID: "a-different-id-12435"}
        });
        expect(component.state('drawerIsVisible')).toBe(true);
        expect(component.state('drawerIsAnimatable')).toBe(false);
    });
    
    it("from one collection ID to collections root, it hides the collection details", () => {
        component.setProps({
            params: {collectionID: undefined}
        });
        expect(component.state('drawerIsVisible')).toBe(false);
        expect(component.state('drawerIsAnimatable')).toBe(true);
        component.instance().handleDrawerTransitionEnd();
        expect(component.state('drawerIsAnimatable')).toBe(false);
    });
});

test("Collection details are hidden when 'Cancel' is clicked", () => {
    const component = shallow(
        <CollectionsController {...defaultProps} />
    );

    component.instance().handleDrawerCloseClick();
    expect(component.state('drawerIsVisible')).toBe(false);
    expect(component.state('drawerIsAnimatable')).toBe(true);
});

describe("Selecting a page in a collection", () => {
    const props = {
        ...defaultProps,
        params: {
            collectionID: "test-collection",
            pageID: undefined
        }
    }
    const component = shallow(
        <CollectionsController {...props} />
    )

    setLocation("https://publishing.onsdigital.co.uk/florence/collections/test-collection");

    it("the first time goes to the page's ID updates", () => {
        const newURL = component.instance().handleCollectionPageClick('test-page-1');
        expect(newURL).toBe('/florence/collections/test-collection#test-page-1');
    });

    it("going from one page to another updates the route with the new page's ID", () => {
        const newURL = component.instance().handleCollectionPageClick('test-page-2');
        expect(newURL).toBe('/florence/collections/test-collection#test-page-2');
    });

    it("doesn't do anything if the same page is clicked", () => {
        component.setProps({activePageURI: "test-page-2"});
        const newURL = component.instance().handleCollectionPageClick('test-page-2');
        expect(newURL).toBe(undefined);
    });
});

describe("Deleting a page from a collection", () => {
    const props = {
        ...defaultProps,
        activeCollection: collection
    }
    const component = shallow(
        <CollectionsController {...props} />
    )

    expect(component.instance().mapPagesAndPendingDeletes('inProgress')).toEqual(collection.inProgress);
    
    it("removes the page from the collection details", () => {
        component.instance().handleCollectionPageDeleteClick(
            collection.inProgress[0].uri, collection.inProgress[0].description.title, 'inProgress'
        );
        expect(component.instance().mapPagesAndPendingDeletes('inProgress')).toEqual([collection.inProgress[1]]);
    });

    it("redirects the user to the collection details", () => {
        setLocation("https://publishing.onsdigital.co.uk/florence/collections/test-collection-12345#test-page-1");
        const newURL = component.instance().handleCollectionPageDeleteClick(
            "test-page-1", "Test page 1", 'inProgress'
        );
        expect(newURL).toBe('/florence/collections/test-collection-12345');
    });

    it("undo puts the page back into the collection details", () => {
        component.instance().handleCollectionPageDeleteUndo(() => {}, collection.inProgress[0].uri, '12345');
        expect(component.instance().mapPagesAndPendingDeletes('inProgress')).toEqual(collection.inProgress);
    });
    
    it("undo redirects the user to the undeleted page", () => {
        const newURL = component.instance().handleCollectionPageDeleteUndo(() => {}, 'test-page-1', '12345');
        expect(newURL).toBe("/florence/collections/test-collection-12345#test-page-1");
    });

    it("a timer deletes the page from the server after the click of 'delete'", async () => {
        await component.instance().handleCollectionPageDeleteClick(
            collection.inProgress[0].uri, collection.inProgress[0].description.title, 'inProgress'
        );
        await jest.runOnlyPendingTimers();
        expect(dispatchedAction.collection.inProgress.some(page => page.uri === collection.inProgress[0].uri)).toBe(false);
        expect(dispatchedAction.collection.complete.some(page => page.uri === collection.inProgress[0].uri)).toBe(false);
        expect(dispatchedAction.collection.reviewed.some(page => page.uri === collection.inProgress[0].uri)).toBe(false);
        expect(dispatchedAction.collection.inProgress.length).toBe(1);
    });

    it("updates whether the collection can be approved", async () => {
        const customActiveCollection = {
            ...collection,
            inProgress: [collection.inProgress[0]],
            complete: [],
            reviewed: [collection.inProgress[1]]
        }
        component.setProps({activeCollection: customActiveCollection});
        await component.instance().handleCollectionPageDeleteClick(
            collection.inProgress[0].uri, collection.inProgress[0].description.title, 'inProgress'
        );
        await jest.runOnlyPendingTimers();
        expect(dispatchedAction.collection.canBeApproved).toEqual(true);
        expect(dispatchedAction.collection.canBeDeleted).toEqual(false);
    });
    
    it("updates whether the collection can be deleted", async () => {
        const customActiveCollection = {
            ...collection,
            inProgress: [collection.inProgress[0]],
            complete: [],
            reviewed: [],
            deletes: []
        }
        component.setProps({activeCollection: customActiveCollection});
        await component.instance().handleCollectionPageDeleteClick(
            collection.inProgress[0].uri, collection.inProgress[0].description.title, 'inProgress'
        );
        await jest.runOnlyPendingTimers();
        expect(dispatchedAction.collection.canBeApproved).toEqual(false);
        expect(dispatchedAction.collection.canBeDeleted).toEqual(true);
    });
});

describe("Deleting a collection", () => {
    const props = {
        ...defaultProps
    }
    const component = shallow(
        <CollectionsController {...props} />
    );

    it("user is shown a notification if the collection isn't deleted due to an application error", async () => {
        notifications.add.mockClear();
        expect(notifications.add.mock.calls.length).toEqual(0);
        await component.instance().handleCollectionDeleteClick('test-collection-12345');
        await component.update();
        expect(notifications.add.mock.calls.length).toEqual(1);
    });

    it("removes the collection from the state", async () => {
        expect(component.state('collections').some(collection => {return collection.id === 'test-collection-12345'})).toBeTruthy();
        await component.instance().handleCollectionDeleteClick('test-collection-12345');
        await component.update();
        expect(component.state('collections').some(collection => {return collection.id === 'test-collection-12345'})).toBeFalsy();
    });

});

describe("When fetching a collection's detail", () => {
    const component = shallow(
        <CollectionsController {...defaultProps} />
    );
    
    it("a loading icon is shown", () => {
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

describe("Map state to props function", () => {
    let expectedProps = {
        user: "foobar@email.com",
        activeCollection: {...collection},
        rootPath: "/florence",
        activePageURI: ""
    }
    let reduxState = {
        state: {
            user: "foobar@email.com",
            collections: {
                active: {...collection}
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

describe("readablePublishDate returns correct display date when", () => {
    const component = shallow(
        <CollectionsController {...defaultProps} />
    );

    it("a collection has a publishDate and is set to manual publish", () => {
        const collection = {
            publishDate: "2017-12-19T09:30:00.000Z",
            type: "manual"
        };
        const result = component.instance().readablePublishDate(collection);
        expect(result).toBe("Tue, 19/12/2017 9:30AM [rolled back]");
    });

    it("a collection has a publishDate", () => {
        const collection = {
            publishDate: "2017-07-13T01:30:00.000Z",
            type: ""
        };
        const result = component.instance().readablePublishDate(collection);
        expect(result).toBe("Thu, 13/07/2017 1:30AM");
    });

    it("a collection has no publishDate and is set to manual", () => {
        const collection = {
            publishDate: "",
            type: "manual"
        };
        const result = component.instance().readablePublishDate(collection);
        expect(result).toBe("[manual collection]");
    });
});

test("Map collection to state function", () => {
    const component = shallow(
        <CollectionsController {...defaultProps} />
    );
    const result = component.instance().mapCollectionToState(mockAllCollections[2]);
    expect(result).toEqual({
        id: 'test-collection-12345',
        name: 'Test collection',
        publishDate: undefined,
        status: {
            message: "preparing publish",
            neutral: true,
            warning: false,
            success: false
        },
        type: 'manual',
        selectableBox: {
            firstColumn: 'Test collection',
            secondColumn: '[manual collection]'
        },
        inProgress: undefined,
        complete: undefined,
        reviewed: undefined,
        deletes: undefined,
        canBeApproved: false,
        canBeDeleted: false,
        teams: []
    });
});

describe("Mapping GET collection API response to view state", () => {
    const component = shallow(
        <CollectionsController {...defaultProps} />
    )

    it("'canBeApproved' value set to false correctly", () => {
        let canBeApproved = component.instance().mapPagesToCollection(collection).canBeApproved;
        expect(canBeApproved).toBeFalsy();
        
        let mockCollection = {
            ...collection,
            inProgress: [],
            reviewed: []
        }
        canBeApproved = component.instance().mapPagesToCollection(mockCollection).canBeApproved;
        expect(canBeApproved).toBeFalsy();
        
        mockCollection.complete = [];
        canBeApproved = component.instance().mapPagesToCollection(mockCollection).canBeApproved;
        expect(canBeApproved).toBeFalsy();
    });
    
    it("'canBeApproved' value set to true correctly", () => {
        let mockCollection = {
            inProgress: [],
            complete: [],
            reviewed: [...collection.complete]
        }
        let canBeApproved = component.instance().mapPagesToCollection(mockCollection).canBeApproved;
        expect(canBeApproved).toBeTruthy();

        mockCollection = {
            ...mockCollection,
            reviewed: [
                ...collection.inProgress,
                ...collection.complete
            ]
        }
        canBeApproved = component.instance().mapPagesToCollection(mockCollection).canBeApproved;
        expect(canBeApproved).toBeTruthy();
    });
    
    it("'canBeDeleted' value set to false correctly", () => {
        let canBeDeleted = component.instance().mapPagesToCollection(collection).canBeDeleted;
        expect(canBeDeleted).toBeFalsy();

        let mockCollection = {
            ...collection,
            inProgress: [],
            complete: [],
            reviewed: [...collection.complete]
        }
        canBeDeleted = component.instance().mapPagesToCollection(mockCollection).canBeDeleted;
        expect(canBeDeleted).toBeFalsy();
        
        mockCollection = {
            ...collection,
            inProgress: [],
            complete: [...collection.complete],
            reviewed: []
        }
        canBeDeleted = component.instance().mapPagesToCollection(mockCollection).canBeDeleted;
        expect(canBeDeleted).toBeFalsy();
        
        mockCollection = {
            ...collection,
            inProgress: [],
            complete: [],
            reviewed: [],
            deletes: [...collection.deletes]
        }
        canBeDeleted = component.instance().mapPagesToCollection(mockCollection).canBeDeleted;
        expect(canBeDeleted).toBeFalsy();

        delete mockCollection.reviewed;
        canBeDeleted = component.instance().mapPagesToCollection(mockCollection).canBeDeleted;
        expect(canBeDeleted).toBeFalsy();
    });
    
    it("'canBeDeleted' value set to true correctly", () => {
        let mockCollection = {
            ...collection,
            inProgress: [],
            complete: [],
            reviewed: [],
            deletes: []
        }

        let canBeDeleted = component.instance().mapPagesToCollection(mockCollection).canBeDeleted;
        expect(canBeDeleted).toBeTruthy();
    });

    it("pages and datasets map with the correct structure", () => {
        const inProgressPages = component.instance().mapPagesToCollection(collection).inProgress;
        const expectedInProgress = [
            {
                lastEdit: {
                    email: "foobar@email.com",
                    date: "2017-12-14T11:36:03.402Z"
                },
                title: "Home",
                edition: "",
                uri: "/",
                type: "homepage"
            },
            {
                lastEdit: {
                    email: "foobar@email.com",
                    date: "2017-12-14T11:36:03.402Z"
                },
                title: "Consumer Price Inflation",
                edition: "July 2017",
                uri: "/economy/inflationsandprices/consumerinflation/bulletins/consumerpriceinflation/july2017",
                type: "bulletin"
            },
            {"title": "A second test dataset", "type": "dataset", "uri": "http://a-valid-uri-2"}
        ]
        expect(inProgressPages).toEqual(expectedInProgress);
        
        const completePages = component.instance().mapPagesToCollection(collection).complete;
        const expectedComplete = [
            {
                lastEdit: {
                    email: "foobar@email.com",
                    date: "2017-12-14T11:36:03.402Z"
                },
                title: "Business industry and trade",
                edition: "",
                uri: "/businessindustryandtrade",
                type: "taxonomy_landing_page"
            },
            {"title": "A third test dataset", "type": "dataset", "uri": "http://a-valid-uri-3"}
        ]
        expect(completePages).toEqual(expectedComplete);
        
        const reviewedPages = component.instance().mapPagesToCollection(collection).reviewed;
        expect(reviewedPages).toEqual([{"title": "A test dataset", "type": "dataset", "uri": "http://a-valid-uri-1"}]);
    });
});

describe("Approving a collection", () => {
    const component = shallow(
        <CollectionsController {...defaultProps}/>
    );
    const collectionWithInProgressPages = {
        id: "in-progress-collection-123",
        name: "In progress collection",
        inProgress: [{
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
        }],
        complete: [],
        reviewed: [{
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
        }]
    }

    const collectionThatsReadyToApprove = {
        id: "ready-to-approve-collection-123",
        name: "Ready to approve collection",
        inProgress: [],
        complete: [],
        reviewed: [{
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
        }]
    };

    it("shows a notification when an error occurs", () => {
        notifications.add.mockClear();
        expect(notifications.add.mock.calls.length).toBe(0);
        component.setProps({activeCollection: collectionWithInProgressPages});
        component.instance().handleCollectionApproveClick();
        expect(notifications.add.mock.calls.length).toBe(1);
    });

    it("exits the function if the collection isn't in the correct state to be approved", () => {
        component.setProps({activeCollection: collectionWithInProgressPages});
        expect(component.instance().handleCollectionApproveClick()).toBe(false);
    });

    it("shows a notification if the collection isn't in the correct state to be approved", async () => {
        notifications.add.mockClear();
        expect(notifications.add.mock.calls.length).toBe(0);
        component.setProps({activeCollection: collectionThatsReadyToApprove});
        const returnValue = await component.instance().handleCollectionApproveClick();
        await component.update();
        expect(returnValue).not.toBe(false); // confirms thats it was a valid collection to be approved but there was an issue from the API response
        expect(notifications.add.mock.calls.length).toBe(1);
    });

    it("on successful approval the state updates to show that collection's pre-publish process is in progress", async () => {
        const collectionsArray = component.props('collections');
        const props = {
            params: {
                collectionID: 'ready-to-approve-collection-123'
            },
            activeCollection: collectionThatsReadyToApprove
        };
        component.setState({collections: [
            ...collectionsArray, 
            collectionThatsReadyToApprove
        ]});
        component.setProps(props);
        component.instance().handleCollectionApproveClick();
        await component.update();
        expect(component.state('collections').find(collection => collection.id === 'ready-to-approve-collection-123').publishedStatus.neutral).toBe(true);
    });
});