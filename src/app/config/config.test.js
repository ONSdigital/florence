import { userLoggedIn, userLoggedOut } from './actions';
import { initialState } from './initialState';
import reducer from './reducer';

jest.mock('../utilities/log', () => {
    return {
        add: function() {
            // do nothing
        },
        eventTypes: {}
    }
})

test('Reducer returns proper initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
});

test('userLoggedIn action and USER_LOGGED_IN reducer return correct state', () => {
    const action = userLoggedIn("foo@bar.com", "PUBLISHER", false);
    expect(reducer({}, action)).toEqual({
        user: {
            isAuthenticated: true,
            email: "foo@bar.com",
            userType: "PUBLISHER",
            isAdmin: false
        }
    });
});

test('userLoggedOut action and USER_LOGGED_OUT reducer return correct state', () => {
    const action = userLoggedOut();
    expect(reducer({}, action)).toEqual({
        user: {
            isAuthenticated: false
        }
    });
});