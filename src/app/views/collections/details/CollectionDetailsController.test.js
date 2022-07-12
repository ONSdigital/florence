import React from "react";
import { shallow } from "enzyme";
import { CollectionDetailsController, mapStateToProps } from "./CollectionDetailsController";
import CollectionDetails from "./CollectionDetails";
import collections from "../../../utilities/api-clients/collections";
import notifications from "../../../utilities/notifications";
import { UPDATE_PAGES_IN_ACTIVE_COLLECTION, UPDATE_ACTIVE_COLLECTION } from "../../../config/constants";
import datasets from "../../../utilities/api-clients/datasets";

console.error = () => {};

jest.mock("../../../utilities/notifications", () => ({
    add: jest.fn(() => {}),
    remove: jest.fn(() => {}),
}));

jest.mock("../../../utilities/websocket", () => {
    return {
        send: jest.fn(() => {}),
    };
});

jest.mock("../../../utilities/cookies", () => ({
    add: jest.fn(() => {}),
}));

jest.mock("../../../utilities/api-clients/collections", () => ({
    get: jest.fn(() => {
        return Promise.resolve({});
    }),
    delete: jest.fn(() => {
        return Promise.resolve({});
    }),
}));

jest.mock("../../../utilities/api-clients/datasets", () => {
    return {
        getLatestVersionURL: jest.fn(() => {
            return Promise.resolve("/datasets/cpi/editions/current/versions/2");
        }),
        get: jest.fn(() => {
            return Promise.resolve();
        }),
    };
});

function setLocation(href) {
    jsdom.reconfigure({
        url: href,
    });
}

let dispatchedActions = [];

const defaultProps = {
    dispatch: action => {
        dispatchedActions.push(action);
    },
    rootPath: "/florence",
    enableDatasetImport: false,
    routes: [{}],
    collectionID: undefined,
    activePageURI: undefined,
    activeCollection: null,
    user: {
        userType: "",
    },
    location: {
        hash: "",
    },
    collections: [
        {
            approvalStatus: "NOT_STARTED",
            publishComplete: false,
            isEncrypted: false,
            collectionOwner: "hello",
            timeseriesImportFiles: [],
            id: "anothercollection-91bc818cff240fa546c84b0cc4c3d32f0667de3068832485e254c17655d5b4ad",
            name: "Another collection",
            type: "manual",
            teams: [],
        },
        {
            approvalStatus: "IN_PROGRESS",
            publishComplete: false,
            isEncrypted: false,
            collectionOwner: "PUBLISHING_SUPPORT",
            timeseriesImportFiles: [],
            id: "asdasdasd-04917444856fa9ade290b8847dee1f24e7726d71e1a7378c2557d949b6a6968c",
            name: "asdasdasd",
            type: "manual",
            teams: [],
        },
        {
            approvalStatus: "IN_PROGRESS",
            publishComplete: false,
            isEncrypted: false,
            collectionOwner: "PUBLISHING_SUPPORT",
            timeseriesImportFiles: [],
            id: "test-collection-12345",
            name: "Test collection",
            type: "manual",
            teams: ["cpi", "cpih"],
        },
        {
            approvalStatus: "ERROR",
            publishComplete: false,
            isEncrypted: false,
            collectionOwner: "PUBLISHING_SUPPORT",
            timeseriesImportFiles: [],
            id: "different-collection-12345",
            name: "Test",
            type: "manual",
            teams: ["Team 2"],
        },
        {
            approvalStatus: "COMPLETE",
            publishComplete: false,
            isEncrypted: false,
            collectionOwner: "PUBLISHING_SUPPORT",
            timeseriesImportFiles: [],
            id: "test-sau39393uyqha8aw8y3n3",
            name: "Complete collection",
            type: "manual",
            teams: ["Team 2"],
        },
    ],
};

const component = shallow(<CollectionDetailsController {...defaultProps} />);

beforeEach(() => {
    dispatchedActions = [];
});

