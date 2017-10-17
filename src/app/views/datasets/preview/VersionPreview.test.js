import React from 'react';
import {VersionPreview} from './VersionPreview';
import notifications from '../../../utilities/notifications';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

console.error = jest.fn();

jest.mock('../../../utilities/notifications', () => {
    return {
        add: jest.fn(() => {
            //
        })
    }
});
jest.mock('../../../utilities/url', () => {
    return {
        resolve: function() {
            //
        },
        parent: function() {}
    }
});
jest.mock('../../../utilities/api-clients/datasets', () => (
    {
        get: jest.fn(() => {
            return Promise.resolve({
                "id": "931a8a2a-0dc8-42b6-a884-7b6054ed3b68",
                "current": {
                    "collection_id": "fddffdfdaadf-e8ad17766a81bf589e76ef57d854945fdf0bfe546000228837aa70701506869c",
                    "id": "931a8a2a-0dc8-42b6-a884-7b6054ed3b68",
                    "links": {
                        "editions": {
                            "href": "http://localhost:22000/datasets/931a8a2a-0dc8-42b6-a884-7b6054ed3b68/editions"
                        },
                        "latest_version": {
                            "id": "efcc4581-30b1-463b-b85b-2e2d85c4918b",
                            "href": "http://localhost:22000/datasets/931a8a2a-0dc8-42b6-a884-7b6054ed3b68/editions/2016/versions/1"
                        },
                        "self": {
                            "href": "http://localhost:22000/datasets/931a8a2a-0dc8-42b6-a884-7b6054ed3b68"
                        }
                    },
                    "next_release": "pudding",
                    "publisher": {},
                    "qmi": {},
                    "state": "published",
                    "title": "CPI",
                    "uri": "/economy/inflationandpricesindices/datasets/consumerpriceindices"
                },
                "next": {
                    "collection_id": "fddffdfdaadf-e8ad17766a81bf589e76ef57d854945fdf0bfe546000228837aa70701506869c",
                    "id": "931a8a2a-0dc8-42b6-a884-7b6054ed3b68",
                    "links": {
                        "editions": {
                            "href": "http://localhost:22000/datasets/931a8a2a-0dc8-42b6-a884-7b6054ed3b68/editions"
                        },
                        "latest_version": {
                            "id": "efcc4581-30b1-463b-b85b-2e2d85c4918b",
                            "href": "http://localhost:22000/datasets/931a8a2a-0dc8-42b6-a884-7b6054ed3b68/editions/2016/versions/1"
                        },
                        "self": {
                            "href": "http://localhost:22000/datasets/931a8a2a-0dc8-42b6-a884-7b6054ed3b68"
                        }
                    },
                    "next_release": "pudding",
                    "publisher": {},
                    "qmi": {},
                    "state": "published",
                    "title": "CPI",
                    "uri": "/economy/inflationandpricesindices/datasets/consumerpriceindices"
                }
            })
        }).mockImplementationOnce(() => {
            return Promise.reject({status: 403});
        }),
        approveInstance: jest.fn().mockImplementation(() => {
            return Promise.resolve()
        })
    }
));

const mockEvent = {
    preventDefault: function() {}
}

const defaultProps = {
    dispatch: function(){},
    params: {
        datasetID: "abc123",
        edition: "2017",
        version: "2"
    }
}

test("Version preview matches stored snapshot", () => {
    const component = renderer.create(
        <VersionPreview {...defaultProps} />
    );
    expect(component.toJSON()).toMatchSnapshot();
});

test("On approval the state is updated to toggle disabling some actions during approval", async () => {
    const component = shallow(
        <VersionPreview {...defaultProps} />
    );

    expect(component.state("isApprovingVersion")).toBe(false);
    await component.instance().handleApproveSubmit(mockEvent);
    expect(component.state("isApprovingVersion")).toBe(true);
});

test("User shown a notification if an error occurs during approval", async () => {
    const component = shallow(
        <VersionPreview {...defaultProps} />
    );

    await component.instance().handleApproveSubmit(mockEvent);
    expect(notifications.add.mock.calls.length).toBe(1);
});

test("Dataset title updates after successful fetch from dataset API on mount", async () => {
    const component = shallow(
        <VersionPreview {...defaultProps} />
    );

    expect(component.state("datasetTitle")).toBe(null);
    await component.instance().componentWillMount();
    expect(component.update().state("datasetTitle")).toBe("CPI");
});