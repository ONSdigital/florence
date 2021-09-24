import React from "react";
import { shallow } from "enzyme";
import { PreviewNav } from "../preview-nav";

let dispatchedActions = [];

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

const defaultProps = {
    preview: {
        selectedPage: null,
        collectionID: "test-collection-123",
        name: "My collection"
    },
    workingOn: {
        id: "test-collection"
    },
    rootPath: "/florence",
    updateSelected: () => {}
};

const withPagesProps = {
    ...defaultProps,
    preview: {
        ...defaultProps.preview,
        pages: pages
    },
};

describe("PreviewNav", () => {
    it("renders Select component", () => {
        const wrapper = shallow(<PreviewNav {...defaultProps} />);
        expect(wrapper.find(Select)).toBeTruthy();
    });

    it("renders Select with default option selected", () => {
        const wrapper = mount(<PreviewNav {...defaultProps} />);
        expect(wrapper.find(".select").text()).toEqual("Loading pages...");
    });

    it("generates page titles in Select options", () => {
        const wrapper = mount(<PreviewNav {...withPagesProps} />);
        const options = wrapper.find("option");

        expect(options.at(0).text()).toEqual("Select an option");
        expect(options.at(1).text()).toEqual("Test title: Edition");
        expect(options.at(2).text()).toEqual("Test title 2");
        expect(options.at(3).text()).toEqual("[no title available]: Edition 3");
    });

    it("allows to select page", () => {
        const wrapper = mount(<PreviewNav {...withPagesProps} />);
        expect(wrapper.find("select").props().value).toBe("default-option");
        wrapper.find("select").simulate("change", { target: { value: "/test-uri" } });
        expect(wrapper.find("select").props().value).toBe("/test-uri");
    });
});

// TODO: when added react-router-dom to use mock location 
// it("routes to selected page on page selection", () => {
//   component.handleSelectChange({ target: { value: "/test-uri" } });
//   expect(dispatchedActions[1].type).toBe("@@router/CALL_HISTORY_METHOD");
//   expect(dispatchedActions[1].payload.method).toBe("push");
//   expect(dispatchedActions[1].payload.args[0]).toBe("/florence/collections/test-collection/preview?url=/test-uri");
// });
// });
