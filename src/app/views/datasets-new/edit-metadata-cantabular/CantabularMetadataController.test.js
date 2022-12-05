import React from "react";
import { CantabularMetadataController } from "./CantabularMetadataController";
import { shallow } from "enzyme";
import datasets from "../../../utilities/api-clients/datasets";
import cookies from "../../../utilities/cookies";
import log from "../../../utilities/logging/log";
import topics from "../../../utilities/api-clients/topics";

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

jest.mock("../../../utilities/api-clients/topics", () => {
    return {
        getRootTopics: jest.fn(),
        getSubtopics: jest.fn(),
    };
});

jest.mock("../../../utilities/cookies.js", () => {
    return {
        get: jest.fn(),
    };
});

afterEach(() => {
    jest.clearAllMocks();
});

const mockedRecipeDimensions = [
    {
        label: "Dimension1 label",
        links: [],
        href: "dimension-href",
        id: "Dimension1 Name",
        name: "Dimension1 Name",
        variable: "dimensionVariable",
        number_of_options: 1,
        is_area_type: true,
    },
    {
        label: "Dimension2 label",
        links: [],
        href: "dimension-href",
        id: "Dimension2 Name",
        name: "Dimension2 Name",
        variable: "dimensionVariable",
        number_of_options: 3,
        is_area_type: false,
    },
];

const mockedCompleteDimensions = [
    {
        label: "Dimension1 Label",
        description: "Dimension1 description",
        links: [],
        href: "dimension-href",
        id: "Dimension1 Name",
        name: "Dimension1 Name",
        variable: "dimensionVariable",
        number_of_options: 1,
        is_area_type: true,
        quality_statement_text: "quality statement text 1",
        quality_statement_url: "quality statement url 1",
    },
    {
        label: "Dimension2 Label",
        description: "Dimension2 description",
        links: [],
        href: "dimension-href",
        id: "Dimension2 Name",
        name: "Dimension2 Name",
        variable: "dimensionVariable",
        number_of_options: 3,
        is_area_type: false,
        quality_statement_text: "quality statement text 2",
        quality_statement_url: "quality statement url 2",
    },
];

const mockedCantabularExtractorResp = {
    table_query_result: {
        service: {
            tables: [
                {
                    name: "Cantabular metadata",
                    label: "Cantabular dataset label",
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
                    licence: "",
                    methodology_link: "www.test.com/methodology",
                    methodology_statement: "",
                    national_statistic_certified: "",
                },
            },
            vars: [
                {
                    name: "Dimension1 Name",
                    description: "Dimension1 description",
                    label: "Dimension1 Label",
                    meta: {
                        ONS_Variable: {
                            quality_statement_text: "quality statement text 1",
                            quality_summary_url: "quality statement url 1",
                        },
                    },
                },
                {
                    name: "Dimension2 Name",
                    description: "Dimension2 description",
                    label: "Dimension2 Label",
                    meta: {
                        ONS_Variable: {
                            quality_statement_text: "quality statement text 2",
                            quality_summary_url: "quality statement url 2",
                        },
                    },
                },
            ],
        },
    },
};

