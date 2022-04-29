import React from "react";
import { CollectionEditController, mapStateToProps } from "./CollectionEditController";
import collections from "../../../utilities/api-clients/collections";
import { shallow } from "enzyme";
import { LOAD_GROUPS_PROGRESS, LOAD_GROUPS_SUCCESS } from "../../../config/groups/constants";
import { getGroups } from "../../../config/selectors";

console.error = () => {};
console.warn = () => {};
const fail = jest.fn();
jest.mock("../../../utilities/websocket", () => {
    return {
        send: jest.fn(() => {}),
    };
});

jest.mock("../../../utilities/api-clients/teams.js", () => ({
    getAll: () =>
        Promise.resolve([
            { id: "1", name: "Team 1", members: ["member1@email.com", "member2@email.com"] },
            { id: "2", name: "Team 2", members: [] },
            { id: "3", name: "Team 3", members: ["member2@email.com"] },
        ]),
}));

jest.mock("../../../utilities/date.js", () => ({
    format: () => {
        return "formatted date"; // we're mocking date.format() so don't care that the value isn't right - that is covered in date class tests
    },
}));

jest.mock("../../../utilities/api-clients/collections.js", () => ({
    update: jest.fn(() => {
        return Promise.resolve();
    }),
}));

let dispatchedAction;

const defaultProps = {
    name: "Test collection",
    id: "test-collection-1234-abcd",
    dispatch: action => {
        dispatchedAction = action;
    },
    teams: [],
    publishType: "manual",
    isNewSignIn: false,
    isEnablePermissionsAPI: false,
    policy: null
};

const propsWithScheduleDetails = {
    ...defaultProps,
    publishType: "scheduled",
    publishDate: "2017-06-12T12:30:00.000Z",
};

const propsWithTeams = {
    ...defaultProps,
    teams: [{ id: "2", name: "Team 2" }],
};

const fetchedAllTeams = [
    { id: "1", name: "Team 1", members: ["member1@email.com", "member2@email.com"] },
    { id: "2", name: "Team 2", members: [] },
    { id: "3", name: "Team 3", members: ["member2@email.com"] },
];

const defaultComponent = shallow(<CollectionEditController {...defaultProps} />);
const scheduledComponent = shallow(<CollectionEditController {...propsWithScheduleDetails} />);
const componentWithTeams = shallow(<CollectionEditController {...propsWithTeams} />);

describe("Passing a scheduled publish type and date as props", () => {
    it("sets the publish date value", () => {
        expect(scheduledComponent.state("publishDate")).toMatchObject({
            value: "formatted date",
            errorMsg: "",
        });
    });

    it("sets the publish time value", () => {
        expect(scheduledComponent.state("publishTime")).toMatchObject({
            value: "formatted date",
            errorMsg: "",
        });
    });

    it("still renders the component even if the publish date is missing", () => {
        const propsWithNoPublishDate = {
            ...propsWithScheduleDetails,
            publishDate: "",
        };
        const componentWithNoPublishDate = shallow(<CollectionEditController {...propsWithNoPublishDate} />);

        expect(componentWithNoPublishDate.state("publishDate")).toMatchObject({
            value: "",
            errorMsg: "",
        });
        expect(componentWithNoPublishDate.state("publishDate")).toMatchObject({
            value: "",
            errorMsg: "",
        });
    });
});

describe("Editing the collection name", () => {
    it("updates the components state whenever change is made to the name", () => {
        defaultComponent.instance().handleNameChange("Edited test collection");
        expect(defaultComponent.state("name").value).toBe("Edited test collection");
    });

    it("removes the error message for the name input only", () => {
        defaultComponent.setState({
            name: {
                value: "",
                errorMsg: "An error message",
            },
            publishDate: {
                value: "",
                errorMsg: "Another error message",
            },
        });
        defaultComponent.instance().handleNameChange("Edited test collection");
        expect(defaultComponent.state("name").errorMsg).toEqual("");
        expect(defaultComponent.state("publishDate").errorMsg).toBeTruthy();
    });
});

