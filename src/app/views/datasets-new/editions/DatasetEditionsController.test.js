import React from "react";
import { DatasetEditionsController } from "./DatasetEditionsController";
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
        getEditions: jest.fn(() => {
            return Promise.resolve(mockedEditions);
        }),
        getVersion: jest.fn(() => {
            return Promise.resolve(mockedVersions[0]);
        }),
        getAllVersions: jest.fn(() => {
            return Promise.resolve(mockedVersions);
        }),
        getLatestVersionForEditions: jest.fn(() => {
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

const mockedEditions = {
    items: [
        {
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
        },
        {
            id: "test-2",
            current: {
                edition: "edition-2",
                links: {
                    latest_version: {
                        href: "test/3",
                        id: "12"
                    }
                },
                state: "published"
            }
        }
    ]
};

const mockedMappedEditions = [
    {
        title: "edition-1",
        id: "edition-1",
        url: "florence/collections/12345/datasets/6789/editions/edition-1",
        details: ["Release date: loading..."],
        latestVersion: "3"
    },
    {
        title: "edition-2",
        id: "edition-2",
        url: "florence/collections/12345/datasets/6789/editions/edition-2",
        details: ["Release date: loading..."],
        latestVersion: "12"
    }
];

const mockedVersions = [
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
];

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

const component = shallow(<DatasetEditionsController {...defaultProps} />);

beforeEach(() => {
    mockNotifications = [];
});

describe("Calling getDataset", () => {
    it("returns mapped dataset", async () => {
        const dataset = await component.instance().getDataset(mockedDataset.id);
        expect(dataset).toMatchObject({ title: mockedDataset.current.title });
    });

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

    it("Errors cause notification", async () => {
        datasets.get.mockImplementationOnce(() => Promise.reject({ status: 404 }));
        await component.instance().getDataset(mockedDataset.id);
        expect(mockNotifications.length).toBe(1);
    });
});

describe("Calling getEditions", () => {
    it("returns mapped editions", async () => {
        //gets dataset title and stores in state
        component.setState({ dataset: { title: mockedDataset.current.title } });
        const editions = await component.instance().getEditions(mockedDataset.id);
        expect(editions[0]).toMatchObject({
            title: mockedEditions.items[0].current.edition,
            id: mockedEditions.items[0].current.edition,
            url: `${defaultProps.location.pathname}/editions/${mockedEditions.items[0].current.edition}`,
            details: [`Release date: loading...`],
            latestVersion: mockedEditions.items[0].current.links.latest_version.id
        });
    });

    it("updates isFetchingEditions state to show it's fetching data for all editions", () => {
        expect(component.state("isFetchingEditions")).toBe(false);

        // Tests that state is set correctly before asynchronous requests have finished
        component.instance().getEditions();
        expect(component.state("isFetchingEditions")).toBe(true);
    });

    it("updates isFetchingEditions state to show it has fetched data for all editions", async () => {
        // Tests that state is set correctly after asynchronous requests were successful
        await component.instance().getEditions();
        expect(component.state("isFetchingEditions")).toBe(false);
    });

    it("updates isFetchingEditions state correctly on failure to fetch data for all editions", async () => {
        datasets.getEditions.mockImplementationOnce(() => Promise.reject({ status: 500 }));
        await component.instance().getEditions();
        expect(component.state("isFetchingEditions")).toBe(false);
    });

    it("Errors cause notification", async () => {
        datasets.getEditions.mockImplementationOnce(() => Promise.reject({ status: 404 }));
        await component.instance().getEditions();
        expect(mockNotifications.length).toBe(1);
    });
});

describe("Mapping version release dates to editions method", () => {
    it("returns mapped editions correctly", async () => {
        const mappedEditions = await component.instance().mapVersionReleaseDatesToEditions(mockedDataset.id, mockedMappedEditions);
        expect(mappedEditions[0]).toMatchObject({
            title: "edition-1",
            id: "edition-1",
            url: "florence/collections/12345/datasets/6789/editions/edition-1",
            details: ["Release date: 07 September 2018"],
            latestVersion: "3"
        });
    });

    it("displays inline error if no versions returned", async () => {
        datasets.getLatestVersionForEditions.mockImplementationOnce(() => Promise.reject({ status: 500 }));
        const mappedEditions = await component.instance().mapVersionReleaseDatesToEditions(mockedDataset.id, mockedMappedEditions);
        expect(mappedEditions[0]).toMatchObject({
            title: "edition-1",
            id: "edition-1",
            url: "florence/collections/12345/datasets/6789/editions/edition-1",
            details: ["Release date: error retreiving release date"],
            latestVersion: "3"
        });
    });
});

test("Mapping dataset to state", () => {
    const mappedDataset = component.instance().mapDatasetToState(mockedDataset);
    expect(mappedDataset).toMatchObject({ title: mockedDataset.current.title });
});

test("Mapping edition to state", () => {
    const expectedMappedEdition = {
        title: mockedEditions.items[0].current.edition,
        id: mockedEditions.items[0].current.edition,
        url: defaultProps.location.pathname + "/editions/" + mockedEditions.items[0].current.edition,
        details: ["Release date: loading..."],
        latestVersion: mockedEditions.items[0].current.links.latest_version.id
    };
    // componenet gets dataset info and stores in state, so set it for this test
    component.setState({ dataset: { title: "Dataset Title" } });
    const mappedEditions = component.instance().mapDatasetEditionsToView(mockedEditions.items);
    expect(mappedEditions[0]).toMatchObject(expectedMappedEdition);
});
