import React from "react";
import { EditHomepageController } from "./EditHomepageController";
import { shallow } from "enzyme";
import homepage from "../../../utilities/api-clients/homepage";
import collections from "../../../utilities/api-clients/collections";

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
        }
    ],
    serviceMessage: "This is a default service message for mock testing"
};

const mockCollectionData = {
    eventsByUri: {
        "/data.json": [
            {
                type: "EDITED",
                email: "test@email.com"
            }
        ]
    }
};

jest.mock("../../../utilities/api-clients/homepage", () => {
    return {
        get: jest.fn(() => {
            return Promise.resolve(mockAPIResponse);
        })
    };
});

jest.mock("../../../utilities/api-clients/collections", () => {
    return {
        get: jest.fn(() => {
            return Promise.resolve(mockAPIResponse);
        }),
        savePageContent: jest.fn(() => {
            return Promise.resolve(true);
        }),
        setContentStatusToComplete: jest.fn(() => {
            return Promise.resolve(true);
        }),
        setPageContentAsReviewed: jest.fn(() => {
            return Promise.resolve(true);
        }),
        getContentCollectionDetails: jest.fn(() => {
            return Promise.resolve(mockCollectionData);
        })
    };
});

let dispatchedActions = [];

const defaultProps = {
    dispatch: event => {
        dispatchedActions.push(event);
    },
    params: {
        collectionID: "12345",
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
    dispatchedActions = [];
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
        expect(wrapper.state("homepageData").featuredContent.length).toBe(3);
    });
    it("maps the additional fields to the state", () => {
        const firstEntryOffeaturedContent = wrapper.state("homepageData").featuredContent[0];
        expect(firstEntryOffeaturedContent.simpleListHeading).toBe("Weekly deaths");
        expect(firstEntryOffeaturedContent.simpleListDescription).toBe(
            "The most up-to-date provisional figures for deaths involving the coronavirus (COVID-19) in England and Wales."
        );
    });
});

describe("managing data loading states", () => {
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

describe("editable list handlers", () => {
    it("calls dispatch with the correct route when handleSimpleEditableListAdd is called", () => {
        wrapper.instance().handleSimpleEditableListAdd("featuredContent");
        expect(dispatchedActions[0].type).toBe("@@router/CALL_HISTORY_METHOD");
        expect(dispatchedActions[0].payload.method).toBe("push");
        expect(dispatchedActions[0].payload.args[0]).toBe("florence/collections/12345/homepage/edit/featuredContent/3");
    });

    it("calls dispatch with the correct route when handleSimpleEditableListEdit is called", () => {
        const editedField = {
            id: 1,
            title: "Title",
            description: "Description",
            uri: "/"
        };
        wrapper.instance().handleSimpleEditableListEdit(editedField, "featuredContent");
        expect(dispatchedActions[0].type).toBe("@@router/CALL_HISTORY_METHOD");
        expect(dispatchedActions[0].payload.method).toBe("push");
        expect(dispatchedActions[0].payload.args[0]).toBe("florence/collections/12345/homepage/edit/featuredContent/1");
    });

    it("calls dispatch with the correct route when handleSimpleEditableListCancel is called", () => {
        wrapper.instance().handleSimpleEditableListEditCancel();
        expect(dispatchedActions[0].type).toBe("@@router/CALL_HISTORY_METHOD");
        expect(dispatchedActions[0].payload.method).toBe("push");
        expect(dispatchedActions[0].payload.args[0]).toBe("");
    });

    it("removes featuredContent element with ID of 0 when handleSimpleEditableListDelete is called", () => {
        const deletedField = {
            id: 0
        };
        wrapper.instance().handleSimpleEditableListDelete(deletedField, "featuredContent");
        expect(wrapper.state("homepageData").featuredContent.length).toBe(2);
    });

    it("adds a new element into featuredContent when handleSimpleEditableListEditSuccess is called without an ID present", async () => {
        const newField = {
            title: "Title 2",
            description: "Description 5",
            uri: "/"
        };
        await wrapper.instance().handleSimpleEditableListEditSuccess(newField, "featuredContent");
        expect(wrapper.state("homepageData").featuredContent.length).toBe(3);
    });

    it("updates the element in featuredContent when handleSimpleEditableListEditSuccess is called with an ID present", async () => {
        const updatedfield = {
            id: 0,
            title: "New Title",
            description: "New Description",
            uri: "/new-uri"
        };
        await wrapper.instance().handleSimpleEditableListEditSuccess(updatedfield, "featuredContent");
        expect(wrapper.state("homepageData").featuredContent[0].title).toBe("New Title");
        expect(wrapper.state("homepageData").featuredContent[0].description).toBe("New Description");
        expect(wrapper.state("homepageData").featuredContent[0].uri).toBe("/new-uri");
    });
});

describe("submit handlers", () => {
    it("calls the savePageContent method when changes have been made", async () => {
        const updatedfield = {
            id: 0,
            title: "New Title",
            description: "New Description",
            uri: "/new-uri"
        };
        await wrapper.instance().handleSimpleEditableListEditSuccess(updatedfield, "featuredContent");
        await wrapper.instance().handleSaveAndPreview();
        expect(wrapper.state("isSaving")).toBe(true);
        expect(wrapper.state("hasChangesMade")).toBe(true);
        expect(collections.savePageContent.mock.calls.length).toBe(1);
    });
    it("calls the setContentStatusToComplete method", async () => {
        await wrapper.instance().handleSubmitForReview();
        expect(wrapper.state("isSaving")).toBe(true);
        expect(wrapper.state("hasChangesMade")).toBe(false);
        expect(collections.setContentStatusToComplete.mock.calls.length).toBe(1);
    });
    it("calls the setPageContentAsReviewed method", async () => {
        await wrapper.instance().handleMarkAsReviewed();
        expect(wrapper.state("isSaving")).toBe(false);
        expect(wrapper.state("hasChangesMade")).toBe(false);
        expect(collections.setPageContentAsReviewed.mock.calls.length).toBe(1);
    });
});
