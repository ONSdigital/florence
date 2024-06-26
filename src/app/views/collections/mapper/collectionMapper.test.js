import collectionMapper from "./collectionMapper";
import log from "../../../utilities/logging/log";

console.error = () => {};

jest.mock("../../../utilities/websocket", () => {
    return {
        send: jest.fn(() => {}),
    };
});

jest.mock("../../../utilities/logging/log", () => ({
    event: jest.fn(() => {}),
    error: jest.fn(() => {}),
    warn: jest.fn(() => {}),
}));

let collectionData = {},
    mappedEmptyCollection = {},
    exampleUnmappedPages = [];

beforeEach(() => {
    jest.clearAllMocks();
    collectionData = {
        approvalStatus: "IN_PROGRESS",
        publishComplete: false,
        isEncrypted: false,
        collectionOwner: "PUBLISHING_SUPPORT",
        timeseriesImportFiles: [],
        id: "test-collection-12345",
        name: "Test collection",
        type: "manual",
        teams: ["cpi", "cpih"],
    };

    mappedEmptyCollection = collectionMapper.collectionResponseToState({
        ...collectionData,
        inProgress: [],
        reviewed: [],
        complete: [],
        pendingDeletes: [],
        approvalStatus: "NOT_STARTED",
    });
    exampleUnmappedPages = [
        {
            contentPath: "/economy/environmentalaccounts",
            uri: "/economy/environmentalaccounts",
            deleteMarker: false,
            description: {
                title: "Environmental accounts",
            },
            events: [
                { date: "2021-05-01T13:43:24.327Z", type: "CREATED", email: "test@test.com" },
                { date: "2021-05-10T13:54:01.408Z", type: "COMPLETED", email: "test@test.com" },
                { date: "2021-05-12T13:54:58.235Z", type: "EDITED", email: "test@test.com" },
                { date: "2021-05-16T13:54:58.327Z", type: "COMPLETED", email: "test@test.com" },
                { date: "2021-05-18T14:01:11.028Z", type: "EDITED", email: "test@test.com" },
                { date: "2021-05-22T14:14:54.601Z", type: "COMPLETED", email: "test@test.com" },
            ],
            type: "taxonomy_landing_page",
        },
        {
            contentPath: "/economy",
            uri: "/economy",
            deleteMarker: false,
            description: {
                title: "Economy",
            },
            events: [{ date: "2021-11-01T13:43:24.327Z", type: "CREATED", email: "test@test.com" }],
            type: "taxonomy_landing_page",
        },
    ];
});

afterEach(() => {
    collectionData = {};
    mappedEmptyCollection = {};
    exampleUnmappedPages = [];
});

