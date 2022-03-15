import React from "react";
import { CreateContent } from "./CreateContent";
import { mount } from "enzyme";
import url from "../../utilities/url";

console.error = () => {};

jest.mock("../../utilities/url", () => {
    return {
        resolve: function () {},
    };
});

const contentTypes = [
    {
        title: "Bulletin",
        id: "content-type-1",
        url: url.resolve("../") + "/bulletins",
    },
    {
        title: "Dataset",
        id: "dataset-cmd",
        url: url.resolve("../") + "/datasets",
    },
    {
        title: "Static content",
        id: "static-content",
        url: url.resolve("../") + "/static",
    },
];

const defaultProps = {
    dispatch: event => {
        dispatchedActions.push(event);
    },
    rootPath: "/florence",
    params: {
        collectionID: "test-collection",
    },
    location: {
        pathname: "florence/collections/12345/datasets",
    },
};

const mountComponent = () => {
    return mount(<CreateContent {...defaultProps} />);
};

let component;

beforeEach(() => {
    component = mountComponent();
});

it("handle search returns correct results", () => {
    component.setState({ contentTypes });
    component.instance().handleSearchInput({ target: { value: "bulletin" } });
    expect(component.state().filteredContentTypes[0]).toBe(contentTypes[0]);
    component.instance().handleSearchInput({ target: { value: "cmd" } });
    expect(component.state().filteredContentTypes[0]).toBe(contentTypes[1]);
});