const mockedCantabularDatasetMetadata = {
    dataset: {
        title: mockedCantabularExtractorResp.table_query_result.service.tables[0].label,
        description: "Cantabular metadata description",
        keywords: ["Dimension1", "Dimension2"],
        unit_of_measure: "unit",
        contacts: [
            {
                name: "Name",
                email: "email@email.com",
                telephone: "1111111",
            },
        ],
    },
    version: {
        dimensions: [
            {
                id: "Dimension1 Name",
                name: "Dimension1 Name",
                description: "Dimension1 description",
                label: "Dimension1 Label",
                quality_statement_text: "quality statement text 1",
                quality_statement_url: "quality statement url 1",
            },
            {
                id: "Dimension2 Name",
                name: "Dimension2 Name",
                description: "Dimension2 description",
                label: "Dimension2 Label",
                quality_statement_text: "quality statement text 2",
                quality_statement_url: "quality statement url 2",
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
        canonical_topic: "testID1",
        subtopics: ["testID1", "testSubtopicID1"],
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
        dimensions: mockedRecipeDimensions,
    },
    collection_id: "123",
    collection_state: "inProgress",
    collection_last_edited_by: "test@user.com",
};

const mockedNewNonCantDatasetMetadata = {
    dataset: {
        id: "567",
        methodologies: [],
        next_release: "1",
        release_frequency: "1",
        related_content: [],
        survey: "census",
        national_statistic: true,
        license: "www.test.com/licence",
        related_datasets: [],
        publications: [],
        qmi: {
            href: "www.test.com/methodology",
        },
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
        dimensions: mockedRecipeDimensions,
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
        dimensions: mockedCompleteDimensions,
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
        nationalStatistic: mockedNewNonCantDatasetMetadata.dataset.national_statistic,
        licence: mockedNewNonCantDatasetMetadata.dataset.license,
        relatedDatasets: mockedNewNonCantDatasetMetadata.dataset.related_datasets,
        relatedPublications: mockedNewNonCantDatasetMetadata.dataset.publications,
        relatedMethodologies: mockedNewNonCantDatasetMetadata.dataset.methodologies,
        releaseFrequency: mockedNewNonCantDatasetMetadata.dataset.release_frequency,
        unitOfMeasure: mockedCantabularDatasetMetadata.dataset.unit_of_measure,
        nextReleaseDate: mockedNewNonCantDatasetMetadata.dataset.next_release,
        qmi: mockedNewNonCantDatasetMetadata.dataset.qmi.href,
        contactName: mockedCantabularDatasetMetadata.dataset.contacts[0].name,
        contactEmail: {
            value: mockedCantabularDatasetMetadata.dataset.contacts[0].email,
            error: "",
        },
        contactTelephone: {
            value: mockedCantabularDatasetMetadata.dataset.contacts[0].telephone,
            error: "",
        },
        edition: mockedNewNonCantDatasetMetadata.version.edition,
        version: mockedNewNonCantDatasetMetadata.version.version,
        releaseDate: { value: mockedNewNonCantDatasetMetadata.version.release_date, error: "" },
        notices: mockedNewNonCantDatasetMetadata.version.alerts,
        dimensions: mockedCompleteDimensions,
        usageNotes: mockedNewNonCantDatasetMetadata.version.usage_notes,
        latestChanges: mockedNewNonCantDatasetMetadata.version.latest_changes,
        canonicalTopic: {},
        secondaryTopics: [],
        relatedContent: mockedNewNonCantDatasetMetadata.dataset.related_content,
        census: mockedNewNonCantDatasetMetadata.dataset.survey ? true : false,
    },
    datasetCollectionState: "",
    versionCollectionState: "",
    lastEditedBy: mockedNewNonCantDatasetMetadata.collection_last_edited_by || null,
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
        canonicalTopic: { value: "testID1", label: "Test title 1" },
        secondaryTopics: [
            { value: "testID1", label: "Test title 1" },
            { value: "testSubtopicID1", label: "Test subtopic title 1" },
        ],
        contactName: mockedSavedNonCantDatasetMetadata.dataset.contacts[0].name,
        contactEmail: {
            value: mockedSavedNonCantDatasetMetadata.dataset.contacts[0].email,
            error: "",
        },
        contactTelephone: {
            value: mockedSavedNonCantDatasetMetadata.dataset.contacts[0].telephone,
            error: "",
        },
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
    it("fetches metadata", async () => {
        const getDatasetsCalls = datasets.getEditMetadata.mock.calls.length;
        await component.instance().UNSAFE_componentWillMount();
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
        const returnValue = component.instance().mapMetadataToState(mockedNewNonCantDatasetMetadata, component.state("cantabularMetadata"));
        expect(returnValue).toMatchObject(mockCantabularMetadataState);
    });
    it("maps dataset-API metadata when the collection state is not an empty string", () => {
        component.setState({
            allTopicsArr: [
                { value: "testID1", label: "Test title 1" },
                { value: "testSubtopicID1", label: "Test subtopic title 1" },
            ],
        });
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
        expect(returnValue.dataset.related_content).toBe(mockedNewNonCantDatasetMetadata.dataset.related_content);
        expect(returnValue.dataset.survey).toBe("census");
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
        jest.clearAllMocks();
    });

    cookies.get = jest.fn(() => "cy");

    it("calls getCantabularMetadata with expected args", async () => {
        datasets.getCantabularMetadata.mockImplementationOnce(() => Promise.resolve());
        await component.instance().getCantabularMetadata("datasetId", mockedSavedNonCantDatasetMetadata);
        expect(datasets.getCantabularMetadata).toHaveBeenCalledWith("datasetId", "cy");
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
        expect(log.error).toHaveBeenCalledTimes(1);
        expect(mockedNotifications.length).toEqual(1);
    });
});

describe("Calling marshalCantabularMetadata", () => {
    it("marshals correctly", () => {
        expect(component.instance().marshalCantabularMetadata(mockedCantabularExtractorResp)).toEqual(mockedCantabularDatasetMetadata);
    });
});

describe("Calling checkMandatoryFields", () => {
    it("sets state if release date is not set", async () => {
        const mockCantabularMetadataStateNoReleaseDate = {
            ...mockCantabularMetadataState,
            metadata: { ...mockCantabularMetadataState.metadata, releaseDate: { value: "", error: "" } },
        };
        component.setState(mockCantabularMetadataStateNoReleaseDate);
        component.instance().checkMandatoryFields();
        expect(component.state("metadata")).toEqual({
            ...mockCantabularMetadataStateNoReleaseDate.metadata,
            releaseDate: { value: "", error: "You must set a release date" },
        });
    });
    it("raises error if there is only a secondary topics selection and no primary topic selection ", async () => {
        const mockCantabularMetadataStateNoCanonicalTopic = {
            ...mockCantabularMetadataState,
            metadata: {
                ...mockCantabularMetadataState.metadata,
                secondaryTopics: [
                    { value: "testSubtopicID1", label: "Test subtopic title 1" },
                    { value: "testSubtopicID2", label: "Test subtopic title 2" },
                ],
            },
        };
        component.setState(mockCantabularMetadataStateNoCanonicalTopic);
        component.instance().checkMandatoryFields();
        expect(component.state("topicsErr")).toEqual("You cannot enter a secondary topic without a canonical topic");
    });
});

describe("Calling saveDatasetMetadata", () => {
    it("calls saveMetadata with correct args", async () => {
        component.instance().mapMetadataToPutBody = jest.fn(() => mockedSavedNonCantDatasetMetadata);
        component.instance().saveMetadata = jest.fn();
        await component.instance().saveDatasetMetadata(true, false);
        expect(component.instance().saveMetadata).toHaveBeenCalledWith("456", "789", "1", mockedSavedNonCantDatasetMetadata, true, false);
    });
});

describe("Calling retrieveDatasetMetadata", () => {
    beforeEach(() => {
        mockedNotifications = [];
        jest.clearAllMocks();
    });

    it("calls datasets.getEditMetadata and mapMetadataToState with correct args in success case", async () => {
        datasets.getEditMetadata.mockImplementationOnce(() => mockedSavedNonCantDatasetMetadata);
        component.instance().mapMetadataToState = jest.fn();
        await component.instance().retrieveDatasetMetadata();
        expect(datasets.getEditMetadata).toHaveBeenCalledWith("456", "789", "1");
        expect(component.instance().mapMetadataToState).toHaveBeenCalledWith(mockedSavedNonCantDatasetMetadata);
    });

    it("logs error and notification when datasets.getEditMetadata errors", async () => {
        datasets.getEditMetadata.mockImplementationOnce(() => () => Promise.reject({ status: 500 }));
        await component.instance().retrieveDatasetMetadata();
        expect(mockedNotifications.length).toEqual(1);
        expect(log.error).toHaveBeenCalledTimes(1);
    });

    it("logs error and notification when mapMetadataToState errors", async () => {
        datasets.getEditMetadata.mockImplementationOnce(() => mockedSavedNonCantDatasetMetadata);
        component.instance().mapMetadataToState = jest.fn(() => {
            throw new Error();
        });
        await component.instance().retrieveDatasetMetadata();
        expect(mockedNotifications.length).toEqual(1);
        expect(log.error).toHaveBeenCalledTimes(1);
    });
});

describe("Calling saveAndRetrieveDatasetMetadata", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("calls saveDatasetMetadata if all mandatory fields are present", () => {
        component.setState(mockCantabularMetadataState);
        component.instance().saveDatasetMetadata = jest.fn(() => Promise.resolve());
        component.instance().saveAndRetrieveDatasetMetadata();
        expect(component.instance().saveDatasetMetadata).toHaveBeenCalledTimes(1);
    });

    it("does not call saveDatasetMetadata if one or more mandatory fields are missing", () => {
        component.instance().saveDatasetMetadata = jest.fn();
        const mockCantabularMetadataStateNoReleaseDate = {
            ...mockCantabularMetadataState,
            metadata: { ...mockCantabularMetadataState.metadata, releaseDate: { value: "", error: "" } },
        };
        component.setState(mockCantabularMetadataStateNoReleaseDate);
        component.instance().saveAndRetrieveDatasetMetadata();
        expect(component.instance().saveDatasetMetadata).toHaveBeenCalledTimes(0);
        const mockCantabularMetadataStateMissingFields = {
            ...mockCantabularMetadataState,
            metadata: { ...mockCantabularMetadataState.metadata, contactEmail: { value: "", error: "" }, contactTelephone: { value: "", error: "" } },
        };
        component.setState(mockCantabularMetadataStateMissingFields);
        component.instance().saveAndRetrieveDatasetMetadata();
        expect(component.instance().saveDatasetMetadata).toHaveBeenCalledTimes(0);
    });

    it("does not call retrieveDatasetMetadata if saveMetadata errors", () => {
        component.setState(mockCantabularMetadataState);
        component.instance().saveMetadata = jest.fn(() => Promise.reject());
        component.instance().saveDatasetMetadata = jest.fn(() => component.instance().saveMetadata());
        component.instance().retrieveDatasetMetadata = jest.fn();
        component.instance().saveAndRetrieveDatasetMetadata();
        expect(component.instance().saveDatasetMetadata).toHaveBeenCalledTimes(1);
        expect(component.instance().retrieveDatasetMetadata).toHaveBeenCalledTimes(0);
    });
});

