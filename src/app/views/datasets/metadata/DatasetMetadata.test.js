import React from 'react';
import {DatasetMetadata} from './DatasetMetadata.jsx';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import handleMetadataSaveErrors from './datasetHandleMetadataSaveErrors';
import collections from '../../../utilities/api-clients/collections'
import datasets from '../../../utilities/api-clients/datasets'

console.error = jest.fn();

jest.mock('uuid/v4', () => () => {
    return "12345";
});

jest.mock('../../../utilities/notifications', () => {
    return {
        add: jest.fn(() => {
            //
        })
    }
});

jest.mock('../../../utilities/http', () => {
    return {
        resolve: function() {
            //
        }
    }
});

jest.mock('../../../utilities/log', () => {
    return {
        add: function() {
            //
        },
        eventTypes: {}
    }
});

jest.mock('../../../utilities/api-clients/datasets', () => (
    {
        get: jest.fn(() => {
            return Promise.resolve({
                next: {
                    collection_id: 'test-collection-12345',
                    id: '931a8a2a-0dc8-42b6-a884-7b6054ed3b68',
                    license: 'Open Government License',
                    links: {
                        editions: {
                            href: 'http://localhost:22000/datasets/931a8a2a-0dc8-42b6-a884-7b6054ed3b68/editions'
                        },
                        latest_version: {
                            id: 'efcc4581-30b1-463b-b85b-2e2d85c4918b',
                            href: 'http://localhost:22000/datasets/931a8a2a-0dc8-42b6-a884-7b6054ed3b68/editions/2016/versions/1'
                        },
                        self: {
                            href: 'http://localhost:22000/datasets/931a8a2a-0dc8-42b6-a884-7b6054ed3b68'
                        }
                    },
                    qmi: {
                        href: 'http://localhost:8080/datasets/12345'
                    },
                    related_datasets: [
                        {
                            href: 'http://localhost:8080/datasets/6789910',
                            title: 'Crime in the UK'
                        },
                        {
                            href: 'http://localhost:8080/datasets/6789910',
                            title: 'More Crime in the UK'
                        }
                    ],
                    publications: [
                        {
                            href: 'http://www.localhost:8080/datasets/173849jf8j238d',
                            title: 'An example publication'
                        }
                    ],
                    methodologies: [
                        {
                            href: 'http://www.localhost:8080/datasets/173849jf8j238d',
                            title: 'An example methodology',
                            description: "A description"
                        }
                    ],
                    next_release: 'pudding',
                    keywords: [
                        'keyword1',
                        'keyword2'
                    ],
                    publisher: {},
                    contacts: [{
                        email: "test@email.com",
                        name: "foo bar",
                        telephone: "01633 123456"
                    }],
                    state: 'published',
                    title: 'CPI',
                    uri: '/economy/inflationandpricesindices/datasets/consumerpriceindices'
                }
            });
        }),
        getAll: jest.fn(() => {
            return Promise.resolve({
                items: []
            })
        }),
        updateDatasetMetadata: jest.fn(() => Promise.resolve())
    }
));

jest.mock('../../../utilities/api-clients/collections', () => (
    {
        get: jest.fn(() => Promise.resolve({
            id: "test-collection-12345",
            datasets: [{
                id: "931a8a2a-0dc8-42b6-a884-7b6054ed3b68",
                state: 'InProgress',
                lastEditedBy: 'user@email.com'
            }],
            datasetVersions: []
        })),
        setDatasetStatusToComplete: jest.fn(() => Promise.resolve()),
        setDatasetStatusToReviewed: jest.fn(() => Promise.resolve())
    }
));

jest.mock('./datasetHandleMetadataSaveErrors.js', () => {
    return jest.fn(() => false);
});

jest.mock('../../../utilities/url.js', () => (
    {
        resolve: jest.fn(() => '/florence/collections/my-collection-12345')
    }
));

const mockEvent = {
    preventDefault: function() {}
}