describe("Editing the collection's associated teams", () => {
    let editingTeamsComponent;

    beforeEach(() => {
        editingTeamsComponent = shallow(<CollectionEditController {...propsWithTeams} allTeams={fetchedAllTeams} />);
    });

    it("adds a team to the state", () => {
        const addedTeam = { id: "3", name: "Team 3" };
        expect(editingTeamsComponent.prop("teams").some(team => team.id == addedTeam.id)).toEqual(false);
        expect(editingTeamsComponent.state("updatedTeamsList")).toEqual(null);
        editingTeamsComponent.instance().handleAddTeam(addedTeam.id);
        expect(editingTeamsComponent.state("updatedTeamsList").some(team => team.id == addedTeam.id)).toEqual(true);
    });

    it("disables a team option after a user has added it", () => {
        const addedTeam = { id: "3", name: "Team 3" };
        const getDisabledTeams = () => editingTeamsComponent.state("allTeams").filter(team => team.disabled);

        // First verify that the component's state is as expected
        expect(getDisabledTeams().length).toBe(0);
        expect(getDisabledTeams().some(team => team.id === addedTeam.id)).toBe(false);

        editingTeamsComponent.instance().handleAddTeam(addedTeam.id);

        expect(getDisabledTeams().length).toBe(1);
        expect(getDisabledTeams().some(team => team.id === addedTeam.id)).toBe(true);
    });

    it("remove a team from the state", () => {
        const removedTeam = { id: "2", name: "Team 2" };
        expect(editingTeamsComponent.prop("teams").some(team => team.id == removedTeam.id)).toEqual(true);
        expect(editingTeamsComponent.state("updatedTeamsList")).toBe(null);
        editingTeamsComponent.instance().handleRemoveTeam(removedTeam.id);
        expect(editingTeamsComponent.state("teams")).not.toEqual(expect.arrayContaining([removedTeam]));
        expect(editingTeamsComponent.state("updatedTeamsList")).toEqual([]);
    });

    it("enables a team option if it's not added at load", () => {
        const getEnabledTeams = () => editingTeamsComponent.state("allTeams").filter(team => !team.disabled);
        expect(editingTeamsComponent.state("allTeams").length).toBe(3);
        expect(getEnabledTeams().length).toBe(3);
    });

    it("enables a team option after a user has removed it", () => {
        const team = { id: "3", name: "Team 3" };
        const getDisabledTeams = () => editingTeamsComponent.state("allTeams").filter(team => team.disabled);

        // First verify that the component's state is as expected
        expect(getDisabledTeams().length).toBe(0);
        expect(getDisabledTeams().some(team => team.id === team.id)).toBe(false);

        editingTeamsComponent.instance().handleAddTeam(team.id);

        expect(getDisabledTeams().length).toBe(1);
        expect(getDisabledTeams().some(team => team.id === team.id)).toBe(true);

        const getEnabledTeams = () => editingTeamsComponent.state("allTeams").filter(team => !team.disabled);

        expect(getEnabledTeams().length).toBe(2);
        expect(getDisabledTeams().some(t => t.id === team.id)).toBe(true);
        expect(getEnabledTeams().some(t => t.id === team.id)).toBe(false);

        editingTeamsComponent.instance().handleRemoveTeam(team.id);
        expect(getEnabledTeams().length).toBe(3);
        expect(getDisabledTeams().some(team => team.id === team.id)).toBe(false);
        expect(getEnabledTeams().some(team => team.id === team.id)).toBe(true);
    });

    it("doesn't add the same team twice", () => {
        const addedTeam = { id: "2", name: "Team 2" };

        // Check that the team we're going to attempt to add already exists
        expect(editingTeamsComponent.state("allTeams").some(team => team.id === addedTeam.id)).toBe(true);

        editingTeamsComponent.instance().handleAddTeam(addedTeam.id);

        expect(editingTeamsComponent.state("updatedTeamsList")).toBe(null);
    });

    it("does nothing if it gets no ID for the team to add", () => {
        try {
            editingTeamsComponent.instance().handleAddTeam();
        } catch (error) {
            fail();
            console.error(error);
        }
        expect(editingTeamsComponent.state("updatedTeamsList")).toEqual(null);
    });

    it("does nothing if it doesn't recognise the ID in all teams for the team to add", () => {
        const originalTeams = editingTeamsComponent.state("teams");
        try {
            editingTeamsComponent.instance().handleAddTeam("unrecognised-id");
        } catch (error) {
            fail();
            console.error(error);
        }
        expect(editingTeamsComponent.state("teams")).toEqual(originalTeams);
    });
});