describe("Calling checkDimensions", () => {
    beforeEach(() => {
        mockedNotifications = [];
    });

    it("doesn't trigger notification if dimensions correspond 1-1", () => {
        const datasetDimensions = [
            { id: "testDimensionID1", name: "testDimensionName1", description: "" },
            { id: "testDimensionID2", name: "testDimensionName2", description: "" },
        ];
        const cantabularDimensions = [
            { id: "testDimensionID1", name: "testDimensionName1", description: "" },
            { id: "testDimensionID2", name: "testDimensionName2", description: "" },
        ];
        expect(mockedNotifications.length).toEqual(0);
        component.instance().checkDimensions(datasetDimensions, cantabularDimensions);
        expect(mockedNotifications.length).toEqual(0);
    });

    it("triggers error notification if dataset dimension is not present in Cantabular dimensions", () => {
        const datasetDimensions = [
            { id: "testDimensionID1", name: "testDimensionName1", description: "" },
            { id: "testDimensionID2", name: "testDimensionName2", description: "" },
        ];
        const cantabularDimensions = [{ id: "testDimensionID1", name: "testDimensionName1", description: "" }];
        expect(mockedNotifications.length).toEqual(0);
        component.instance().checkDimensions(datasetDimensions, cantabularDimensions);
        expect(mockedNotifications.length).toEqual(1);
    });

    it("triggers error notification if Cantabular dimension is not present in dataset dimensions", () => {
        const datasetDimensions = [{ id: "testDimensionID1", name: "testDimensionName1", description: "" }];
        const cantabularDimensions = [
            { id: "testDimensionID1", name: "testDimensionName1", description: "" },
            { id: "testDimensionID2", name: "testDimensionName2", description: "" },
        ];
        expect(mockedNotifications.length).toEqual(0);
        component.instance().checkDimensions(datasetDimensions, cantabularDimensions);
        expect(mockedNotifications.length).toEqual(1);
    });
});