const exampleDataset = {
    current: {
        collection_id: 'test-collection-12345',
        id: '931a8a2a-0dc8-42b6-a884-7b6054ed3b68',
        license: 'Open Government License',
        links: {
            editions: {
                href: 'http://localhost:22000/datasets/931a8a2a-0dc8-42b6-a884-7b6054ed3b68/editions'
            },
            latest_version: {
                id: 'efcc4581-30b1-463b-b85b-2e2d85c4918b',
                href: 'http://localhost:22000/datasets/931a8a2a-0dc8-42b6-a884-7b6054ed3b68/editions/2016/versions/1'
            },
            self: {
                href: 'http://localhost:22000/datasets/931a8a2a-0dc8-42b6-a884-7b6054ed3b68'
            }
        },
        qmi: {
            href: 'http://localhost:8080/datasets/12345'
        },
        related_datasets: [
            {
                href: 'http://localhost:8080/datasets/6789910',
                title: 'Crime in the UK'
            },
            {
                href: 'http://localhost:8080/datasets/6789910',
                title: 'More Crime in the UK'
            }
        ],
        publications: [
            {
                href: 'http://www.localhost:8080/datasets/173849jf8j238d',
                title: 'An example publication'
            }
        ],
        methodologies: [
            {
                href: 'http://www.localhost:8080/datasets/173849jf8j238d',
                title: 'An example methodology',
                description: "A description"
            }
        ],
        next_release: 'pudding',
        keywords: [
            'keyword1',
            'keyword2'
        ],
        publisher: {},
        contacts: [{
            email: "test@email.com",
            name: "foo bar",
            telephone: "01633 123456"
        }],
        state: 'published',
        title: 'CPI',
        uri: '/economy/inflationandpricesindices/datasets/consumerpriceindices'
    }
}

let dispatchedAction = null;

const defaultProps = {
    rootPath: "/florence",
    collectionID: "test-collection-12345",
    dispatch: action => {dispatchedAction = action},
    datasets: [{
        next: {
            title: "Dataset 1"
        },
        current: {
            title: "Dataset 2"
        }
    }],
    dataset: {...exampleDataset.current},
    params: {
        datasetID: "931a8a2a-0dc8-42b6-a884-7b6054ed3b68"
    },
    userEmail: "user@email.com",
    routes: [{}],
    router: {
        listenBefore: () => {}
    }
}

const defaultComponent = shallow(
    <DatasetMetadata {...defaultProps} />
);

test("Dataset details page matches stored snapshot", () => {
    const component = renderer.create(
      <DatasetMetadata {...defaultProps} />
    );
    expect(component.toJSON()).toMatchSnapshot();
});

test("Dataset title updates after successful fetch from dataset API on mount", async () => {
    datasets.get.mockImplementationOnce(() => (
        Promise.resolve({current: exampleDataset.current})
    ))
    await defaultComponent.instance().componentWillMount();
    await defaultComponent.update(); // update() appears to be async so we need to wait for it to finish before asserting
    expect(defaultComponent.state("title")).toBe("CPI");
});

test("Correct modal type shows when user wants to add a related bulletin", () => {
    expect(defaultComponent.state("modalType")).toBe("");
    expect(defaultComponent.state("showModal")).toBe(false);
    defaultComponent.instance().handleAddRelatedClick("bulletin");
    expect(defaultComponent.state("modalType")).toBe("bulletin");
    expect(defaultComponent.state("showModal")).toBe(true);

    // Reset state for future tests
    defaultComponent.setState({
        modalType: "",
        showModal: false
    })
});

test("Removing the value from related QMI input updates state to be empty", async () => {
    const mockTitleEvent = {
        target: {
            value: "",
            name: "relatedQMI"
        }
    }
    await defaultComponent.instance().componentWillMount();
    await defaultComponent.update();
    expect(defaultComponent.state("relatedQMI")).toBe(exampleDataset.current.qmi.href);
    defaultComponent.instance().handleInputChange(mockTitleEvent);
    await defaultComponent.update();
    expect(defaultComponent.state("relatedQMI")).toBe("");
});

