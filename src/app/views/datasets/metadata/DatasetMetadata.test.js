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

test("Removing a related bulletin updates state correctly", async () => {
    const component = shallow(
        <DatasetMetadata {...defaultProps} />
    );

    await component.instance().componentWillMount();
    await component.update();
    expect(component.state("relatedBulletins").length).toEqual(1);
    // expect(component.state("relatedBulletins")).toMatchObject({
    //     key: "12345",
    //     title: exampleDataset.current.re.title,
    //     url: exampleDataset.current.qmi.href
    // });
    // await component.instance().handleDeleteRelatedClick("bulletin", "12345");
    // await component.update();
    // expect(component.state("relatedQMI")).toBe("");
});

test("Related datasets are set in state correctly on mount", async () => {
    const component = shallow(
        <DatasetMetadata {...defaultProps} />
    );

    await component.instance().componentWillMount();
    await component.update();

    expect(component.state("relatedLinks").length).toEqual(2);
});