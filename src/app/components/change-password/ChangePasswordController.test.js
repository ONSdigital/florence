import React from 'react';
import ChangePasswordController from './ChangePasswordController';
import user from '../../utilities/api-clients/user';
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
        }
    }
});

jest.mock('../../utilities/api-clients/user', () => {
    return {
        updatePassword: jest.fn(() => {
            return Promise.resolve();
        }).mockImplementationOnce(() => {
            return Promise.reject({status: 500});
        })
    }
});

const formEvent = {
    preventDefault: () => {}
};

const passwordToShort = {
    value: "test",
    errorMsg: "Passwords must contain four words, separated by spaces"
};

const notValidPassPhrase = {
    value: "notaValidPassPhrase",
    errorMsg: "Passwords must contain four words, separated by spaces"
};

const props = {
    email: "test@test.com",
    currentPassword: "testPassword",
    handleSuccess: function() {},
    handleCancel: function() {}
};

const mockEvent = {
    target: {
        id: "new-password",
        value: "updated password"
    }
};

test("handleSubmit checks length of new password and displays error", async () => {
    const component = mount(
        <ChangePasswordController {...props}/>
    );
    component.setState({newPassword: {value: "test", errorMsg: ""}});
    await component.instance().handleSubmit(formEvent);
    expect(component.state('newPassword')).toMatchObject(passwordToShort);
});

test("handleSubmit checks if new password is a valid pass phrase and displays error", async () => {
    const component = mount(
        <ChangePasswordController {...props}/>
    );
    component.setState({newPassword: {value: "notaValidPassPhrase", errorMsg: ""}});
    await component.instance().handleSubmit(formEvent);
    expect(component.state('newPassword')).toMatchObject(notValidPassPhrase);
});

test("handleSubmit posts if no validation errors", async () => {
    const component = mount(
        <ChangePasswordController {...props}/>
    );
    component.setState({newPassword: {value: "a valid pass phrase", errorMsg: ""}});
    await component.instance().handleSubmit(formEvent);
    expect(user.updatePassword.mock.calls.length).toBe(1);
})

test("handleInputChange updates state", async () => {
    const component = mount(
        <ChangePasswordController {...props}/>
    );
    expect(component.state('newPassword')).toEqual({value: "", errorMsg: ""});
    await component.instance().handleInputChange(mockEvent);
    expect(component.state('newPassword')).toEqual({value: "updated password", errorMsg: ""});

})