import React from 'react';
import {DatasetMetadata} from './DatasetMetadata.jsx';
import notifications from '../../../utilities/notifications';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';

console.error = jest.fn();

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

jest.mock('../../../utilities/api-clients/datasets', () => (
    {
        get: jest.fn(() => {
            return Promise.resolve({
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
                    "qmi": {
                        "href": "http://localhost:8080/datasets/12345",
                        "title": "An example QMI",
                        "descrption": "this is an example QMI for you to look at"
                    },
                    "related_datasets": [
                      {
                          "href": "http://localhost:8080/datasets/6789910",
                          "title": "Crime in the UK"
                      },
                      {
                          "href": "http://localhost:8080/datasets/6789910",
                          "title": "More Crime in the UK"
                      }
                    ],
                    "publications": [
                        {
                            "href": "http://www.localhost:8080/datasets/173849jf8j238d",
                            "title": "An example publication"
                        }
                    ],
                    "next_release": "pudding",
                    "keywords": ["keyword1", "keyword2"],
                    "publisher": {},
                    "qmi": {},
                    "state": "published",
                    "title": "CPI",
                    "uri": "/economy/inflationandpricesindices/datasets/consumerpriceindices"
                }
            })
        }),
        getAll: jest.fn().mockImplementation(() => {
            return Promise.resolve()
        })
    }
));

const mockEvent = {
    preventDefault: function() {}
}

const defaultProps = {
    dispatch: function(){},
    datasets: [],
    params: {
      dataset: "1234"
    }
}

test("Dataset details page matches stored snapshot", () => {
    const component = renderer.create(
      <DatasetMetadata {...defaultProps} />
    );
    expect(component.toJSON()).toMatchSnapshot();
});

test("Dataset ID displayed matches ID from dataset API", async () => {
  const component = mount(
      <DatasetMetadata {...defaultProps} />
  );
  await component.instance().componentWillMount();
  expect(component.update().state("isFetchingDataset")).toBe(false);
  expect(component.update().find('.datasetId').text()).toEqual(datasetID);
});

test("Dataset title updates after successful fetch from dataset API on mount", async () => {
    const component = shallow(
        <DatasetMetadata {...defaultProps} />
    );

    expect(component.state("title")).toBe(null);
    await component.instance().componentWillMount();
    expect(component.update().state("title")).toBe("CPI");
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
    const component = mount(
        <DatasetMetadata {...defaultProps} />
    );
    await component.instance().componentWillMount();
    expect(component.update().state("relatedQMI")).to.have.length.of(1);
    await component.instance().removeRelated("qmi", "123");
    expect(component.update().state("relatedQMI")).to.have.length.of(0);
});
