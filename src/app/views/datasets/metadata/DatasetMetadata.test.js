import React from 'react';
import {DatasetMetadata} from './DatasetMetadata.jsx';
import notifications from '../../../utilities/notifications';
import uuid from 'uuid/v4';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';

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
        }
    }
});

jest.mock('../../../utilities/api-clients/datasets', () => (
    {
        get: jest.fn(() => {
            return Promise.resolve({
                next: {}
            });
        }),
        getAll: jest.fn(() => {
            return Promise.resolve({
                items: []
            })
        })
    }
));

const mockEvent = {
    preventDefault: function() {}
}

const exampleDataset = {
    current: {
        collection_id: 'fddffdfdaadf-e8ad17766a81bf589e76ef57d854945fdf0bfe546000228837aa70701506869c',
        id: '931a8a2a-0dc8-42b6-a884-7b6054ed3b68',
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
            href: 'http://localhost:8080/datasets/12345',
            title: 'An example QMI',
            description: 'this is an example QMI for you to look at'
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
        next_release: 'pudding',
        keywords: [
            'keyword1',
            'keyword2'
        ],
        publisher: {},
        state: 'published',
        title: 'CPI',
        uri: '/economy/inflationandpricesindices/datasets/consumerpriceindices'
    }
}

const defaultProps = {
    dispatch: function(){},
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
    }
}

test("Dataset details page matches stored snapshot", () => {
    const component = renderer.create(
      <DatasetMetadata {...defaultProps} />
    );
    expect(component.toJSON()).toMatchSnapshot();
});

test("Dataset title updates after successful fetch from dataset API on mount", async () => {
    const component = shallow(
        <DatasetMetadata {...defaultProps} />
    );

    await component.instance().componentWillMount();
    await component.update(); // update() appears to be async so we need to wait for it to finish before asserting
    expect(component.state("title")).toBe("CPI");
});

test("Correct modal type shows when user wants to add a related bulletin", async () => {
    const component = shallow(
        <DatasetMetadata {...defaultProps} />
    );
    expect(component.state("modalType")).toBe("");
    await component.instance().handleAddRelatedClick("bulletin");
    expect(component.state("modalType")).toBe("bulletin");
});

test("Removing a related QMI updates state to be empty", async () => {
    const component = shallow(
        <DatasetMetadata {...defaultProps} />
    );
    await component.instance().componentWillMount();
    await component.update();
    expect(component.state("relatedQMI")).toMatchObject({
        key: "12345",
        title: exampleDataset.current.qmi.title,
        url: exampleDataset.current.qmi.href
    });
    await component.instance().handleDeleteRelatedClick("qmi", "12345");
    await component.update();
    expect(component.state("relatedQMI")).toBe("");
});

test("Handler for removing a related bulletin updates state correctly", async () => {
    const component = shallow(
        <DatasetMetadata {...defaultProps} />
    );

    await component.instance().componentWillMount();
    await component.update();
    expect(component.state("relatedBulletins").length).toEqual(1);
    expect(component.state("relatedBulletins")[0]).toMatchObject({
        key: "12345",
        title: exampleDataset.current.publications[0].title,
        url: exampleDataset.current.publications[0].href
    });
    await component.instance().handleDeleteRelatedClick("bulletin", "12345");
    await component.update();
    expect(component.state("relatedBulletins").length).toBe(0);
});

test("Related datasets are set in state correctly on mount", async () => {
    const component = shallow(
        <DatasetMetadata {...defaultProps} />
    );

    await component.instance().componentWillMount();
    await component.update();
    expect(component.state("relatedLinks").length).toEqual(2);
    component.state("relatedLinks").forEach((relatedLink, index) => {
        expect(relatedLink).toMatchObject({
            key: "12345",
            title: exampleDataset.current.related_datasets[index].title,
            url: exampleDataset.current.related_datasets[index].href
        });
    });
});

test("Changing an input value updates the state to show a change has been made", async () => {
    const component = await shallow(
        <DatasetMetadata {...defaultProps} />
    );

    await component.update();
    expect(component.state("hasChanges")).toBe(false);
    component.setState({description: "A new description"});
    expect(component.state("description")).toBe("A new description");
    expect(component.state("hasChanges")).toBe(true);
});

