import React from "react";
import { VersionMetadata } from "./VersionMetadata.jsx";
import notifications from "../../../utilities/notifications";
import datasets from "../../../utilities/api-clients/datasets";
import uuid from "uuid/v4";
import renderer from "react-test-renderer";
import { shallow, mount } from "enzyme";

console.error = jest.fn();
console.warn = jest.fn();

jest.mock("uuid/v4", () => () => {
    return "12345";
});

jest.mock("../../../utilities/url", () => {
    return {
        resolve: function() {
            return "test";
        },
        parent: function() {}
    };
});

jest.mock("../../../utilities/date", () => {
    return {
        format: function() {
            return "a formatted date";
        }
    };
});

jest.mock("../../../utilities/notifications", () => {
    return {
        add: jest.fn(() => {
            //
        })
    };
});

jest.mock("../../../utilities/http", () => {
    return {
        resolve: function() {
            //
        }
    };
});

jest.mock("../../../utilities/log", () => {
    return {
        add: function() {
            //
        },
        eventTypes: {}
    };
});

jest.mock("../../../utilities/api-clients/recipes", () => ({
    getAll: jest.fn(() => {
        return Promise.resolve({
            items: []
        });
    })
}));

jest.mock("../../../utilities/api-clients/datasets", () => ({
    get: jest.fn(() => {
        return Promise.resolve({
            next: {}
        });
    }),
    getVersion: jest.fn(() => {
        return Promise.resolve({});
    }),
    getInstance: jest.fn(() => {
        return Promise.resolve({});
    })
}));

const mockEvent = {
    preventDefault: function() {}
};

const exampleDataset = {
    current: {
        collection_id: "fddffdfdaadf-e8ad17766a81bf589e76ef57d854945fdf0bfe546000228837aa70701506869c",
        id: "931a8a2a-0dc8-42b6-a884-7b6054ed3b68",
        license: "Open Government License",
        links: {
            editions: {
                href: "http://localhost:22000/datasets/931a8a2a-0dc8-42b6-a884-7b6054ed3b68/editions"
            },
            latest_version: {
                id: "efcc4581-30b1-463b-b85b-2e2d85c4918b",
                href: "http://localhost:22000/datasets/931a8a2a-0dc8-42b6-a884-7b6054ed3b68/editions/2016/versions/1"
            },
            self: {
                href: "http://localhost:22000/datasets/931a8a2a-0dc8-42b6-a884-7b6054ed3b68"
            }
        },
        next_release: "pudding",
        keywords: ["keyword1", "keyword2"],
        publisher: {},
        contacts: [
            {
                email: "test@email.com",
                name: "foo bar",
                telephone: "01633 123456"
            }
        ],
        release_frequency: "Monthly",
        state: "published",
        title: "CPI",
        uri: "/economy/inflationandpricesindices/datasets/consumerpriceindices"
    }
};

const exampleInstance = {
    id: "b5655290-0414-4f94-a773-fdc14652d868",
    dimensions: [
        {
            description: "sdsds",
            href: "http://localhost:22400/code-lists/64d384f1-ea3b-445c-8fb8-aa453f96e58a",
            id: "64d384f1-ea3b-445c-8fb8-aa453f96e58a",
            name: "time",
            label: ""
        },
        {
            description: "dsdsdsd",
            href: "http://localhost:22400/code-lists/65107A9F-7DA3-4B41-A410-6F6D9FBD68C3",
            id: "65107A9F-7DA3-4B41-A410-6F6D9FBD68C3",
            name: "geography",
            label: ""
        },
        {
            description: "dssdsds",
            href: "http://localhost:22400/code-lists/e44de4c4-d39e-4e2f-942b-3ca10584d078",
            id: "e44de4c4-d39e-4e2f-942b-3ca10584d078",
            name: "aggregate",
            label: ""
        }
    ],
    state: "associated",
    edition: "time-series",
    alerts: [
        {
            date: "21/10/2018",
            description: "This an alert",
            type: "correction"
        }
    ],
    latest_changes: [
        {
            description: "Big change!",
            name: "Test change",
            type: "summary of changes"
        }
    ],
    version: 1,
    collection_id: "acceptancetestcollection-e329dda6d14eb3a280eb8536230ebdc1ee48751bccc4df87ee12059bcceae0e8"
};

const defaultProps = {
    dispatch: function() {},
    dataset: { ...exampleDataset.current },
    instance: { ...exampleInstance },
    version: { ...exampleInstance },
    recipes: [
        {
            output_instances: [
                {
                    editions: ["time-series", "another-type"],
                    dataset_id: "931a8a2a-0dc8-42b6-a884-7b6054ed3b68"
                }
            ]
        }
    ],
    params: {
        datasetID: "931a8a2a-0dc8-42b6-a884-7b6054ed3b68",
        version: "1",
        edition: "time-series"
    },
    location: {
        query: { collection: "a-collection-id" }
    },
    router: {
        listenBefore: () => {}
    }
};