describe("Editing the collection's publish type", () => {
    it("changes the publish type in state from 'scheduled' to 'manual'", () => {
        scheduledComponent.setState({ publishType: "scheduled" });

        expect(scheduledComponent.state("publishType")).toEqual("scheduled");
        scheduledComponent.instance().handlePublishTypeChange("manual");
        expect(scheduledComponent.state("publishType")).toEqual("manual");
    });

    it("changes the publish type in state from 'manual' to 'scheduled''", () => {
        scheduledComponent.setState({ publishType: "manual" });

        expect(scheduledComponent.state("publishType")).toEqual("manual");
        scheduledComponent.instance().handlePublishTypeChange("scheduled");
        expect(scheduledComponent.state("publishType")).toEqual("scheduled");
    });

    it("doesn't alter the state if the publish type is unrecognised", () => {
        scheduledComponent.setState({ publishType: "manual" });
        scheduledComponent.instance().handlePublishTypeChange("unrecognised publish type");
        expect(scheduledComponent.state("publishType")).toEqual("manual");

        scheduledComponent.setState({ publishType: "scheduled" });
        scheduledComponent.instance().handlePublishTypeChange("unrecognised publish type");
        expect(scheduledComponent.state("publishType")).toEqual("scheduled");
    });
});

describe("Checking whether publish type has changed", () => {
    it("uses a publish type of 'scheduled' if it was 'manual' and has been changed to 'scheduled'", () => {
        defaultComponent.setProps({ publishType: "manual" });
        defaultComponent.instance().handlePublishTypeChange("scheduled");
        expect(defaultComponent.instance().mapEditsToAPIRequestBody(defaultComponent.state()).type).toEqual("scheduled");
    });

    it("uses a publish type of 'manual' if it was 'scheduled' and has been changed to 'manual'", () => {
        defaultComponent.setProps({ publishType: "scheduled" });
        defaultComponent.instance().handlePublishTypeChange("manual");
        expect(defaultComponent.instance().mapEditsToAPIRequestBody(defaultComponent.state()).type).toEqual("manual");
    });

    it("doesn't change the publish date if it was 'manual', then changed to 'scheduled' and back to 'manual'", () => {
        defaultComponent.setProps({ publishType: "manual" });
        defaultComponent.instance().handlePublishTypeChange("scheduled");
        defaultComponent.instance().handlePublishTypeChange("manual");
        expect(defaultComponent.instance().mapEditsToAPIRequestBody(defaultComponent.state()).type).toBeUndefined();
    });
});

describe("Data sent as request body on save", () => {
    it("teams value matches the value the API expects", () => {
        const componentWithTeams = shallow(<CollectionEditController {...propsWithTeams} allTeams={fetchedAllTeams} />);
        const addedTeam = { id: "10", name: "Team 10" };
        componentWithTeams.instance().handleAddTeam(addedTeam.id);

        const state = {
            isSavingEdits: true,
            isFetchingAllTeams: false,
            name: { value: "Test collection Boo", errorMsg: "" },
            allTeams: [
                { id: "1", name: "Team 1", members: [Array] },
                { id: "2", name: "Team 2", members: [] },
                { id: "3", name: "Team 3", members: [Array] },
            ],
            updatedTeamsList: [{ id: "10", name: "Team 10", members: [Array] }],
            addedTeams: new Map([addedTeam]),
            removedTeams: new Map([{ id: "1", name: "Team 1", members: [Array] }]),
            publishType: "manual",
            publishDate: { value: "", errorMsg: "" },
            publishTime: { value: "09:30", errorMsg: "" },
        };

        const request = componentWithTeams.instance().mapEditsToAPIRequestBody(state);

        expect(request.teams).toEqual(expect.arrayContaining([addedTeam.name]));
    });

    it("publish date matches the value the API expects", () => {
        scheduledComponent.setState({
            publishDate: {
                value: "2018-05-15",
                errorMsg: "",
            },
            publishTime: {
                value: "09:30",
                errorMsg: "",
            },
            publishType: "scheduled",
        });
        const request = scheduledComponent.instance().mapEditsToAPIRequestBody(scheduledComponent.state());
        expect(request.publishDate).toEqual("2018-05-15T08:30:00.000Z");
    });

    it("only includes a new publish date if the collection is scheduled", () => {
        scheduledComponent.setState({
            publishDate: {
                value: "2018-05-15",
                errorMsg: "",
            },
            publishTime: {
                value: "09:30",
                errorMsg: "",
            },
            publishType: "manual",
        });
        const request = scheduledComponent.instance().mapEditsToAPIRequestBody(scheduledComponent.state());
        expect(request.publishDate).toBeFalsy();
    });

    it("publish type matches the property the API expects", () => {
        scheduledComponent.setState({
            publishType: "manual",
        });
        const request = scheduledComponent.instance().mapEditsToAPIRequestBody(scheduledComponent.state());
        expect(request.type).toEqual("manual");

        scheduledComponent.setState({
            publishType: "scheduled",
        });
    });
});

