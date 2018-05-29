import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import {CollectionDetailsController} from './CollectionDetailsController';
import collections from '../../../utilities/api-clients/collections';

jest.mock('../../../utilities/notifications', () => {
    return {
        add: jest.fn(() => {}),
        remove: () => {}
    }
});

jest.mock('../../../utilities/log', () => ({
    add: jest.fn(() => {}),
    eventTypes: {}
}));

jest.mock('../../../utilities/cookies', () => ({
    add: jest.fn(() => {})
}))

jest.mock('../../../utilities/api-clients/collections', () => ({
    get: jest.fn(() => {
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

let dispatchedAction;

const defaultProps = {
    dispatch: action => {
        dispatchedAction = action;
    },
    rootPath: '/florence',
    routes:[{}],
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
    
    it("from one collection ID to another, it updates collection name and date instantly", () => {
        component.setProps({collectionID: "different-collection-12345"});
        component.setProps({collectionID: "asdasdasd-04917444856fa9ade290b8847dee1f24e7726d71e1a7378c2557d949b6a6968c"});
        expect(dispatchedAction.collection).toBeTruthy();
        expect(dispatchedAction.collection.id).toBe("asdasdasd-04917444856fa9ade290b8847dee1f24e7726d71e1a7378c2557d949b6a6968c");
        expect(dispatchedAction.collection.name).toBe("asdasdasd");
        expect(dispatchedAction.collection.type).toBe("manual");
    });
    
    it("from one collection ID to `/collections`, it hides the collection details", () => {
        component.setProps({collectionID: undefined});
        expect(component.state('drawerIsVisible')).toBe(false);
        expect(component.state('drawerIsAnimatable')).toBe(true);
        component.instance().handleDrawerTransitionEnd();
        expect(component.state('drawerIsAnimatable')).toBe(false);
    });
});

test("Collection details are hidden when 'Close' is clicked", () => {
    component.setProps({collectionID: "asdasdasd-04917444856fa9ade290b8847dee1f24e7726d71e1a7378c2557d949b6a6968c"});
    expect(component.state('drawerIsVisible')).toBe(true);

    component.instance().handleDrawerCloseClick();
    expect(component.state('drawerIsVisible')).toBe(false);
    expect(component.state('drawerIsAnimatable')).toBe(true);
});

describe("Selecting a page in a collection", () => {
    const newProps = {
        collectionID: "test-sau39393uyqha8aw8y3n3",
        activePageURI: undefined,
        activeCollection: defaultProps.collections.find(collection => collection.id === "test-sau39393uyqha8aw8y3n3")
    }
    component.setProps(newProps);

    setLocation("https://publishing.onsdigital.co.uk/florence/collections/test-sau39393uyqha8aw8y3n3");

    it("routes to the page's ID", () => {
        expect(newURL).not.toBe('/florence/collections/test-sau39393uyqha8aw8y3n3#test-page-1');
        const newURL = component.instance().handleCollectionPageClick('test-page-1');
        expect(newURL).toBe('/florence/collections/test-sau39393uyqha8aw8y3n3#test-page-1');
    });

    it("going from one page to another updates the route with the new page's ID", () => {
        component.setProps({activePageURI: "test-page-1"});
        const newURL = component.instance().handleCollectionPageClick('test-page-2');
        expect(newURL).toBe('/florence/collections/test-sau39393uyqha8aw8y3n3#test-page-2');
    });

    it("doesn't do anything if the same page is clicked", () => {
        component.setProps({activePageURI: "test-page-2"});
        const newURL = component.instance().handleCollectionPageClick('test-page-2');
        expect(newURL).toBe(undefined);
    });
});