test("Handler for removing a related bulletin updates state correctly", async () => {
    await defaultComponent.instance().componentWillMount();
    await defaultComponent.update();
    expect(defaultComponent.state("relatedBulletins").length).toEqual(1);
    expect(defaultComponent.state("relatedBulletins")[0]).toMatchObject({
        key: "12345",
        title: exampleDataset.current.publications[0].title,
        href: exampleDataset.current.publications[0].href
    });
    await defaultComponent.instance().handleDeleteRelatedClick("bulletin", "12345");
    await defaultComponent.update();
    expect(defaultComponent.state("relatedBulletins").length).toBe(0);
});

test("Related datasets are set in state correctly on mount", async () => {
    await defaultComponent.instance().componentWillMount();
    await defaultComponent.update();
    expect(defaultComponent.state("relatedLinks").length).toEqual(2);
    defaultComponent.state("relatedLinks").forEach((relatedLink, index) => {
        expect(relatedLink).toMatchObject({
            key: "12345",
            title: exampleDataset.current.related_datasets[index].title,
            href: exampleDataset.current.related_datasets[index].href
        });
    });
});

test("Usage information is set in state after successful fetch from dataset API on mount", () => {
    expect(defaultComponent.state("license")).toBe("Open Government License");
});

test("Changing an input value updates the state to show a change has been made", async () => {
    const asyncComponent = await shallow(
        <DatasetMetadata {...defaultProps} />
    );
    const event = {
        ...mockEvent,
        target: {
            value: "A new description",
            name: "description"
        }
    }

    await asyncComponent.update();
    expect(asyncComponent.state("hasChanges")).toBe(false);
    asyncComponent.instance().handleInputChange(event);
    await asyncComponent.update();
    expect(asyncComponent.state("description")).toBe("A new description");
    expect(asyncComponent.state("hasChanges")).toBe(true);
});

test("Warning modal shown when unsaved changes have been made", async () => {
    defaultComponent.setState({isReadOnly: false});

    expect(defaultComponent.find(".modal__header h2").exists()).toBe(false);
    expect(defaultComponent.state("showModal")).toBe(false);

    const inputChangeEvent = {
        ...mockEvent,
        target: {
            value: "test-value",
            name: "test-name"
        }
    }
    defaultComponent.instance().handleInputChange(inputChangeEvent);
    defaultComponent.instance().handleBackButton();
    expect(defaultComponent.state("showModal")).toBe(true);
    expect(defaultComponent.state("modalType")).toBe("");
    expect(defaultComponent.find(".modal__header h2").exists()).toBe(true);
});

test("Available release frequencies maps correctly to select element", () => {
    const validSelectContents = [
        {
            id: "weekly",
            name: "Weekly"
        },
        {
            id: "monthly",
            name: "Monthly"
        },
        {
            id: "annually",
            name: "Annually"
        }
    ]

    const createdSelectContents = defaultComponent.instance().mapReleaseFreqToSelectOptions();
    expect(createdSelectContents).toEqual(expect.arrayContaining(validSelectContents));
});

test("Handle select change event updates state correctly", () => {

    expect(defaultComponent.update().state("releaseFrequency")).toBe("");
    defaultComponent.instance().handleSelectChange({preventDefault: ()=>{}, target: {value: "Weekly"}});
    expect(defaultComponent.update().state("releaseFrequency")).toBe("Weekly");
});

test("Handle checkbox tick updates 'national statistic' state correctly", () => {

    expect(defaultComponent.state("isNationalStat")).toBe(false);
    defaultComponent.instance().handleToggleChange(true);
    expect(defaultComponent.state("isNationalStat")).toBe(true);
    defaultComponent.instance().handleToggleChange(false);
    expect(defaultComponent.state("isNationalStat")).toBe(false);
});