test("Dataset version metadata page matches stored snapshot", () => {
    const component = renderer.create(<VersionMetadata {...defaultProps} />);
    expect(component.toJSON()).toMatchSnapshot();
});

test("Dataset title updates after successful fetch from dataset API on mount", async () => {
    const component = shallow(<VersionMetadata {...defaultProps} />);

    datasets.get.mockImplementationOnce(() => Promise.resolve({ current: exampleDataset.current }));

    await component.instance().componentWillMount();
    await component.update(); // update() appears to be async so we need to wait for it to finish before asserting
    expect(component.state("title")).toBe("CPI");
});

test("Correct modal type shows when user wants to add an alert", async () => {
    const component = shallow(<VersionMetadata {...defaultProps} />);
    expect(component.state("modalType")).toBe("");
    await component.instance().handleAddRelatedClick("alerts");
    expect(component.state("modalType")).toBe("alerts");
});

test("Handler for removing a summary of changes updates state correctly", async () => {
    const component = shallow(<VersionMetadata {...defaultProps} />);

    await component.instance().componentWillMount();
    await component.update();
    expect(component.state("alerts").length).toEqual(1);
    expect(component.state("alerts")[0]).toMatchObject({
        key: "12345",
        date: exampleInstance.alerts[0].date,
        description: exampleInstance.alerts[0].description,
        type: exampleInstance.alerts[0].type
    });
    await component.instance().handleDeleteRelatedClick("alerts", "12345");
    await component.update();
    expect(component.state("alerts").length).toBe(0);
});

test("Latest changes are set in state correctly on mount", async () => {
    const component = shallow(<VersionMetadata {...defaultProps} />);

    await component.instance().componentWillMount();
    await component.update();
    expect(component.state("changes").length).toEqual(1);
    component.state("changes").forEach((change, index) => {
        expect(change).toMatchObject({
            key: "12345",
            name: exampleInstance.latest_changes[0].name,
            description: exampleInstance.latest_changes[0].description,
            type: exampleInstance.latest_changes[0].type
        });
    });
});

test("Available editions maps correctly to select element", async () => {
    const component = shallow(<VersionMetadata {...defaultProps} />);

    const validSelectContents = [
        { id: "time-series", name: "time-series" },
        { id: "another-type", name: "another-type" }
    ];
    await component.instance().componentWillMount();
    await component.update();
    const createdSelectContents = component.instance().mapEditionsToSelectOptions();
    expect(createdSelectContents).toEqual(expect.arrayContaining(validSelectContents));
});

test("Handle select change event updates state correctly", async () => {
    const component = shallow(<VersionMetadata {...defaultProps} />);

    await component.instance().componentWillMount();
    await component.update();
    expect(component.state("edition")).toBe("time-series");
    component.instance().handleSelectChange({ preventDefault: () => {}, target: { id: "edition", value: "another-type" } });
    expect(component.update().state("edition")).toBe("another-type");
});

test("Changing an input value updates the state to show a change has been made", async () => {
    const component = await shallow(<VersionMetadata {...defaultProps} />);

    await component.update();
    expect(component.state("hasChanges")).toBe(false);
    component.instance().handleSelectChange({ preventDefault: () => {}, target: { id: "edition", value: "another-type" } });
    expect(component.state("edition")).toBe("another-type");
    expect(component.state("hasChanges")).toBe(true);
});

test("Warning modal shown when unsaved changes have been made", async () => {
    const component = await shallow(<VersionMetadata {...defaultProps} />);

    await component.update();
    expect(component.find(".modal__header h2").exists()).toBe(false);
    expect(component.state("showModal")).toBe(false);
    component.instance().handleSelectChange({ preventDefault: () => {}, target: { id: "edition", value: "another-type" } });
    component.instance().handleBackButton();
    expect(component.state("showModal")).toBe(true);
    expect(component.state("modalType")).toBe("");
    expect(component.find(".modal__header h2").exists()).toBe(true);
});

test("Input errors are added on submit and then removed on change of that input", () => {
    const component = shallow(<VersionMetadata {...defaultProps} />);
    const mockTitleEvent = {
        target: {
            value: "Some free text",
            name: "add-related-content-title"
        }
    };
    const mockDescEvent = {
        target: {
            value: "Some description",
            name: "add-related-content-desc"
        }
    };

    expect(component.state("titleInput")).toBe("");
    expect(component.state("descInput")).toBe("");
    expect(component.update().state("titleError")).toBe(undefined);
    expect(component.update().state("descError")).toBe(undefined);

    component.instance().handleRelatedContentSubmit({ preventDefault: () => {} });
    expect(component.update().state("titleError")).not.toBe("");
    expect(component.update().state("descError")).not.toBe("");

    component.instance().handleInputChange(mockTitleEvent);
    expect(component.state("titleInput")).toBe(mockTitleEvent.target.value);
    expect(component.update().state("titleError")).toBe(null);

    component.instance().handleInputChange(mockDescEvent);
    expect(component.state("descInput")).toBe(mockDescEvent.target.value);
    expect(component.update().state("descError")).toBe(null);
});

