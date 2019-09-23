import React from "react";
import { DatasetVersionsController } from "./DatasetVersionsController";
import { shallow, mount } from "enzyme";
import datasets from "../../../utilities/api-clients/datasets";

console.error = () => {};

jest.mock("../../../utilities/logging/log", () => {
    return {
        event: function() {}
    };
});

jest.mock("../../../utilities/notifications", () => {
    return {
        add: jest.fn(notification => {
            mockNotifications.push(notification);
        }),
        remove: () => {}
    };
});

jest.mock("../../../utilities/api-clients/datasets", () => {
    return {
        get: jest.fn(() => {
            return Promise.resolve(mockedDataset);
        }),
        getEdition: jest.fn(() => {
            return Promise.resolve(mockedEdition);
        }),
        getVersions: jest.fn(() => {
            return Promise.resolve(mockedVersions);
        })
    };
});

const mockedDataset = {
    id: "test-dataset-1",
    current: {
        collection_id: "1234567890",
        id: "test-dataset-1",
        title: "Test Dataset 1"
    }
};

const mockedEdition = {
    id: "test-1",
    current: {
        edition: "edition-1",
        links: {
            latest_version: {
                href: "test/3",
                id: "3"
            }
        },
        state: "published"
    }
};

const mockedVersions = {
    items: [
        {
            alerts: [],
            edition: "edition-1",
            id: "6b59a885-f4ca-4b78-9b89-4e9a8e939d55",
            release_date: "2018-09-07T00:00:00.000Z",
            state: "published",
            version: 1
        },
        {
            alerts: [],
            edition: "edition-2",
            id: "6b59a885-f4ca-4b78-9b89-4e9a8e939d55",
            release_date: "2018-09-07T00:00:00.000Z",
            state: "published",
            version: 2
        }
    ]
};

let dispatchedActions,
    mockNotifications = [];

const defaultProps = {
    dispatch: event => {
        dispatchedActions.push(event);
    },
    rootPath: "/florence",
    location: {
        pathname: "florence/collections/12345/datasets/6789"
    },
    routeParams: {
        datasetID: "1234"
    }
};

const component = shallow(<DatasetVersionsController {...defaultProps} />);

beforeEach(() => {
    mockNotifications = [];
});

describe("Get dataset", () => {
    it("updates isFetchingDataset state to show it's fetching data for all datasets", () => {
        expect(component.state("isFetchingDataset")).toBe(false);

        // Tests that state is set correctly before asynchronous requests have finished
        component.instance().getDataset(mockedDataset.id);
        expect(component.state("isFetchingDataset")).toBe(true);
    });

    it("updates isFetchingDatasets state to show it has fetched data for all datasets", async () => {
        // Tests that state is set correctly after asynchronous requests were successful
        await component.instance().getDataset(mockedDataset.id);
        expect(component.state("isFetchingDataset")).toBe(false);
    });

    it("updates isFetchingDatasets state correctly on failure to fetch data for all datasets", async () => {
        datasets.get.mockImplementationOnce(() => Promise.reject({ status: 500 }));
        await component.instance().getDataset(mockedDataset.id);
        expect(component.state("isFetchingDataset")).toBe(false);
    });

    it("errors cause notification", async () => {
        datasets.get.mockImplementationOnce(() => Promise.reject({ status: 404 }));
        await component.instance().getDataset(mockedDataset.id);
        expect(mockNotifications.length).toBe(1);
    });
});

describe("Get edition", () => {
    it("updates isFetchingDataset state to show it's fetching data for all datasets", () => {
        expect(component.state("isFetchingEdition")).toBe(false);

        // Tests that state is set correctly before asynchronous requests have finished
        component.instance().getEdition(mockedDataset.id, mockedEdition.id);
        expect(component.state("isFetchingEdition")).toBe(true);
    });

    it("updates isFetchingDatasets state to show it has fetched data for all datasets", async () => {
        // Tests that state is set correctly after asynchronous requests were successful
        await component.instance().getEdition(mockedDataset.id, mockedEdition.id);
        expect(component.state("isFetchingEdition")).toBe(false);
    });

    it("updates isFetchingDatasets state correctly on failure to fetch data for all datasets", async () => {
        datasets.get.mockImplementationOnce(() => Promise.reject({ status: 500 }));
        await component.instance().getEdition(mockedDataset.id, mockedEdition.id);
        expect(component.state("isFetchingEdition")).toBe(false);
    });
});

describe("Get all versions", () => {
    it("updates isFetchingDataset state to show it's fetching data for all datasets", () => {
        expect(component.state("isFetchingVersions")).toBe(false);

        // Tests that state is set correctly before asynchronous requests have finished
        component.instance().getAllVersions(mockedDataset.id, mockedEdition.id);
        expect(component.state("isFetchingVersions")).toBe(true);
    });

    it("updates isFetchingDatasets state to show it has fetched data for all datasets", async () => {
        // Tests that state is set correctly after asynchronous requests were successful
        await component.instance().getAllVersions(mockedDataset.id, mockedEdition.id);
        expect(component.state("isFetchingVersions")).toBe(false);
    });

    it("updates isFetchingDatasets state correctly on failure to fetch data for all datasets", async () => {
        datasets.get.mockImplementationOnce(() => Promise.reject({ status: 500 }));
        await component.instance().getAllVersions(mockedDataset.id, mockedEdition.id);
        expect(component.state("isFetchingVersions")).toBe(false);
    });
});

test("Mapping dataset to state", () => {
    const mappedDataset = component.instance().mapDatasetToState(mockedDataset);
    expect(mappedDataset).toMatchObject({ title: mockedDataset.current.title });
});

test("Mapping edition to state", () => {
    const mappedEdition = component.instance().mapDatasetEditionToState(mockedEdition);
    expect(mappedEdition).toMatchObject({ title: mockedEdition.current.edition });
});

test("Mapping version to state", () => {
    const mappedVersions = component.instance().mapDatasetVersionsToState(mockedVersions.items);
    expect(mappedVersions[0]).toMatchObject({
        id: "6b59a885-f4ca-4b78-9b89-4e9a8e939d55",
        title: "Version: 2 (published)",
        url: "florence/collections/12345/datasets/6789/versions/2",
        details: ["Release date: 07 September 2018"]
    });
});
