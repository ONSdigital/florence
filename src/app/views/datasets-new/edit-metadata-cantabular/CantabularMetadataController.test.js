import React from "react";
import { CantabularMetadataController } from "./CantabularMetadataController";
import { shallow } from "enzyme";
import datasets from "../../../utilities/api-clients/datasets";
import cookies from "../../../utilities/cookies";
import log from "../../../utilities/logging/log";

console.error = () => {};

jest.mock("../../../utilities/logging/log", () => {
    return {
        event: function () {},
        data: function () {},
        error: jest.fn(),
    };
});

jest.mock("../../../utilities/log", () => {
    return {
        add: function () {},
        eventTypes: {},
    };
});

jest.mock("../../../utilities/notifications", () => {
    return {
        add: jest.fn(notification => {
            mockedNotifications.push(notification);
        }),
        remove: () => {},
    };
});

jest.mock("../../../utilities/api-clients/datasets", () => {
    return {
        getEditMetadata: jest.fn(() => {
            return Promise.resolve(mockedSavedNonCantDatasetMetadata);
        }),
        putEditMetadata: jest.fn(() => {
            return Promise.resolve();
        }),
        get: jest.fn(() => {
            return Promise.resolve();
        }),
        getCantabularMetadata: jest.fn(),
    };
});

jest.mock("../../../utilities/cookies.js", () => {
    return {
        get: jest.fn(),
    };
});

const mockedCantabularExtractorResp = {
    table_query_result: {
        service: {
            tables: [
                {
                    name: "Cantabular metadata",
                    label: "",
                    description: "Cantabular metadata description",
                    vars: ["Dimension1", "Dimension2"],
                    meta: {
                        contact: {},
                        census_releases: [],
                        dataset_mnemonic2011: "",
                        dataset_population: "",
                        dissemination_source: "",
                        geographic_coverage: "",
                        geographic_variable_mnemonic: "",
                        last_updated: "",
                        keywords: [],
                        publications: [],
                        related_datasets: [],
                        statistical_unit: {
                            statistical_unit: "unit",
                            statistical_unit_description: "",
                        },
                        unique_url: "",
                        version: "1",
                    },
                },
            ],
        },
    },
    dataset_query_result: {
        dataset: {
            label: "",
            description: "",
            meta: {
                source: {
                    contact: {
                        contact_name: "Name",
                        contact_email: "email@email.com",
                        contact_phone: "1111111",
                        contact_website: "www.test.com/contact",
                    },
                    licence: "www.test.com/licence",
                    methodology_link: "www.test.com/methodology",
                    methodology_statement: "",
                    national_statistic_certified: "Y",
                },
            },
            vars: [
                {
                    name: "Dimension1 Name",
                    description: "Dimension1 description",
                    label: "Dimension1 Label",
                },
                {
                    name: "Dimension2 Name",
                    description: "Dimension2 description",
                    label: "Dimension2 Label",
                },
            ],
        },
    },
};

const mockedCantabularDatasetMetadata = {
    dataset: {
        title: `Cantabular metadata (${mockedCantabularExtractorResp.table_query_result.service.tables[0].label})`,
        description: "Cantabular metadata description",
        keywords: ["Dimension1", "Dimension2"],
        national_statistic: true,
        license: "www.test.com/licence",
        related_datasets: [],
        publications: [],
        unit_of_measure: "unit",
        qmi: {
            href: "www.test.com/methodology",
        },
        contacts: [
            {
                name: "Name",
                email: "email@email.com",
                telephone: "1111111",
                website: "www.test.com/contact",
            },
        ],
    },
    version: {
        dimensions: [
            {
                name: "Dimension1 Name",
                description: "Dimension1 description",
                label: "Dimension1 Label",
            },
            {
                name: "Dimension2 Name",
                description: "Dimension2 description",
                label: "Dimension2 Label",
            },
        ],
    },
};

