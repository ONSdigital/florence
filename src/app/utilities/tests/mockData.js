const collections = [
    {
        approvalStatus: "NOT_STARTED",
        publishComplete: false,
        isEncrypted: false,
        collectionOwner: "hello",
        timeseriesImportFiles: [],
        id: "zebedee-91bc818cff240fa546c84b0cc4c3d32f0667de3068832485e254c17655d5b4ad",
        name: "Zebedee collection",
        type: "manual",
        teams: [],
    },
    {
        approvalStatus: "IN_PROGRESS",
        publishComplete: false,
        publishDate: "2021-11-17T09:30:00.000Z",
        isEncrypted: false,
        collectionOwner: "PUBLISHING_SUPPORT",
        timeseriesImportFiles: [],
        id: "boo-04917444856fa9ade290b8847dee1f24e7726d71e1a7378c2557d949b6a6968c",
        name: "Boo",
        type: "scheduled",
        teams: [],
    },
    {
        approvalStatus: "IN_PROGRESS",
        publishComplete: false,
        publishDate: "2022-01-01T00:30:00.000Z",
        isEncrypted: false,
        collectionOwner: "PUBLISHING_SUPPORT",
        timeseriesImportFiles: [],
        id: "test-collection-12345",
        name: "Test collection",
        type: "scheduled",
        teams: ["cpi", "cpih"],
    },
    {
        approvalStatus: "ERROR",
        publishComplete: false,
        isEncrypted: false,
        collectionOwner: "PUBLISHING_SUPPORT",
        timeseriesImportFiles: [],
        id: "different-collection-6712345",
        name: "Different collection",
        type: "manual",
        teams: ["Team 2"],
    },
    {
        approvalStatus: "COMPLETE",
        publishComplete: false,
        isEncrypted: false,
        collectionOwner: "PUBLISHING_SUPPORT",
        timeseriesImportFiles: [],
        id: "ala-sau39393uyqha8aw8y3n3",
        name: "Ala collection",
        type: "scheduled",
        teams: ["Team 2"],
        publishDate: "2021-12-17T09:30:00.000Z",
    },
];

const items = [
    {
        id: "1",
        name: "Foo",
        selectableBox: {
            firstColumn: "Foo",
            secondColumn: "2021-12-17T09:30:00.000Z",
        },
        status: { neutral: true, warning: false, message: "" },
    },
    {
        id: "2",
        name: "Bar",
        selectableBox: {
            firstColumn: "Bar",
            secondColumn: "Friday",
        },
        status: { neutral: true, warning: false, message: "" },
    },
    {
        id: "3",
        name: "Baz",
        selectableBox: {
            firstColumn: "Baz",
            secondColumn: "[manual collection]",
        },
        status: { neutral: true, warning: false, message: "" },
    },
];

const emptyCollection = [];
const newCollection = {};

// CommonJS style export via Node no Babel-node
module.exports = {
    newCollection,
    collections,
    emptyCollection,
    items,
};
