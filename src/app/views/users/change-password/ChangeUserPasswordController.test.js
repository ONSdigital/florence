import React from "react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";
import user from "../../../utilities/api-clients/user";
import log from "../../../utilities/logging/log";
import notifications from "../../../utilities/notifications";
import { ChangeUserPasswordController, mapStateToProps } from "./ChangeUserPasswordController";
import validatePassword from "../../../components/change-password/validatePassword";

jest.mock("../../../utilities/websocket", () => ({
    send: jest.fn(() => {}),
}));

jest.mock("../../../utilities/notifications", () => ({
    add: jest.fn(() => {}),
}));

jest.mock("../../../utilities/logging/log", () => ({
    event: jest.fn(() => {}),
    data: jest.fn(() => {}),
    error: jest.fn(() => {}),
}));

jest.mock("../../../utilities/url", () => ({
    resolve: jest.fn(string => string),
}));

jest.mock("../../../utilities/api-clients/user", () => ({
    updatePassword: jest.fn().mockImplementation(() => Promise.resolve(true)),
    logOut: jest.fn().mockImplementation(() => {}),
}));

jest.mock("../../../components/change-password/validatePassword", () =>
    jest.fn(() => ({
        isValid: true,
        error: null,
    }))
);

console.error = () => {};
console.warn = () => {};

let dispatchedActions = [];
const defaultProps = {
    dispatch: action => dispatchedActions.push(action),
    params: {
        userID: "foobar@email.com",
    },
    loggedInUser: {
        isAdmin: false,
        email: "foobar@email.com",
    },
};
const publisherProps = {
    ...defaultProps,
    loggedInUser: {
        ...defaultProps.loggedInUser,
        isAdmin: false,
    },
};
const adminProps = {
    ...defaultProps,
    loggedInUser: {
        ...defaultProps.loggedInUser,
        isAdmin: true,
    },
};
const mockEvent = {
    preventDefault: () => {},
};

beforeEach(() => {
    dispatchedActions = [];
});

describe("Publisher changing their own password", () => {
    let publisherComponent;

    beforeEach(() => {
        publisherComponent = shallow(<ChangeUserPasswordController {...publisherProps} />);
        user.updatePassword.mockClear();
        validatePassword.mockClear();
    });

    it("renders inputs for current password and new password", () => {
        const inputs = publisherComponent.instance().formInputs();
        expect(inputs.length).toBe(2);
        expect(inputs[0].id).toBe("current-password");
        expect(inputs[1].id).toBe("new-password");
    });

    it("renders inputs with the 'handleInputChange' function bound", () => {
        publisherComponent.instance().handleInputChange = jest.fn(() => {});
        const inputs = publisherComponent.instance().formInputs();
        expect(inputs.length).toBe(2);
        expect(publisherComponent.instance().handleInputChange.mock.calls.length).toBe(0);
        inputs.forEach((input, index) => {
            input.onChange(
                {
                    target: {
                        value: `a mocked value (${index})`,
                    },
                },
                input.id
            );
        });
        const mockedHandlerCalls = publisherComponent.instance().handleInputChange.mock.calls;
        expect(mockedHandlerCalls.length).toBe(2);
        expect(mockedHandlerCalls[0][0]).toBe("a mocked value (0)");
        expect(mockedHandlerCalls[0][1]).toBe("currentPassword");
        expect(mockedHandlerCalls[1][0]).toBe("a mocked value (1)");
        expect(mockedHandlerCalls[1][1]).toBe("newPassword");
    });

    it("validates that the current password isn't left empty", () => {
        expect(publisherComponent.state("currentPassword").error).toBe("");
        publisherComponent.instance().handleSubmit(mockEvent);
        expect(publisherComponent.state("currentPassword").error).toBe("You must enter your current password");
    });

    it("validates that the new password is valid", () => {
        expect(validatePassword.mock.calls.length).toBe(0);
        publisherComponent.setState({
            newPassword: {
                value: "foobar foobar foobar foobar",
                error: "",
            },
        });
        publisherComponent.instance().handleSubmit(mockEvent);
        expect(validatePassword.mock.calls.length).toBe(1);
        expect(validatePassword.mock.calls[0][0]).toBe("foobar foobar foobar foobar");
    });

    it("sends the request when current password is populated and new password is valid", () => {
        publisherComponent.setState({
            newPassword: {
                value: "foobar foobar foobar foobar",
                error: "",
            },
            currentPassword: {
                value: "barfoo barfoo barfoo barfoo",
                error: "",
            },
        });
        expect(user.updatePassword.mock.calls.length).toBe(0);
        publisherComponent.instance().handleSubmit(mockEvent);
        expect(user.updatePassword.mock.calls.length).toBe(1);
    });

    it("doesn't send the request when current password and new password aren't valid", () => {
        validatePassword.mockImplementationOnce(() => ({
            isValid: false,
            error: "An error message",
        }));
        publisherComponent.setState({
            newPassword: {
                value: "foobar foobar",
                error: "",
            },
            currentPassword: {
                value: "",
                error: "",
            },
        });
        expect(user.updatePassword.mock.calls.length).toBe(0);
        publisherComponent.instance().handleSubmit(mockEvent);
        expect(user.updatePassword.mock.calls.length).toBe(0);
    });

    it("doesn't send the request when current password isn't valid", () => {
        publisherComponent.setState({
            newPassword: {
                value: "foobar foobar foobar foobar",
                error: "",
            },
            currentPassword: {
                value: "",
                error: "",
            },
        });
        expect(user.updatePassword.mock.calls.length).toBe(0);
        publisherComponent.instance().handleSubmit(mockEvent);
        expect(user.updatePassword.mock.calls.length).toBe(0);
    });

    it("doesn't send the request when new password isn't valid", () => {
        validatePassword.mockImplementationOnce(() => ({
            isValid: false,
            error: "An error message",
        }));
        publisherComponent.setState({
            newPassword: {
                value: "f b e r",
                error: "",
            },
            currentPassword: {
                value: "barfoo barfoo barfoo barfoo",
                error: "",
            },
        });
        expect(user.updatePassword.mock.calls.length).toBe(0);
        publisherComponent.instance().handleSubmit(mockEvent);
        expect(user.updatePassword.mock.calls.length).toBe(0);
    });
});