describe("Calling getTopics", () => {
    beforeEach(() => {
        mockedNotifications = [];
        jest.clearAllMocks();
    });
    const mockRootTopicsResp = {
        count: 0,
        offset_index: 0,
        limit: 0,
        total_count: 1,
        items: [
            {
                id: "testID1",
                next: {
                    id: "testID1",
                    description: "Test description 1",
                    title: "Test title 1",
                    state: "published",
                    links: {
                        self: {
                            href: "http://localhost:25300/topics/testID1",
                            id: "testID1",
                        },
                        subtopics: {
                            href: "http://localhost:25300/topics/testID1/subtopics",
                        },
                    },
                },
                current: {
                    id: "testID1",
                    description: "Test description 1",
                    title: "Test title 1",
                    state: "published",
                    links: {
                        self: {
                            href: "http://localhost:25300/topics/testID1",
                            id: "testID1",
                        },
                        subtopics: {
                            href: "http://localhost:25300/topics/testID1/subtopics",
                        },
                    },
                },
            },
        ],
    };

    const mockSubtopicsResp = {
        count: 0,
        offset_index: 0,
        limit: 0,
        total_count: 2,
        items: [
            {
                id: "testSubtopicID1",
                next: {
                    id: "testSubtopicID1",
                    description: "Test subtopic description 1",
                    title: "Test subtopic title 1",
                    state: "published",
                    links: {
                        self: {
                            href: "http://localhost:25300/topics/testSubtopicID1",
                            id: "testSubtopicID1",
                        },
                        subtopics: {
                            href: "http://localhost:25300/topics/testSubtopicID1/subtopics",
                        },
                    },
                },
                current: {
                    id: "testSubtopicID1",
                    description: "Test subtopic description 1",
                    title: "Test subtopic title 1",
                    state: "published",
                    links: {
                        self: {
                            href: "http://localhost:25300/topics/testSubtopicID1",
                            id: "testSubtopicID1",
                        },
                        subtopics: {
                            href: "http://localhost:25300/topics/testSubtopicID1/subtopics",
                        },
                    },
                },
            },
            {
                id: "testSubtopicID2",
                next: {
                    id: "testSubtopicID2",
                    description: "Test subtopic description 2",
                    title: "Test subtopic title 2",
                    state: "published",
                    links: {
                        self: {
                            href: "http://localhost:25300/topics/testSubtopicID2",
                            id: "testSubtopicID2",
                        },
                        subtopics: {
                            href: "http://localhost:25300/topics/testSubtopicID2/subtopics",
                        },
                    },
                },
                current: {
                    id: "testSubtopicID2",
                    description: "Test subtopic description 2",
                    title: "Test subtopic title 2",
                    state: "published",
                    links: {
                        self: {
                            href: "http://localhost:25300/topics/testSubtopicID2",
                            id: "testSubtopicID2",
                        },
                        subtopics: {
                            href: "http://localhost:25300/topics/testSubtopicID2/subtopics",
                        },
                    },
                },
            },
        ],
    };

    const allMockTopics = [
        {
            id: "primaryTopics",
            label: "Primary topics",
            options: [{ value: "testID1", label: "Test title 1" }],
        },
        {
            id: "secondaryTopics",
            label: "Secondary topics",
            options: [
                { value: "testSubtopicID1", label: "Test subtopic title 1" },
                { value: "testSubtopicID2", label: "Test subtopic title 2" },
            ],
        },
    ];

    it("sets state correctly", async () => {
        topics.getRootTopics.mockImplementationOnce(() => Promise.resolve(mockRootTopicsResp));
        topics.getSubtopics.mockImplementationOnce(() => Promise.resolve(mockSubtopicsResp));
        await component.instance().getTopics();

        expect(component.state("canonicalTopicsMenuArr")).toEqual(allMockTopics);
        expect(component.state("secondaryTopicsMenuArr")).toEqual(allMockTopics);
    });
    it("logs error and notification when topics.getRootTopics errors", async () => {
        topics.getRootTopics.mockImplementationOnce(() => () => Promise.reject({ status: 500 }));
        await component.instance().getTopics();

        expect(mockedNotifications.length).toEqual(1);
        expect(log.error).toHaveBeenCalledTimes(1);
    });
    it("logs error and notification when topics.getSubopics errors", async () => {
        topics.getSubtopics.mockImplementationOnce(() => () => Promise.reject({ status: 500 }));
        await component.instance().getTopics();

        expect(mockedNotifications.length).toEqual(1);
        expect(log.error).toHaveBeenCalledTimes(1);
    });
});

