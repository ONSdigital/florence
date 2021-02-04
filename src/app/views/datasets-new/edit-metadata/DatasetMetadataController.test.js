import React from "react";
import { DatasetMetadataController } from "./DatasetMetadataController";
import { shallow, mount } from "enzyme";
import datasets from "../../../utilities/api-clients/datasets";
import { async } from "regenerator-runtime";

console.error = () => {};

jest.mock("../../../utilities/logging/log", () => {
    return {
        event: function() {},
        data: function() {},
        error: function() {}
    };
});

jest.mock("../../../utilities/log", () => {
    return {
        add: function() {},
        eventTypes: {}
    };
});

jest.mock("../../../utilities/notifications", () => {
    return {
        add: jest.fn(notification => {
            mockedNotifications.push(notification);
        }),
        remove: () => {}
    };
});

jest.mock("../../../utilities/api-clients/datasets", () => {
    return {
        getEditMetadata: jest.fn(() => {
            return Promise.resolve(mockedMetadata);
        }),
        putEditMetadata: jest.fn(() => {
            return Promise.resolve();
        })
    };
});

const mockedMetadata = {
    dataset: {
        id: "456",
        title: "Test dataset",
        national_statistic: true,
        collection_id: "123",
        contacts: [
            {
                name: "Person",
                telephone: "0385927492083820",
                email: "email@email.com"
            }
        ]
    },
    version: {
        alerts: [],
        collection_id: "123",
        edition: "time-series",
        id: "ed0e8b92-7152-4b43-a2cf-999dc65c1af2",
        release_date: "2020-12-03T00:00:00.000Z",
        state: "edition-confirmed",
        version: 2
    },
    dimensions: [
        {
            id: "mmm-yy",
            name: "time",
            description: "This is time",
            label: "Time",
            href: "/code-lists/mmm-yy"
        },
        {
            id: "uk-only",
            name: "geography",
            description: "Geography",
            label: "Geography",
            href: "/code-lists/uk-only"
        }
    ],
    collection_id: "123",
    collection_state: "InProgress",
    collection_last_edited_by: "test@user.com"
};
const mockedState = {
    metadata: {
        title: mockedMetadata.dataset.title,
        summary: mockedMetadata.dataset.description,
        keywords: "",
        nationalStatistic: mockedMetadata.dataset.national_statistic,
        licence: "",
        relatedDatasets: [],
        relatedPublications: [],
        relatedMethodologies: [],
        releaseFrequency: "",
        unitOfMeasure: "",
        nextReleaseDate: mockedMetadata.dataset.next_release,
        qmi: "",
        contactName: mockedMetadata.dataset.contacts[0].name,
        contactEmail: mockedMetadata.dataset.contacts[0].email,
        contactTelephone: mockedMetadata.dataset.contacts[0].telephone,
        edition: mockedMetadata.version.edition,
        version: mockedMetadata.version.version,
        releaseDate: { value: mockedMetadata.version.release_date, error: "" },
        notices: [],
        dimensions: mockedMetadata.dimensions,
        usageNotes: [],
        latestChanges: []
    },
    datasetCollectionState: mockedMetadata.collection_state,
    versionCollectionState: mockedMetadata.collection_state,
    lastEditedBy: mockedMetadata.collection_last_edited_by
};

let mockedNotifications = [];
let dispatchedActions = [];

const datasetID = "456";
const editionID = "789";
const versionID = "1";

const defaultProps = {
    dispatch: event => {
        dispatchedActions.push(event);
    },
    rootPath: "/florence",
    location: {
        pathname: "florence/collections/123/datasets/456/editions/789/version/1"
    },
    params: {
        collectionID: "123",
        datasetID: "456",
        editionID: "789",
        versionID: "1"
    }
};

const mountComponent = () => {
    return shallow(<DatasetMetadataController {...defaultProps} />);
};

let component;

beforeEach(() => {
    component = mountComponent();
});

