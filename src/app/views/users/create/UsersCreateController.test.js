import React from "react";
import UsersCreateController from "./UsersCreateController";
import { shallow } from "enzyme";
import user from "../../../utilities/api-clients/user";

console.error = () => {};

jest.mock("../../../utilities/logging/log", () => ({
    event: jest.fn(() => {}),
    data: jest.fn(() => {}),
    error: jest.fn(() => {}),
}));

jest.mock("../../../utilities/notifications", () => {
    return {
        add: jest.fn(() => {}),
        remove: () => {},
    };
});

jest.mock("../../../utilities/api-clients/user", () => {
    return {
        create: jest.fn(() => {
            return Promise.resolve({});
        }),
        setPassword: jest.fn(() => {
            return Promise.resolve({});
        }),
        setPermissions: jest.fn(() => {
            return Promise.resolve({});
        }),
        remove: jest.fn(() => {
            return Promise.resolve({});
        }),
    };
});

const defaultProps = {
    onCreateSuccess: jest.fn(() => {}),
};

const defaultState = {
    newUser: {
        username: {
            value: "",
            error: "",
        },
        email: {
            value: "",
            error: "",
        },
        password: {
            value: "",
            error: "",
        },
        type: "viewer",
    },
    isSubmitting: false,
};

const testNewUser = {
    username: {
        value: "test-user",
        error: "",
    },
    email: {
        value: "test-email@email.com",
        error: "",
    },
    password: {
        value: "test-password",
        error: "",
    },
    type: "viewer",
};

const testNewAdminUser = {
    username: {
        value: "test-user",
        error: "",
    },
    email: {
        value: "test-admin-email@email.com",
        error: "",
    },
    password: {
        value: "test-password",
        error: "",
    },
    type: "admin",
};

// create a copy
const tempUser = JSON.parse(JSON.stringify(defaultState.newUser));

let component;

beforeEach(() => {
    component = shallow(<UsersCreateController {...defaultProps} />);
});

describe("Handle submit", () => {
    it("checks for empty username", () => {
        expect(component.state().newUser.username.error.length).toBe(0);
        component.instance().handleSubmit({ preventDefault: () => {} });
        expect(component.state().newUser.username.error.length).not.toBe(0);
    });

    it("checks for empty email", () => {
        expect(component.state().newUser.email.error.length).toBe(0);
        // const tempUser = {username: {value: ""}}
        const newTempUser = { ...tempUser };
        newTempUser.username.value = "temp-username";
        component.setState({ newUser: newTempUser });
        component.instance().handleSubmit({ preventDefault: () => {} });
        expect(component.state().newUser.email.error.length).not.toBe(0);
    });

    it("checks for empty password", () => {
        expect(component.state().newUser.password.error.length).toBe(0);
        // const tempUser = {email: {value: ""}}
        const newTempUser = { ...tempUser };
        newTempUser.username.value = "temp-username";
        newTempUser.email.value = "temp-email@email.com";
        component.setState({ newUser: newTempUser });
        component.instance().handleSubmit({ preventDefault: () => {} });
        expect(component.state().newUser.password.error.length).not.toBe(0);
    });

    describe("on creation of user", () => {
        afterEach(() => {
            tempUser.username.value = "";
            tempUser.email.value = "";
            tempUser.password.value = "";
            defaultProps.onCreateSuccess.mockClear();
        });

        it("newUser state is reset", async () => {
            // const tempUser = {password: {value: ""}}
            const newTempUser = { ...tempUser };
            newTempUser.username.value = "temp-username";
            newTempUser.email.value = "temp-email@email.com";
            newTempUser.password.value = "password";
            component.setState({ newUser: newTempUser });
            await component.instance().handleSubmit({ preventDefault: () => {} });
            expect(component.state()).toMatchObject(defaultState);
        });

        it("onCreateSuccess is called with correct arguements", async () => {
            // const tempUser = {password: {value: ""}}
            const newTempUser = { ...tempUser };
            newTempUser.username.value = "temp-username";
            newTempUser.email.value = "temp-email@email.com";
            newTempUser.password.value = "password";
            component.setState({ newUser: newTempUser });
            expect(defaultProps.onCreateSuccess.mock.calls.length).toBe(0);
            await component.instance().handleSubmit({ preventDefault: () => {} });
            expect(defaultProps.onCreateSuccess.mock.calls.length).toBe(1);
            expect(defaultProps.onCreateSuccess.mock.calls[0][0]).toMatchObject({ name: "temp-username", email: "temp-email@email.com" });
        });
    });

    describe("on failed creation of user", () => {
        beforeEach(() => {
            user.setPassword.mockImplementationOnce(() => Promise.reject({}));
            user.create.mockImplementationOnce(() =>
                Promise.reject({
                    body: {
                        message: "mock message",
                    },
                })
            );
        });

        afterEach(() => {
            user.setPassword.mockClear();
            defaultProps.onCreateSuccess.mockClear();
            user.create.mockClear();
            user.setPassword.mockRestore();
            defaultProps.onCreateSuccess.mockRestore();
            user.create.mockRestore();
        });

        it("newUser state is not reset", async () => {
            // const tempUser = {username: {value: ""},email: {value: ""},password: {value: ""}}
            const newTempUser = { ...tempUser };
            newTempUser.username.value = "temp-username";
            newTempUser.email.value = "temp-email@email.com";
            newTempUser.password.value = "password";
            component.setState({ newUser: newTempUser });
            await component.instance().handleSubmit({ preventDefault: () => {} });
            expect(component.state().newUser).toMatchObject(newTempUser);
        });

        it("onCreateSuccess is not called", async () => {
            // const tempUser = {username: {value: ""},email: {value: ""},password: {value: ""}}
            const newTempUser = { ...tempUser };
            newTempUser.username.value = "temp-username";
            newTempUser.email.value = "temp-email@email.com";
            newTempUser.password.value = "password";
            component.setState({ newUser: newTempUser });
            expect(defaultProps.onCreateSuccess.mock.calls.length).toBe(0);
            await component.instance().handleSubmit({ preventDefault: () => {} });
            expect(defaultProps.onCreateSuccess.mock.calls.length).toBe(0);
        });
    });
});

