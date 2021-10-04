import React from "react";
import { CreateCantabularDatasetController } from "./CreateCantabularDatasetController";
import { shallow, mount } from "enzyme";
import datasets from "../../../utilities/api-clients/datasets";

console.error = () => {};

jest.mock("../../../utilities/notifications", () => {
    return {
        add: jest.fn(notification => {
            mockNotifications.push(notification);
        }),
        remove: () => {}
    };
});

jest.mock("../../../utilities/api-clients/datasets", () => {
    return {
        create: jest.fn(() => {
            return Promise.resolve();
        })
    };
});

let mockNotifications = [];
let dispatchedActions = [];

const defaultProps = {
    dispatch: event => {
        dispatchedActions.push(event);
    },
    location: {
        pathname: "florence/collections/12345/datasets/create"
    },
    params: {
        datasetID: "test-id",
        format: "test_format"
    }
};

const component = shallow(<CreateCantabularDatasetController {...defaultProps} />);

beforeEach(() => {
    mockNotifications = [];
    dispatchedActions = [];
});

test("makeCreateDatasetPostBody returns correct model", () => {
    component.setState({ format: "test_format" });
    const postBody = component.instance().makeCreateDatasetPostBody();
    expect(postBody).toMatchObject({
        type: "test_format"
    });
});

describe("Calling handleCreateClick", () => {
    const mockEvent = { preventDefault: () => {} };

    it("updates isPosting state to show post of new dataset", () => {
        expect(component.state("isPosting")).toBe(false);

        // Tests that state is set correctly before asynchronous requests have finished
        component.instance().handleCreateClick(mockEvent);
        expect(component.state("isPosting")).toBe(true);
    });

    describe("on success", () => {
        it("displays notification", async () => {
            await component.instance().handleCreateClick(mockEvent);
            expect(mockNotifications.length).toBe(1);
        });

        it("routes back to list of datasets page", async () => {
            await component.instance().handleCreateClick(mockEvent);
            expect(dispatchedActions[0].type).toBe("@@router/CALL_HISTORY_METHOD");
        });

        it("updates isPosting state to show it has created dataset", async () => {
            // Tests that state is set correctly after asynchronous requests were successful
            await component.instance().handleCreateClick(mockEvent);
            expect(component.state("isPosting")).toBe(false);
        });
    });
    describe("on failure", () => {
        it("shows notification", async () => {
            datasets.create.mockImplementationOnce(() => Promise.reject({ status: 404 }));
            await component.instance().handleCreateClick(mockEvent);
            expect(mockNotifications.length).toBe(1);
            expect(component.state("isPosting")).toBe(false);
        });
    });
});
