import React from 'react';
import { CollectionCreateController } from './CollectionCreateController';
import { mount, shallow } from 'enzyme';
import renderer from 'react-test-renderer';

jest.mock('../../../utilities/notifications', () => {
    return {
        add: jest.fn(() => {
            //
        })
    }
});

jest.mock('../../../utilities/date', () => {
    return {
        format: jest.fn(() => {
            return "2017-10-12" // the adding year, formatting and getNow functionality is all tested in the date class so we can just hardcode this response
        }),
        getNow: jest.fn(() => {
            //
        }),
        addYear: jest.fn(() => {
            //
        })
    }
});

jest.mock('../../../utilities/log', () => {
    return {
        add: function() {
            //
        },
        eventTypes: {}
    }
});

jest.mock('../../../utilities/api-clients/teams', () => {
    return {
        getAll: jest.fn(() => {
            return Promise.resolve([{id: 1, name: "Team 1"}, {id: 2, name: "Team 2"}])
        })
    }
});

const newCollectionDetails = {
    name: {
        value: "",
        errorMsg: ""
    },
    type: "scheduled",
    publishDate: {
        value: "",
        errorMsg: ""
    },
    publishTime: {
        value: "09:30",
        errorMsg: ""
    },
    scheduleType: "custom-schedule",
    pendingDeletes: [],
    teams: [],
    collectionOwner: "ADMIN",
    release: {
        uri: "",
        date: "",
        title: "",
        errorMsg: ""
    }
};

const expectedPostBody = {
    collectionOwner: "ADMIN",
    name: "Test collection",
    publishDate: "2017-12-07T09:30:00.000Z",
    releaseUri: null,
    teams: ["Team 1"],
    type: "scheduled"
}

const mockedTeams = [{id: "1", name: "Team 1"}, {id: "2", name: "Team 2"}];

const defaultProps = {
    user: {
        userType: "ADMIN"
    },
    onSuccess: function(){},
    dispatch: () => {},
    allTeams: []
};

test("Create collection form matches stored snapshot", () => {
    const component = renderer.create(
        <CollectionCreateController {...defaultProps} />
    );
    expect(component.toJSON()).toMatchSnapshot();
});

test("Handle collection name change updates state correctly", () => {
    const component = shallow(
        <CollectionCreateController {...defaultProps} />
    );
    expect(component.update().state().newCollectionDetails.name.value).toBe("");
    component.instance().handleCollectionNameChange({target: {value: "Test collection"}});
    expect(component.update().state().newCollectionDetails.name.value).toBe("Test collection");
});

test("Handle team selection change updates state correctly", () => {
    const component = shallow(
        <CollectionCreateController {...defaultProps} />
    );
    component.setProps({ allTeams: mockedTeams });
    expect(component.update().state().newCollectionDetails.teams).toHaveLength(0);
    component.instance().handleTeamSelection({target: {value: "1"}});
    expect(component.update().state().newCollectionDetails.teams).toContainEqual({id: "1", name: "Team 1"});
});

describe("Selecting/removing a team", () => {
    let component;

    beforeEach(() => {
        component = mount(
            <CollectionCreateController {...defaultProps} />
        );
        component.setProps({allTeams: mockedTeams});
    });
    
    it("disables a team on selection", () => {
        const selectedTeamID = "2";
        const getDisabledTeams = () => component.state('updatedAllTeams').filter(team => team.disabled);

        // Check that the component has the state and props we'd expect at this point
        expect(component.prop('allTeams').length).toBe(2);
        expect(component.state('updatedAllTeams')).toBe(null);

        component.instance().handleTeamSelection({preventDefault: ()=>{}, target: {value: selectedTeamID}});

        expect(component.state('updatedAllTeams')).toBeTruthy();
        expect(getDisabledTeams().length).toBe(1);
        expect(getDisabledTeams()[0].id).toBe("2");
        expect(getDisabledTeams()[0].name).toBe("Team 2");
    });

    it("enables a team on removal", () => {
        const removedTeam = {id: "2", name: "Team 2"};
        const getDisabledTeams = () => component.state('updatedAllTeams').filter(team => team.disabled);

        // Ensure that the component has the state and props we'd expect at this point
        expect(component.state('updatedAllTeams')).toBe(null);
        component.instance().handleTeamSelection({preventDefault: ()=>{}, target: {value: removedTeam.id}});
        expect(getDisabledTeams().length).toBe(1);
        expect(component.state('updatedAllTeams')).toBeTruthy();

        component.instance().handleRemoveTeam(removedTeam);
        expect(getDisabledTeams().length).toBe(0);
    })
});