describe("Admin changing a user's password", () => {
    let adminComponent;

    beforeEach(() => {
        adminComponent = shallow(<ChangeUserPasswordController {...adminProps} />);
        user.updatePassword.mockClear();
        validatePassword.mockClear();
    });

    it("only renders input for new password", () => {
        const inputs = adminComponent.instance().formInputs();
        expect(inputs.length).toBe(1);
        expect(inputs[0].id).toBe("new-password");
    });

    it("doesn't attempt to validate a currentPassword value", () => {
        expect(adminComponent.state("currentPassword").value).toBe("");
        expect(adminComponent.state("currentPassword").error).toBe("");
        adminComponent.instance().handleSubmit(mockEvent);
        expect(adminComponent.state("currentPassword").error).toBe("");
    });

    it("validates that the new password is valid", () => {
        expect(validatePassword.mock.calls.length).toBe(0);
        adminComponent.setState({
            newPassword: {
                value: "my new password",
                error: "",
            },
        });
        adminComponent.instance().handleSubmit(mockEvent);
        expect(validatePassword.mock.calls.length).toBe(1);
        expect(validatePassword.mock.calls[0][0]).toBe("my new password");
    });

    it("sends the request when the new password is valid", () => {
        expect(user.updatePassword.mock.calls.length).toBe(0);
        adminComponent.setState({
            newPassword: {
                value: "foobar foobar foobar foobar",
                error: "",
            },
        });
        adminComponent.instance().handleSubmit(mockEvent);
        expect(user.updatePassword.mock.calls.length).toBe(1);
    });

    it("doesn't send the request when the new password isn't valid", () => {
        validatePassword.mockImplementationOnce(() => ({
            isValid: false,
            error: "An error message",
        }));
        expect(user.updatePassword.mock.calls.length).toBe(0);
        adminComponent.instance().handleSubmit(mockEvent);
        expect(user.updatePassword.mock.calls.length).toBe(0);
    });
});

