import React, { Component } from 'react';
import { CollectionsController, mapStateToProps } from './CollectionsController';
import { shallow } from 'enzyme';
import notifications from '../../utilities/notifications';

console.error = () => {};

jest.mock('../../utilities/log', () => {
    return {
        add: function() {},
        eventTypes: {}
    }
});

jest.mock('../../utilities/notifications', () => {
    return {
        add: jest.fn(() => {}),
        remove: () => {}
    }
});

jest.mock('../../utilities/api-clients/collections', () => {
    return {
        getAll: () => {
            return Promise.resolve(mockAllCollections);
        },
        deletePage: () => {
            return Promise.resolve();
        },
        approve: jest.fn().mockImplementationOnce(() => {
            return Promise.reject({status: 500});
        }).mockImplementation(() => {
            return Promise.resolve()
        }),
        delete: jest.fn().mockImplementationOnce(() => {
            return Promise.reject({status: 500})
        }).mockImplementation(() => {
            return Promise.resolve()
        }),
        get: () => {
            return Promise.reject({status: 404});
        }
    }
});

const mockAllCollections = [
    {
        "approvalStatus": "NOT_STARTED",
        "publishComplete": false,
        "isEncrypted": false,
        "collectionOwner": "hello",
        "timeseriesImportFiles": [],
        "id": "anothercollection-91bc818cff240fa546c84b0cc4c3d32f0667de3068832485e254c17655d5b4ad",
        "name": "Another collection",
        "type": "manual",
        "teams": []
    },
    {
        "approvalStatus": "IN_PROGRESS",
        "publishComplete": false,
        "isEncrypted": false,
        "collectionOwner": "PUBLISHING_SUPPORT",
        "timeseriesImportFiles": [],
        "id": "asdasdasd-04917444856fa9ade290b8847dee1f24e7726d71e1a7378c2557d949b6a6968c",
        "name": "asdasdasd",
        "type": "manual",
        "teams": []
    },
    {
        "approvalStatus": "IN_PROGRESS",
        "publishComplete": false,
        "isEncrypted": false,
        "collectionOwner": "PUBLISHING_SUPPORT",
        "timeseriesImportFiles": [],
        "id": "test-collection-12345",
        "name": "Test collection",
        "type": "manual",
        "teams": ['cpi', 'cpih']
    },
    {
        "approvalStatus": "ERROR",
        "publishComplete": false,
        "isEncrypted": false,
        "collectionOwner": "PUBLISHING_SUPPORT",
        "timeseriesImportFiles": [ ],
        "id": "different-collection-12345",
        "name": "Test",
        "type": "manual",
        "teams": [
            "Team 2"
        ]
    },
    {
        "approvalStatus": "COMPLETE",
        "publishComplete": false,
        "isEncrypted": false,
        "collectionOwner": "PUBLISHING_SUPPORT",
        "timeseriesImportFiles": [ ],
        "id": "test-sau39393uyqha8aw8y3n3",
        "name": "Complete collection",
        "type": "manual",
        "teams": [
            "Team 2"
        ]
    }
];

const collection = {
    id: 'test-collection-12345',
    name: 'Test collection',
    type: 'manual',
    teams: ['cpi', 'cpih'],
    inProgress: [
        {
            uri: "/",
            type: "homepage",
            description: {
                title: "Home"
            },
            events: [
                {
                    email: "foobar@email.com",
                    date: "2017-12-14T11:36:03.402Z"
                }
            ]
        },
        {
            uri: "/economy/inflationsandprices/consumerinflation/bulletins/consumerpriceinflation/july2017",
            type: "bulletin",
            description: {
                title: "Consumer Price Inflation",
                edition: "July 2017"
            },
            events: [
                {
                    email: "foobar@email.com",
                    date: "2017-12-14T11:36:03.402Z"
                }
            ]
        }
    ],
    complete: [
        {
            uri: "/businessindustryandtrade",
            type: "taxonomy_landing_page",
            description: {
                title: "Business industry and trade"
            },
            events: [
                {
                    email: "foobar@email.com",
                    date: "2017-12-14T11:36:03.402Z"
                },
                {
                    email: "foobar@email.com",
                    date: "2017-12-10T10:21:43.402Z"
                }
            ]
        }
    ],
    reviewed: [],
    deletes: [{
        user: "foobar@email.com",
        root: {
            uri: "/about/surveys",
            type: "generic_static_page",
            description: {
                title: "Surveys"
            },
            children: [],
            deleteMarker: true,
            contentPath: "/about/surveys"
        },
        totalDeletes: 1
    }],
    datasets: [],
    datasetVersion: []
}

describe("Potentially some tests still?", () => {
    it("*shrug*")
});