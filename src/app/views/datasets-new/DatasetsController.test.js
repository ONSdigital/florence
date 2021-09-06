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
        getAllList: jest.fn(() => {
            return Promise.resolve(mockedAllDatasets);
        })
    };
});

const mockedAllDatasets = [
    {
        id: "test-dataset-1",
        title: "Test Dataset 1"
    },
    {
        id: "test-dataset-2",
        title: "Test Datatset 2"
    },
    {
        id: "test-dataset-3",
        title: ""
    }
];

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

const mountComponent = () => {
    return shallow(<DatasetsController {...defaultProps} />);
};

let component;

beforeEach(() => {
    component = mountComponent();
});

describe("On mount of the datasets controller screen", () => {
    it("fetches datasets", () => {
        const getDatasetsCalls = datasets.getAllList.mock.calls.length;
        component.instance().UNSAFE_componentWillMount();
        expect(datasets.getAllList.mock.calls.length).toBe(getDatasetsCalls + 1);
    });
});

describe("Calling getAllDatasets", () => {
    it("adds all datasets to state", () => {
        component.instance().getAllDatasets();
        // plus 1 to expected because we hard code a create link at index 0
        expect(component.state().datasets.length).toBe(mockedAllDatasets.length + 1);
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
        datasets.getAllList.mockImplementationOnce(() => Promise.reject({ status: 500 }));
        await component.instance().getAllDatasets();
        expect(component.state("isFetchingDatasets")).toBe(false);
    });
});

describe("Mapping datasets to state", () => {
    it("maps correctly", () => {
        const expectedValue = [
            {
                title: "Create new dataset",
                id: "create-new-dataset",
                url: defaultProps.location.pathname + "/create"
            },
            {
                title: mockedAllDatasets[0].title,
                id: mockedAllDatasets[0].id,
                url: defaultProps.location.pathname + "/" + mockedAllDatasets[0].id
            },
            {
                title: mockedAllDatasets[1].title,
                id: mockedAllDatasets[1].id,
                url: defaultProps.location.pathname + "/" + mockedAllDatasets[1].id
            },
            {
                title: mockedAllDatasets[2].id,
                id: mockedAllDatasets[2].id,
                url: defaultProps.location.pathname + "/" + mockedAllDatasets[2].id
            }
        ];
        const returnValue = component.instance().mapDatasetsToState(mockedAllDatasets);
        expect(returnValue[0]).toMatchObject(expectedValue[0]);
        expect(returnValue[1]).toMatchObject(expectedValue[1]);
        expect(returnValue[2]).toMatchObject(expectedValue[2]);
    });
});
