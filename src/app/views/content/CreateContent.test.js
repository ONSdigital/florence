import React from "react";
import { CreateContent } from "./CreateContent";
import { mount } from "enzyme";
import url from "../../utilities/url";
import { render, screen } from "../../utilities/tests/test-utils";

console.error = () => {};

jest.mock("../../utilities/url", () => {
    return {
        resolve: function () {},
    };
});

const contentTypes = [
    {
        title: "Old workspace",
        id: "workspace",
        details: ["Create/edit content via the old workspace"],
        url: `${url.resolve("../../../")}/workspace`,
        externalLink: true,
        enabled: true,
    },
    {
        title: "Filterable dataset",
        id: "cmd-filterable-datasets",
        details: ["Create/edit datasets and/or versions for filterable (CMD) datasets"],
        url: url.resolve("../") + "/datasets",
        enabled: true,
    },
    {
        title: "Homepage",
        id: "homepage",
        url: url.resolve("../") + "/homepage",
        enabled: true,
    },
    {
        title: "Interactives",
        id: "interactives",
        url: url.resolve("../../../") + `/interactives`,
        enabled: false, // from setupJest.js
    },
]

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
    component.instance().handleSearchInput({ target: { value: "dataset" } });
    expect(component.state().filteredContentTypes[0]).toBe(contentTypes[1]);
    component.instance().handleSearchInput({ target: { value: "homepage" } });
    expect(component.state().filteredContentTypes[0]).toBe(contentTypes[2]);
});

it("shows enabled modules", () => {
    render(<CreateContent {...defaultProps} />);
    expect(screen.getByText("Old workspace")).toBeInTheDocument();
    expect(screen.getByText("Filterable dataset")).toBeInTheDocument();
    expect(screen.getByText("Homepage")).toBeInTheDocument();
    expect(screen.queryByText("Interactives")).not.toBeInTheDocument();
});