const mockedSavedNonCantDatasetMetadata = {
    dataset: {
        id: "456",
        methodologies: [],
        next_release: "",
        release_frequency: "2",
        title: "Dataset-API test metadata",
        description: "Cantabular metadata description",
        keywords: ["Dimension1", "Dimension2"],
        national_statistic: false,
        license: "www.testData.com/licence",
        related_datasets: [],
        publications: [],
        unit_of_measure: "unit",
        qmi: {
            href: "www.testData.com/methodology",
        },
        contacts: [
            {
                name: "Test Name",
                email: "testEmail@email.com",
                telephone: "2222222",
                website: "www.testData.com/contact",
            },
        ],
    },
    version: {
        alerts: [],
        collection_id: "123",
        edition: "time-series",
        id: "ed0e8b92-7152-4b43-a2cf-999dc65c1af2",
        release_date: "2020-12-03T00:00:00.000Z",
        state: "edition-confirmed",
        version: 2,
        latest_changes: [],
        usage_notes: [
            {
                id: 0,
                note: "usage note 1",
                simpleListDescription: "usage note 1",
                simpleListHeading: "usage note title 1",
                title: "usage note title 1",
            },
            {
                id: 1,
                note: "usage note 2",
                simpleListDescription: "usage note 2",
                simpleListHeading: "usage note title 2",
                title: "usage note title 2",
            },
        ],
    },
    collection_id: "123",
    collection_state: "inProgress",
    collection_last_edited_by: "test@user.com",
};

const mockedUnSavedNonCantabularDatasetMetadata = {
    dataset: {
        id: "567",
        methodologies: [],
        next_release: "",
        release_frequency: "1",
    },
    version: {
        alerts: [],
        collection_id: "test_collection_253275687",
        edition: "2021",
        id: "3be1d978-ead1-4fc5-8cd7-2bf58199728b",
        release_date: "2022-12-03T00:00:00.000Z",
        version: 1,
        latest_changes: [],
        usage_notes: [
            {
                id: 0,
                note: "usage note 1",
                simpleListDescription: "usage note 1",
                simpleListHeading: "usage note title 1",
                title: "usage note title 1",
            },
        ],
    },
    dimensions: [],
    collection_id: "test_collection_253275687",
    collection_state: "",
    collection_last_edited_by: "",
};

const mockedCantabularDataset = {
    dataset: {
        id: "cantabular",
        state: "created",
        type: "cantabular_table",
    },
    version: {
        alerts: [],
        collection_id: "",
        downloads: null,
        edition: "2021",
        id: "3be1d978-ead1-4fc5-8cd7-2bf58199728b",
        release_date: "",
        state: "edition-confirmed",
        version: 1,
    },
    dimensions: [],
    collection_id: "",
    collection_state: "",
    collection_last_edited_by: "test@user.com",
};

const mockCantabularMetadataState = {
    metadata: {
        title: mockedCantabularDatasetMetadata.dataset.title,
        summary: mockedCantabularDatasetMetadata.dataset.description,
        keywords: mockedCantabularDatasetMetadata.dataset.keywords?.join().replace(",", ", "),
        nationalStatistic: mockedCantabularDatasetMetadata.dataset.national_statistic,
        licence: mockedCantabularDatasetMetadata.dataset.license,
        relatedDatasets: mockedCantabularDatasetMetadata.dataset.related_datasets,
        relatedPublications: mockedCantabularDatasetMetadata.dataset.publications,
        relatedMethodologies: mockedUnSavedNonCantabularDatasetMetadata.dataset.methodologies,
        releaseFrequency: mockedUnSavedNonCantabularDatasetMetadata.dataset.release_frequency,
        unitOfMeasure: mockedCantabularDatasetMetadata.dataset.unit_of_measure,
        nextReleaseDate: mockedUnSavedNonCantabularDatasetMetadata.dataset.next_release,
        qmi: mockedCantabularDatasetMetadata.dataset.qmi.href,
        contactName: mockedCantabularDatasetMetadata.dataset.contacts[0].name,
        contactEmail: mockedCantabularDatasetMetadata.dataset.contacts[0].email,
        contactTelephone: mockedCantabularDatasetMetadata.dataset.contacts[0].telephone,
        edition: mockedUnSavedNonCantabularDatasetMetadata.version.edition,
        version: mockedUnSavedNonCantabularDatasetMetadata.version.version,
        releaseDate: { value: mockedUnSavedNonCantabularDatasetMetadata.version.release_date, error: "" },
        notices: mockedUnSavedNonCantabularDatasetMetadata.version.alerts,
        dimensions: mockedCantabularDatasetMetadata.version.dimensions,
        usageNotes: mockedUnSavedNonCantabularDatasetMetadata.version.usage_notes,
        latestChanges: mockedUnSavedNonCantabularDatasetMetadata.version.latest_changes,
    },
    datasetCollectionState: "",
    versionCollectionState: "",
    lastEditedBy: mockedUnSavedNonCantabularDatasetMetadata.collection_last_edited_by || null,
};