test("Handle team selection doesn't add a team that is already in the collection", () => {
    const component = shallow(
        <CollectionCreateController {...defaultProps} />
    );
    component.setProps({ allTeams: mockedTeams });
    const teams = [{id: "1", name: "Team 1"}];
    const newCollection = {...newCollectionDetails, teams: teams};
    component.setState({ newCollectionDetails: newCollection });
    expect(component.update().state().newCollectionDetails.teams).toHaveLength(1);
    component.instance().handleTeamSelection({preventDefault: ()=>{}, target: {value: "1"}});
    expect(component.update().state().newCollectionDetails.teams).toHaveLength(1);
});

test("Handle schedule type change updates state correctly", () => {
    const component = shallow(
        <CollectionCreateController {...defaultProps} />
    );
    expect(component.update().state().newCollectionDetails.scheduleType).toBe("custom-schedule");
    component.instance().handleScheduleTypeChange({value: "calender-entry-schedule"});
    expect(component.update().state().newCollectionDetails.scheduleType).toBe("calender-entry-schedule");
});

test("Handle publish date change updates state correctly", () => {
    const component = shallow(
        <CollectionCreateController {...defaultProps} />
    );
    expect(component.update().state().newCollectionDetails.publishDate.value).toBe("");
    component.instance().handlePublishDateChange({target: {value: "2017-12-07"}});
    expect(component.update().state().newCollectionDetails.publishDate.value).toBe("2017-12-07");
});

test("Handle publish time change updates state correctly", () => {
    const component = shallow(
        <CollectionCreateController {...defaultProps} />
    );
    expect(component.update().state().newCollectionDetails.publishTime.value).toBe("09:30");
    component.instance().handlePublishTimeChange({target: {value: "13:00"}});
    expect(component.update().state().newCollectionDetails.publishTime.value).toBe("13:00");
});

test("Handle submit validates that a collection has a name", () => {
    const component = shallow(
        <CollectionCreateController {...defaultProps} />
    );
    component.instance().handleSubmit({preventDefault: ()=>{}});
    expect(component.update().state().newCollectionDetails.name.errorMsg).toBe("Collections must be given a name");
});

test("Handle submit validates that a scheduled collection has a date", () => {
    const component = shallow(
        <CollectionCreateController {...defaultProps} />
    );
    const name = {value: "Test Collection", errorMsg: ""};
    const newCollection = {...newCollectionDetails, name: name};
    component.setState({ newCollectionDetails: newCollection});
    component.instance().handleSubmit({preventDefault: ()=>{}});
    expect(component.update().state().newCollectionDetails.publishDate.errorMsg).toBe("Scheduled collections must be given a publish date");
});

test("Handle submit validates that a scheduled collection has a time", () => {
    const component = shallow(
        <CollectionCreateController {...defaultProps} />
    );
    const name = {value: "Test Collection", errorMsg: ""};
    const date = {value: "2017-12-07", errorMsg: ""};
    const time = {value: "", errorMsg: ""};
    const newCollection = {...newCollectionDetails, name: name, publishDate: date, publishTime: time};
    component.setState({ newCollectionDetails: newCollection});
    component.instance().handleSubmit({preventDefault: ()=>{}});
    expect(component.update().state().newCollectionDetails.publishTime.errorMsg).toBe("Scheduled collections must be given a publish time");
});

test("Make publish date returns correct date value", () => {
    const component = shallow(
        <CollectionCreateController {...defaultProps} />
    );
    const date = {value: "2017-12-07", errorMsg: ""};
    const time = {value: "09:30", errorMsg: ""};
    const newCollection = {...newCollectionDetails, publishDate: date, publishTime: time};
    component.setState({ newCollectionDetails: newCollection});
    const makePublishDate = component.instance().makePublishDate();
    expect(makePublishDate).toEqual("2017-12-07T09:30:00.000Z");
});

test("Map state to post body returns correct object", () => {
    const component = shallow(
        <CollectionCreateController {...defaultProps} />
    );
    const name = {value: "Test collection", errorMsg: ""};
    const date = {value: "2017-12-07", errorMsg: ""};
    const time = {value: "09:30", errorMsg: ""};
    const teams = [{id: "1", name: "Team 1"}];
    const newCollection = {...newCollectionDetails, name: name, publishDate: date, publishTime: time, teams: teams};
    component.setState({ newCollectionDetails: newCollection});
    const makePublishDate = component.instance().mapStateToPostBody();
    expect(makePublishDate).toEqual(expectedPostBody);
});