describe("Calling getObjectDiff", () => {
    const testObj1 = {
        dataset: {
            title: "Legal partnership status - test",
            description: "test",
            keywords: ["ltla", "legal_partnership_status"],
            unit_of_measure: "Person",
            contacts: [
                {
                    name: "Michael Roskams",
                    email: "Census.Customer.Services@ons.gov.uk - test",
                    telephone: "+44 3000 682750",
                },
            ],
        },
        version: {
            dimensions: [
                {
                    id: "ltla",
                    name: "ltla",
                    description:
                        "As of 2022 there are 309 lower tier local authorities in England, comprising non-metropolitan districts (181), unitary authorities (59), metropolitan districts (36) and London boroughs (33, including City of London). There are 22 lower tier local authorities in Wales, comprising 22 unitary authorities",
                    label: "Lower Tier Local Authorities",
                    quality_statement_text: "test-quality_statement_text",
                    quality_statement_url: "test-quality_statement_url",
                },
                {
                    id: "legal_partnership_status",
                    name: "legal_partnership_status",
                    description:
                        'Classifies a person according to their legal marital or registered civil partnership status on Census Day 21 March 2021.\n\nIt is the same as the 2011 census variable "Marital status" but has been updated for Census 2021 to reflect the revised Civil Partnership Act that came into force in 2019.\n\nIn Census 2021 results, "single" refers only to someone who has never been married or in a registered civil partnership.',
                    label: "Marital and civil partnership status (12 categories)",
                    quality_statement_text: "This really won't do at all. Very Poor. See me.",
                    quality_statement_url: "http://example.com",
                },
            ],
        },
    };

    const testObj2 = {
        dataset: {
            title: "Legal partnership status",
            description:
                "This dataset provides Census 2021 estimates that classify usual residents in England and Wales by their legal partnership status. The estimates are at Census Day, 21 March 2021.",
            keywords: ["ltla", "legal_partnership_status"],
            unit_of_measure: "Person",
            contacts: [
                {
                    name: "Michael Roskams",
                    email: "Census.Customer.Services@ons.gov.uk",
                    telephone: "+44 3000 682750",
                },
            ],
        },
        version: {
            dimensions: [
                {
                    id: "ltla",
                    name: "ltla",
                    description:
                        "As of 2022 there are 309 lower tier local authorities in England, comprising non-metropolitan districts (181), unitary authorities (59), metropolitan districts (36) and London boroughs (33, including City of London). There are 22 lower tier local authorities in Wales, comprising 22 unitary authorities",
                    label: "Lower Tier Local Authorities",
                    quality_statement_text: "",
                    quality_statement_url: "",
                },
                {
                    id: "legal_partnership_status",
                    name: "legal_partnership_status",
                    description:
                        'Classifies a person according to their legal marital or registered civil partnership status on Census Day 21 March 2021.\n\nIt is the same as the 2011 census variable "Marital status" but has been updated for Census 2021 to reflect the revised Civil Partnership Act that came into force in 2019.\n\nIn Census 2021 results, "single" refers only to someone who has never been married or in a registered civil partnership.',
                    label: "Marital and civil partnership status (12 categories)",
                    quality_statement_text: "This really won't do at all. Very Poor. See me.",
                    quality_statement_url: "http://example.com",
                },
            ],
        },
    };
    const cantabularMetadataObjFieldsDiff = {
        dataset: {
            description: "test",
            title: "Legal partnership status - test",
            contacts: [{ email: "Census.Customer.Services@ons.gov.uk - test" }],
        },
        version: {
            dimensions: [
                {
                    quality_statement_text: "test-quality_statement_text",
                    quality_statement_url: "test-quality_statement_url",
                    id: "ltla",
                },
            ],
        },
    };

    it("returns the differnces between 2 objects", () => {
        const returnedObject = component.instance().getObjectDiff(testObj1, testObj2);
        expect(returnedObject).toMatchObject(cantabularMetadataObjFieldsDiff);
    });
});
