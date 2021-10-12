import React from "react";
import { CreateDatasetTaxonomyController } from "./CreateDatasetTaxonomyController";
import { shallow, mount } from "enzyme";
import taxonomy from "../../../utilities/api-clients/taxonomy";
import datasets from "../../../utilities/api-clients/datasets";
import log from "../../../utilities/logging/log";

console.error = () => {};

jest.mock("../../../utilities/logging/log", () => {
    return {
        event: jest.fn(() => {}),
        error: function () {},
    };
});

jest.mock("../../../utilities/notifications", () => {
    return {
        add: jest.fn(notification => {
            mockNotifications.push(notification);
        }),
        remove: () => {},
    };
});

jest.mock("../../../utilities/api-clients/taxonomy", () => {
    return {
        getAllProductPages: jest.fn(() => {
            return Promise.resolve(mockedAllTopics);
        }),
    };
});
jest.mock("../../../utilities/api-clients/datasets", () => {
    return {
        create: jest.fn(() => {
            return Promise.resolve();
        }),
    };
});

let mockNotifications = [];
let dispatchedActions = [];

const mockedAllTopics = [
    {
        _type: "product_page",
        description: {
            title: "Activity, size and location",
        },
        uri: "/businessindustryandtrade/business/activitysizeandlocation",
    },
    {
        _type: "product_page",
        description: {
            title: "Adoption",
        },
        uri: "/peoplepopulationandcommunity/birthsdeathsandmarriages/adoption",
    },
    {
        _type: "product_page",
        description: {
            title: "Ageing",
        },
        uri: "/peoplepopulationandcommunity/birthsdeathsandmarriages/ageing",
    },
    {
        _type: "product_page",
        description: {
            title: "Balance of payments",
        },
        uri: "/economy/nationalaccounts/balanceofpayments",
    },
    {
        _type: "product_page",
        description: {
            title: "Bankruptcy/insolvency",
        },
        uri: "/businessindustryandtrade/changestobusiness/bankruptcyinsolvency",
    },
    {
        _type: "product_page",
        description: {
            title: "Business births, deaths and survival rates",
        },
        uri: "/businessindustryandtrade/changestobusiness/businessbirthsdeathsandsurvivalrates",
    },
    {
        _type: "product_page",
        description: {
            title: "Business innovation",
        },
        uri: "/businessindustryandtrade/business/businessinnovation",
    },
];

const mockedMappedState = [
    {
        id: "/businessindustryandtrade/business/activitysizeandlocation",
        value: "/businessindustryandtrade/business/activitysizeandlocation",
        label: "Activity, size and location",
    },
    {
        id: "/peoplepopulationandcommunity/birthsdeathsandmarriages/adoption",
        value: "/peoplepopulationandcommunity/birthsdeathsandmarriages/adoption",
        label: "Adoption",
    },
    {
        id: "/peoplepopulationandcommunity/birthsdeathsandmarriages/ageing",
        value: "/peoplepopulationandcommunity/birthsdeathsandmarriages/ageing",
        label: "Ageing",
    },
];

const defaultProps = {
    dispatch: event => {
        dispatchedActions.push(event);
    },
    location: {
        pathname: "florence/collections/12345/datasets/create",
    },
    params: {
        datasetID: "test-id",
    },
};

const component = shallow(<CreateDatasetTaxonomyController {...defaultProps} />);

beforeEach(() => {
    mockNotifications = [];
    dispatchedActions = [];
});

describe("mapTaxonomyTopicsToState ", () => {
    describe("on success:", () => {
        it("returns topics in correct format", () => {
            const mapped = component.instance().mapTaxonomyTopicsToState(mockedAllTopics);
            expect(mapped[0]).toMatchObject({
                id: mockedAllTopics[0].uri,
                value: mockedAllTopics[0].uri,
                label: mockedAllTopics[0].description.title,
            });
            expect(mapped[3]).toMatchObject({
                id: mockedAllTopics[3].uri,
                value: mockedAllTopics[3].uri,
                label: mockedAllTopics[3].description.title,
            });
        });
    });
    describe("on failure:", () => {
        const brokenTopicsLists = [...mockedAllTopics];
        brokenTopicsLists.push({
            _type: "product_page",
            uri: "/businessindustryandtrade/business/businessinnovation",
        });
        it("shows notification", () => {
            component.instance().mapTaxonomyTopicsToState(brokenTopicsLists);
            expect(mockNotifications.length).toBe(1);
            expect(mockNotifications[0].message).toBe("An error occurred when trying to get available taxonomy nodes. Try refreshing the page");
        });
        it("logs error", () => {
            component.instance().mapTaxonomyTopicsToState(brokenTopicsLists);
            expect(log.event).toHaveBeenCalled();
        });
    });
});

