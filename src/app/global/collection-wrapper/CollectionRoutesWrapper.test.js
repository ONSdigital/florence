import React from "react";
import { CollectionRoutesWrapper } from "./CollectionRoutesWrapper";
import { shallow } from "enzyme";

import log from "../../utilities/logging/log";
import collections from "../../utilities/api-clients/collections";

console.error = () => {};

jest.mock("../../utilities/logging/log", () => {
    return {
        event: jest.fn(() => {}),
        data: jest.fn(() => {}),
        error: jest.fn(() => {})
    };
});

jest.mock("../../utilities/notifications", () => {
    return {
        add: jest.fn(event => {
            mockedNotifications.push(event);
        })
    };
});

jest.mock("../../utilities/api-clients/collections", () => ({
    get: jest.fn(() => {
        return Promise.resolve(mockedCollection);
    })
}));

const mockedCollection = {
    id: "test-collection-1",
    name: "Test Collection"
};

let dispatchedActions,
    mockedNotifications = [];

const defaultProps = {
    dispatch: event => {
        dispatchedActions.push(event);
    },
    rootPath: "/florence",
    params: {
        collectionID: "test-collection-1"
    },
    location: {
        pathname: "/florence/test-collection-1/"
    }
};

const component = shallow(<CollectionRoutesWrapper {...defaultProps} />);

describe("Calling getCollectionDetails", () => {
    beforeEach(() => {
        dispatchedActions = [];
        mockedNotifications = [];
    });

    it("on success, it dispatches 'working on' state to redux", async () => {
        await component.instance().getCollectionDetails(mockedCollection.id);
        expect(dispatchedActions[0].type).toBe("UPDATE_WORKING_ON");
        expect(dispatchedActions[0].workingOn.id).toBe(mockedCollection.id);
        expect(dispatchedActions[0].workingOn.name).toBe(mockedCollection.name);
        expect(dispatchedActions[0].workingOn.url).toBe("/florence/collections/" + mockedCollection.id);
        expect(dispatchedActions[0].workingOn.collection).toMatchObject(mockedCollection);
    });

    it("on 404 error, redirects to collections page", async () => {
        collections.get.mockImplementationOnce(() => Promise.reject({ status: 404 }));
        await component.instance().getCollectionDetails(mockedCollection.id);
        expect(dispatchedActions[0].type).toBe("@@router/CALL_HISTORY_METHOD");
        expect(dispatchedActions[0].payload.method).toBe("replace");
        expect(dispatchedActions[0].payload.args[0]).toBe("/florence/collections");
        expect(mockedNotifications.length).toBe(1);
    });

    it("on 403 error, redirects to collections page", async () => {
        collections.get.mockImplementationOnce(() => Promise.reject({ status: 403 }));
        await component.instance().getCollectionDetails(mockedCollection.id);
        expect(dispatchedActions[0].type).toBe("@@router/CALL_HISTORY_METHOD");
        expect(dispatchedActions[0].payload.method).toBe("replace");
        expect(dispatchedActions[0].payload.args[0]).toBe("/florence/collections");
        expect(mockedNotifications.length).toBe(1);
    });

    it("on error, shows notification", async () => {
        collections.get.mockImplementationOnce(() => Promise.reject({ status: 500 }));
        await component.instance().getCollectionDetails(mockedCollection.id);
        expect(mockedNotifications.length).toBe(1);
    });
});

describe("Mapping collection to working on state", () => {
    beforeEach(() => {
        log.event.mockClear();
        log.data.mockClear();
        log.error.mockClear();
    });

    it("returns the correct object on success", () => {
        const mappedObject = component.instance().mapCollectionResponseToWorkingOnState(mockedCollection);
        expect(mappedObject).toMatchObject({
            id: "test-collection-1",
            name: "Test Collection",
            url: "/florence/collections/test-collection-1",
            error: false
        });
    });

    it("returns the correct object on error", () => {
        const mappedObject = component.instance().mapCollectionResponseToWorkingOnState();
        expect(mappedObject).toMatchObject({
            error: true
        });
    });

    it("logs on error", () => {
        component.instance().mapCollectionResponseToWorkingOnState();
        expect(log.event.mock.calls.length).toBe(2);
        expect(log.data.mock.calls.length).toBe(1);
        expect(log.error.mock.calls.length).toBe(1);
    });
});