const mockDatasetApiMetadataState = {
    metadata: {
        title: mockedSavedNonCantDatasetMetadata.dataset.title,
        summary: mockedSavedNonCantDatasetMetadata.dataset.description,
        keywords: mockedSavedNonCantDatasetMetadata.dataset.keywords?.join().replace(",", ", "),
        nationalStatistic: mockedSavedNonCantDatasetMetadata.dataset.national_statistic,
        licence: mockedSavedNonCantDatasetMetadata.dataset.license,
        relatedDatasets: mockedSavedNonCantDatasetMetadata.dataset.related_datasets,
        relatedPublications: mockedSavedNonCantDatasetMetadata.dataset.publications,
        relatedMethodologies: mockedSavedNonCantDatasetMetadata.dataset.methodologies,
        releaseFrequency: mockedSavedNonCantDatasetMetadata.dataset.release_frequency,
        unitOfMeasure: mockedSavedNonCantDatasetMetadata.dataset.unit_of_measure,
        nextReleaseDate: mockedSavedNonCantDatasetMetadata.dataset.next_release,
        qmi: mockedSavedNonCantDatasetMetadata.dataset.qmi?.href,
        contactName: mockedSavedNonCantDatasetMetadata.dataset.contacts[0].name,
        contactEmail: mockedSavedNonCantDatasetMetadata.dataset.contacts[0].email,
        contactTelephone: mockedSavedNonCantDatasetMetadata.dataset.contacts[0].telephone,
        edition: mockedSavedNonCantDatasetMetadata.version.edition,
        version: mockedSavedNonCantDatasetMetadata.version.version,
        releaseDate: { value: mockedSavedNonCantDatasetMetadata.version.release_date, error: "" },
        notices: mockedSavedNonCantDatasetMetadata.version.alerts,
        dimensions: mockedSavedNonCantDatasetMetadata.version.dimensions,
        usageNotes: mockedSavedNonCantDatasetMetadata.version.usage_notes,
        latestChanges: mockedSavedNonCantDatasetMetadata.version.latest_changes,
    },
    datasetCollectionState: mockedSavedNonCantDatasetMetadata.collection_state,
    versionCollectionState: mockedSavedNonCantDatasetMetadata.collection_state,
    lastEditedBy: mockedSavedNonCantDatasetMetadata.collection_last_edited_by,
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
        pathname: "florence/collections/123/datasets/456/editions/789/version/1/cantabular",
    },
    params: {
        collectionID: "123",
        datasetID: "456",
        editionID: "789",
        versionID: "1",
    },
};

const mountComponent = () => {
    return shallow(<CantabularMetadataController {...defaultProps} />);
};

let component;

beforeEach(() => {
    component = mountComponent();
});

