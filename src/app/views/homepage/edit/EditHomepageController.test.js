import React from "react";
import EditHomepageController from "./EditHomepageController";
import { shallow } from "enzyme";
import homepage from "../../../utilities/api-clients/homepage";

const mockAPIResponse = {
    featuredContent: [
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

jest.mock("../../../utilities/api-clients/homepage", () => {
    return {
        get: jest.fn(() => {
            return Promise.resolve(mockAPIResponse);
        })
    };
});

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

describe("On mount of the edit homepage controller", () => {
    it("fetches homepage content", () => {
        const getHomepageContentCalls = homepage.get.mock.calls.length;
        wrapper.instance().componentWillMount();
        expect(homepage.get.mock.calls.length).toBe(getHomepageContentCalls + 1);
    });
});

describe("mapping data fetched from API to component state", () => {
    it("maps the mock response to the state", () => {
        const featuredContent = wrapper.state("homepageData").featuredContent;
        expect(featuredContent.length).toBe(4);
    });
    it("maps the additional fields to the state", () => {
        const firstEntryOffeaturedContent = wrapper.state("homepageData").featuredContent[0];
        expect(firstEntryOffeaturedContent.simpleListHeading).toBe("Weekly deaths");
        expect(firstEntryOffeaturedContent.simpleListDescription).toBe(
            "The most up-to-date provisional figures for deaths involving the coronavirus (COVID-19) in England and Wales."
        );
    });
});

describe("fetching data states", () => {
    it("updates isGettingHomepageData state to show it's fetching data for all datasets", () => {
        wrapper.instance().getHomepageData();
        expect(wrapper.state("isGettingHomepageData")).toBe(true);
    });
    it("updates isGettingHomepageData state correctly on failure to fetch homepage data", async () => {
        homepage.get.mockImplementationOnce(() => Promise.reject({ status: 500 }));
        await wrapper.instance().getHomepageData();
        expect(wrapper.state("isGettingHomepageData")).toBe(false);
    });
});
