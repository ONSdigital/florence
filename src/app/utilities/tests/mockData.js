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
    email: "test.user-1498@ons.gov.uk",
    forename: "test",
    groups: [],
    id: "test.user-1498@ons.gov.uk",
    lastname: "user-1498",
    status: "CONFIRMED",
    status_notes: "This user is active",
};

const unconfirmedUser = {
    active: true,
    email: "test.unconfirmed.user-2025@ons.gov.uk",
    forename: "test",
    groups: [],
    id: "test.unconfirmed.user-2025@ons.gov.ukk",
    lastname: "user-2025",
    status: "FORCE_CHANGE_PASSWORD",
    status_notes: "This user is active",
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
const group = {
    created: "2022-03-08T14:37:59.484Z",
    id: "0",
    name: "Boo is fine",
    precedence: 10,
};

const specialGroup = {
    created: "2022-03-10T14:37:59.484Z",
    id: "1",
    name: "Admins",
    precedence: 1,
};

const groups = [
    {
        creation_date: "2021-10-12T14:32:50.913Z",
        name: "my test group description",
        id: "510ce85879",
        last_modified_date: "2021-10-12T14:32:50.913Z",
        precedence: 19,
        role_arn: null,
        user_pool_id: "foo",
    },
    {
        creation_date: "2022-10-12T14:32:50.913Z",
        name: "my first test group description",
        id: "078f79ba-51ce858790c5",
        last_modified_date: "2022-10-13T14:32:50.913Z",
        precedence: 10,
        role_arn: null,
        user_pool_id: "foo",
    },
    {
        creation_date: "2021-10-12T14:32:50.913Z",
        name: "admins group description",
        id: "51ce858790c5",
        last_modified_date: "2021-10-12T14:32:50.913Z",
        precedence: 1,
        role_arn: null,
        user_pool_id: "foo",
    },
];

const mappedSortedGroups = [
    {
        creation_date: "2022-03-25T15:50:15.953Z",
        extraDetails: [],
        id: "4",
        last_modified_date: "2022-03-28T13:33:29.586Z",
        name: "Hello Group",
        precedence: 10,
        role_arn: null,
        title: "Hello Group",
        url: "/florence/groups/4",
        user_pool_id: "foo",
    },
    {
        creation_date: "2022-03-25T15:49:33.421Z",
        extraDetails: [],
        id: "1",
        last_modified_date: "2022-03-28T13:26:11.637Z",
        name: "Test",
        precedence: 10,
        role_arn: null,
        title: "Test",
        url: "/florence/groups/1",
        user_pool_id: "foo",
    },
    {
        creation_date: "2022-02-24T15:15:22.106Z",
        extraDetails: [],
        id: "2",
        last_modified_date: "2022-03-16T16:12:06.761Z",
        name: "This team has 5 members",
        precedence: 10,
        role_arn: null,
        title: "This team has 5 members",
        url: "/florence/groups/2",
        user_pool_id: "foo",
    },
    {
        creation_date: "2022-02-24T15:15:22.106Z",
        extraDetails: [],
        id: "0",
        last_modified_date: "2022-03-16T16:12:06.761Z",
        name: "Admins",
        precedence: 1,
        role_arn: null,
        title: "Admins",
        url: "/florence/groups/0",
        user_pool_id: "foo",
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
    unconfirmedUser,
    groups,
    mappedSortedGroups,
    group,
    specialGroup,
};