describe("Sending the request to change password", () => {
    let component;

    beforeEach(() => {
        component = shallow(<ChangeUserPasswordController {...adminProps} />);
        dispatchedActions = [];
        user.logOut.mockClear();
        user.updatePassword.mockClear();
        notifications.add.mockClear();
        log.event.mockClear();
    });

    const publisherComponent = shallow(<ChangeUserPasswordController {...publisherProps} />);
    const adminComponent = shallow(<ChangeUserPasswordController {...adminProps} />);

    it("publishers see an inline error message if the current password is wrong (401 response)", async () => {
        user.updatePassword.mockImplementationOnce(() =>
            Promise.reject({
                status: 401,
            })
        );
        publisherComponent.setState({
            currentPassword: {
                value: "bad password",
                error: "",
            },
            newPassword: {
                value: "foobar foobar foobar foobar",
                error: "",
            },
        });

        expect(user.updatePassword.mock.calls.length).toBe(0);
        await publisherComponent.instance().handleSubmit(mockEvent);
        expect(user.updatePassword.mock.calls.length).toBe(1);
        expect(publisherComponent.state("currentPassword").value).toBe("bad password");
        expect(publisherComponent.state("currentPassword").error).toBe("Incorrect password");
    });

    it("admins are logged out if they receive a 401 response", async () => {
        user.updatePassword.mockImplementationOnce(() =>
            Promise.reject({
                status: 401,
            })
        );

        expect(user.logOut.mock.calls.length).toBe(0);
        expect(notifications.add.mock.calls.length).toBe(0);
        await adminComponent.instance().handleSubmit(mockEvent);
        expect(user.logOut.mock.calls.length).toBe(1);
        expect(notifications.add.mock.calls.length).toBe(0);
    });

    it("user's are notified if the request errors", async () => {
        user.updatePassword.mockImplementationOnce(() =>
            Promise.reject({
                status: 500,
            })
        );

        expect(notifications.add.mock.calls.length).toBe(0);
        await component.instance().handleSubmit(mockEvent);
        expect(notifications.add.mock.calls.length).toBe(1);
        expect(notifications.add.mock.calls[0][0].type).toBe("warning");
        expect(notifications.add.mock.calls[0][0].message).toBe("Unable to change user's password due to an unexpected error");
    });

    it("errors are logged", async () => {
        user.updatePassword.mockImplementationOnce(() =>
            Promise.reject({
                status: 404,
            })
        );

        expect(log.event.mock.calls.length).toBe(0);
        await component.instance().handleSubmit(mockEvent);
        expect(log.event.mock.calls.length).toBe(1);

        user.updatePassword.mockImplementationOnce(() =>
            Promise.reject({
                status: "undefined",
            })
        );

        expect(log.event.mock.calls.length).toBe(1);
        await component.instance().handleSubmit(mockEvent);
        expect(log.event.mock.calls.length).toBe(3);
    });

    it("user's are routed to the user details screen on success", async () => {
        expect(dispatchedActions.length).toBe(0);
        await component.instance().handleSubmit(mockEvent);
        expect(dispatchedActions.length).toBe(1);
        expect(dispatchedActions[0].type).toBe("@@router/CALL_HISTORY_METHOD");
        expect(dispatchedActions[0].payload.method).toBe("push");
        expect(dispatchedActions[0].payload.args[0]).toBe("../");
    });

    it("user's are shown a notification on success", async () => {
        expect(notifications.add.mock.calls.length).toBe(0);
        await component.instance().handleSubmit(mockEvent);
        expect(notifications.add.mock.calls.length).toBe(1);
        expect(notifications.add.mock.calls[0][0].type).toBe("positive");
        expect(notifications.add.mock.calls[0][0].message).toBe("Password successfully changed");
    });

    it("component's state is updated to reflect that the request is being sent", () => {
        expect(component.state("isSubmitting")).toBe(false);
        component.instance().handleSubmit(mockEvent);
        expect(component.state("isSubmitting")).toBe(true);
    });

    it("component's state is updated to reflect that the request has finished with an error", async () => {
        user.updatePassword.mockImplementationOnce(() =>
            Promise.reject({
                status: 500,
            })
        );

        expect(component.state("isSubmitting")).toBe(false);
        await component.instance().handleSubmit(mockEvent);
        expect(component.state("isSubmitting")).toBe(false);
    });

    it("when a publisher the component's state is mapped to the request bodies expected structure", () => {
        component.setState({
            currentPassword: {
                value: "current password is correct",
                error: "",
            },
            newPassword: {
                value: "a new password foobar",
                error: "",
            },
        });

        expect(user.updatePassword.mock.calls.length).toBe(0);
        component.instance().handleSubmit(mockEvent);
        expect(user.updatePassword.mock.calls.length).toBe(1);

        const requestBody = user.updatePassword.mock.calls[0][0];
        expect(requestBody).toEqual({
            oldPassword: "current password is correct",
            password: "a new password foobar",
            email: "foobar@email.com",
        });
    });

    it("when an admin the component's state is mapped to the request bodies expected structure", () => {
        component.setProps({
            params: {
                userID: "differentuser@email.com",
            },
        });
        component.setState({
            newPassword: {
                value: "a new password foobar",
                error: "",
            },
        });

        expect(user.updatePassword.mock.calls.length).toBe(0);
        component.instance().handleSubmit(mockEvent);
        expect(user.updatePassword.mock.calls.length).toBe(1);

        const requestBody = user.updatePassword.mock.calls[0][0];
        expect(requestBody).toEqual({
            oldPassword: "",
            password: "a new password foobar",
            email: "differentuser@email.com",
        });
    });
});

