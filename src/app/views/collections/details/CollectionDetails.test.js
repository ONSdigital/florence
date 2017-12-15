import React from 'react';
import CollectionDetails from './CollectionDetails';
import { shallow } from 'enzyme';

console.error = () => {};

jest.mock('../../../utilities/log', () => {
    return {
        add: function() {
            //
        },
        eventTypes: {}
    }
});

jest.mock('../../../utilities/notifications', () => {
    return {
        add: jest.fn(() => {
            //
        })
    }
});

const defaultProps = {
    collectionID: 'test-collection-12345',
    activePageID: 'economy-grossdomesticproduct-bulletins-gdp-2014',
    name: 'Test collection',
    onCancel: () => {},
    onPageClick: () => {},
    onEditPageClick: () => {},
    isLoadingDetails: null,
    inProgress: [],
    complete: [],
    reviewed: []
};

const alternativePageProps = {
    inProgress: [
            {
                uri: "/",
                type: "homepage",
                description: {
                    title: "Home"
                }
            },
            {
                uri: "/economy/inflationsandprices/consumerinflation/bulletins/consumerpriceinflation/july2017",
                type: "bulletin",
                description: {
                    title: "Consumer Price Inflation",
                    edition: "July 2017"
                }
            }
        ],
        complete: [
            {
                uri: "/businessindustryandtrade",
                type: "taxonomy_landing_page",
                description: {
                    title: "Business industry and trade"
                }
            }
        ],
        reviewed: null
}

describe("Collection details page edit/delete buttons only show for an active page", () => {
    const props = {
        ...defaultProps,
        ...alternativePageProps
    }
    const component = shallow(
        <CollectionDetails {...props} />
    )

    it("render the correct number of in progress pages", () => {
        const pages = component.find('.list__item--expandable');
        expect(pages.length).toBe(3);
    });
    
    it("render the correct number of awaiting review pages", () => {
        const pages = component.find('.list__item--expandable');
        expect(pages.length).toBe(3);
    });
    
    it("render the correct number of reviewed pages", () => {
        const pages = component.find('.list__item--expandable');
        expect(pages.length).toBe(3);
    });

    it("buttons will hide for inactive pages", () => {
        const activePages = component.find('.list__item--expandable.active');
        const pages = component.find('.list__item--expandable');
        expect(pages.length).toBe(3);
        expect(activePages.length).toBe(0);
    });

    it("buttons will show for active pages", () => {
        component.setProps({
            activePageID: "economy-inflationsandprices-consumerinflation-bulletins-consumerpriceinflation-july2017"
        });
        const activePages = component.find('.list__item--expandable.active');
        expect(activePages.length).toBe(1);
        expect(activePages.key()).toBe("/economy/inflationsandprices/consumerinflation/bulletins/consumerpriceinflation/july2017");
    });
});

describe("When the collections details are loading", () => {
    const props = {
        ...defaultProps,
        isLoadingDetails: true
    };
    const component = shallow(
        <CollectionDetails {...props} />
    );

    it("show a loading icon", () => {
        expect(component.find('.loader').length).toBe(1);
    });

    it("doesn't try to render any pages", () => {
        expect(component.find('.page').length).toBe(0);
    });
});

describe("Number of pages in a state are rendered correctly", () => {
    const props = {
        ...defaultProps,
        ...alternativePageProps,
        reviewed: []
    };
    const component = shallow(
        <CollectionDetails {...props} />
    );

    it("for pages in progress", () => {
        expect(component.instance().statePageCount('inProgress')).toBe("2");
        expect(component.instance().renderPluralisedPageText('inProgress')).toBe("pages");
    });
    
    it("for pages awaiting review", () => {
        expect(component.instance().statePageCount('complete')).toBe("1");
        expect(component.instance().renderPluralisedPageText('complete')).toBe("page");
    });
    
    it("for pages that have been reviewed", () => {
        expect(component.instance().statePageCount('reviewed')).toBe("0");
        expect(component.instance().renderPluralisedPageText('reviewed')).toBe("pages");
    });
});

describe("Invalid props doesn't break the component", () => {
    const props = {
        ...defaultProps,
        inProgress: null,
        complete: null,
        reviewed: null
    }
    const component = shallow(
        <CollectionDetails {...props} />
    )

    it("'null' properties for page state arrays", () => {
        expect(component.find('h3').length).toBe(3);
    });
    
    it("missing 'activePageID'", () => {
        component.setProps({...alternativePageProps});
        expect(component.find('.list__item--expandable').length).toBe(3);
    });
});