import React from "react";
import { CreateContent } from "./CreateContent";
import { mount } from "enzyme";
import url from "../../utilities/url";
import { render, screen, WrapperComponent } from "../../utilities/tests/test-utils";

let dispatchedActions = [];
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
];

const defaultProps = {
    dispatch: event => {
        dispatchedActions.push(event);
    },
    rootPath: "/florence",
    match: {
        params: {
            collectionID: "test-collection",
        },
    },
    location: {
        pathname: "florence/collections/12345/datasets",
    },
};

const mountComponent = () => {
    return mount(
        <WrapperComponent>
            <CreateContent {...defaultProps} />
        </WrapperComponent>
    );
};

let component;

beforeEach(() => {
    component = mountComponent();
});

it("handle search returns correct results", () => {
    const createContent = component.find(CreateContent);
    createContent.setState({ contentTypes });
    createContent.instance().handleSearchInput({ target: { value: "dataset" } });
    expect(createContent.state().filteredContentTypes[0]).toBe(contentTypes[1]);
    createContent.instance().handleSearchInput({ target: { value: "homepage" } });
    expect(createContent.state().filteredContentTypes[0]).toBe(contentTypes[2]);
});

it("shows enabled modules", () => {
    render(
        <WrapperComponent>
            <CreateContent {...defaultProps} />
        </WrapperComponent>
    );
    expect(screen.getByText("Old workspace")).toBeInTheDocument();
    expect(screen.getByText("Filterable dataset")).toBeInTheDocument();
    expect(screen.getByText("Homepage")).toBeInTheDocument();
});
