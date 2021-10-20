import React from "react";
import { DatasetVersionsController } from "./DatasetVersionsController";
import { shallow, mount } from "enzyme";
import datasets from "../../../utilities/api-clients/datasets";

console.error = () => {};

jest.mock("../../../utilities/logging/log", () => {
    return {
        event: function () {},
    };
});

jest.mock("../../../utilities/notifications", () => {
    return {
        add: jest.fn(notification => {
            mockNotifications.push(notification);
        }),
        remove: () => {},
    };
});

jest.mock("../../../utilities/api-clients/datasets", () => {
    return {
        getVersionsList: jest.fn(() => {
            return Promise.resolve(mockedResponse);
        }),
    };
});

const mockedDataset = {
    title: "Test Dataset 1",
    id: "test-dataset-001",
};

const mockedResponse = {
    dataset_name: mockedDataset.title,
    edition_name: "test-edition-1",
    versions: [
        {
            title: "Version: 2 (published)",
            id: "6b59a885-f4ca-4b78-9b89-4e9a8e980000",
            release_date: "",
            state: "published",
            version: 2,
        },
        {
            title: "Version: 1 (published)",
            id: "6b59a885-f4ca-4b78-9b89-4e9a8e939d55",
            release_date: "15 March 2021",
            state: "published",
            version: 1,
        },
    ],
};

let dispatchedActions,
    mockNotifications = [];

const defaultProps = {
    dispatch: event => {
        dispatchedActions.push(event);
    },
    rootPath: "/florence",
    location: {
        pathname: "florence/collections/12345/datasets/6789",
    },
    routeParams: {
        datasetID: "1234",
    },
};

const component = shallow(<DatasetVersionsController {...defaultProps} />);

beforeEach(() => {
    mockNotifications = [];
});

describe("Get versions list", () => {
    it("updates isFetchingData state to show it's fetching data", () => {
        expect(component.state("isFetchingData")).toBe(false);

        component.instance().getAllVersions(mockedDataset.id);
        expect(component.state("isFetchingData")).toBe(true);
    });

    it("updates isFetchingData state to show it has fetched data", async () => {
        await component.instance().getAllVersions(mockedDataset.id);
        expect(component.state("isFetchingData")).toBe(false);
    });

    it("updates isFetchingData state correctly on failure to fetch data", async () => {
        datasets.getVersionsList.mockImplementationOnce(() => Promise.reject({ status: 500 }));
        await component.instance().getAllVersions(mockedDataset.id);
        expect(component.state("isFetchingData")).toBe(false);
    });

    it("errors cause notification", async () => {
        datasets.getVersionsList.mockImplementationOnce(() => Promise.reject({ status: 404 }));
        await component.instance().getAllVersions(mockedDataset.id);
        expect(mockNotifications.length).toBe(1);
    });
});

test("Mapping response to state", () => {
    const mapped = component.instance().mapDatasetVersionsToState(mockedResponse.versions);
    expect(mapped[0]).toMatchObject({
        id: "6b59a885-f4ca-4b78-9b89-4e9a8e980000",
        title: "Version: 2 (published)",
        url: "florence/collections/12345/datasets/6789/versions/2",
        details: ["Release date: Not yet set"],
    });
    expect(mapped[1]).toMatchObject({
        id: "6b59a885-f4ca-4b78-9b89-4e9a8e939d55",
        title: "Version: 1 (published)",
        url: "florence/collections/12345/datasets/6789/versions/1",
        details: ["Release date: 15 March 2021"],
    });
});
