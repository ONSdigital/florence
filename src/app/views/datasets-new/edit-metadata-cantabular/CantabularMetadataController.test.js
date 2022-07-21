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
            return Promise.resolve(mockedNonCantDatasetMetadata);
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

const mockedCantabularDatasetMetadata = {
    dataset: {
        title: "Cantabular metadata",
        description: "Cantabular metadata description",
        keywords: ["Dimension1", "Dimension2"],
        national_statistic: true,
        license: "www.test.com/licence",
        related_datasets: [],
        publications: [],
        unit_of_measure: "unit",
        release_frequency: "",
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
                name: "Dimension1",
                description: "Dimension description",
                label: "Dimension1",
            },
            {
                name: "Dimension2",
                description: "Dimension description",
                label: "Dimension2",
            },
        ],
        release_date: "2022/06/28",
    },
};

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
                        census_releases: [{ release_date: "28/06/2022" }],
                        dataset_mnemonic2011: "",
                        dataset_population: "",
                        dissemination_source: "",
                        geographic_coverage: "",
                        geographic_variable_mnemonic: "",
                        last_updated: "",
                        keywords: [],
                        publications: [],
                        related_datasets: [],
                        release_frequency: "",
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
                    name: "Dimension1",
                    meta: {
                        ons_variable: {
                            variable_description: "Dimension description",
                            keywords: [],
                            statistical_unit: {
                                statistical_unit: "",
                                statistical_unit_desc: "",
                            },
                        },
                    },
                },
                {
                    name: "Dimension2",
                    meta: {
                        ons_variable: {
                            variable_description: "Dimension description",
                            keywords: [],
                            statistical_unit: {
                                statistical_unit: "",
                                statistical_unit_desc: "",
                            },
                        },
                    },
                },
            ],
        },
    },
};

const mockedNonCantDatasetMetadata = {
    dataset: {
        id: "456",
        methodologies: [],
        next_release: "",
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

const mockedState = {
    metadata: {
        title: mockedCantabularDatasetMetadata.dataset.title,
        summary: mockedCantabularDatasetMetadata.dataset.description,
        keywords: mockedCantabularDatasetMetadata.dataset.keywords.join().replace(",", ", "),
        nationalStatistic: mockedCantabularDatasetMetadata.dataset.national_statistic,
        licence: mockedCantabularDatasetMetadata.dataset.license,
        relatedDatasets: mockedCantabularDatasetMetadata.dataset.related_datasets,
        relatedPublications: mockedCantabularDatasetMetadata.dataset.publications,
        relatedMethodologies: mockedNonCantDatasetMetadata.dataset.methodologies,
        releaseFrequency: mockedCantabularDatasetMetadata.dataset.release_frequency,
        unitOfMeasure: mockedCantabularDatasetMetadata.dataset.unit_of_measure,
        nextReleaseDate: mockedNonCantDatasetMetadata.dataset.next_release,
        qmi: mockedCantabularDatasetMetadata.dataset.qmi.href,
        contactName: mockedCantabularDatasetMetadata.dataset.contacts[0].name,
        contactEmail: mockedCantabularDatasetMetadata.dataset.contacts[0].email,
        contactTelephone: mockedCantabularDatasetMetadata.dataset.contacts[0].telephone,
        edition: mockedNonCantDatasetMetadata.version.edition,
        version: mockedNonCantDatasetMetadata.version.version,
        releaseDate: { value: mockedCantabularDatasetMetadata.version.release_date, error: "" },
        notices: mockedNonCantDatasetMetadata.version.alerts,
        dimensions: mockedCantabularDatasetMetadata.version.dimensions,
        usageNotes: mockedNonCantDatasetMetadata.version.usage_notes,
        latestChanges: mockedNonCantDatasetMetadata.version.latest_changes,
    },
    datasetCollectionState: mockedNonCantDatasetMetadata.collection_state,
    versionCollectionState: mockedNonCantDatasetMetadata.collection_state,
    lastEditedBy: mockedNonCantDatasetMetadata.collection_last_edited_by,
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

describe("Mapping cantabular metadata to state", () => {
    it("maps correctly", () => {
        component.setState({ cantabularMetadata: mockedCantabularDatasetMetadata });
        const returnValue = component.instance().mapMetadataToState(mockedNonCantDatasetMetadata, component.state("cantabularMetadata"));
        expect(returnValue).toMatchObject(mockedState);
    });
});

describe("Allowing preview functionality", () => {
    it("enables preview on GET metadata success", () => {
        component.instance().handleGETSuccess(mockedNonCantDatasetMetadata, mockedCantabularDatasetMetadata);
        expect(component.state("allowPreview")).toBe(true);
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
        component.setState(mockedState);
        const returnValue = component.instance().mapMetadataToPutBody(false, false);
        expect(returnValue.dataset.id).toBe(mockedNonCantDatasetMetadata.dataset.id);
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
        await component.instance().getCantabularMetadata("datasetId", mockedNonCantDatasetMetadata);
        expect(datasets.getCantabularMetadata).toHaveBeenCalledWith("datasetId", "cantabularDatasetId", "cy");
    });

    it("sets state correctly when getCantabularMetadata returns 200", async () => {
        component.instance().marshalCantabularMetadata = jest.fn();
        datasets.getCantabularMetadata.mockImplementationOnce(() => Promise.resolve({ status: 200 }));
        await component.instance().getCantabularMetadata("datasetId", mockedNonCantDatasetMetadata);
        expect(component.state("isReadOnly")).toBe(true);
        expect(component.instance().marshalCantabularMetadata).toHaveBeenCalled();
    });

    it("handles correctly and throws error when getCantabularMetadata returns error", async () => {
        datasets.getCantabularMetadata.mockImplementationOnce(() => Promise.reject());
        component.instance().marshalCantabularMetadata = jest.fn();
        component.instance().handleGETSuccess = jest.fn();
        await component.instance().getCantabularMetadata("datasetId", mockedNonCantDatasetMetadata);
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