test("Handle input change updates relevant state correctly", () => {
    const mockTitleEvent = {
        target: {
            value: "Some free text",
            name: "add-related-content-title"
        }
    }
    const mockURLEvent = {
        target: {
            value: "https://url.com",
            name: "add-related-content-url"
        }
    }

    expect(defaultComponent.state("titleInput")).toBe("");
    expect(defaultComponent.state("urlInput")).toBe("");

    defaultComponent.instance().handleInputChange(mockTitleEvent);
    expect(defaultComponent.state("titleInput")).toBe(mockTitleEvent.target.value);

    defaultComponent.instance().handleInputChange(mockURLEvent);
    expect(defaultComponent.state("urlInput")).toBe(mockURLEvent.target.value);

    defaultComponent.setState({
        urlInput: "",
        urlError: "",
        titleInput: "",
        titleError: ""
    });
});

test("Input errors are added on submit and then removed on change of that input", () => {
    const mockTitleEvent = {
        target: {
            value: "Some free text",
            name: "add-related-content-title"
        }
    }
    const mockURLEvent = {
        target: {
            value: "https://url.com",
            name: "add-related-content-url"
        }
    }

    expect(defaultComponent.state("titleInput")).toBe("");
    expect(defaultComponent.state("urlInput")).toBe("");
    expect(defaultComponent.update().state("titleError")).toBe("");
    expect(defaultComponent.update().state("urlError")).toBe("");

    defaultComponent.instance().handleRelatedContentSubmit({preventDefault: ()=>{}});
    expect(defaultComponent.update().state("titleError")).not.toBe("");
    expect(defaultComponent.update().state("urlError")).not.toBe("");

    defaultComponent.instance().handleInputChange(mockTitleEvent);
    expect(defaultComponent.state("titleInput")).toBe(mockTitleEvent.target.value);
    expect(defaultComponent.update().state("titleError")).toBe(null);

    defaultComponent.instance().handleInputChange(mockURLEvent);
    expect(defaultComponent.state("urlInput")).toBe(mockURLEvent.target.value);
    expect(defaultComponent.update().state("urlError")).toBe(null);
});

test("Handler to edit a related item updates the state with new values", () => {
    defaultComponent.setState({relatedBulletins: [{
        key: "12345"
    }]});
    defaultComponent.setState({titleInput: "Some new words"});
    defaultComponent.instance().editRelatedLink("bulletin", "12345");
    expect(defaultComponent.state("relatedBulletins").length).toBe(1);
    const editedRelatedBulletins = defaultComponent.update().state("relatedBulletins");
    expect(editedRelatedBulletins[0].title).toBe("Some new words"); 
});

test("Handler for editing a related link opens modal with existing values", () => { 
    defaultComponent.setState({relatedBulletins: [{
        key: "12345",
        href: exampleDataset.current.publications[0].href,
        title: exampleDataset.current.publications[0].title
    }]})   
    defaultComponent.instance().handleEditRelatedClick("bulletin", "12345");
    expect(defaultComponent.state("showModal")).toBe(true);
    expect(defaultComponent.state("modalType")).toBe("bulletin");
    expect(defaultComponent.state("urlInput")).toBe(exampleDataset.current.publications[0].href);
    expect(defaultComponent.state("titleInput")).toBe(exampleDataset.current.publications[0].title);
});

test("Editing an existing related methodologies card display correct modal with values", () => {
    defaultComponent.instance().handleEditRelatedClick("methodologies", "12345");
    expect(defaultComponent.state("showModal")).toBe(true);
    expect(defaultComponent.state("modalType")).toBe("methodologies");
    expect(defaultComponent.state("urlInput")).toBe(exampleDataset.current.methodologies[0].href);
    expect(defaultComponent.state("titleInput")).toBe(exampleDataset.current.methodologies[0].title);
    expect(defaultComponent.state("descInput")).toBe(exampleDataset.current.methodologies[0].description);
});