describe("collectionMapper", () => {
    describe("readablePublishDate returns correct display date when", () => {
        it("a collection has a publishDate and is set to manual publish", () => {
            const collection = {
                publishDate: "2017-12-19T09:30:00.000Z",
                type: "manual",
            };
            const result = collectionMapper.publishDate(collection);
            expect(result).toBe("Tue, 19/12/2017 9:30AM [rolled back]");
        });

        it("a collection has a publishDate", () => {
            const collection = {
                publishDate: "2017-07-13T01:30:00.000Z",
                type: "",
            };
            const result = collectionMapper.publishDate(collection);
            expect(result).toBe("Thu, 13/07/2017 2:30AM");
        });

        it("a collection has no publishDate and is set to manual", () => {
            const collection = {
                publishDate: "",
                type: "manual",
            };
            const result = collectionMapper.publishDate(collection);
            expect(result).toBe("[manual collection]");
        });
    });

    describe("Mapping collection data to application state function", () => {
        it("leaves missing properties as `undefined`", () => {
            const result = collectionMapper.collectionResponseToState(collectionData);
            expect(result.inProgress).toBe(undefined);
            expect(result.complete).toBe(undefined);
            expect(result.reviewed).toBe(undefined);
            expect(result.deletes).toBe(undefined);
            expect(result.canBeApproved).toBe(false);
            expect(result.canBeDeleted).toBe(false);
        });

        it("adds a message and status when preparing for publish", () => {
            const result = collectionMapper.collectionResponseToState(collectionData);

            expect(result.status.message).toBe("preparing publish");
            expect(result.status.neutral).toBe(true);
            expect(result.status.warning).toBe(false);
            expect(result.status.success).toBe(false);
        });

        it("adds a message and status when publish preparation has failed", () => {
            const resultWithErrorStatus = collectionMapper.collectionResponseToState({
                ...collectionData,
                approvalStatus: "ERROR",
            });
            expect(resultWithErrorStatus.status.message).toBeTruthy();
            expect(resultWithErrorStatus.status.warning).toBe(true);
            expect(resultWithErrorStatus.status.neutral).toBe(false);
            expect(resultWithErrorStatus.status.success).toBe(false);
        });

        it("adds a status with no message when publish preparation was successful", () => {
            const resultWithSuccessStatus = collectionMapper.collectionResponseToState({
                ...collectionData,
                approvalStatus: "COMPLETE",
            });
            expect(resultWithSuccessStatus.status.message).toBeFalsy();
            expect(resultWithSuccessStatus.status.success).toBe(true);
            expect(resultWithSuccessStatus.status.warning).toBe(false);
            expect(resultWithSuccessStatus.status.neutral).toBe(false);
        });

        it("no status message or state when publishing preparation is not in progress", () => {
            const resultWithNoStatus = collectionMapper.collectionResponseToState({
                ...collectionData,
                approvalStatus: "NOT_STARTED",
            });
            expect(resultWithNoStatus.status.message).toBeFalsy();
            expect(resultWithNoStatus.status.warning).toBe(false);
            expect(resultWithNoStatus.status.neutral).toBe(false);
            expect(resultWithNoStatus.status.success).toBe(false);
        });

        it("includes structured data for the table of collections", () => {
            const result = collectionMapper.collectionResponseToState(collectionData);

            expect(result.selectableBox.firstColumn).toBe("Test collection");
            expect(result.selectableBox.secondColumn).toBe("[manual collection]");
        });

        it("correctly sets the `type` and publish date for scheduled collections", () => {
            const resultOfScheduledCollection = collectionMapper.collectionResponseToState({
                ...collectionData,
                publishDate: "2018-05-31T09:30:00.000Z",
                type: "scheduled",
            });
            expect(resultOfScheduledCollection.publishDate).toBe("2018-05-31T09:30:00.000Z");
            expect(resultOfScheduledCollection.type).toBe("scheduled");
            expect(resultOfScheduledCollection.selectableBox.secondColumn).toBe("Thu, 31/05/2018 10:30AM");
        });

        it("correctly sets the `type` and publish date for collections scheduled by a calendar entry", () => {
            const resultOfScheduledCollection = collectionMapper.collectionResponseToState({
                ...collectionData,
                publishDate: "2018-05-31T09:30:00.000Z",
                type: "scheduled",
                releaseUri: "/releases/myreleasemay2018",
            });
            expect(resultOfScheduledCollection.publishDate).toBe("2018-05-31T09:30:00.000Z");
            expect(resultOfScheduledCollection.type).toBe("scheduled");
            expect(resultOfScheduledCollection.release).toBe("/releases/myreleasemay2018");
        });

        it("correctly sets the `type` and publish date for manual collections", () => {
            const resultOfManualCollection = collectionMapper.collectionResponseToState({
                ...collectionData,
                type: "manual",
            });
            expect(resultOfManualCollection.type).toBe("manual");
            expect(resultOfManualCollection.publishDate).toBe(undefined);
        });

        it("correctly sets `isForcedManualType` to `true`", () => {
            const resultOfOutdatedScheduledCollection = collectionMapper.collectionResponseToState({
                ...collectionData,
                publishDate: "2018-05-31T09:30:00.000Z",
                type: "manual",
                releaseUri: "/releases/myrelease",
            });
            expect(resultOfOutdatedScheduledCollection.isForcedManualType).toBe(true);
        });

        it("correctly sets `isForcedManualType` to `false`", () => {
            const result = collectionMapper.collectionResponseToState(collectionData);
            expect(result.isForcedManualType).toBe(false);

            const resultOfScheduledCollection = collectionMapper.collectionResponseToState({
                ...collectionData,
                publishDate: "2018-05-31T09:30:00.000Z",
                type: "scheduled",
                releaseUri: "/releases/myreleasemay2018",
            });
            expect(resultOfScheduledCollection.isForcedManualType).toBe(false);
        });

        it("includes teams id, when available", () => {
            const resultWithTeamsDetails = collectionMapper.collectionResponseToState({
                ...collectionData,
                teams: ["team1", "id-1234"],
            });
            expect(resultWithTeamsDetails.teams).toEqual([
                {
                    id: "team1",
                },
                {
                    id: "id-1234",
                },
            ]);
        });
    });

    describe("Mapping collection data to approvable/deletable state", () => {
        it("can't be approved when a collection has not pages or deletes", () => {
            let canBeApproved = collectionMapper.pagesToCollectionState(mappedEmptyCollection).canBeApproved;
            expect(canBeApproved).toBe(false);
        });

        it("can't be approved when pages are awaiting review or in progress", () => {
            let collection = {
                ...mappedEmptyCollection,
                inProgress: [
                    {
                        contentPath: "/economy/environmentalaccounts",
                        uri: "/economy/environmentalaccounts",
                        deleteMarker: false,
                        description: {
                            title: "Environmental accounts",
                        },
                        events: [{ email: "test@test.com", date: "2018-05-29T13:41:40.536Z" }],
                        type: "taxonomy_landing_page",
                    },
                ],
                deletes: [
                    {
                        root: {},
                        totalDeletes: 1,
                        user: "test@test.com",
                    },
                ],
            };

            let canBeApproved = collectionMapper.pagesToCollectionState(collection).canBeApproved;
            expect(canBeApproved).toBe(false);

            collection.complete = [...collection.inProgress];
            collection.inProgress = [];
            canBeApproved = collectionMapper.pagesToCollectionState(collection).canBeApproved;
            expect(canBeApproved).toBe(false);
        });

        it("can be approved when no pages are present but a delete is", () => {
            const collection = {
                ...mappedEmptyCollection,
                deletes: [
                    {
                        root: {},
                        totalDeletes: 1,
                        user: "test@test.com",
                    },
                ],
            };
            const canBeApproved = collectionMapper.pagesToCollectionState(collection).canBeApproved;
            expect(canBeApproved).toBe(true);
        });

        it("can be approved when all pages have been reviewed", () => {
            const collection = {
                ...mappedEmptyCollection,
                reviewed: [
                    {
                        contentPath: "/economy/environmentalaccounts",
                        uri: "/economy/environmentalaccounts",
                        deleteMarker: false,
                        description: {
                            title: "Environmental accounts",
                        },
                        events: [{ email: "test@test.com", date: "2018-05-29T13:41:40.536Z" }],
                        type: "taxonomy_landing_page",
                    },
                ],
            };
            const canBeApproved = collectionMapper.pagesToCollectionState(collection).canBeApproved;
            expect(canBeApproved).toBe(true);
        });

        it("can't be deleted when a page is in progress", () => {
            const collection = {
                ...mappedEmptyCollection,
                inProgress: [
                    {
                        contentPath: "/economy/environmentalaccounts",
                        uri: "/economy/environmentalaccounts",
                        deleteMarker: false,
                        description: {
                            title: "Environmental accounts",
                        },
                        events: [{ email: "test@test.com", date: "2018-05-29T13:41:40.536Z" }],
                        type: "taxonomy_landing_page",
                    },
                ],
            };
            const canBeDeleted = collectionMapper.pagesToCollectionState(collection).canBeDeleted;
            expect(canBeDeleted).toBe(false);
        });

        it("can't be deleted when a page is awaiting review", () => {
            let collection = {
                ...mappedEmptyCollection,
                complete: [
                    {
                        contentPath: "/economy/environmentalaccounts",
                        uri: "/economy/environmentalaccounts",
                        deleteMarker: false,
                        description: {
                            title: "Environmental accounts",
                        },
                        events: [{ email: "test@test.com", date: "2018-05-29T13:41:40.536Z" }],
                        type: "taxonomy_landing_page",
                    },
                ],
            };
            let canBeDeleted = collectionMapper.pagesToCollectionState(collection).canBeDeleted;
            expect(canBeDeleted).toBe(false);
        });

        it("can't be deleted when a page is reviewed", () => {
            let collection = {
                ...mappedEmptyCollection,
                reviewed: [
                    {
                        contentPath: "/economy/environmentalaccounts",
                        uri: "/economy/environmentalaccounts",
                        deleteMarker: false,
                        description: {
                            title: "Environmental accounts",
                        },
                        events: [{ email: "test@test.com", date: "2018-05-29T13:41:40.536Z" }],
                        type: "taxonomy_landing_page",
                    },
                ],
            };
            let canBeDeleted = collectionMapper.pagesToCollectionState(collection).canBeDeleted;
            expect(canBeDeleted).toBe(false);
        });

        it("can't be deleted when any deletes are in the collection", () => {
            const collection = {
                ...mappedEmptyCollection,
                deletes: [
                    {
                        root: {},
                        totalDeletes: 1,
                        user: "test@test.com",
                    },
                ],
            };
            const canBeDeleted = collectionMapper.pagesToCollectionState(collection).canBeDeleted;
            expect(canBeDeleted).toBe(false);
        });

        it("can be deleted when no deletes are in the collection", () => {
            const canBeDeleted = collectionMapper.pagesToCollectionState(mappedEmptyCollection).canBeDeleted;
            expect(canBeDeleted).toBe(true);
        });

        it("re-mapping collection metadata updates correctly", () => {
            const mappedCollection = {
                ...mappedEmptyCollection,
                inProgress: [
                    {
                        lastEdit: {
                            email: "test@test.com",
                            date: "2018-05-29T13:41:40.536Z",
                        },
                        title: "Economy",
                        edition: "",
                        uri: "/economy",
                        type: "taxonomy_landing_page",
                    },
                ],
            };
            expect(mappedCollection.name).toBe("Test collection");

            const remappedCollection = collectionMapper.collectionResponseToState({
                ...mappedCollection,
                name: "A new name",
            });
            expect(remappedCollection.name).toBe("A new name");
        });

        it("doesn't alter page data when re-mapping metadata in the collection", () => {
            const mappedCollection = {
                ...mappedEmptyCollection,
                inProgress: [
                    {
                        lastEdit: {
                            email: "test@test.com",
                            date: "2018-05-29T13:41:40.536Z",
                        },
                        title: "Economy",
                        edition: "",
                        uri: "/economy",
                        type: "taxonomy_landing_page",
                    },
                ],
            };
            expect(mappedCollection.name).toBe("Test collection");

            const remappedCollection = collectionMapper.collectionResponseToState({
                ...mappedCollection,
                name: "A new name",
            });
            expect(remappedCollection.inProgress).toEqual(mappedCollection.inProgress);
        });
    });

    describe("Mapping a collections pages to state", () => {
        it("maps 'in progress' pages", () => {
            const mappedCollection = collectionMapper.pagesToCollectionState({
                ...collectionData,
                inProgress: [...exampleUnmappedPages],
            });
            expect(mappedEmptyCollection.inProgress.length).toBe(0);
            expect(mappedCollection.inProgress.length).toBe(2);
            expect(mappedCollection.inProgress[0].uri).toBe("/economy/environmentalaccounts");
            expect(mappedCollection.inProgress[1].uri).toBe("/economy");
        });

        it("maps 'awaiting review' pages", () => {
            const mappedCollection = collectionMapper.pagesToCollectionState({
                ...collectionData,
                complete: [...exampleUnmappedPages],
            });
            expect(mappedEmptyCollection.complete.length).toBe(0);
            expect(mappedCollection.complete.length).toBe(2);
            expect(mappedCollection.complete[0].uri).toBe("/economy/environmentalaccounts");
            expect(mappedCollection.complete[1].uri).toBe("/economy");
        });

        it("maps 'reviewed' pages", () => {
            const mappedCollection = collectionMapper.pagesToCollectionState({
                ...collectionData,
                reviewed: [...exampleUnmappedPages],
            });
            expect(mappedEmptyCollection.reviewed.length).toBe(0);
            expect(mappedCollection.reviewed.length).toBe(2);
            expect(mappedCollection.reviewed[0].uri).toBe("/economy/environmentalaccounts");
            expect(mappedCollection.reviewed[1].uri).toBe("/economy");
        });

        it("maps a page to the correct structure", () => {
            const mappedCollection = collectionMapper.pagesToCollectionState({
                ...collectionData,
                reviewed: [
                    ...exampleUnmappedPages,
                    {
                        contentPath: "/economy/grossdomesticproductgdp/bulletins/secondestimateofgdp/octobertodecember2017",
                        uri: "/economy/grossdomesticproductgdp/bulletins/secondestimateofgdp/octobertodecember2017",
                        deleteMarker: false,
                        description: {
                            title: "Second estimate of GDP",
                            edition: "October to December 2017",
                        },
                        events: [{ email: "test@test.com", date: "2018-05-29T13:42:23.909Z", type: "EDITED" }],
                        type: "bulletin",
                    },
                ],
            });

            expect(mappedCollection.reviewed[0]).toEqual({
                lastEdit: {
                    email: "test@test.com",
                    date: "2021-05-18T14:01:11.028Z",
                },
                title: "Environmental accounts",
                edition: "",
                uri: "/economy/environmentalaccounts",
                type: "taxonomy_landing_page",
            });

            expect(mappedCollection.reviewed[2]).toEqual({
                lastEdit: {
                    email: "test@test.com",
                    date: "2018-05-29T13:42:23.909Z",
                },
                title: "Second estimate of GDP",
                edition: "October to December 2017",
                uri: "/economy/grossdomesticproductgdp/bulletins/secondestimateofgdp/octobertodecember2017",
                type: "bulletin",
            });
        });

        it("doesn't throw an error when a page has no events", () => {
            const pageWithoutEvents = { ...exampleUnmappedPages[0] };
            delete pageWithoutEvents.events;
            const mappedCollection = collectionMapper.pagesToCollectionState({
                ...collectionData,
                inProgress: [pageWithoutEvents],
            });

            expect(mappedCollection.inProgress[0]).toEqual({
                lastEdit: {
                    email: "",
                    date: "",
                },
                title: "Environmental accounts",
                edition: "",
                uri: "/economy/environmentalaccounts",
                type: "taxonomy_landing_page",
            });
        });

        it("logs any errors caused by mapping a page", () => {
            const brokenCollectionData = {
                ...collectionData,
                inProgress: [{ uri: "/economy" }],
                reviewed: [],
                complete: [],
            };
            const logCount = log.event.mock.calls.length;
            collectionMapper.pagesToCollectionState(brokenCollectionData);
            expect(log.event.mock.calls.length).toBe(logCount + 1);
            expect(log.event.mock.calls[0][0]).toBe("Error mapping a page to Florence's state");
        });

        it("continues to map other pages even if one fails", () => {
            const brokenCollectionData = {
                ...collectionData,
                inProgress: [{}, { ...exampleUnmappedPages[0] }],
                reviewed: [{ ...exampleUnmappedPages[1] }],
                complete: [],
            };
            const expectedMappedInProgress = [
                {},
                {
                    lastEdit: {
                        email: "test@test.com",
                        date: "2021-05-18T14:01:11.028Z",
                    },
                    title: "Environmental accounts",
                    edition: "",
                    uri: "/economy/environmentalaccounts",
                    type: "taxonomy_landing_page",
                },
            ];
            const expectedMappedReviewed = [
                {
                    lastEdit: {
                        email: "test@test.com",
                        date: "2021-11-01T13:43:24.327Z",
                    },
                    title: "Economy",
                    edition: "",
                    uri: "/economy",
                    type: "taxonomy_landing_page",
                },
            ];
            const mappedCollection = collectionMapper.pagesToCollectionState(brokenCollectionData);

            expect(mappedCollection.inProgress).toMatchObject(expectedMappedInProgress);
            expect(mappedCollection.complete).toMatchObject([]);
            expect(mappedCollection.reviewed).toMatchObject(expectedMappedReviewed);
        });

        it("it shows newest edit date for lastEdit", () => {
            const collection = { inProgress: [...exampleUnmappedPages] };
            const mappedCollection = collectionMapper.pagesToCollectionState(collection);

            expect(mappedCollection.inProgress[0].lastEdit).toMatchObject({
                email: "test@test.com",
                date: "2021-05-18T14:01:11.028Z",
            });
        });

        it("it shows the created date when edit date is not registered", () => {
            let collection = {
                ...mappedEmptyCollection,
                inProgress: [
                    {
                        contentPath: "/economy/environmentalaccounts",
                        uri: "/economy/environmentalaccounts",
                        deleteMarker: false,
                        description: {
                            title: "Environmental accounts",
                        },
                        events: [
                            {
                                email: "test@test.com",
                                date: "2021-05-18T14:01:11.028Z",
                                type: "CREATED",
                            },
                        ],
                    },
                ],
            };

            const mappedCollection = collectionMapper.pagesToCollectionState(collection);
            expect(mappedCollection.inProgress[0].lastEdit).toMatchObject({
                email: "test@test.com",
                date: "2021-05-18T14:01:11.028Z",
            });
        });
    });

    describe("Pages currently being deleted from a collection", () => {
        const exampleMappedPages = [
            {
                lastEdit: { email: "test@test.com", date: "2018-05-29T13:41:40.536Z" },
                title: "Environmental accounts",
                edition: "",
                uri: "/economy/environmentalaccounts",
                type: "taxonomy_landing_page",
            },
            {
                lastEdit: { email: "test@test.com", date: "2018-05-28T10:23:13.569Z" },
                title: "Economy",
                edition: "",
                uri: "/economy",
                type: "taxonomy_landing_page",
            },
            {
                lastEdit: { email: "test@test.com", date: "2018-05-29T13:42:23.909Z" },
                title: "Second estimate of GDP",
                edition: "October to December 2017",
                uri: "/economy/grossdomesticproductgdp/bulletins/secondestimateofgdp/octobertodecember2017",
                type: "bulletin",
            },
        ];

        it("returns the original array of pages if no pending removed pages are given", () => {
            const pages = collectionMapper.pagesExcludingPendingDeletedPages(exampleMappedPages, []);
            expect(pages.length).toBe(3);
            expect(pages).toEqual(exampleMappedPages);
        });

        it("excludes a page from the collection data", () => {
            const pendingDeletedPages = ["/economy"];
            const pages = collectionMapper.pagesExcludingPendingDeletedPages(exampleMappedPages, pendingDeletedPages);
            expect(pages.length).toBe(2);
            expect(pages.some(page => page.uri === "/economy")).toBe(false);
            expect(pages).not.toEqual(exampleMappedPages);
        });

        it("excludes multiple pages from the returned pages data", () => {
            const pendingDeletedPages = ["/economy", "/economy/grossdomesticproductgdp/bulletins/secondestimateofgdp/octobertodecember2017"];
            const pages = collectionMapper.pagesExcludingPendingDeletedPages(exampleMappedPages, pendingDeletedPages);
            expect(pages.length).toBe(1);
            expect(pages).not.toEqual(exampleMappedPages);
            expect(pages.some(page => page.uri === "/economy")).toBe(false);
            expect(pages.some(page => page.uri === "/economy/grossdomesticproductgdp/bulletins/secondestimateofgdp/octobertodecember2017")).toBe(
                false
            );
            expect(pages.some(page => page.uri === "/economy/environmentalaccounts")).toBe(true);
        });

        it("returns 'undefined' if the array of pages in the collection doesn't exist", () => {
            expect(collectionMapper.pagesExcludingPendingDeletedPages(undefined, ["/economy"])).toBe(undefined);
            expect(collectionMapper.pagesExcludingPendingDeletedPages(null, ["/economy"])).toBe(undefined);
        });
    });
});
