import React from "react";
import { shallow } from "enzyme";
import { PreviewNav } from "../preview-nav";

let dispatchedActions = [];

const defaultProps = {
    preview: {},
    workingOn: {
        id: "test-collection"
    },
    rootPath: "/florence"
};

const pages = [
    {
        uri: "/test-uri",
        type: "bulletin",
        description: {
            title: "Test title",
            edition: "Edition",
            language: "English"
        }
    },
    {
        uri: "/test-uri2",
        type: "bulletin",
        description: {
            title: "Test title 2",
            edition: ""
        }
    },
    {
        uri: "/test-uri3",
        type: "bulletin",
        description: {
            title: "",
            edition: "Edition 3"
        }
    }
];

const component = shallow(<PreviewNav {...defaultProps} />);

test("Map pages to select component", () => {
    const pagesResult = component.instance().mapPagesToSelect(pages);
    expect(pagesResult[0]).toMatchObject({ id: "/test-uri", name: "Test title: Edition" });
    expect(pagesResult[1]).toMatchObject({ id: "/test-uri2", name: "Test title 2" });
    expect(pagesResult[2]).toMatchObject({ id: "/test-uri3", name: "[no title available]: Edition 3" });
});

describe("Creating page title", () => {
    it("with title and edition", () => {
        const pageTitle = component.instance().createPageTitle(pages[0]);
        expect(pageTitle).toBe("Test title: Edition");
    });

    it("with title but not an edition", () => {
        const pageTitle = component.instance().createPageTitle(pages[1]);
        expect(pageTitle).toBe("Test title 2");
    });

    it("with edition but no title", () => {
        const pageTitle = component.instance().createPageTitle(pages[2]);
        expect(pageTitle).toBe("[no title available]: Edition 3");
    });
});

describe("Handle select", () => {
    it("does nothing when default option selected", () => {
        component.instance().handleSelectChange({ target: { value: "default-option" } });
        expect(dispatchedActions.length).toBe(0);
    });

    it("routes to selected page on page selection", () => {
        component.instance().handleSelectChange({ target: { value: "/test-uri" } });
        expect(dispatchedActions[1].type).toBe("@@router/CALL_HISTORY_METHOD");
        expect(dispatchedActions[1].payload.method).toBe("push");
        expect(dispatchedActions[1].payload.args[0]).toBe("/florence/collections/test-collection/preview?url=/test-uri");
    });
});
