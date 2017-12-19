import React, { Component } from 'react';
import { CollectionsController, mapStateToProps } from './CollectionsController';
import { shallow } from 'enzyme';
import colllections from '../../utilities/api-clients/collections';
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
        add: jest.fn().mockImplementation(() => {}),
        remove: () => {}
    }
});

jest.mock('../../utilities/api-clients/collections', () => {
    return {
        getAll: () => {
            return Promise.resolve([]);
        },
        deletePage: () => {
            return Promise.resolve();
        },
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
    params: {
        collectionID: undefined,
        pageID: undefined
    },
    activeCollection: null
};

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
    datasets: [],
    datasetVersion: []
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

    component.instance().handleDrawerCancelClick();
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
        expect(newURL).toBe('/florence/collections/test-collection/test-page-1');
    });

    it("going from one page to another updates the route with the new page's ID", () => {
        const newURL = component.instance().handleCollectionPageClick('test-page-2');
        expect(newURL).toBe('/florence/collections/test-collection/test-page-2');
    });

    it("doesn't do anything if the same page is clicked", () => {
        component.setProps({params: {pageID: "test-page-2"}});
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

    expect(component.instance().mapPagesToCollectionsDetails('inProgress')).toEqual(collection.inProgress);
    
    it("removes the page from the collection details", () => {
        component.instance().handleCollectionPageDeleteClick(
            collection.inProgress[0].uri, collection.inProgress[0].description.title, 'inProgress'
        );
        expect(component.instance().mapPagesToCollectionsDetails('inProgress')).toEqual([collection.inProgress[1]]);
    });

    it("redirects the user to the collection details", () => {
        setLocation("https://publishing.onsdigital.co.uk/florence/collections/test-collection-12345/test-page-1");
        const newURL = component.instance().handleCollectionPageDeleteClick(
            collection.inProgress[0].uri, collection.inProgress[0].description.title, 'inProgress'
        );
        expect(newURL).toBe('/florence/collections/test-collection-12345');
    });

    it("undo puts the page back into the collection details", () => {
        component.instance().handleCollectionPageDeleteUndo(() => {}, collection.inProgress[0].uri, '12345');
        expect(component.instance().mapPagesToCollectionsDetails('inProgress')).toEqual(collection.inProgress);
    });
    
    it("undo redirects the user to the undeleted page", () => {
        const newURL = component.instance().handleCollectionPageDeleteUndo(() => {}, 'test-page-1', '12345');
        expect(newURL).toBe("/florence/collections/test-collection-12345/test-page-1");
    });

    it("deletes the page from the server 5 seconds after the click of 'delete'", async () => {
        await component.instance().handleCollectionPageDeleteClick(
            collection.inProgress[0].uri, collection.inProgress[0].description.title, 'inProgress'
        );
        await jest.runOnlyPendingTimers();
        expect(dispatchedAction.collection.inProgress.length).toBe(1);
        expect(dispatchedAction.collection.inProgress).toMatchObject([collection.inProgress[1]]);
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

test("Map state to props function", () => {
    const reduxState = {
        state: {
            user: "foobar@email.com",
            collections: {
                active: {...collection}
            },
            rootPath: "/florence"
        }
    }
    const expectedProps = {
        user: "foobar@email.com",
        activeCollection: {...collection},
        rootPath: "/florence"
    }
    expect(mapStateToProps(reduxState)).toMatchObject(expectedProps);
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
        expect(result).toBe("Thu, 13/07/2017 2:30AM");
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

test("Map collections to double selectable box function", () => {
    const component = shallow(
        <CollectionsController {...defaultProps} />
    );
    component.setState({collections: [collection]});
    const result = component.instance().mapCollectionsToDoubleSelectableBox();
    expect(result).toContainEqual({
        id: 'test-collection-12345',
        firstColumn: 'Test collection',
        secondColumn: '[manual collection]',
        selectableItem: collection
    });
});

describe("Mapping GET collection API response to view state", () => {
    const component = shallow(
        <CollectionsController {...defaultProps} />
    )

    it("'canBeApproved' value set to false correctly")
    
    it("'canBeApproved' value set to true correctly")
    
    it("'canBeDeleted' value set to false correctly")
    
    it("'canBeDeleted' value set to true correctly")

    it("pages map and have correct structure", () => {
        const inProgressPages = component.instance().mapCollectionResponseToState(collection).inProgress;
        const expectedInProgress = [
            {
                lastEdit: {
                    email: "foobar@email.com",
                    date: "2017-12-14T11:36:03.402Z"
                },
                title: "Home",
                edition: "",
                uri: "/",
                type: "homepage",
                id: ""
            },
            {
                lastEdit: {
                    email: "foobar@email.com",
                    date: "2017-12-14T11:36:03.402Z"
                },
                title: "Consumer Price Inflation",
                edition: "July 2017",
                uri: "/economy/inflationsandprices/consumerinflation/bulletins/consumerpriceinflation/july2017",
                type: "bulletin",
                id: "economy-inflationsandprices-consumerinflation-bulletins-consumerpriceinflation-july2017"
            }
        ]
        expect(inProgressPages).toEqual(expectedInProgress);
        
        const completePages = component.instance().mapCollectionResponseToState(collection).complete;
        const expectedComplete = [
            {
                lastEdit: {
                    email: "foobar@email.com",
                    date: "2017-12-14T11:36:03.402Z"
                },
                title: "Business industry and trade",
                edition: "",
                uri: "/businessindustryandtrade",
                type: "taxonomy_landing_page",
                id: "businessindustryandtrade"
            }
        ]
        expect(completePages).toEqual(expectedComplete);
        
        const reviewedPages = component.instance().mapCollectionResponseToState(collection).reviewed;
        const expectedReviewed = []
        expect(reviewedPages).toEqual(expectedReviewed);
    });

});