describe("When the active collection parameter changes", () => {
    it("from collections root to a collection ID it sets the collection details to show", () => {
        component.setProps({ collectionID: "asdasdasd-04917444856fa9ade290b8847dee1f24e7726d71e1a7378c2557d949b6a6968c" });
        expect(component.state("drawerIsVisible")).toBe(true);
        expect(component.state("drawerIsAnimatable")).toBe(true);
        component.instance().handleDrawerTransitionEnd();
        expect(component.state("drawerIsAnimatable")).toBe(false);
    });

    it("from one collection ID to another, it keeps the collection details showing without animating", () => {
        component.setProps({ collectionID: "different-collection-12345" });
        expect(component.state("drawerIsVisible")).toBe(true);
        expect(component.state("drawerIsAnimatable")).toBe(false);
    });

    it("from one collection ID to another, it fetches the details for the new collection", () => {
        const callsCounter = collections.get.mock.calls.length;
        component.setProps({ collectionID: "test-collection-12345" });
        expect(collections.get.mock.calls.length).toBe(callsCounter + 1);
        expect(collections.get.mock.calls[callsCounter][0]).toBe("test-collection-12345");
    });

    it("from one collection ID to another, it updates collection name and date instantly", () => {
        component.setProps({ collectionID: "different-collection-12345" });
        component.setProps({ collectionID: "asdasdasd-04917444856fa9ade290b8847dee1f24e7726d71e1a7378c2557d949b6a6968c" });
        const updateActiveCollectionAction = dispatchedActions.filter(action => action.type === UPDATE_ACTIVE_COLLECTION);
        const action = updateActiveCollectionAction[updateActiveCollectionAction.length - 1];
        expect(action.collection).toBeTruthy();
        expect(action.collection.id).toBe("asdasdasd-04917444856fa9ade290b8847dee1f24e7726d71e1a7378c2557d949b6a6968c");
        expect(action.collection.name).toBe("asdasdasd");
        expect(action.collection.type).toBe("manual");
    });

    it("from one collection ID to `/collections`, it hides the collection details", () => {
        component.setProps({ collectionID: undefined });
        expect(component.state("drawerIsVisible")).toBe(false);
        expect(component.state("drawerIsAnimatable")).toBe(true);
        component.instance().handleDrawerTransitionEnd();
        expect(component.state("drawerIsAnimatable")).toBe(false);
    });
});

describe("Collection details are hidden", () => {
    it("when 'Close' is clicked", () => {
        component.setProps({ collectionID: "asdasdasd-04917444856fa9ade290b8847dee1f24e7726d71e1a7378c2557d949b6a6968c" });
        expect(component.state("drawerIsVisible")).toBe(true);

        component.instance().handleDrawerCloseClick();
        expect(component.state("drawerIsVisible")).toBe(false);
        expect(component.state("drawerIsAnimatable")).toBe(true);
    });
});