describe("On mount of the dataset metadata controller screen", () => {
    it("fetches metadata", () => {
        const getDatasetsCalls = datasets.getEditMetadata.mock.calls.length;
        component.instance().componentWillMount();
        expect(datasets.getEditMetadata.mock.calls.length).toBe(getDatasetsCalls + 1);
    });
});

describe("Calling getMetadata", () => {
    beforeEach(() => {
        mockedNotifications = [];
    });

    it("updates isFetchingMetadata state to show it's fetching data for all datasets", () => {
        expect(component.state("isGettingMetadata")).toBe(false);

        component.instance().getMetadata();
        expect(component.state("isGettingMetadata")).toBe(true);
    });

    it("updates isFetchingMetadata state to show it has fetched data for all datasets", async () => {
        await component.instance().getMetadata();
        expect(component.state("isGettingMetadata")).toBe(false);
    });

    it("updates isFetchingMetadata state correctly on failure to fetch data for all datasets", async () => {
        datasets.getEditMetadata.mockImplementationOnce(() => Promise.reject({ status: 500 }));
        await component.instance().getMetadata();
        expect(component.state("isGettingMetadata")).toBe(false);
    });

    it("creates notification on error", async () => {
        datasets.getEditMetadata.mockImplementationOnce(() => Promise.reject({ status: 500 }));
        await component.instance().getMetadata();
        expect(mockedNotifications.length).toBe(1);
    });
});

describe("Mapping metadata to state", () => {
    it("maps correctly", () => {
        const returnValue = component.instance().mapMetadataToState(mockedMetadata);
        expect(returnValue).toMatchObject(mockedState);
    });
});

describe("Mapping state to put body", () => {
    it("maps correctly", () => {
        component.setState(mockedState);
        const returnValue = component.instance().mapMetadataToPutBody(false, false);
        expect(returnValue.dataset.id).toBe(mockedMetadata.dataset.id);
        expect(returnValue.collection_id).toBe("123");
        expect(returnValue.collection_state).toBe("InProgress");
    });

    it("maps state correctly", () => {
        component.setState(mockedState);
        const expectComplete = component.instance().mapMetadataToPutBody(true, false);
        expect(expectComplete.collection_state).toBe("Complete");
        const expectReviewed = component.instance().mapMetadataToPutBody(false, true);
        expect(expectReviewed.collection_state).toBe("Reviewed");
    });
});

describe("Calling saveMetadata", () => {
    beforeEach(() => {
        mockedNotifications = [];
        dispatchedActions = [];
    });

    it("updates isSaving state to show it's fetching data for all datasets", () => {
        expect(component.state("isSaving")).toBe(false);

        component.instance().saveMetadata();
        expect(component.state("isSaving")).toBe(true);
    });

    it("updates isSaving state to show it has fetched data for all datasets", async () => {
        await component.instance().saveMetadata();
        expect(component.state("isSaving")).toBe(false);
    });

    it("updates isSaving state correctly on failure to fetch data for all datasets", async () => {
        datasets.putEditMetadata.mockImplementationOnce(() => Promise.reject({ status: 500 }));
        await component.instance().saveMetadata();
        expect(component.state("isSaving")).toBe(false);
    });

    it("on error: creates notification", async () => {
        expect(mockedNotifications.length).toBe(0);
        datasets.putEditMetadata.mockImplementationOnce(() => Promise.reject({ status: 500 }));
        await component.instance().saveMetadata();
        expect(mockedNotifications.length).toBe(1);
    });

    it("on success: creates notifcation", async () => {
        expect(mockedNotifications.length).toBe(0);
        await component.instance().saveMetadata();
        expect(mockedNotifications.length).toBe(1);
    });

    it("on success: redirects if state is 'complete' or 'reviewed'", async () => {
        await component.instance().saveMetadata(datasetID, editionID, versionID, {}, true, false);
        expect(dispatchedActions[0].payload.method).toBe("push");
        expect(dispatchedActions[0].payload.args[0]).toBe("/florence/collections/123");
    });
});
