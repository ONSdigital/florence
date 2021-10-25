import React from "react";
import { WorkflowPreview } from "./WorkflowPreview";
import { shallow, mount } from "enzyme";

console.error = () => {};

jest.mock("../../utilities/logging/log", () => {
    return {
        event: function () {},
    };
});

jest.mock("../../utilities/notifications", () => {
    return {
        add: jest.fn(notification => {
            mockNotifications.push(notification);
        }),
        remove: () => {},
    };
});

let dispatchedActions,
    mockNotifications = [];

const defaultProps = {
    dispatch: event => {
        dispatchedActions.push(event);
    },
    rootPath: "/florence",
    location: {
        pathname: "florence/collections/testcollection-001/test-content/preview",
    },
    params: {
        collectionID: "testcollection-001",
    },
};

const component = shallow(<WorkflowPreview {...defaultProps} />);

beforeEach(() => {
    mockNotifications = [];
});

describe("getting preview iframe url", () => {
    it("gets correct value from correctly formatted url", () => {
        const testURLs = [
            { path: "/florence/collections/collection-001/homepage/preview", expected: "/" },
            {
                path: "/florence/collections/collection-002/datasets/cpih01/editions/time-series/version/2/preview",
                expected: "/datasets/cpih01/editions/time-series/version/2",
            },
            { path: "/florence/collections/collection-003/bulletins/cpih01/preview", expected: "/bulletins/cpih01" },
            { path: "/florence/collections/collection-003/test/test/test/preview", expected: "/test/test/test" },
        ];
        testURLs.forEach(url => {
            const path = component.instance().getPreviewIframeURL(url.path);
            expect(path).toBe(url.expected);
        });
    });

    it("handles errors and displays notification", () => {
        expect(mockNotifications.length).toBe(0);
        const path = component.instance().getPreviewIframeURL("rubbish/url/to/test");
        expect(path).toBe("/");
        expect(mockNotifications.length).toBe(1);
    });
});
