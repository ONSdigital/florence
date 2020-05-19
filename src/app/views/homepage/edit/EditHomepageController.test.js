import React from "react";
import EditHomepageController from "./EditHomepageController";
import { shallow } from "enzyme";

const mockAPIResponse = {
    highlightedContent: [
        {
            title: "Weekly deaths",
            description: "The most up-to-date provisional figures for deaths involving the coronavirus (COVID-19) in England and Wales.",
            uri: "/",
            image: null
        },
        {
            title: "Coronavirus - faster indicators",
            description: "The latest data and experimental indicators on the UK economy and society.",
            uri: "/",
            image: null
        },
        {
            title: "Coronavirus roundup",
            description: "Our summary of the latest data and analysis related to the coronavirus pandemic.",
            uri: "/",
            image: null
        },
        {
            title: "ONS blogs",
            description: "Find out more about the work ONS is doing to respond to the challenge of the pandemic.",
            uri: "/",
            image: null
        }
    ],
    serviceMessage: "This is a default service message for mock testing"
};

let dispatchedActions = [];

const defaultProps = {
    dispatch: event => {
        dispatchedActions.push(event);
    },
    params: {
        homepageDataField: "",
        homepageDataFieldID: ""
    },
    rootPath: "/florence",
    location: {
        pathname: "florence/collections/12345/homepage"
    }
};

let wrapper;
beforeEach(() => {
    wrapper = shallow(<EditHomepageController {...defaultProps} />);
});

describe("mapping data fetched from API to component state", () => {
    it("maps the mock response to the state", () => {
        const highlightedContent = wrapper.state("homepageData").highlightedContent;
        expect(highlightedContent.length).toBe(4);
    });
    it("maps the additional fields to the state", () => {
        const firstEntryOfHighlightedContent = wrapper.state("homepageData").highlightedContent[0];
        expect(firstEntryOfHighlightedContent.simpleListHeading).toBe("Weekly deaths");
        expect(firstEntryOfHighlightedContent.simpleListDescription).toBe(
            "The most up-to-date provisional figures for deaths involving the coronavirus (COVID-19) in England and Wales."
        );
    });
});