test("Related items map to card element correctly", () => {
    const cardProps = defaultComponent.instance().mapTypeContentsToCard(defaultComponent.state("relatedLinks"));
    defaultComponent.state("relatedLinks").forEach((dataset, index) => {
        expect(cardProps[index]).toMatchObject({
            title: dataset.title,
            id: dataset.key
        });
    })
});

test("Methodologies items map to card element correctly", () => {
    const cardProps = defaultComponent.instance().mapTypeContentsToCard(defaultComponent.state("relatedMethodologies"));
    defaultComponent.state("relatedMethodologies").forEach((dataset, index) => {
        expect(cardProps[index]).toMatchObject({
            title: dataset.title,
            id: dataset.key
        });
    })
});

describe("Component's state maps to API request correctly when", () => {
    it("contact details data has been updated", () => {
        const mockState = {
            contactEmail: "foobar@email.com",
            contactPhone: "01234 567890",
            contactName: "Bob Jones"
        }
        const mockRequestContactsObject = {
            email: "foobar@email.com",
            telephone: "01234 567890",
            name: "Bob Jones"
        }
    
        defaultComponent.setState(mockState);
        const componentInstance = defaultComponent.instance();
        expect(componentInstance.mapStateToAPIRequest().contacts.length).toBe(1);
        expect(componentInstance.mapStateToAPIRequest().contacts[0]).toEqual(expect.objectContaining(mockRequestContactsObject));
    });
    
    it("description data has been updated", () => {
        const mockState = {
            description: "This is a stubbed description"
        }
    
        defaultComponent.setState(mockState);
        expect(defaultComponent.instance().mapStateToAPIRequest().description).toBe(mockState.description);
    });
    
    it("related publications data has been updated", () => {
        const mockPublicationsState = {
            relatedBulletins: [
                {
                    title: "A publication title",
                    href: "/economy/gdp/bulletins/july2016"
                },
                {
                    title: "A publication title",
                    href: "/economy/gdp/bulletins/july2016",
                    description: "Words words words and more words"
                }
            ]
        }
    
        defaultComponent.setState(mockPublicationsState);
        const componentInstance = defaultComponent.instance();
        expect(componentInstance.mapStateToAPIRequest().publications.length).toBe(2);
        expect(componentInstance.mapStateToAPIRequest().publications[0]).toEqual(expect.objectContaining(mockPublicationsState.relatedBulletins[0]));
        expect(componentInstance.mapStateToAPIRequest().publications[1]).toEqual(expect.objectContaining(mockPublicationsState.relatedBulletins[1]));
    });
    
    it("related links data has been updated", () => {
        const mockLinksState = {
            relatedLinks: [
                {
                    title: "GOV.UK",
                    href: "https://gov.uk"
                }
            ]
        }
    
        defaultComponent.setState(mockLinksState);
        expect(defaultComponent.instance().mapStateToAPIRequest().related_datasets[0]).toEqual(expect.objectContaining(mockLinksState.relatedLinks[0]));
    });
        
    it("related methodlogies data has been updated", () => {
        const mockState = {
            relatedMethodologies: [
                {
                    title: "New methodology",
                    href: "https://ons.gov.uk",
                    description: "A new description"
                }
            ]
        }
    
        defaultComponent.setState(mockState);
        expect(defaultComponent.instance().mapStateToAPIRequest().methodologies[0]).toEqual(expect.objectContaining(mockState.relatedMethodologies[0]));
    });
    
    it("related QMI data has been updated", () => {
        const mockQMIState = {
            relatedQMI: "/economy/gdp/methodology/gdpqmi"
        }
        const mockRequestQMIObject = {
            href: mockQMIState.relatedQMI
        }
    
        defaultComponent.setState(mockQMIState);
        expect(defaultComponent.instance().mapStateToAPIRequest().qmi).toEqual(expect.objectContaining(mockRequestQMIObject));
    });
    
    it("national statistic data has been updated", () => {
        const mockNationalStatState = {
            isNationalStat: false
        }
    
        defaultComponent.setState(mockNationalStatState);
        expect(defaultComponent.instance().mapStateToAPIRequest().national_statistic).toBe(false);
    });
    
    it("keywords data has been updated", () => {
        const mockKeywordsState = {
            keywords: "foo , bar,more, two words, another"
        }
    
        defaultComponent.setState(mockKeywordsState);
        expect(defaultComponent.instance().mapStateToAPIRequest().keywords).toEqual(expect.arrayContaining(["foo", "bar", "more", "two words", "another"]));
    });
    
    it("title data has been updated", () => {
        const mockTitleState = {
            title: "Foobar"
        }
    
        defaultComponent.setState(mockTitleState);
        expect(defaultComponent.instance().mapStateToAPIRequest().title).toBe("Foobar");
    });

    it("usage information has been updated", () => {
        const mockTitleState = {
            license: "Foobar"
        }
    
        defaultComponent.setState(mockTitleState);
        expect(defaultComponent.instance().mapStateToAPIRequest().license).toBe("Foobar");
    });
});

