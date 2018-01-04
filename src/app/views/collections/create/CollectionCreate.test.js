import React from 'react';
import { CollectionCreate } from './CollectionCreate';
import { mount, shallow } from 'enzyme';
import renderer from 'react-test-renderer';

jest.mock('../../../utilities/notifications', () => {
    return {
        add: jest.fn(() => {
            //
        })
    }
});

jest.mock('../../../utilities/http', () => {
    return {
        resolve: function() {
            //
        }
    }
});

jest.mock('../../../utilities/log', () => {
    return {
        add: function() {
            //
        }
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
    pendingDeletes: [],
    teams: [],
    collectionOwner: "ADMIN",
    releaseUri: ""
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
    onSuccess: function(){}
};

const expectedTodayDate = function() {
    const dateObj = new Date;
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    const formattedMonth = month < 10 ? "0" + month : month;
    const day = dateObj.getUTCDate() < 10 ? "0" + dateObj.getUTCDate() : dateObj.getUTCDate(); // add 0 to start if less then 10
    const year = dateObj.getUTCFullYear();
    return (year + "-" + formattedMonth + "-" + day);
};

const expectTodayInTenYears = function () {
    const dateObj = new Date;
    const month = dateObj.getUTCMonth() + 1; // months from 1-12
    const formattedMonth = month < 10 ? "0" + month : month;
    const day = dateObj.getUTCDate() < 10 ? "0" + dateObj.getUTCDate() : dateObj.getUTCDate(); // add 0 to start if less then 10
    const year = dateObj.getUTCFullYear() + 10; // simulate date 10 years ahead
    return (year + "-" + formattedMonth + "-" + day);
};

test("Create collection form matches stored snapshot", () => {
    const component = renderer.create(
        <CollectionCreate {...defaultProps} />
    );
    expect(component.toJSON()).toMatchSnapshot();
});

test("getTodayDate returns todays date in current format", () => {
    const component = shallow(
        <CollectionCreate {...defaultProps} />
    );
    const date = component.instance().getTodayDate();
    expect(date).toEqual(expectedTodayDate());
});

test("getTodayDate returns correct date when passed yearsAhead argument", () => {
    const component = shallow(
        <CollectionCreate {...defaultProps} />
    );
    const date = component.instance().getTodayDate(10);
    expect(date).toEqual(expectTodayInTenYears());
});

test("Handle collection name change updates state correctly", () => {
    const component = shallow(
        <CollectionCreate {...defaultProps} />
    );
    expect(component.update().state().newCollectionDetails.name.value).toBe("");
    component.instance().handleCollectionNameChange({target: {value: "Test collection"}});
    expect(component.update().state().newCollectionDetails.name.value).toBe("Test collection");
});

test("Handle team selection change updates state correctly", () => {
    const component = shallow(
        <CollectionCreate {...defaultProps} />
    );
    component.setState({ allTeams: mockedTeams });
    expect(component.update().state().newCollectionDetails.teams).toHaveLength(0);
    component.instance().handleTeamSelection({target: {value: "1"}});
    expect(component.update().state().newCollectionDetails.teams).toContainEqual({id: "1", name: "Team 1"});
});

test("Handle team selection doesn't add a team that is already in the collection", () => {
    const component = shallow(
        <CollectionCreate {...defaultProps} />
    );
    component.setState({ allTeams: mockedTeams });
    const teams = [{id: "1", name: "Team 1"}];
    const newCollection = {...newCollectionDetails, teams: teams};
    component.setState({ newCollectionDetails: newCollection });
    expect(component.update().state().newCollectionDetails.teams).toHaveLength(1);
    component.instance().handleTeamSelection({preventDefault: ()=>{}, target: {value: "1"}});
    expect(component.update().state().newCollectionDetails.teams).toHaveLength(1);
});

test("Handle schedule type change updates state correctly", () => {
    const component = shallow(
        <CollectionCreate {...defaultProps} />
    );
    expect(component.update().state().newCollectionDetails.scheduleType).toBe("custom-schedule");
    component.instance().handleScheduleTypeChange({value: "calender-entry-schedule"});
    expect(component.update().state().newCollectionDetails.scheduleType).toBe("calender-entry-schedule");
});

test("Handle publish date change updates state correctly", () => {
    const component = shallow(
        <CollectionCreate {...defaultProps} />
    );
    expect(component.update().state().newCollectionDetails.publishDate.value).toBe("");
    component.instance().handlePublishDateChange({target: {value: "2017-12-07"}});
    expect(component.update().state().newCollectionDetails.publishDate.value).toBe("2017-12-07");
});

test("Handle publish time change updates state correctly", () => {
    const component = shallow(
        <CollectionCreate {...defaultProps} />
    );
    expect(component.update().state().newCollectionDetails.publishTime.value).toBe("09:30");
    component.instance().handlePublishTimeChange({target: {value: "13:00"}});
    expect(component.update().state().newCollectionDetails.publishTime.value).toBe("13:00");
});

test("Handle submit validates that a collection has a name", () => {
    const component = shallow(
        <CollectionCreate {...defaultProps} />
    );
    component.instance().handleSubmit({preventDefault: ()=>{}});
    expect(component.update().state().newCollectionDetails.name.errorMsg).toBe("Collections must be given a name");
});

test("Handle submit validates that a scheduled collection has a date", () => {
    const component = shallow(
        <CollectionCreate {...defaultProps} />
    );
    const name = {value: "Test Collection", errorMsg: ""};
    const newCollection = {...newCollectionDetails, name: name};
    component.setState({ newCollectionDetails: newCollection});
    component.instance().handleSubmit({preventDefault: ()=>{}});
    expect(component.update().state().newCollectionDetails.publishDate.errorMsg).toBe("Scheduled collections must be given a publish date");
});

test("Handle submit validates that a scheduled collection has a time", () => {
    const component = shallow(
        <CollectionCreate {...defaultProps} />
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
        <CollectionCreate {...defaultProps} />
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
        <CollectionCreate {...defaultProps} />
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