describe("Create new user", () => {
    beforeEach(() => {
        user.remove.mockClear();
    });
    it("returns true on completion", async () => {
        user.create.mockImplementationOnce(() =>
            Promise.resolve({
                email: "mock@email.test",
                inactive: true,
                lastAdmin: "mockAdmin@email.test",
                name: "mockName",
                temporaryPassword: true,
            })
        );
        user.setPassword.mockImplementationOnce(() => Promise.resolve("Password updated for mock@email.test"));
        const result = await component.instance().createNewUser(testNewUser);
        console.log("testing result : ", result);
        expect(result).toBeTruthy();
    });

    it("returns on false if postNewUserDetails errors", async () => {
        user.create.mockImplementationOnce(() =>
            Promise.reject({
                body: {
                    message: "mock message",
                },
            })
        );
        const result = await component.instance().createNewUser(testNewUser);
        expect(result).toBeFalsy();
    });

    it("calls deleteErroredNewUser and returns on false if postNewUserPassword errors", async () => {
        user.create.mockImplementationOnce(() =>
            Promise.resolve({
                email: "mock@email.test",
                inactive: true,
                lastAdmin: "mockAdmin@email.test",
                name: "mockName",
                temporaryPassword: true,
            })
        );
        user.setPassword.mockImplementationOnce(() =>
            Promise.reject({
                body: {
                    message: "mock message",
                },
            })
        );
        expect(user.remove.mock.calls.length).toBe(0);
        const result = await component.instance().createNewUser(testNewUser);
        expect(result).toBeFalsy();
        expect(user.remove.mock.calls.length).toBe(1);
    });

    it("calls deleteErroredNewUser and returns on false if postNewUserPermissions errors", async () => {
        user.create.mockImplementationOnce(() =>
            Promise.resolve({
                email: "mock@email.test",
                inactive: true,
                lastAdmin: "mockAdmin@email.test",
                name: "mockName",
                temporaryPassword: true,
            })
        );
        user.setPassword.mockImplementationOnce(() => Promise.resolve("Password updated for mock@email.test"));
        user.setPermissions.mockImplementationOnce(() =>
            Promise.reject({
                body: {
                    message: "mock message",
                },
            })
        );
        expect(user.remove.mock.calls.length).toBe(0);
        const result = await component.instance().createNewUser(testNewUser);
        expect(result).toBeFalsy();
        expect(user.remove.mock.calls.length).toBe(1);
    });
});

