import React from "react";
import { DatasetEditionsController } from "./DatasetEditionsController";
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
        getEditionsList: jest.fn(() => {
            return Promise.resolve(mockedResponse);
        }),
    };
});

const mockedResponse = {
    dataset_name: "test-dataset-1",
    editions: [
        {
            id: "edition-001",
            title: "edition-001",
            release_date: "15 March 2021",
        },
        {
            id: "edition-002",
            title: "edition-002",
            release_date: "11 March 2021",
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
    params: {
        datasetID: "1234",
    },
};

const component = shallow(<DatasetEditionsController {...defaultProps} />);

beforeEach(() => {
    mockNotifications = [];
});

describe("Calling getEditionsList", () => {
    it("updates isFetchingDataset state to show it's fetching data for all datasets", () => {
        expect(component.state("isFetchingData")).toBe(false);

        component.instance().getAllEditions(mockedResponse.dataset_name);
        expect(component.state("isFetchingData")).toBe(true);
    });

    it("updates isFetchingDatasets state to show it has fetched data for all datasets", async () => {
        await component.instance().getAllEditions(mockedResponse.dataset_name);
        expect(component.state("isFetchingData")).toBe(false);
    });

    it("updates isFetchingDatasets state correctly on failure to fetch data for all datasets", async () => {
        datasets.getEditionsList.mockImplementationOnce(() => Promise.reject({ status: 500 }));
        await component.instance().getAllEditions(mockedResponse.dataset_name);
        expect(component.state("isFetchingData")).toBe(false);
    });

    it("Errors cause notification", async () => {
        datasets.getEditionsList.mockImplementationOnce(() => Promise.reject({ status: 404 }));
        await component.instance().getAllEditions(mockedResponse.dataset_name);
        expect(mockNotifications.length).toBe(1);
    });
});

test("Mapping editions to state", () => {
    const mapped = component.instance().mapEditionsToState(mockedResponse.editions);
    expect(mapped[0]).toMatchObject({
        id: mockedResponse.editions[0].id,
        title: mockedResponse.editions[0].title,
        url: "florence/collections/12345/datasets/6789/editions/" + mockedResponse.editions[0].id,
        details: ["Release date: " + mockedResponse.editions[0].release_date],
    });
    expect(mapped[1]).toMatchObject({
        id: mockedResponse.editions[1].id,
        title: mockedResponse.editions[1].title,
        url: "florence/collections/12345/datasets/6789/editions/" + mockedResponse.editions[1].id,
        details: ["Release date: " + mockedResponse.editions[1].release_date],
    });
});
