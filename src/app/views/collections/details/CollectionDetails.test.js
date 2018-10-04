import React from 'react';
import { CollectionDetails } from './CollectionDetails';
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
    activePageURI: 'economy-grossdomesticproduct-bulletins-gdp-2014',
    name: 'Test collection',
    onClose: () => {},
    onPageClick: () => {},
    onEditPageClick: () => {},
    isLoadingDetails: null,
    inProgress: [],
    complete: [],
    reviewed: [],
    deletes: []
};

const alternativePageProps = {
    inProgress: [
            {
                uri: "/",
                type: "homepage",
                description: {
                    title: "Home"
                },
                lastEdit: {
                    email: "foobar@email.com",
                    date: "2017-12-14T11:36:03.402Z"
                }
                
            },
            {
                uri: "/economy/inflationsandprices/consumerinflation/bulletins/consumerpriceinflation/july2017",
                type: "bulletin",
                description: {
                    title: "Consumer Price Inflation",
                    edition: "July 2017"
                },
                lastEdit: {
                    email: "foobar@email.com",
                    date: "2017-12-14T11:36:03.402Z"
                }
            }
        ],
        complete: [
            {
                uri: "/businessindustryandtrade",
                type: "taxonomy_landing_page",
                description: {
                    title: "Business industry and trade"
                },
                lastEdit: {
                    email: "foobar@email.com",
                    date: "2017-12-14T11:36:03.402Z"
                }
            }
        ],
        reviewed: [
            {
                uri: "/businessindustryandtrade/businessbirthsanddeaths",
                type: "taxonomy_landing_page",
                description: {
                    title: "Business births and deaths"
                },
                lastEdit: {
                    email: "foobar@email.com",
                    date: "2017-12-14T11:36:03.402Z"
                }
            }
        ],
        deletes: [
            {
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
            }
        ]
}

