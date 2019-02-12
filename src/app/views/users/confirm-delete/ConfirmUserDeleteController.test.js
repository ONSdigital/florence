import React from 'react';
import { shallow } from 'enzyme';
import { ConfirmUserDeleteController } from './ConfirmUserDeleteController';
import user from "../../../utilities/api-clients/user";
import log from "../../../utilities/logging/log";
import notifications from '../../../utilities/notifications';

console.error = () => {};

jest.mock('../../../utilities/notifications', () => ({
    add: jest.fn(() => {})
}));


jest.mock('../../../utilities/logging/log', () => ({
    event: jest.fn(() => {}),
    error: jest.fn(() => {}),
    data: jest.fn(() => {})
}));

jest.mock('../../../utilities/url', () => ({
    resolve: jest.fn(string => string)
}));

jest.mock("../../../utilities/api-clients/user", () => ({
    remove: jest.fn().mockImplementation(() => Promise.resolve(true))
}));

const mockEvent = {
    preventDefault: () => {}
}

let dispatchedActions = [];

const defaultProps = {
    dispatch: action => dispatchedActions.push(action),
    params: {
        userID: "foobar@email.com"
    },
    loggedInUser: {
        isAdmin: true
    }
};

let component;

beforeEach(() => {
    dispatchedActions = [];
    component = shallow(
        <ConfirmUserDeleteController {...defaultProps}/>
    )
});

describe("After successfully deleting a user", () => {

    beforeEach(() => {
        dispatchedActions = [];
    });

    it("returns an object with 'response' and 'error' properties", async () => {
        const response = await component.instance().deleteUser();
        expect("response" in response).toBe(true);
        expect("error" in response).toBe(true);
    });
    
    it("'error' in the response is set to 'null'", async () => {
        const response = await component.instance().deleteUser();
        expect(response.error).toBe(null);
    });
    
    it("'response' property contains response body from API", async () => {
        const response = await component.instance().deleteUser();
        expect(response.response).toBe(true);
    });
    
    it("an action is dispatched to state to remove them from all users", async () => {
        expect(dispatchedActions.length).toBe(0);
        component.setState({
            email: "foobar@email.com"
        });
        await component.instance().handleSubmit(mockEvent);
        expect(dispatchedActions.length).toBeGreaterThan(0);
        const action = dispatchedActions.find(action => action.type === "REMOVE_USER_FROM_ALL_USERS");
        expect(action).toBeTruthy();
        expect(action.userID).toBe("foobar@email.com");
    });

    it("they are routed to the main 'users' screen", async () => {
        expect(dispatchedActions.length).toBe(0);
        component.setState({
            email: "foobar@email.com"
        });
        await component.instance().handleSubmit(mockEvent);
        expect(dispatchedActions.length).toBeGreaterThan(0);
        const action = dispatchedActions.find(action => action.type === "@@router/CALL_HISTORY_METHOD");
        expect(action).toBeTruthy();
        expect(action.payload.args[0]).toBe("../../");
    });

    it("component state updates when DELETE request is sent",() => {
        component.setState({
            email: "foobar@email.com"
        });
        component.instance().handleSubmit(mockEvent);
        expect(component.state('isSavingDelete')).toBe(true);
    });
    
    it("component state updates when DELETE request is finished", async () => {
        component.setState({
            email: "foobar@email.com"
        });
        await component.instance().handleSubmit(mockEvent);
        expect(component.state('isSavingDelete')).toBe(false);
    });
});

describe("An error after trying to delete the user", () => {

    beforeEach(() => {
        log.event.mockClear();
        notifications.add.mockClear();
    });

    it("shows a notification to the user", async () => {
        expect(notifications.add.mock.calls.length).toBe(0);
        user.remove.mockImplementationOnce(() => Promise.reject({
            status: 404
        }));
        component.setState({
            email: "foobar@email.com"
        });
        await component.instance().handleSubmit(mockEvent);
        expect(notifications.add.mock.calls.length).toBe(1);
        expect(notifications.add.mock.calls[0][0].type).toBe("warning");
    });
    
    it("logs the error", async () => {
        expect(log.event.mock.calls.length).toBe(0);
        user.remove.mockImplementationOnce(() => Promise.reject({
            status: 404
        }));
        component.setState({
            email: "foobar@email.com"
        });
        await component.instance().handleSubmit(mockEvent);
        expect(log.event.mock.calls.length).toBe(1);
        expect(log.event.mock.calls[0][0]).toBe("Error deleting user");
    });

    it("returns an object with 'response' and 'error' properties", async () => {
        user.remove.mockImplementationOnce(() => Promise.reject({
            status: 500
        }));
        const response = await component.instance().deleteUser("foobar@email.com");
        expect("error" in response).toBe(true);
        expect("response" in response).toBe(true);
    });

    it("returned 'error' property contains error response from the request", async () => {
        user.remove.mockImplementationOnce(() => Promise.reject({
            status: 500
        }));
        const response = await component.instance().deleteUser("foobar@email.com");
        expect(response.error).toEqual({
            status: 500
        });
    });
    
    it("returned 'response' property is set to 'null'", async () => {
        user.remove.mockImplementationOnce(() => Promise.reject({
            status: 500
        }));
        const response = await component.instance().deleteUser("foobar@email.com");
        expect(response.response).toBe(null);
    });
});

describe("Shows an inline error message", () => {

    it("when the input is left empty", () => {
        component.setState({email: ""});
        component.instance().handleSubmit(mockEvent);
        expect(component.state('error')).toBe("You must enter the user's email address");
    });

    it("when the input doesn't match the user's email", () => {
        component.setState({email: "foo@email.com"});
        component.instance().handleSubmit(mockEvent);
        expect(component.state('error')).toBe("Email address must match 'foobar@email.com'");
    });

    it("input value remains the same after error is set", () => {
        component.setState({email: "foobar@email.com"});
        component.instance().handleSubmit(mockEvent);
        expect(component.state('email')).toBe("foobar@email.com");
    });
});

describe("Clicking 'close'", () => {

    it("routes back to the user's details screen", () => {
        expect(dispatchedActions.length).toBe(0);
        component.instance().handleClose();
        expect(dispatchedActions.length).toBe(1);
        expect(dispatchedActions[0].type).toBe("@@router/CALL_HISTORY_METHOD");
        expect(dispatchedActions[0].payload.args[0]).toBe("../");
    });

});