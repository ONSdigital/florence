import React from 'react';
import { CollectionsController } from './CollectionsController';
import { shallow } from 'enzyme';

jest.mock('../../utilities/log', () => {
    return {
        add: function() {
            //
        },
        eventTypes: {}
    }
});

// jest.mock('../../../utilities/notifications', () => {
//     return {
//         add: jest.fn(() => {
//             //
//         })
//     }
// });

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

const defaultProps = {
    dispatch: () => {},
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
    inProgress: [],
    complete: [],
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

    setLocation("http://publishing.onsdigital.co.uk/florence/collections/test-collection");

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

// clicking page goes to URL of that page

// updates props with empty active collection after the collection details are hidden