import React from "react";
import { DatasetsController } from "./DatasetsController";
import { shallow, mount } from "enzyme";
import datasets from "../../utilities/api-clients/datasets";

console.error = () => {};

jest.mock("../../utilities/logging/log", () => {
    return {
        event: function() {}
    };
});

jest.mock("../../utilities/log", () => {
    return {
        add: function() {},
        eventTypes: {}
    };
});

jest.mock("../../utilities/notifications", () => {
    return {
        add: jest.fn(() => {}),
        remove: () => {}
    };
});

jest.mock("../../utilities/api-clients/datasets", () => {
    return {
        getAll: jest.fn(() => {
            return Promise.resolve(mockedAllDatasets);
        })
    };
});

const mockedAllDatasets = {
    items: [
        {
            id: "test-dataset-1",
            current: {
                collection_id: "1234567890",
                id: "test-dataset-1",
                title: "Test Dataset 1"
            }
        },
        {
            id: "test-dataset-2",
            current: {
                collection_id: "1234567890",
                id: "test-dataset-2",
                title: "Test Datatset 2"
            }
        },
        {
            id: "test-dataset-3",
            current: {
                collection_id: "1234567890",
                id: "test-dataset-3",
                title: ""
            }
        }
    ]
};

let dispatchedActions = [];

const defaultProps = {
    dispatch: event => {
        dispatchedActions.push(event);
    },
    rootPath: "/florence",
    location: {
        pathname: "florence/collections/12345/datasets"
    }
};

const component = shallow(<DatasetsController {...defaultProps} />);

describe("On mount of the datasets controller screen", () => {
    it("fetches datasets", () => {
        const getDatasetsCalls = datasets.getAll.mock.calls.length;
        component.instance().componentWillMount();
        expect(datasets.getAll.mock.calls.length).toBe(getDatasetsCalls + 1);
    });
});

describe("Calling getAllDatasets", () => {
    it("adds all datasets to state", async () => {
        component.instance().getAllDatasets();
        expect(component.state().datasets.length).toBe(mockedAllDatasets.items.length);
    });

    it("updates isFetchingDatasets state to show it's fetching data for all datasets", () => {
        expect(component.state("isFetchingDatasets")).toBe(false);

        // Tests that state is set correctly before asynchronous requests have finished
        component.instance().getAllDatasets();
        expect(component.state("isFetchingDatasets")).toBe(true);
    });

    it("updates isFetchingDatasets state to show it has fetched data for all datasets", async () => {
        // Tests that state is set correctly after asynchronous requests were successful
        await component.instance().getAllDatasets();
        expect(component.state("isFetchingDatasets")).toBe(false);
    });

    it("updates isFetchingDatasets state correctly on failure to fetch data for all datasets", async () => {
        datasets.getAll.mockImplementationOnce(() => Promise.reject({ status: 500 }));
        await component.instance().getAllDatasets();
        expect(component.state("isFetchingDatasets")).toBe(false);
    });
});

describe("Mapping datasets to state", () => {
    it("maps correctly", () => {
        const expectedValue = [
            {
                title: mockedAllDatasets.items[0].current.title,
                id: mockedAllDatasets.items[0].current.id,
                url: defaultProps.location.pathname + "/" + mockedAllDatasets.items[0].current.id
            },
            {
                title: mockedAllDatasets.items[1].current.title,
                id: mockedAllDatasets.items[1].current.id,
                url: defaultProps.location.pathname + "/" + mockedAllDatasets.items[1].current.id
            },
            {
                title: mockedAllDatasets.items[2].current.id,
                id: mockedAllDatasets.items[2].current.id,
                url: defaultProps.location.pathname + "/" + mockedAllDatasets.items[2].current.id
            }
        ];
        const returnValue = component.instance().mapDatasetsToState(mockedAllDatasets.items);
        expect(returnValue[0]).toMatchObject(expectedValue[0]);
        expect(returnValue[1]).toMatchObject(expectedValue[1]);
        expect(returnValue[2]).toMatchObject(expectedValue[2]);
    });
});