describe("Validating the edited collection", () => {
    it("sends the request to update the collection if all input values are valid", () => {
        defaultComponent.setState({
            name: {
                value: "Edited collection name",
                errorMsg: "",
            },
            publishDate: {
                value: "2018-01-12",
                errorMsg: "",
            },
            publishTime: {
                value: "09:30",
                errorMsg: "",
            },
        });
        expect(collections.update.mock.calls.length).toEqual(0);
        defaultComponent.instance().handleSave();
        expect(collections.update.mock.calls.length).toEqual(1);
        collections.update.mockClear();
    });

    it("adds an error message but keeps the name value when it is invalid", () => {
        defaultComponent.setState({
            name: {
                value: "",
                errorMsg: "",
            },
        });
        defaultComponent.instance().handleSave();
        expect(defaultComponent.state("name").errorMsg).toBeTruthy();
    });

    it("adds an error message but keeps the publish date value when it is invalid", () => {
        defaultComponent.setState({
            publishDate: {
                value: "",
                errorMsg: "",
            },
            publishType: "scheduled",
        });
        defaultComponent.instance().handleSave();
        expect(defaultComponent.state("publishDate").errorMsg).toBeTruthy();
    });

    it("adds an error message but keeps the publish time value when it is invalid", () => {
        defaultComponent.setState({
            publishTime: {
                value: "",
                errorMsg: "",
            },
            publishType: "scheduled",
        });
        defaultComponent.instance().handleSave();
        expect(defaultComponent.state("publishTime").errorMsg).toBeTruthy();
    });

    it("stops the data being saved if a name, publish date or publish time isn't a valid value", () => {
        defaultComponent.setState({
            name: {
                value: "",
                errorMsg: "",
            },
            publishType: "manual",
        });
        expect(collections.update.mock.calls.length).toEqual(0);
        defaultComponent.instance().handleSave();
        expect(collections.update.mock.calls.length).toEqual(0);

        defaultComponent.setState({
            name: {
                value: "A name",
                errorMsg: "",
            },
            publishType: "scheduled",
            publishDate: {
                value: "",
                errorMsg: "",
            },
            publishTime: {
                value: "09:30am",
                errorMsg: "",
            },
        });
        expect(collections.update.mock.calls.length).toEqual(0);
        defaultComponent.instance().handleSave();
        expect(collections.update.mock.calls.length).toEqual(0);

        defaultComponent.setState({
            name: {
                value: "A name",
                errorMsg: "",
            },
            publishType: "scheduled",
            publishDate: {
                value: "2018-01-12",
                errorMsg: "",
            },
            publishTime: {
                value: "",
                errorMsg: "",
            },
        });
        expect(collections.update.mock.calls.length).toEqual(0);
        defaultComponent.instance().handleSave();
        expect(collections.update.mock.calls.length).toEqual(0);
    });
});

describe.only("The mapPropsToState function", () => {
    it("existing activeCollection returns the correct values", () => {
        const state = {
            collections: {
                active: {
                    type: "scheduled",
                    publishDate: "2018-01-12T09:30:00.000Z",
                    teams: ["Team 2", "Team 3"],
                },
            },
            groups: {
                all: [
                    { id: "1", name: "Team 1", members: [] },
                    { id: "2", name: "Team 2", members: [] },
                    { id: "3", name: "Team 3", members: [] },
                ],
            },
            config: {
                enablePermissionsAPI: false,
                enableNewSignIn: false,
            },
            policy: {
                data: null
            }
        };
        const expectProps = {
            publishType: "scheduled",
            publishDate: "2018-01-12T09:30:00.000Z",
            teams: ["Team 2", "Team 3"],
            isEnablePermissionsAPI: false,
            isNewSignIn: false,
            policy: null
        };
        expect(mapStateToProps({ state })).toMatchObject(expectProps);
    });

    it("having no activeCollection returns the correct values", () => {
        const state = {
            collections: {},
            config: {
                enablePermissionsAPI: false,
                enableNewSignIn: false,
            },
            groups: {
                all: [
                    { id: "1", name: "Team 1", members: [] },
                    { id: "2", name: "Team 2", members: [] },
                    { id: "3", name: "Team 3", members: [] },
                ],
            },
            config: {
                enablePermissionsAPI: false,
                enableNewSignIn: false,
            },            policy: {
                data: null
            }
        };
        const expectProps = {
            publishType: undefined,
            publishDate: undefined,
            teams: undefined,
            isEnablePermissionsAPI: false,
            isNewSignIn: false,
        };
        expect(mapStateToProps({ state })).toMatchObject(expectProps);
    });
});