describe("Calling getTaxonomyNodes", () => {
    it("adds mapped taxonomy topics to state", () => {
        component.instance().getTaxonomyNodes();
        expect(component.state("topics")).toHaveLength(mockedAllTopics.length);
        expect(component.state("topics")[0]).toMatchObject(mockedMappedState[0]);
    });

    it("updates isFetchingTopics state to show it's fetching data for all topics", () => {
        expect(component.state("isFetchingTopics")).toBe(false);

        // Tests that state is set correctly before asynchronous requests have finished
        component.instance().getTaxonomyNodes();
        expect(component.state("isFetchingTopics")).toBe(true);
    });

    it("updates isFetchingTopics state to show it has fetched data for all topics", async () => {
        // Tests that state is set correctly after asynchronous requests were successful
        await component.instance().getTaxonomyNodes();
        expect(component.state("isFetchingTopics")).toBe(false);
    });

    it("updates isFetchingTopics state correctly on failure to fetch data for all editions", async () => {
        taxonomy.getAllProductPages.mockImplementationOnce(() => Promise.reject({ status: 500 }));
        await component.instance().getTaxonomyNodes();
        expect(component.state("isFetchingTopics")).toBe(false);
    });

    it("Errors cause notification", async () => {
        taxonomy.getAllProductPages.mockImplementationOnce(() => Promise.reject({ status: 404 }));
        await component.instance().getTaxonomyNodes();
        expect(mockNotifications.length).toBe(1);
    });
});

test("HandleSearchInput updates state with correct values", () => {
    component.setState({ recipes: mockedMappedState });
    component.instance().handleSearchInput({ target: { value: mockedMappedState[1].label } });
    expect(component.state("searchTerm")).toBe("adoption");
    expect(component.state("filteredTopics")).toMatchObject([mockedMappedState[1]]);
});

test("handleSelectedTopicChange updates state with correct value", () => {
    component.instance().handleSelectedTopicChange({ target: { value: mockedMappedState[1].uri } });
    expect(component.state("selectedTopicURL")).toBe(mockedMappedState[1].uri);
});

test("makeCreateDatasetPostBody returns correct model", () => {
    component.setState({ selectedTopicURL: "/test/dataset-id" });
    const postBody = component.instance().makeCreateDatasetPostBody();
    expect(postBody).toMatchObject({
        links: {
            taxonomy: {
                href: "/test/dataset-id",
            },
        },
    });
});

describe("Calling handleCreateClick", () => {
    const mockEvent = { preventDefault: () => {} };

    it("updates isPosting state to show post of new dataset", () => {
        expect(component.state("isPosting")).toBe(false);

        // Tests that state is set correctly before asynchronous requests have finished
        component.instance().handleCreateClick(mockEvent);
        expect(component.state("isPosting")).toBe(true);
    });

    describe("on success", () => {
        it("displays notification", async () => {
            await component.instance().handleCreateClick(mockEvent);
            expect(mockNotifications.length).toBe(1);
        });

        it("routes back to list of datasets page", async () => {
            await component.instance().handleCreateClick(mockEvent);
            expect(dispatchedActions[0].type).toBe("@@router/CALL_HISTORY_METHOD");
        });

        it("updates isPosting state to show it has created dataset", async () => {
            // Tests that state is set correctly after asynchronous requests were successful
            await component.instance().handleCreateClick(mockEvent);
            expect(component.state("isPosting")).toBe(false);
        });
    });
    describe("on failure", () => {
        it("updates isPosting state correctly", async () => {
            taxonomy.getAllProductPages.mockImplementationOnce(() => Promise.reject({ status: 500 }));
            await component.instance().handleCreateClick(mockEvent);
            expect(component.state("isPosting")).toBe(false);
        });

        it("shows notification", async () => {
            datasets.create.mockImplementationOnce(() => Promise.reject({ status: 404 }));
            await component.instance().handleCreateClick(mockEvent);
            expect(mockNotifications.length).toBe(1);
        });
    });
});