describe("Collection details page edit/delete buttons only show for an active page", () => {
    const props = {
        ...defaultProps,
        ...alternativePageProps
    };
    let component;

    beforeEach(() => {
        component = shallow(
            <CollectionDetails {...props} />
        );
    });

    it("render the correct number of in progress pages", () => {
        const pages = component.find('.list__item--expandable[data-page-state="inProgress"]');
        expect(pages.length).toBe(2);
    });
    
    it("render the correct number of awaiting review pages", () => {
        const pages = component.find('.list__item--expandable[data-page-state="complete"]');
        expect(pages.length).toBe(1);
    });
    
    it("render the correct number of reviewed pages", () => {
        const pages = component.find('.list__item--expandable[data-page-state="reviewed"]');
        expect(pages.length).toBe(1);
    });
    
    it("render the correct number of deleted pages", () => {
        const pages = component.find('.list__item--expandable[data-page-state="deletes"]');
        expect(pages.length).toBe(1);
    });

    it("buttons will hide for inactive pages", () => {
        const pages = component.find('.list__item--expandable');
        const activePages = component.find('.list__item--expandable.active');
        expect(pages.length).toBe(5);
        expect(activePages.length).toBe(0);
    });

    it("buttons will show for active pages", () => {
        component.setProps({
            activePageURI: "/economy/inflationsandprices/consumerinflation/bulletins/consumerpriceinflation/july2017"
        });
        const activePages = component.find('.list__item--expandable.active');
        expect(activePages.length).toBe(1);
        expect(activePages.key()).toBe("/economy/inflationsandprices/consumerinflation/bulletins/consumerpriceinflation/july2017");
    });

    it("buttons show for active deleted pages", () => {
        component.setProps({
            activePageURI: "/about/surveys"
        });
        const activePages = component.find('.list__item--expandable.active');
        const activeDeletedPages = component.find('.list__item--expandable[data-page-state="deletes"].active');
        expect(activePages.length).toBe(1);
        expect(activeDeletedPages.length).toBe(1);
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

    it("shows a loading icon", () => {
        expect(component.find('.loader').length).toBe(1);
    });

    it("doesn't try to render any pages", () => {
        expect(component.find('.page').length).toBe(0);
    });

    it("still renders when collection name is updated", () => {
        component.setProps({name: "A new name"});
        expect(component.find('h2').text()).toBe("A new name");
    })
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
    
    it("for pages that have been deleted", () => {
        expect(component.instance().statePageCount('deletes')).toBe("1");
        expect(component.instance().renderPluralisedPageText('deletes')).toBe("page");
    });
});

describe("Invalid props doesn't break the component", () => {
    const props = {
        ...defaultProps,
        inProgress: null,
        complete: null,
        reviewed: null,
        delete: null
    }
    const component = shallow(
        <CollectionDetails {...props} />
    )

    it("'null' properties for page state arrays", () => {
        expect(component.find('h3').length).toBe(3);
    });
    
    it("missing 'activePageURI'", () => {
        component.setProps({...alternativePageProps});
        expect(component.find('.list__item--expandable').length).toBe(5);
    });
});

describe("'Last edit' information for a page in a collection", () => {
    const component = shallow(
        <CollectionDetails {...defaultProps} />
    );

    it("Handles no events being stored for page", () => {
        const brokenEventsProps = {
            ...defaultProps,
            inProgress: [
                ...defaultProps.inProgress,
                {
                    uri: "/economy/page",
                    type: "product_page",
                    description: {
                        title: "A page"
                    }
                }
            ]
        }
        component.setProps({...brokenEventsProps});
        
        // reset props for futures tests
        component.setProps({...defaultProps});
    });

    it("Renders the correct message", () => {
        const event = {
            email: "foobar@email.com",
            date: "2017-12-14T11:36:03.402Z"
        };
        expect(component.instance().renderLastEditText(event)).toBe("Last edit: foobar@email.com (Thu 14 Dec 2017 - 11:36:03)");
    });
    
    it("Renders the correct date and time during BST", () => {
        const event = {
            email: "foobar@email.com",
            date: "2020-06-14T14:25:03.402Z"
        };
        expect(component.instance().renderLastEditText(event)).toBe("Last edit: foobar@email.com (Sun 14 Jun 2020 - 15:25:03)");
    });

    it("Excludes the date if the data isn't available", () => {
        const event = {
            email: "foobar@email.com",
            date: ""
        };
        expect(component.instance().renderLastEditText(event)).toBe("Last edit: foobar@email.com (date not available)");

        delete event.date;
        expect(component.instance().renderLastEditText(event)).toBe("Last edit: foobar@email.com (date not available)");
    });
    
    it("Excludes the date if it isn't a valid date", () => {
        const event = {
            email: "foobar@email.com",
            date: "not a valid date"
        };
        expect(component.instance().renderLastEditText(event)).toBe("Last edit: foobar@email.com (date not available)");
    });
    
    it("Excludes the email if the data isn't available", () => {
        const event = {
            email: "",
            date: "2017-12-14T11:36:03.402Z"
        };
        expect(component.instance().renderLastEditText(event)).toBe("Last edit: email not available (Thu 14 Dec 2017 - 11:36:03)");

        delete event.email;
        expect(component.instance().renderLastEditText(event)).toBe("Last edit: email not available (Thu 14 Dec 2017 - 11:36:03)");
    });

    it("Renders an error message if neither the email or date are available", () => {
        const event = {};
        expect(component.instance().renderLastEditText(event)).toBe("Last edit: information not available");
        expect(component.instance().renderLastEditText()).toBe("Last edit: information not available");
    })
    
    it("Renders an error message if it isn't a valid date and no email is available", () => {
        const event = {
            email: "",
            date: "not a valid date"
        };
        expect(component.instance().renderLastEditText(event)).toBe("Error showing 'last edit' details");
    });

});

describe("Approve collection button", () => {
    const component = shallow(
        <CollectionDetails {...defaultProps}/>
    );

    it("doesn't show when canBeApproved is false", () => {
        component.setProps({canBeApproved: false});
        expect(component.find('#approve-collection').exists()).toEqual(false);
    });
    
    it("shows when canBeApproved is true", () => {
        component.setProps({canBeApproved: true});
        expect(component.find('#approve-collection').exists()).toEqual(true);
    });

    it("doesn't show when the status is set to neutral", () => {
        component.setProps({
            canBeApproved: true,
            status: {neutral: true}
        });
        expect(component.find('#approve-collection').exists()).toEqual(false);
    });
    
    it("doesn't show when the status is set to warning", () => {
        component.setProps({
            canBeApproved: true,
            status: {warning: true}
        });
        expect(component.find('#approve-collection').exists()).toEqual(false);
    });
});

describe("Delete collection button", () => {
    const component = shallow(
        <CollectionDetails {...defaultProps}/>
    );

    it("doesn't show when canBeDeleted is false", () => {
        component.setProps({canBeDeleted: false});
        expect(component.find('#delete-collection').exists()).toEqual(false);
    });
    
    it("shows when canBeDeleted is true", () => {
        component.setProps({canBeDeleted: true});
        expect(component.find('#delete-collection').exists()).toEqual(true);
    });

    it("doesn't show when the status is set to neutral", () => {
        component.setProps({
            canBeDeleted: true,
            status: {neutral: true}
        });
        expect(component.find('#delete-collection').exists()).toEqual(false);
    });
    
    it("doesn't show when the status is set to warning", () => {
        component.setProps({
            canBeDeleted: true,
            status: {warning: true}
        });
        expect(component.find('#delete-collection').exists()).toEqual(false);
    });
});

describe("Cancelling deleted content", () => {
    const component = shallow(
        <CollectionDetails  />
    )

    
});

