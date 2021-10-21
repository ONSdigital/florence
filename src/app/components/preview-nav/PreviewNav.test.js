import React from "react";
import { mount } from "enzyme";
import renderer from "react-test-renderer";
import { mapStateToProps } from "../preview-nav";
import PreviewNav from "../preview-nav/PreviewNav";

const pages = [
    {
        uri: "/test-uri",
        type: "bulletin",
        description: {
            title: "Test title",
            edition: "Edition",
            language: "English",
        },
    },
    {
        uri: "/test-uri2",
        type: "bulletin",
        description: {
            title: "Test title 2",
            edition: "",
        },
    },
    {
        uri: "/test-uri3",
        type: "bulletin",
        description: {
            title: "",
            edition: "Edition 3",
        },
    },
];

const defaultProps = {
    preview: {
        selectedPage: null,
        collectionID: "test-collection-123",
        name: "My collection",
    },
    workingOn: {
        id: "test-collection",
    },
    rootPath: "/florence",
    updateSelected: () => {},
};

const withPagesProps = {
    ...defaultProps,
    preview: {
        ...defaultProps.preview,
        pages: pages,
    },
};

describe("PreviewNav", () => {
    it("should match the snapshot", async () => {
        const tree = renderer.create(<PreviewNav {...defaultProps} />);
        expect(tree).toMatchSnapshot();
    });

    it("should map state to props", () => {
        const state = {
            state: {
                preview: {},
                rootPath: "/foo",
                global: {
                    workingOn: { id: "baz" },
                },
            },
        };

        const props = {
            preview: {},
            rootPath: "/foo",
            workingOn: { id: "baz" },
        };

        const componentState = mapStateToProps(state, props);
        expect(componentState).toEqual(props);
    });

    it("renders select with default option selected", () => {
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
        expect(wrapper.find("select").props().value).toBe("/");
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
