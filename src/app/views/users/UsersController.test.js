import React from 'react';
import { UsersController } from './UsersController';
import { shallow, mount } from 'enzyme';
import user from '../../utilities/api-clients/user';

console.error = () => {};

jest.mock('../../utilities/logging/log', () => {
    return {
        event: jest.fn(() => {}),
        data: jest.fn(() => {}),
        error: jest.fn(() => {})
    }
});

jest.mock('../../utilities/notifications', () => {
    return {
        add: jest.fn(() => {}),
        remove: () => {}
    }
});

jest.mock('../../utilities/api-clients/user', () => {
    return {
        getAll: jest.fn(() => {
            return Promise.resolve(mockedAllUsers);
        }),
    }
});

jest.mock('../../utilities/auth', () => {
    return {
        isAdmin: jest.fn(() => {
            return true;
        }),
    }
});


const mockedAllUsers = [
    {
        "name": "Test user",
        "email": "test@test.com",
        "inactive": false,
        "temporaryPassword": false,
        "lastAdmin": "test@test.com",
        "adminOptions": {
            "rawJson": false
        }
    },
    {
        "name": "Test user 2",
        "email": "test2@test.com",
        "inactive": false,
        "temporaryPassword": false,
        "lastAdmin": "test@test.com",
        "adminOptions": {
            "rawJson": false
        }
    },
    {
        "name": "Test user 3",
        "email": "test3@test.com",
        "inactive": false,
        "temporaryPassword": false,
        "lastAdmin": "test@test.com",
        "adminOptions": {
            "rawJson": false
        }
    },    
];

let dispatchedActions = [];

const defaultProps = {
    dispatch: event => {
        dispatchedActions.push(event);
    },
    rootPath: "/florence",
    params: {
        userID: ""
    }
};

const component = shallow(
    <UsersController {...defaultProps} />
);

describe("On mount of the users screen", () => {
    it("fetches data for all users", () => {
        const getUserCalls = user.getAll.mock.calls.length;
        component.instance().componentWillMount();
        expect(user.getAll.mock.calls.length).toBe(getUserCalls+1);
    });

    it("adds all users to state", () => {
        component.instance().componentWillMount();
        expect(dispatchedActions[0].type).toBe("ADD_ALL_USERS");
        expect(dispatchedActions[0].users.length).toBe(mockedAllUsers.length);
    })

    it("updates isFetchingUsers state to show it's fetching data for all users", () => {
        expect(component.state('isFetchingUsers')).toBe(false);

        // Tests that state is set correctly before asynchronous requests have finished
        component.instance().componentWillMount();
        expect(component.state('isFetchingUsers')).toBe(true);

    }) 

    it("updates isFetchingUsers state to show it has fetched data for all users", async () => {
        // Tests that state is set correctly after asynchronous requests were successful
        await component.instance().componentWillMount();
        expect(component.state('isFetchingUsers')).toBe(false);

    });

    it("updates isFetchingUsers state correctly on failure to fetch data for all users", async () => {
        user.getAll.mockImplementationOnce(() => (
            Promise.reject({status: 500})
        ));
        await component.instance().componentWillMount();
        expect(component.state('isFetchingUsers')).toBe(false);
    });
})

describe("Selecting a user", () => {
    beforeAll(() => {
        dispatchedActions = []
    })
    it("routes to the users details page", () => {
        component.instance().handleUserSelection({id: "user1"});
        expect(dispatchedActions[0].type).toBe("@@router/CALL_HISTORY_METHOD");
        expect(dispatchedActions[0].payload.method).toBe("push");
        expect(dispatchedActions[0].payload.args[0]).toBe("/florence/users/user1");
    });
});

describe("Mapping users to state", () => {
    it("maps correctly", () => {
        const expectedValue = {
            ...mockedAllUsers[0], 
            id: mockedAllUsers[0].email, 
            columnValues: [mockedAllUsers[0].name, mockedAllUsers[0].email],
            returnValue: {id: mockedAllUsers[0].email}
        }
        const returnValue = component.instance().mapUserToState(mockedAllUsers[0]);
        expect(returnValue).toMatchObject(expectedValue);
    })
})