describe("On mount of the dataset metadata controller screen", () => {
    it("fetches metadata", () => {
        const getDatasetsCalls = datasets.getEditMetadata.mock.calls.length;
        component.instance().UNSAFE_componentWillMount();
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
    it("maps cantabular metadata when the collection state is an empty string", async () => {
        component.setState({ cantabularMetadata: mockedCantabularDatasetMetadata });
        const returnValue = component.instance().mapMetadataToState(mockedUnSavedNonCantabularDatasetMetadata, component.state("cantabularMetadata"));
        expect(returnValue).toMatchObject(mockCantabularMetadataState);
    });
    it("maps dataset-API metadata when the collection state is not an empty string", () => {
        const returnValue = component.instance().mapMetadataToState(mockedSavedNonCantDatasetMetadata);
        expect(returnValue).toMatchObject(mockDatasetApiMetadataState);
    });
});

describe("Allowing preview functionality", () => {
    it("enables preview on GET metadata success and when all the mandatory cantabular metadata fields (title, dimensions) are returned", () => {
        component.setState({ fieldsReturned: { title: true, dimensions: true } });
        component.instance().handleGETSuccess(mockedSavedNonCantDatasetMetadata, mockedCantabularDatasetMetadata);
        expect(component.state("allowPreview")).toBe(true);
    });

    it("disables preview for datasets if one of the cantabular metadata mandatory fields is missing :title and dimensions ", () => {
        component.setState({ fieldsReturned: { title: false, dimensions: true } });
        component.instance().handleGETSuccess(mockedSavedNonCantDatasetMetadata, mockedCantabularDatasetMetadata);
        expect(component.state("allowPreview")).toBe(false);
        component.setState({ fieldsReturned: { title: true, dimensions: false } });
        component.instance().handleGETSuccess(mockedSavedNonCantDatasetMetadata, mockedCantabularDatasetMetadata);
        expect(component.state("allowPreview")).toBe(false);
        component.setState({ fieldsReturned: { title: false, dimensions: false } });
        component.instance().handleGETSuccess(mockedSavedNonCantDatasetMetadata, mockedCantabularDatasetMetadata);
        expect(component.state("allowPreview")).toBe(false);
    });

    it("disables preview for datasets with state of 'created'", () => {
        component.instance().handleGETSuccess(mockedCantabularDataset, mockedCantabularDatasetMetadata);
        expect(component.state("allowPreview")).toBe(false);
    });

    it("disables preview if GET metadata fails", async () => {
        datasets.getEditMetadata.mockImplementationOnce(() => Promise.reject({ status: 500 }));
        await component.instance().getMetadata();
        expect(component.state("allowPreview")).toBe(false);
    });

    it("disables preview if saving edits fails", async () => {
        datasets.putEditMetadata.mockImplementationOnce(() => Promise.reject({ status: 500 }));
        await component.instance().saveMetadata();
        expect(component.state("allowPreview")).toBe(false);
    });

    it("enables preview if saving edits successful", async () => {
        await component.instance().saveMetadata();
        expect(component.state("allowPreview")).toBe(true);
    });
});

describe("Mapping state to put body", () => {
    it("maps correctly", () => {
        component.setState(mockCantabularMetadataState);
        const returnValue = component.instance().mapMetadataToPutBody(false, false);
        expect(returnValue.dataset.id).toBe(mockedSavedNonCantDatasetMetadata.dataset.id);
        expect(returnValue.collection_id).toBe("123");
        expect(returnValue.collection_state).toBe("InProgress");
    });

    it("maps state correctly", () => {
        component.setState(mockCantabularMetadataState);
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

describe("Calling getCantabularMetadata", () => {
    beforeEach(() => {
        mockedNotifications = [];
    });

    const mockDatasetResp = {
        next: {
            is_based_on: {},
        },
    };
    mockDatasetResp.next.is_based_on["@id"] = "cantabularDatasetId";

    datasets.get = jest.fn(() => Promise.resolve(mockDatasetResp));
    cookies.get = jest.fn(() => "cy");

    it("calls getCantabularMetadata with expected args", async () => {
        await component.instance().getCantabularMetadata("datasetId", mockedSavedNonCantDatasetMetadata);
        expect(datasets.getCantabularMetadata).toHaveBeenCalledWith("datasetId", "cantabularDatasetId", "cy");
    });

    it("sets state correctly when getCantabularMetadata returns 200", async () => {
        component.instance().marshalCantabularMetadata = jest.fn();
        datasets.getCantabularMetadata.mockImplementationOnce(() => Promise.resolve({ status: 200 }));
        await component.instance().getCantabularMetadata("datasetId", mockedSavedNonCantDatasetMetadata);
        expect(component.instance().marshalCantabularMetadata).toHaveBeenCalled();
    });

    it("handles correctly and throws error when getCantabularMetadata returns error", async () => {
        datasets.getCantabularMetadata.mockImplementationOnce(() => Promise.reject());
        component.instance().marshalCantabularMetadata = jest.fn();
        component.instance().handleGETSuccess = jest.fn();
        await component.instance().getCantabularMetadata("datasetId", mockedSavedNonCantDatasetMetadata);
        expect(component.instance().marshalCantabularMetadata).toHaveBeenCalledTimes(0);
        expect(component.instance().handleGETSuccess).toHaveBeenCalledTimes(0);
        expect(component.state("isGettingMetadata")).toBe(false);
        expect(component.state("disableScreen")).toBe(true);
        expect(component.state("allowPreview")).toBe(false);
        expect(component.state("disableCancel")).toBe(false);
        expect(log.error).toHaveBeenCalled();
        expect(mockedNotifications.length).toEqual(1);
    });
});

describe("Calling marshalCantabularMetadata", () => {
    it("marshals correctly", () => {
        expect(component.instance().marshalCantabularMetadata(mockedCantabularExtractorResp)).toEqual(mockedCantabularDatasetMetadata);
    });
});

describe("Calling handleSave", () => {
    it("sets state and does not save metadata if release date is not set", async () => {
        const mockCantabularMetadataStateNoReleaseDate = {
            ...mockCantabularMetadataState,
            metadata: { ...mockCantabularMetadataState.metadata, releaseDate: { value: "", error: "" } },
        };
        component.setState(mockCantabularMetadataStateNoReleaseDate);
        component.instance().saveMetadata = jest.fn();
        await component.instance().handleSave(true, true);
        expect(component.state("metadata")).toEqual({
            ...mockCantabularMetadataStateNoReleaseDate.metadata,
            releaseDate: { value: "", error: "You must set a release date" },
        });
        expect(component.instance().saveMetadata).toHaveBeenCalledTimes(0);
    });
});