// TODO complete these tests!
describe("Restore content to a collection", () => {
    const singleRestoredData = {
        uri: "/economy/grossdomesticproduct/bulletins/grossdomesticproduct/march2018",
        title: "Gross Domestic Product: March 2018",
        type: "bulletin",
    };

    const multiRestoredData = [
        {
            uri: "/about/test",
            description: { title: "Test Page" },
            type: "test_type",
        },
        {
            uri: "/about/test/two",
            description: { title: "Test Page 2" },
            type: "test_type",
        },
    ];

    beforeAll(() => {
        component.setProps({
            activeCollection: {
                ...defaultProps.collections[0],
                inProgress: [],
            },
        });
    });

    afterAll(() => {
        component.setProps({ activeCollection: defaultProps.activeCollection });
    });

    describe("When restoring single file", () => {
        it("adds the correct page back into the collections", () => {
            component.instance().handleRestoreSingleDeletedContentSuccess(singleRestoredData);
            expect(dispatchedActions[0].type).toBe(UPDATE_PAGES_IN_ACTIVE_COLLECTION);
            expect(dispatchedActions[0].collection.inProgress.some(page => (page.uri = singleRestoredData.uri))).toBe(true);
        });

        it("maps the page data to the structure expected in state", () => {
            component.instance().handleRestoreSingleDeletedContentSuccess(singleRestoredData);
            expect(dispatchedActions[0].type).toBe(UPDATE_PAGES_IN_ACTIVE_COLLECTION);

            const restoredPage = dispatchedActions[0].collection.inProgress.find(page => (page.uri = singleRestoredData.uri));
            expect(restoredPage).toBeTruthy();
            expect(restoredPage.uri).toBe("/economy/grossdomesticproduct/bulletins/grossdomesticproduct/march2018");
            expect(restoredPage.title).toBe("Gross Domestic Product: March 2018");
            expect(restoredPage.type).toBe("bulletin");
        });
    });

    describe("When restoring multiple files", () => {
        it("adds all pages into collection", () => {
            component.instance().handleRestoreMultiDeletedContentSuccess(multiRestoredData);
            expect(dispatchedActions[0].type).toBe(UPDATE_PAGES_IN_ACTIVE_COLLECTION);
            expect(dispatchedActions[0].collection.inProgress.some(page => (page.uri = multiRestoredData[0].uri))).toBe(true);
            expect(dispatchedActions[0].collection.inProgress.some(page => (page.uri = multiRestoredData[1].uri))).toBe(true);
        });

        it("maps the page data to the structure expected in state", () => {
            component.instance().handleRestoreMultiDeletedContentSuccess(multiRestoredData);
            const restoredPage = dispatchedActions[0].collection.inProgress.find(page => (page.uri = multiRestoredData[0].uri));
            expect(restoredPage).toBeTruthy();
            expect(restoredPage.uri).toBe("/about/test");
            expect(restoredPage.title).toBe("Test Page");
            expect(restoredPage.type).toBe("test_type");
        });

        it("correct number of pages are restored", () => {
            component.instance().handleRestoreMultiDeletedContentSuccess(multiRestoredData);
            expect(dispatchedActions[0].collection.inProgress.length).toBe(multiRestoredData.length);
        });
    });
});

describe("Deleting a collection", () => {
    it("user is shown a notification if the collection isn't deleted due to an application error", async () => {
        notifications.add.mockClear();
        expect(notifications.add.mock.calls.length).toEqual(0);

        collections.delete.mockImplementationOnce(() => Promise.reject({ status: 500, statusText: "Unexpected error" }));
        await component.instance().handleCollectionDeleteClick("test-collection-12345");
        await component.update();

        expect(notifications.add.mock.calls.length).toEqual(1);
    });
});

describe("When fetching a collection's detail", async () => {
    component.setProps({ collectionID: "asdasdasd-04917444856fa9ade290b8847dee1f24e7726d71e1a7378c2557d949b6a6968c" });
    await component.update();

    const getCollectionResponse = () => Promise.resolve({ id: "asdasdasd-04917444856fa9ade290b8847dee1f24e7726d71e1a7378c2557d949b6a6968c" });

    it("a loading icon is shown", () => {
        collections.get.mockImplementation(getCollectionResponse);
        component.instance().fetchActiveCollection();
        expect(component.state("isFetchingCollectionDetails")).toBe(true);
    });

    it("the loading icon is hidden on success", async () => {
        await component.instance().fetchActiveCollection();
        await component.update();
        expect(component.state("isFetchingCollectionDetails")).toBe(false);
    });

    it("the loading icon is hidden on error", async () => {
        await component.instance().fetchActiveCollection();
        await component.update();
        expect(component.state("isFetchingCollectionDetails")).toBe(false);
    });

    it("shows a notification on error", async () => {
        notifications.add.mockClear();
        await component.instance().fetchActiveCollection();
        await component.update();
        expect(notifications.add.mock.calls.length).toBe(1);
    });
});

describe("Selecting a page in a collection", () => {
    component.setProps({
        collectionID: "test-sau39393uyqha8aw8y3n3",
        activePageURI: undefined,
    });

    setLocation("https://publishing.onsdigital.co.uk/florence/collections/test-sau39393uyqha8aw8y3n3");

    it("routes to the page's ID", () => {
        expect(newURL).not.toBe("/florence/collections/test-sau39393uyqha8aw8y3n3#test-page-1");
        const newURL = component.instance().handleCollectionPageClick("test-page-1");
        expect(newURL).toBe("/florence/collections/test-sau39393uyqha8aw8y3n3#test-page-1");
    });

    it("going from one page to another updates the route with the new page's ID", () => {
        component.setProps({ activePageURI: "test-page-1", collectionID: "test-sau39393uyqha8aw8y3n3" });
        const newURL = component.instance().handleCollectionPageClick("test-page-2");
        expect(newURL).toBe("/florence/collections/test-sau39393uyqha8aw8y3n3#test-page-2");
    });

    it("doesn't do anything if the same page is clicked", () => {
        component.setProps({ activePageURI: "test-page-2" });
        const newURL = component.instance().handleCollectionPageClick("test-page-2");
        expect(newURL).toBe(undefined);
    });
});