describe("Saving changes and submitting for review/approval", () => {

    it("passes any errors from updating review state to the error handler", async () => {
        collections.setDatasetStatusToComplete.mockImplementationOnce(() => (
            Promise.reject({status: 500, statusText: "Mocked error"})
        ));
        await defaultComponent.instance().handleSave(mockEvent, true, false);
        const handlerArguments = handleMetadataSaveErrors.mock.calls[handleMetadataSaveErrors.mock.calls.length-1];
        expect(handlerArguments[1]).toBeTruthy();
        expect(handlerArguments[1]).toEqual({status: 500, statusText: "Mocked error"});
        expect(handlerArguments[0]).toBeFalsy();
    });
    
    it("passes any errors from metadata updates to the error handler", async () => {
        datasets.updateDatasetMetadata.mockImplementationOnce(() => (
            Promise.reject({status: 500, statusText: "Mocked error"})
        ));
        await defaultComponent.instance().handleSave(mockEvent, true, false);
        const handlerArguments = handleMetadataSaveErrors.mock.calls[handleMetadataSaveErrors.mock.calls.length-1];
        expect(handlerArguments[0]).toBeTruthy();
        expect(handlerArguments[0]).toEqual({status: 500, statusText: "Mocked error"});
        expect(handlerArguments[1]).toBeFalsy();
    });

    it("doesn't reset 'hasChanges' in state after error saving metadata updates", async () => {
        datasets.updateDatasetMetadata.mockImplementationOnce(() => (
            Promise.reject({status: 500, statusText: "Mocked error"})
        ));
        defaultComponent.setState({hasChanges: true});
        await defaultComponent.instance().handleSave(mockEvent, false, false);
        expect(defaultComponent.state('hasChanges')).toBe(true);
    });

    it("reset 'hasChanges' in state after successfully saving metadata updates", async () => {
        defaultComponent.setState({hasChanges: true});
        await defaultComponent.instance().handleSave(mockEvent, false, false);
        expect(defaultComponent.state('hasChanges')).toBe(false);
    });

    it("re-routes to the current collection when there are no errors and review state has been updated", async () => {
        defaultComponent.instance().handleSave(mockEvent, false, true);
        await expect(dispatchedAction.payload.args[0]).toBe('/florence/collections/my-collection-12345');
        dispatchedAction = null;
    });

    it("doesn't route to the current collection if there are errors", async () => {
        collections.setDatasetStatusToReviewed.mockImplementationOnce(() => Promise.reject({status: 500}));
        dispatchedAction = null;
        await defaultComponent.instance().handleSave(mockEvent, false, true); 
        expect(dispatchedAction).toBeFalsy();
    });
});

