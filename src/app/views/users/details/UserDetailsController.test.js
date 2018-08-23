import React from 'react';
import { shallow, mount } from 'enzyme';
import {UserDetailsController, mapStateToProps} from './UserDetailsController';
import user from "../../../utilities/api-clients/user";
import log from "../../../utilities/log";
import notifications from '../../../utilities/notifications';

console.error = () => {};

jest.mock("../../../utilities/api-clients/user", () => ({
    get: jest.fn().mockImplementation(() => Promise.resolve({
        email: "foo@bar.com",
        name: "Foo Bar",
        temporaryPassword: false
    })),
    getPermissions: jest.fn().mockImplementation(email => Promise.resolve({
        email,
        admin: false,
        editor: true
    })),
    getUserRole: jest.fn(() => "PUBLISHER")
}));

jest.mock('../../../utilities/notifications', () => ({
    add: jest.fn(() => {})
}));

jest.mock('../../../utilities/log', () => ({
    add: jest.fn(() => {}),
    eventTypes: {}
}));

jest.mock('../../../utilities/auth', () => ({
    isAdmin: jest.fn(() => {return true}),
}));

let dispatchedActions = [];
const defaultProps = {
    dispatch: action => dispatchedActions.push(action),
    params: {
        userID: "foo@bar.com"
    },
    activeUser: {},
    currentUser: {}
}

let component = shallow(
    <UserDetailsController {...defaultProps} />
);

beforeEach(() => {
    component = shallow(
        <UserDetailsController {...defaultProps} />
    );
    dispatchedActions = [];
    log.add.mockClear();
    notifications.add.mockClear();
    user.get.mockClear();
    user.getPermissions.mockClear();
});

describe("Fetching the user", () => {

    it("request to get details returns an object of an error and response", async () => {
        const response = await component.instance().getUserDetails();
        expect(response).toHaveProperty("response");
        expect(response).toHaveProperty("error");
    });

    it("request to get permissions returns an object of an error and response", async () => {
        const response = await component.instance().getUserPermissions();
        expect(response).toHaveProperty("response");
        expect(response).toHaveProperty("error");
    });

    it("permissions request returns a 404 error when Zebedee returns a 200 with no email", async () => {
        const response = await component.instance().getUserPermissions();
        expect(response.error).toBeTruthy();
        expect(response.error.status).toBe(404);
    });
});

describe("Error fetching the user", () => {
    beforeEach(() => {
        log.add.mockClear();
        notifications.add.mockClear();
    });

    it("failure getting permissions is logged", async () => {
        user.getPermissions.mockImplementationOnce(() => Promise.reject({status: 500}));
        expect(log.add.mock.calls.length).toBe(0);
        await component.instance().getUserPermissions();
        expect(log.add.mock.calls.length).toBe(1);
    });
    
    it("user is notified when fetching permissions fails", async () => {
        user.getPermissions.mockImplementationOnce(() => Promise.reject({status: 500}));
        expect(notifications.add.mock.calls.length).toBe(0);
        await component.instance().updateStateWithUser();
        expect(notifications.add.mock.calls.length).toBe(1);
    });

    it("failure getting details is logged", async () => {
        user.get.mockImplementationOnce(() => Promise.reject({status: 500}));
        expect(log.add.mock.calls.length).toBe(0);
        await component.instance().getUserDetails();
        expect(log.add.mock.calls.length).toBe(1);
    });

    it("user is notified when fetching details fails", async () => {
        user.get.mockImplementationOnce(() => Promise.reject({status: 500}));
        expect(notifications.add.mock.calls.length).toBe(0);
        await component.instance().updateStateWithUser();
        expect(notifications.add.mock.calls.length).toBe(1);
    });

    it("matching error statuses when getting details and permissions is logged", async () => {
        user.get.mockImplementationOnce(() => Promise.reject({status: 500}));
        user.getPermissions.mockImplementationOnce(() => Promise.reject({status: 500}));
        expect(log.add.mock.calls.length).toBe(0);
        await component.instance().updateStateWithUser();
        expect(log.add.mock.calls.length).toBe(2);
    });

    it("nothing is logged when getting details and permissions is successful", async () => {
        expect(log.add.mock.calls.length).toBe(0);
        await component.instance().updateStateWithUser();
        expect(log.add.mock.calls.length).toBe(0);
    });
    
    it("user is not notified when getting details and permissions is successful", async () => {
        expect(notifications.add.mock.calls.length).toBe(0);
        await component.instance().updateStateWithUser();
        expect(notifications.add.mock.calls.length).toBe(0);
    });

    it("user is notified once when fetching details and permissions fails with the same status", async () => {
        user.get.mockImplementationOnce(() => Promise.reject({status: 500}));
        user.getPermissions.mockImplementationOnce(() => Promise.reject({status: 500}));
        expect(notifications.add.mock.calls.length).toBe(0);
        await component.instance().updateStateWithUser();
        expect(notifications.add.mock.calls.length).toBe(1);
    });

    it("different error statuses when getting details and permissions is logged", async () => {
        user.get.mockImplementationOnce(() => Promise.reject({status: 500}));
        user.getPermissions.mockImplementationOnce(() => Promise.reject({status: 404}));
        expect(log.add.mock.calls.length).toBe(0);
        await component.instance().updateStateWithUser();
        expect(log.add.mock.calls.length).toBe(2);
    });
    
    it("user is notified once when fetching details and permissions fails with a different status", async () => {
        user.get.mockImplementationOnce(() => Promise.reject({status: 500}));
        user.getPermissions.mockImplementationOnce(() => Promise.reject({status: 500}));
        expect(notifications.add.mock.calls.length).toBe(0);
        await component.instance().updateStateWithUser();
        expect(notifications.add.mock.calls.length).toBe(1);
    });
});