test("Handler to edit an alert updates the state with new values", async () => {
    const component = await shallow(<VersionMetadata {...defaultProps} />);
    await component.update();

    expect(component.state("alerts").length).toBe(1);
    const initialAlerts = component.state("alerts");
    component.setState({ titleInput: "Some new words" });
    component.instance().editRelatedLink("alerts", "12345");
    expect(component.state("alerts").length).toBe(1);
    const editedAlerts = component.update().state("alerts");
    expect(editedAlerts[0].date).toBe("Some new words");
});

test("Handle for editing an opens modal with existing values", async () => {
    const component = await shallow(<VersionMetadata {...defaultProps} />);
    await component.update();

    component.instance().handleEditRelatedClick("alerts", "12345");
    expect(component.state("showModal")).toBe(true);
    expect(component.state("modalType")).toBe("alerts");
    expect(component.state("descInput")).toBe(exampleInstance.alerts[0].description);
    expect(component.state("titleInput")).toBe(exampleInstance.alerts[0].date);
});

test("Alert items map to card element correctly", async () => {
    const component = await shallow(<VersionMetadata {...defaultProps} />);
    await component.update();

    const cardProps = component.instance().mapTypeContentsToCard(component.state("alerts"), "alerts");
    component.state("alerts").forEach((alert, index) => {
        expect(cardProps[index]).toMatchObject({
            title: "a formatted date",
            id: alert.key
        });
    });
});

test("Dimensions map correctly to input elements", async () => {
    const component = await shallow(<VersionMetadata {...defaultProps} />);
    await component.instance().componentWillMount();
    const dimensions = component.instance().mapDimensionsToInputs(component.state("dimensions"));
    let dimensionNames = [];
    dimensions.forEach((dimension, index) => {
        dimensionNames.push({ id: dimension.key });
    });

    component.state("dimensions").forEach((dimension, index) => {
        expect(dimensionNames[index]).toMatchObject({
            id: dimension.id
        });
    });
});

test("Changing the dimension title value updates the dimension label in state", async () => {
    const component = await shallow(<VersionMetadata {...defaultProps} />);
    await component.instance().componentWillMount();
    const mockLabelEvent = {
        target: {
            value: "New label",
            name: "dimension-name",
            id: "time"
        }
    };
    const dimensions = component.instance().mapDimensionsToInputs(component.state("dimensions"));
    expect(component.state("dimensions")[0].label).toBe("");
    component.instance().handleInputChange(mockLabelEvent);
    expect(component.state("dimensions")[0].label).toBe(mockLabelEvent.target.value);
});

// TODO test that the saving responses are passed to the error handler in the correct order

// describe("addErrorToSummary returns correct values when"), async () => {

//     const component = await shallow(
//         <VersionMetadata {...defaultProps} />
//     );
//     await component.instance().componentWillMount();

//     it("passed a new error message", () => {
//         const testArr = ["Error message 1"];
//         const newArr = component.instance().addErrorToSummary("Error message 2", testArr)
//         expect(newArr).toEqual(expect.arrayContaining(["Error message 1", "Error message 2"]));
//     });

//     it("passed a duplicate error message", ()=> {
//         const testArr = ["Error message 1", "Error message 2"];
//         const newArr = component.instance().addErrorToSummary("Error message 2", testArr)
//         expect(newArr).toEqual(expect.arrayContaining(["Error message 1", "Error message 2"]));
//     });

// }

test("addErrorToSummary returns correct values when it is passed a new error message", async () => {
    const component = await shallow(<VersionMetadata {...defaultProps} />);
    await component.instance().componentWillMount();

    const testArr = ["Error message 1"];
    const newArr = component.instance().addErrorToSummary("Error message 2", testArr);
    expect(newArr).toEqual(expect.arrayContaining(["Error message 1", "Error message 2"]));
});

test("addErrorToSummary returns correct values when it is passed a duplicate error message", async () => {
    const component = await shallow(<VersionMetadata {...defaultProps} />);
    await component.instance().componentWillMount();

    const testArr = ["Error message 1", "Error message 2"];
    const newArr = component.instance().addErrorToSummary("Error message 2", testArr);
    expect(newArr).toEqual(expect.arrayContaining(["Error message 1", "Error message 2"]));
});

test("removeErrorFromSummary returns correct values when it is passed an existing error message", async () => {
    const component = await shallow(<VersionMetadata {...defaultProps} />);
    await component.instance().componentWillMount();

    const testArr = ["Error message 1", "Error message 2"];
    const newArr = component.instance().removeErrorFromSummary("Error message 1", testArr);
    expect(newArr).toEqual(expect.arrayContaining(["Error message 2"]));
});

test("removeErrorFromSummary returns correct values when it is passed an error that doesn't exist", async () => {
    const component = await shallow(<VersionMetadata {...defaultProps} />);
    await component.instance().componentWillMount();

    const testArr = ["Error message 1", "Error message 2"];
    const newArr = component.instance().removeErrorFromSummary("Error message 3", testArr);
    expect(newArr).toEqual(expect.arrayContaining(["Error message 1", "Error message 2"]));
});