describe("Map state to props function", () => {
    let expectedProps = {
        activeCollection: {
            id: "a-collection-id",
            name: "A collection",
        },
        rootPath: "/florence",
        activePageURI: "",
        collections: [
            {
                id: "a-collection-id",
                name: "A collection",
            },
        ],
    };
    let reduxState = {
        state: {
            user: "foobar@email.com",
            collections: {
                active: {
                    id: "a-collection-id",
                    name: "A collection",
                },
                all: [
                    {
                        id: "a-collection-id",
                        name: "A collection",
                    },
                ],
            },
            rootPath: "/florence",
            config: {
                enableDatasetImport: false,
            },
        },
        routing: {
            locationBeforeTransitions: {
                hash: "",
            },
        },
    };

    it("maps the application state correctly", () => {
        expect(mapStateToProps(reduxState)).toMatchObject(expectedProps);
    });

    it("maps routing state correctly when a bulletin page is active in the collection", () => {
        reduxState.routing.locationBeforeTransitions.hash = "#/economy/grossdomesticproduct/bulletins/gdp/july2017";
        expectedProps.activePageURI = "/economy/grossdomesticproduct/bulletins/gdp/july2017";
        expect(mapStateToProps(reduxState)).toMatchObject(expectedProps);
    });

    it("maps routing state correctly when the home page is active in the collection", () => {
        reduxState.routing.locationBeforeTransitions.hash = "#/";
        expectedProps.activePageURI = "/";
        expect(mapStateToProps(reduxState)).toMatchObject(expectedProps);
    });

    it("maps routing state correctly when there is a trailing slash on the active page URI ", () => {
        reduxState.routing.locationBeforeTransitions.hash = "#/economy#";
        expectedProps.activePageURI = "/economy#";
        expect(mapStateToProps(reduxState)).toMatchObject(expectedProps);
    });
});

