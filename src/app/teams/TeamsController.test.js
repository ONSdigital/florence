import React from 'react';
import { TeamsController } from './TeamsController';
import { mount } from 'enzyme';

const listOfTeams = [
    {
        name: "Team 1",
        id: 1
    },
    {
        name: "Team 2",
        id: 2
    },
    {
        name: "Team 2",
        id: 3
    }
]

jest.mock('../utilities/teams.js', () => (
    {
        getAll: jest.fn().mockImplementation(() => {
            return Promise.resolve()
        }
    )}
));

test('Loading state shown when fetching all teams', () => {
    const props = {
        dispatch: function() {},
        rootPath: '/florence',
        allTeams: listOfTeams,
        params: {}
    }
    const component = mount(
        <TeamsController {...props}/>
    )
    expect(component.find('.loader').length).toBe(1);
    component.setState({isUpdatingAllTeams: false});
    expect(component.find('.loader').length).toBe(0);
});

test('Renders updated list of teams', () => {
    const props = {
        dispatch: function() {},
        rootPath: '/florence',
        allTeams: [],
        params: {}
    }
    const component = mount(
        <TeamsController {...props}/>
    )
    expect(component.find('li').length).toBe(0);
    component.setProps({allTeams: listOfTeams});
    component.setState({isUpdatingAllTeams: false});
    expect(component.find('li').length).toBe(3);
});

test('Correctly renders when an new active team is changed', () => {
    const props = {
        dispatch: function() {},
        rootPath: '/florence',
        allTeams: listOfTeams,
        params: {},
        activeTeam: {}
    }
    const component = mount(
        <TeamsController {...props}/>
    )
    component.setState({isUpdatingAllTeams: false});
    expect(component.find('.selected').length).toBe(0);
    component.setProps({
        activeTeam: {
            name: "Team 1",
            id: 1
        }
    });
    expect(component.find('.selected').length).toBe(1);
    component.setProps({activeTeam: {}});
    expect(component.find('.selected').length).toBe(0);
});