describe("Updating the 'active user' in state", () => {

    it("updates the component state to show it is loading whilst the user is being fetched", () => {
        expect(component.state('isFetchingUser')).toBe(false);
        component.instance().updateStateWithUser();
        expect(component.state('isFetchingUser')).toBe(true);
    });

    it("reverts the component state to show it's finished loading after the user has been fetched", async () => {
        expect(component.state('isFetchingUser')).toBe(false);
        await component.instance().updateStateWithUser();
        expect(component.state('isFetchingUser')).toBe(false);
    });

    it("doesn't try to update state with active user if requests fail", async () => {
        const dispatchedActionsFromMount = dispatchedActions;
        user.get.mockImplementationOnce(() => Promise.reject({status: 500}));
        user.getPermissions.mockImplementationOnce(() => Promise.reject({status: 500}));
        await component.instance().updateStateWithUser();
        expect(dispatchedActions.length).toBe(dispatchedActionsFromMount.length);
    });
});

describe("After the component updates", () => {
    // We need a fully mounted component so that we can access and alter the userID
    // parameter prop that is passed in from the router. 'shallow()' only doesn't 
    // allow access to these props.
    const mountedComponent = mount(
        <UserDetailsController {...defaultProps} />
    )

    beforeEach(() => {
        mountedComponent.setProps({params: {
            userID: defaultProps.params.userID
        }});
    });

    it("fetches new user's details", () => {
        const noOfDetailsRequests = user.get.mock.calls.length;
        const noOfPermissionsRequests = user.getPermissions.mock.calls.length;
        mountedComponent.setProps({params: {
            userID: "foo2@bar.com"
        }});
        expect(user.get.mock.calls.length).toBe(noOfDetailsRequests+1);
        expect(user.getPermissions.mock.calls.length).toBe(noOfPermissionsRequests+1);
    });

    it("does nothing if user ID is the same", () => {
        const noOfDetailsRequests = user.get.mock.calls.length;
        const noOfPermissionsRequests = user.getPermissions.mock.calls.length;
        mountedComponent.setProps({params: {
            userID: "foo@bar.com"
        }});
        expect(user.get.mock.calls.length).toBe(noOfDetailsRequests);
        expect(user.getPermissions.mock.calls.length).toBe(noOfPermissionsRequests);
    });
});

describe("Mapping API response to state", () => {
    const userDetailsResponse = {
        adminOptions: {rawJson: false},
        email: "foo@bar.com",
        inactive: false,
        lastAdmin: "florence@magicroundabout.ons.gov.uk",
        name: "Foo Bar",
        temporaryPassword: false
    };
    const userPermissionsResponse = {
        admin: false,
        editor: true,
        email: "foo@bar.com"
    };

    it("defines 'name', 'email', 'hasTemporaryPassword' and 'role' correctly", () => {
        const mappedToState = component.instance().mapUserResponsesToState(userDetailsResponse, userPermissionsResponse);
        expect(mappedToState).toEqual({
            email: "foo@bar.com",
            name: "Foo Bar",
            role: "PUBLISHER",
            hasTemporaryPassword: false
        });
    });

    it("defaults 'email' and 'name' to empty strings if the API responses isn't defined", () => {
        const emptyUserDetailsResponse = {
            ...userDetailsResponse,
            email: "",
            name: ""
        };
        const emptyUserPermissionsResponse = {
            ...userPermissionsResponse,
            email: ""
        }
        const mappedToState = component.instance().mapUserResponsesToState(emptyUserDetailsResponse, emptyUserPermissionsResponse);
        expect(mappedToState.email).toBe("");
        expect(mappedToState.name).toBe("");
    });
    
    it("uses 'email' from permissions response if it isn't defined in the details response", () => {
        const emptyUserDetailsResponse = {
            ...userDetailsResponse,
            email: "",
            name: ""
        };
        const mappedToState = component.instance().mapUserResponsesToState(emptyUserDetailsResponse, userPermissionsResponse);
        expect(mappedToState.email).toBe("foo@bar.com");
        expect(mappedToState.name).toBe("");
    });

    it("defaults 'hasTemporaryPassword' to false if the API response isn't defined", () => {
        const mappedToState = component.instance().mapUserResponsesToState(null, userPermissionsResponse);
        expect(mappedToState.hasTemporaryPassword).toBe(false);
    });

    it("defaults 'role' to an empty string if the API permissions response isn't defined", () => {
        const mappedToState = component.instance().mapUserResponsesToState(userDetailsResponse, null);
        expect(mappedToState.role).toBe("");
    });
});

describe("Mapping state to component props", () => {
    it("includes the active user", () => {
        const state = {state: {
            users: {
                active: {
                    hasTemporaryPassword: false,
                    name: "Foo Bar",
                    email: "foo@bar.com",
                    role: "PUBLISHER"
                }
            }
        }};

        expect(mapStateToProps(state).activeUser).toEqual({
            hasTemporaryPassword: false,
            name: "Foo Bar",
            email: "foo@bar.com",
            role: "PUBLISHER"
        });
    });
});