describe("Clicking 'edit' for a page", () => {
    const props = {
        ...defaultProps,
        collectionID: "my-collection-12345",
        activeCollection: {
            id: "my-collection-12345",
            inProgress: [
                {
                    type: "dataset_details",
                    id: "cpi",
                    uri: "/datasets/cpi",
                    lastEditedBy: "test.user@email.com",
                },
            ],
            complete: [
                {
                    type: "dataset_version",
                    id: "cpi/editions/current/versions/2",
                    uri: "/datasets/cpi/editions/current/versions/2",
                    edition: "current",
                    version: "2",
                    lastEditedBy: "test.user@email.com",
                },
            ],
            reviewed: [],
        },
    };
    const editClickComponent = shallow(<CollectionDetailsController {...props} />);

    it("routes to the datasets screen for dataset/versions", async () => {
        const mockedDatasetType = {
            next: {
                type: "test_type",
            },
        };
        datasets.get.mockImplementationOnce(() => Promise.resolve(mockedDatasetType));
        const datasetURL = await editClickComponent
            .instance()
            .handleCollectionPageEditClick(
                { type: "dataset_details", id: "cpi", uri: "/datasets/cpi", lastEditedBy: "test.user@email.com" },
                "inProgress"
            );
        expect(datasetURL).toBe("/florence/collections/my-collection-12345/datasets/cpi/editions/current/versions/2");

        const versionURL = await editClickComponent.instance().handleCollectionPageEditClick(
            {
                type: "dataset_version",
                datasetID: "cpi",
                id: "cpi/editions/current/versions/2",
                uri: "/datasets/cpi/editions/current/versions/2",
                edition: "current",
                version: "2",
                lastEditedBy: "test.user@email.com",
            },
            "complete"
        );
        expect(editClickComponent.state("isCantabularDataset")).toBe(false);
        expect(versionURL).toBe("/florence/collections/my-collection-12345/datasets/cpi/editions/current/versions/2");
    });

    it("routes to the workspace for a non-dataset pages", async () => {
        const pageURL = await editClickComponent
            .instance()
            .handleCollectionPageEditClick({ type: "article", uri: "/economy/grossdomesticproductgdp/articles/ansarticle" });
        expect(editClickComponent.state("isCantabularDataset")).toBe(false);
        expect(pageURL).toBe("/florence/workspace?collection=my-collection-12345&uri=/economy/grossdomesticproductgdp/articles/ansarticle");
    });
    it("routes to the cantabular edit metadata form if the dataset type is a cantabular_table", async () => {
        const cantabularProps = {
            ...defaultProps,
            ...props,
            enableCantabularJourney: true,
        };
        const cantabularEditClickComponent = shallow(<CollectionDetailsController {...cantabularProps} />);

        const mockedDatasetType = { next: { type: "cantabular_table" } };
        datasets.get.mockImplementationOnce(() => Promise.resolve(mockedDatasetType));
        const versionURL = await cantabularEditClickComponent.instance().handleCollectionPageEditClick(
            {
                type: "dataset_version",
                datasetID: "cpi",
                id: "cpi/editions/current/versions/2",
                uri: "/datasets/cpi/editions/current/versions/2",
                edition: "current",
                version: "2",
                lastEditedBy: "test.user@email.com",
            },
            "complete"
        );
        expect(cantabularEditClickComponent.state("isCantabularDataset")).toBe(true);
        expect(versionURL).toBe("/florence/collections/my-collection-12345/datasets/cpi/editions/current/versions/2/cantabular");
    });
    it("routes to the cantabular edit metadata form if the dataset type is a cantabular_flexible_table", async () => {
        const cantabularProps = {
            ...defaultProps,
            ...props,
            enableCantabularJourney: true,
        };
        const cantabularEditClickComponent = shallow(<CollectionDetailsController {...cantabularProps} />);
        const mockedDatasetType = { next: { type: "cantabular_flexible_table" } };
        datasets.get.mockImplementationOnce(() => Promise.resolve(mockedDatasetType));
        const versionURL = await cantabularEditClickComponent.instance().handleCollectionPageEditClick(
            {
                type: "dataset_version",
                datasetID: "cpi",
                id: "cpi/editions/current/versions/2",
                uri: "/datasets/cpi/editions/current/versions/2",
                edition: "current",
                version: "2",
                lastEditedBy: "test.user@email.com",
            },
            "complete"
        );
        expect(cantabularEditClickComponent.state("isCantabularDataset")).toBe(true);
        expect(versionURL).toBe("/florence/collections/my-collection-12345/datasets/cpi/editions/current/versions/2/cantabular");
    });
});

describe("Edit Homepage functionality", () => {
    it("is disabled in collection details when disabled in global config", () => {
        const props = {
            ...defaultProps,
            collectionID: "test-collection-12345",
            activeCollection: {
                id: "test-collection-12345",
            },
        };
        const component = shallow(<CollectionDetailsController {...props} />);
    });
    it("is enabled in collection details when enabled in global config", () => {
        const props = {
            ...defaultProps,
            collectionID: "test-collection-12345",
            activeCollection: {
                id: "test-collection-12345",
            },
        };
        const component = shallow(<CollectionDetailsController {...props} />);
    });
});

describe("Dataset import functionality", () => {
    it("disabled in collection details when disabled in global config", () => {
        const props = {
            ...defaultProps,
            collectionID: "test-collection-12345",
            activeCollection: {
                id: "test-collection-12345",
            },
            enableDatasetImport: false,
        };
        const component = shallow(<CollectionDetailsController {...props} />);

        expect(component.find(CollectionDetails).props().enableDatasetImport).toBe(false);
    });

    it("enabled in collection details when enabled in global config", () => {
        const props = {
            ...defaultProps,
            collectionID: "test-collection-12345",
            activeCollection: {
                id: "test-collection-12345",
            },
            enableDatasetImport: true,
        };
        const component = shallow(<CollectionDetailsController {...props} />);

        expect(component.find(CollectionDetails).props().enableDatasetImport).toBe(true);
    });
});