describe("Change password form props", () => {
    const component = shallow(<ChangeUserPasswordController {...defaultProps} />);

    component.instance().formInputs = () => "form inputs function";
    component.instance().handleSubmit = () => "handle submit function";
    component.instance().handleCancel = () => "handle close function";

    const getFormData = component => component.instance().render().props.children.props;

    it("runs this.formInputs() for the 'inputs' prop", () => {
        expect(getFormData(component).formData.inputs).toBe("form inputs function");
    });

    it("passes in this.handleSubmit for 'onSubmit'", () => {
        expect(getFormData(component).formData.onSubmit()).toBe("handle submit function");
    });

    it("passes in this.handleCancel for 'onCancel'", () => {
        expect(getFormData(component).formData.onCancel()).toBe("handle close function");
    });

    it("passes in this.state.isSubmitting for 'isSubmitting'", () => {
        component.setState({
            isSubmitting: "is submitting state",
        });
        expect(component.instance().render().props.children.props.formData.isSubmitting).toBe("is submitting state");
    });
});

describe("On close", () => {
    const component = shallow(<ChangeUserPasswordController {...defaultProps} />);

    it("user's are routed to the user's details screen", () => {
        expect(dispatchedActions.length).toBe(0);
        component.instance().handleCancel();
        expect(dispatchedActions.length).toBe(1);
        expect(dispatchedActions[0].type).toBe("@@router/CALL_HISTORY_METHOD");
        expect(dispatchedActions[0].payload.method).toBe("push");
        expect(dispatchedActions[0].payload.args[0]).toBe("../");
    });
});

describe("On input change component state updates", () => {
    const component = shallow(<ChangeUserPasswordController {...defaultProps} />);

    it("the 'current password' value updates", () => {
        expect(component.state("currentPassword").value).toBe("");
        component.instance().handleInputChange("a current password value", "currentPassword");
        expect(component.state("currentPassword").value).toBe("a current password value");
    });

    it("'current password' inline errors are removed", () => {
        component.setState({
            currentPassword: {
                value: "",
                error: "An inline error",
            },
        });
        expect(component.state("currentPassword").error).toBe("An inline error");
        component.instance().handleInputChange("a current password value", "currentPassword");
        expect(component.state("currentPassword").error).toBe("");
    });

    it("the newPassword value state updates", () => {
        expect(component.state("newPassword").value).toBe("");
        component.instance().handleInputChange("a new password value", "newPassword");
        expect(component.state("newPassword").value).toBe("a new password value");
    });

    it("'new password' inline errors are removed", () => {
        component.setState({
            newPassword: {
                value: "",
                error: "An inline error",
            },
        });
        expect(component.state("newPassword").error).toBe("An inline error");
        component.instance().handleInputChange("a new password value", "newPassword");
        expect(component.state("newPassword").error).toBe("");
    });

    it("doesn't update state if there is no 'property' passed to the method", () => {
        const initalState = component.state();
        component.instance().handleInputChange("a new password value", "");
        expect(component.state()).toBe(initalState);
    });
});

describe("Mapping state to props", () => {
    it("logged in user details from state are mapped to 'loggedInUser' prop", () => {
        const state = {
            state: {
                user: {
                    isAdmin: true,
                },
            },
        };
        const mappedProps = mapStateToProps(state);
        expect(mappedProps.loggedInUser).toBeTruthy();
        expect(mappedProps.loggedInUser.isAdmin).toBe(true);
    });
});