test("Warning modal shown when unsaved changes have been made", async () => {
    const component = await shallow(
        <DatasetMetadata {...defaultProps} />
    );

    await component.update();
    expect(component.find(".modal__header h2").exists()).toBe(false);
    expect(component.state("showModal")).toBe(false);
    component.setState({description: "A new description"});
    component.instance().handleBackButton();
    expect(component.state("showModal")).toBe(true);
    expect(component.state("modalType")).toBe("");
    expect(component.find(".modal__header h2").exists()).toBe(true);
});

test("Available release frequencies maps correctly to select element", () => {
    const component = shallow(
        <DatasetMetadata {...defaultProps} />
    );

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

    const createdSelectContents = component.instance().mapReleaseFreqToSelectOptions();
    expect(createdSelectContents).toEqual(expect.arrayContaining(validSelectContents));
});

test("Handle select change event updates state correctly", () => {
    const component = shallow(
        <DatasetMetadata {...defaultProps} />
    );

    expect(component.update().state("periodicity")).toBe("");
    component.instance().handleSelectChange({preventDefault: ()=>{}, target: {value: "Weekly"}});
    expect(component.update().state("periodicity")).toBe("Weekly");
});

test("Handle checkbox tick updates 'national statistic' state correctly", () => {
    const component = shallow(
        <DatasetMetadata {...defaultProps} />
    );

    expect(component.state("isNationalStat")).toBe(false);
    component.instance().handleToggleChange(true);
    expect(component.state("isNationalStat")).toBe(true);
    component.instance().handleToggleChange(false);
    expect(component.state("isNationalStat")).toBe(false);
});

test("Handle input change updates relevant state correctly", () => {
    const component = shallow(
        <DatasetMetadata {...defaultProps} />
    );
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

    expect(component.state("titleInput")).toBe("");
    expect(component.state("urlInput")).toBe("");

    component.instance().handleInputChange(mockTitleEvent);
    expect(component.state("titleInput")).toBe(mockTitleEvent.target.value);

    component.instance().handleInputChange(mockURLEvent);
    expect(component.state("urlInput")).toBe(mockURLEvent.target.value);
});

test("Input errors are added on submit and then removed on change of that input", () => {
    const component = shallow(
        <DatasetMetadata {...defaultProps} />
    );
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

    expect(component.state("titleInput")).toBe("");
    expect(component.state("urlInput")).toBe("");
    expect(component.update().state("titleError")).toBe("");
    expect(component.update().state("urlError")).toBe("");

    component.instance().handleFormSubmit({preventDefault: ()=>{}});
    expect(component.update().state("titleError")).not.toBe("");
    expect(component.update().state("urlError")).not.toBe("");

    component.instance().handleInputChange(mockTitleEvent);
    expect(component.state("titleInput")).toBe(mockTitleEvent.target.value);
    expect(component.update().state("titleError")).toBe(null);

    component.instance().handleInputChange(mockURLEvent);
    expect(component.state("urlInput")).toBe(mockURLEvent.target.value);
    expect(component.update().state("urlError")).toBe(null);
});

test("Handler to edit a related item updates the state with new values", async () => {
    const component = await shallow(
        <DatasetMetadata {...defaultProps} />
    );
    await component.update();
    
    expect(component.state("relatedBulletins").length).toBe(1);
    const initialRelatedBulletins = component.state("relatedBulletins");
    component.setState({titleInput: "Some new words"});
    component.instance().editRelatedLink("bulletin", "12345");
    expect(component.state("relatedBulletins").length).toBe(1);
    const editedRelatedBulletins = component.update().state("relatedBulletins");
    expect(editedRelatedBulletins[0].title).toBe("Some new words");
});

test("Handle for editing a related link opens modal with existing values", async () => {
    const component = await shallow(
        <DatasetMetadata {...defaultProps} />
    );
    await component.update();
    
    component.instance().handleEditRelatedClick("bulletin", "12345");
    expect(component.state("showModal")).toBe(true);
    expect(component.state("modalType")).toBe("bulletin");
    expect(component.state("urlInput")).toBe(exampleDataset.current.publications[0].href);
    expect(component.state("titleInput")).toBe(exampleDataset.current.publications[0].title);
});

test("Related items map to card element correctly", async () => {
    const component = await shallow(
        <DatasetMetadata {...defaultProps} />
    );
    await component.update();

    const cardProps = component.instance().mapTypeContentsToCard(component.state("relatedLinks"));
    component.state("relatedLinks").forEach((dataset, index) => {
        expect(cardProps[index]).toMatchObject({
            title: dataset.title,
            id: dataset.key
        });
    })
})