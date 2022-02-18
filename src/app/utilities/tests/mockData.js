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
        status: { neutral: true, warning: false, message: "My test message" },
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

const users = [
    {
        name: "Test user",
        email: "test@test.com",
        inactive: false,
        temporaryPassword: false,
        lastAdmin: "test@test.com",
        adminOptions: {
            rawJson: false,
        },
    },
    {
        name: "Test user 2",
        email: "test2@test.com",
        inactive: false,
        temporaryPassword: false,
        lastAdmin: "test2@test.com",
        adminOptions: {
            rawJson: false,
        },
    },
    {
        name: "Test user 3",
        email: "test3@test.com",
        inactive: false,
        temporaryPassword: false,
        lastAdmin: "test3@test.com",
        adminOptions: {
            rawJson: false,
        },
    },
];

const user = {
    active: true,
    email: "bill.hicks@ons.gov.uk",
    forename: "Bill",
    groups: [],
    id: "bill.hicks@ons.gov.uk",
    lastname: "Hickes",
    status: "CONFIRMED",
    status_notes: "",
};

const notifications = [
    {
        type: "neutral",
        message: "My test message.",
        id: "1",
        isDismissable: true,
        buttons: [],
        isVisible: true,
    },
    {
        type: "warning",
        message: "My another test message.",
        id: "2",
        isDismissable: false,
        isVisible: true,
        buttons: [],
    },
];

const teams = [
    {
        id: 25,
        name: "A new team",
        members: ["test@test.com", "test2@test.com", "test3@test.com"],
        path: "a_new_team_25",
    },
    {
        id: 15,
        name: "crispin",
        members: ["admin@test.com", "data@vis.com"],
        path: "crispin_15",
    },
    {
        id: 23,
        name: "crumpet",
        members: [],
        path: "crumpet_23",
    },
    {
        id: 1,
        name: "Test Team",
        members: [],
        path: "test_team_1",
    },
];

const groups = [
    {
        creation_date: "2021-10-12T14:32:50.913Z",
        description: "my test group description",
        group_name: "my test group",
        last_modified_date: "2021-10-12T14:32:50.913Z",
        precedence: 19,
        role_arn: null,
        user_pool_id: "eu-west-1_Rnma9lp2q",
    },
    {
        creation_date: "2022-10-12T14:32:50.913Z",
        description: "my first test group description",
        group_name: "my first group",
        last_modified_date: "2022-10-13T14:32:50.913Z",
        precedence: 10,
        role_arn: null,
        user_pool_id: "eu-west-1_Rnma9lp2q",
    },
    {
        creation_date: "2021-10-12T14:32:50.913Z",
        description: "admins group description",
        group_name: "admins",
        last_modified_date: "2021-10-12T14:32:50.913Z",
        precedence: 1,
        role_arn: null,
        user_pool_id: "eu-west-1_Rnma9lp2q",
    },
];

const popouts = [
    {
        id: "foo",
        title: "bar",
        body: "baz",
        buttons: [
            {
                onClick: () => {},
                text: "Qux",
                style: "primary",
            },
        ],
    },
    {
        id: "foo 2",
        title: "bar2",
        body: "baz2",
        buttons: [
            {
                onClick: () => {},
                text: "Qux2",
                style: "primary",
            },
        ],
    },
];

// CommonJS style export via Node no Babel-node
module.exports = {
    collections,
    items,
    users,
    notifications,
    teams,
    popouts,
    user,
    groups,
};