describe("Posting new user details", () => {
    it("returns response on success", async () => {
        user.create.mockImplementationOnce(() =>
            Promise.resolve({
                email: "mock@email.test",
                inactive: true,
                lastAdmin: "mockAdmin@email.test",
                name: "mockName",
                temporaryPassword: true,
            })
        );
        const postNewDetailsBody = {
            name: testNewUser.username.value,
            email: testNewUser.email.value,
        };
        const response = await component.instance().postNewUserDetails(postNewDetailsBody);
        expect(response.response).toBeTruthy();
    });

    it("returns error on failure", async () => {
        const postNewDetailsBody = {
            name: testNewUser.username.value,
            email: testNewUser.email.value,
        };
        user.create.mockImplementationOnce(() => Promise.reject({}));
        const response = await component.instance().postNewUserDetails(postNewDetailsBody);
        expect(response.error).toBeTruthy();
    });
});

describe("Posting new user password", () => {
    it("returns response on success", async () => {
        user.create.mockImplementationOnce(() =>
            Promise.resolve({
                email: "mock@email.test",
                inactive: true,
                lastAdmin: "mockAdmin@email.test",
                name: "mockName",
                temporaryPassword: true,
            })
        );
        const postNewPasswordBody = {
            email: testNewUser.email.value,
            password: testNewUser.password.value,
        };
        const response = await component.instance().postNewUserDetails(postNewPasswordBody);
        expect(response.response).toBeTruthy();
    });

    it("returns error on failure and calls deleteErroredUser", async () => {
        user.create.mockImplementationOnce(() =>
            Promise.resolve({
                email: "mock@email.test",
                inactive: true,
                lastAdmin: "mockAdmin@email.test",
                name: "mockName",
                temporaryPassword: true,
            })
        );
        const postNewPasswordBody = {
            email: testNewUser.email.value,
            password: testNewUser.password.value,
        };
        user.setPassword.mockImplementationOnce(() => Promise.reject({}));
        const response = await component.instance().postNewUserDetails(postNewPasswordBody);
        expect(response.error).toBeNull();
        expect(user.remove.mock.calls.length).toBe(1);
    });
});

describe("Posting new user permission", () => {
    it("returns response on success", async () => {
        user.create.mockImplementationOnce(() =>
            Promise.resolve({
                email: "mock@email.test",
                inactive: true,
                lastAdmin: "mockAdmin@email.test",
                name: "mockName",
                temporaryPassword: true,
            })
        );
        const postNewPermissionsBody = {
            email: testNewUser.email.value,
            admin: false,
            editor: true,
        };
        const response = await component.instance().postNewUserDetails(postNewPermissionsBody);
        expect(response.response).toBeTruthy();
    });

    it("returns error on failure and calls deleteErroredUser", async () => {
        user.create.mockImplementationOnce(() =>
            Promise.resolve({
                email: "mock@email.test",
                inactive: true,
                lastAdmin: "mockAdmin@email.test",
                name: "mockName",
                temporaryPassword: true,
            })
        );
        const postNewPermissionsBody = {
            email: testNewUser.email.value,
            admin: false,
            editor: true,
        };
        user.setPassword.mockImplementationOnce(() => Promise.reject({}));
        const response = await component.instance().postNewUserDetails(postNewPermissionsBody);
        expect(response.error).toBeNull();
        expect(user.remove.mock.calls.length).toBe(1);
    });
});

test("mapUserDetailsPostBody maps correctly", () => {
    const result = component.instance().mapUserDetailsPostBody(testNewUser);
    expect(result).toMatchObject({ name: testNewUser.username.value, email: testNewUser.email.value });
});

test("mapUserPasswordPostBody maps correctly", () => {
    const result = component.instance().mapUserPasswordPostBody(testNewUser);
    expect(result).toMatchObject({ email: testNewUser.email.value, password: testNewUser.password.value });
});

test("mapUserPermissionPostBody maps correctly", () => {
    const userResult = component.instance().mapUserPermissionPostBody(testNewUser);
    expect(userResult).toMatchObject({ email: testNewUser.email.value, admin: false, editor: false });
    const adminResult = component.instance().mapUserPermissionPostBody(testNewAdminUser);
    expect(adminResult).toMatchObject({ email: testNewAdminUser.email.value, admin: true, editor: false });
});

test("Handle input change updates state correct", () => {
    expect(component.state().newUser.username.value).toBe("");
    component.instance().handleInputChange({ target: { id: "username", value: "test-username" } });
    expect(component.state().newUser.username.value).toBe("test-username");
});

test("Handle user type change updates state correct", () => {
    expect(component.state().newUser.type).toBe("viewer");
    component.instance().handleUserTypeChange({ value: "publisher" });
    expect(component.state().newUser.type).toBe("publisher");
});