describe("Updating the review state on mount", () => {

    it("loads read-only mode if the fetch for a collection fails", async () => {
        collections.get.mockImplementationOnce(() => Promise.reject({status: 500, statusText: "Mocked error"}));
        defaultComponent.setState({isReadOnly: false});
        await defaultComponent.instance().updateReviewStateData();
        await defaultComponent.update();
        expect(defaultComponent.instance().state.isReadOnly).toBe(true);
    });

    it("loads read-only mode if the dataset cannot be found in the current collection", async () => {
        datasets.get.mockImplementationOnce(() => Promise.reject({status: 500, statusText: "Mocked error"}));
        defaultComponent.setState({isReadOnly: false});
        await defaultComponent.instance().componentWillMount();
        await defaultComponent.update();
        expect(defaultComponent.instance().state.isReadOnly).toBe(true);
    });

    it("updates the 'last edited by' data in state", async () => {
        dispatchedAction = {};

        collections.get.mockImplementationOnce(() => Promise.resolve({
            datasets: [{
                state: "Complete",
                lastEditedBy: "user-2@email.com",
                id: "931a8a2a-0dc8-42b6-a884-7b6054ed3b68"
            }]
        }));

        await defaultComponent.instance().updateReviewStateData();
        expect(dispatchedAction.lastEditedBy).toBe('user-2@email.com');
    });
    
    it("updates the 'review state' data in state", async () => {
        dispatchedAction = {};

        collections.get.mockImplementationOnce(() => Promise.resolve({
            datasets: [{
                state: "Complete",
                lastEditedBy: "user@email.com",
                id: "931a8a2a-0dc8-42b6-a884-7b6054ed3b68"
            }]
        }));

        await defaultComponent.instance().updateReviewStateData();
        expect(dispatchedAction.reviewState).toBe('complete');
    });
});

describe("Renders the correct buttons", () => {
    const completeProps = {
        ...defaultProps,
        dataset: {
            ...exampleDataset.current,
            reviewState: "complete",
            lastEditedBy: "user-2@email.com"
        }
    }
    const completeComponent = shallow(
        <DatasetMetadata {...completeProps} />
    )
    
    const inProgressProps = {
        ...defaultProps,
        dataset: {
            ...exampleDataset.current,
            reviewState: "inProgress",
            lastEditedBy: "user-2@email.com"
        }
    }
    const inProgressComponent = shallow(
        <DatasetMetadata {...inProgressProps} />
    )
    
    const reviewedProps = {
        ...defaultProps,
        dataset: {
            ...exampleDataset.current,
            reviewState: "reviewed",
            lastEditedBy: "user-2@email.com"
        }
    }
    const reviewedComponent = shallow(
        <DatasetMetadata {...reviewedProps} />
    )
    
    it("disables the 'save' button loading data", async () => {
        expect(defaultComponent.state('isFetchingDataset')).toBeFalsy();
        expect(defaultComponent.state('isFetchingCollectionData')).toBeFalsy();
        defaultComponent.instance().componentWillMount();
        expect(defaultComponent.state('isFetchingDataset')).toBe(true);
        expect(defaultComponent.find('#btn-save[disabled=true]').exists()).toBe(true);

        await defaultComponent.update();
        expect(defaultComponent.state('isFetchingCollectionData')).toBe(true);
        expect(defaultComponent.find('#btn-save[disabled=true]').exists()).toBe(true);
    });

    it("disables save button when saving data", () => {
        expect(inProgressComponent.find('#btn-save[disabled=false]').exists()).toBe(true);

        inProgressComponent.instance().handleSave(mockEvent, false, false);
        expect(inProgressComponent.find('#btn-save[disabled=true]').exists()).toBe(true);
    });

    it("disables the 'save' button/s when a dataset is read-only", () => {
        defaultComponent.setState({isReadOnly: false});
        expect(defaultComponent.find('#btn-save[disabled=false]').exists()).toBe(true);
        defaultComponent.setState({isReadOnly: true});
        expect(defaultComponent.find('#btn-save[disabled=true]').exists()).toBe(true);
    });
});