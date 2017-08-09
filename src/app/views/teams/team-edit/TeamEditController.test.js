import React from 'react';
import { TeamEditController } from './TeamEditController';
import { mount, shallow } from 'enzyme';

jest.mock('../../../utilities/notifications.js', () => (
    {
        add: jest.fn().mockImplementation(() => {
        }
    )}
));

jest.mock('../../../utilities/log.js', () => (
    {
        add: jest.fn().mockImplementation(() => {
            console.log('Log added');
        }
    )}
));

jest.mock('../../../utilities/log.js', () => (
    {
        add: jest.fn().mockImplementation(() => {
            // do nothing
        }),
        eventTypes: {
            editedTeamMembers: ""
        }
    }
));

jest.mock('../../../utilities/api-clients/user.js', () => (
    {
        getAll: jest.fn().mockImplementation(() => {
            return Promise.resolve([
                {
                    name: "User 1",
                    email: "user.1@test.com"
                },
                {
                    name: "User 2",
                    email: "user.2@test.com"
                },
                {
                    name: "User 3",
                    email: "user.3@test.com"
                },
                {
                    name: "User 4",
                    email: "user.4@test.com"
                },
                {
                    name: "User 5",
                    email: "user.5@test.com"
                }
            ]);
        }
    )}
));

jest.mock('../../../utilities/api-clients/teams.js', () => (
    {
        addMember: jest.fn().mockImplementation(() => {
            return Promise.resolve();
        }),
        removeMember: jest.fn().mockImplementation(() => {
            return Promise.resolve();
        })
    }
));

const users = [
    {
        name: "User 1",
        email: "user.1@test.com"
    },
    {
        name: "User 2",
        email: "user.2@test.com"
    },
    {
        name: "User 3",
        email: "user.3@test.com"
    },
    {
        name: "User 4",
        email: "user.4@test.com"
    },
    {
        name: "User 5",
        email: "user.5@test.com"
    }
]
const name = "A test team"
const isUpdatingMembers = false;
const members = [];

function dispatch() {}

// TODO this should really be tested in the team edit component tests
// test('Add/remove functionality is disabled whilst data is being fetched', () => {
//     const props = {
//         users,
//         members,
//         dispatch,
//         name,
//         isUpdatingMembers: true
//     }
//     const component = mount(
//         <TeamEditController {...props}/>
//     )
// });

test('Updating the search term filters displayed users correctly', () => {
    const props = {
        users,
        members,
        dispatch,
        name,
        isUpdatingMembers
    }
    const component = mount(
        <TeamEditController {...props}/>
    )

    expect(component.state('editedUsers')).toBe(null);

    const newEditedUsers = users.slice(0, users.length-1);
    component.setState({editedUsers: newEditedUsers});
    expect(component.state('editedUsers').length).toBe(4);
    component.instance().handleUsersSearch({target: {value: "User.2"}});
    expect(component.state('editedUsers').length).toBe(1);
});

test("Adding and removing a user to/from a team updates the 'All users' list accordingly", async () => {
    const props = {
        users,
        members,
        dispatch,
        name,
        isUpdatingMembers
    }
    const component = shallow(
        <TeamEditController {...props}/>
    )

    component.setState({editedUsers: users});
    expect(component.state('editedUsers').length).toBe(5);
    await component.instance().handleMembersChange({email: "user.1@test.com", action: "add"});
    expect(component.update().state('editedUsers').length).toBe(4);
    
    await component.instance().handleMembersChange({email: "user.1@test.com", action: "remove"});
    expect(component.update().state('editedUsers').length).toBe(5);
});