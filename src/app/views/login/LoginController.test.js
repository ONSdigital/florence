import React from 'react';
import { LoginController } from './LoginController';
import renderer from 'react-test-renderer';
import { mount, shallow } from 'enzyme';

jest.mock('../../utilities/notifications.js', () => {
    return {
        add: function() {
            // do nothing
        }
    }
});

jest.mock('../../utilities/log.js', () => {
    return {
        add: function() {
            // do nothing
        },
        eventTypes: {
            shownNotification: "SHOWN_NOTIFICATION"
        }
    }
});

jest.mock('../../utilities/APIs/user.js', () => {
    return {
        setUserState: function () {
            // do nothing
        },
        logOut: function () {
            // do nothing
        }
    }
});
jest.mock('../../utilities/redirectToMainScreen.js', () => {
    return {
        redirectToMainScreen: function () {
            // do nothing
        }
    }
});

test("Check redirect doesn't work if not authenticated", () => {
    const props = {
        dispatch: function() {},
        rootPath: '/florence',
        isAuthenticated: false
    };
    const component = mount(
        <LoginController {...props}/>
    );
    expect(component.find('h1').text()).toBe("Login");
});

test("Does password change form appear on state change", () => {
    const props = {
        dispatch: function() {},
        rootPath: '/florence',
        isAuthenticated: false
    };
    const component = mount(
        <LoginController {...props}/>
    )
    expect(component.find('.modal__overlay').length).toBe(0);
    component.setState({requestPasswordChange: true});
    expect(component.find('.modal__overlay').length).toBe(1);
});