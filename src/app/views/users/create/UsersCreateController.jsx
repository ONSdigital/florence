import React, { Component } from "react";
import PropTypes from "prop-types";

import Input from "../../../components/Input";
import RadioGroup from "../../../components/radio-buttons/RadioGroup";

import user from "../../../utilities/api-clients/user";
import log from "../../../utilities/logging/log";
import notifications from "../../../utilities/notifications";

const propTypes = {
    onCreateSuccess: PropTypes.func.isRequired,
};

class UsersCreateController extends Component {
    constructor(props) {
        super(props);

        this.state = {
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

        this.blankNewUserDetails = this.state.newUser;
    }

    handleInputChange = event => {
        const propertyName = event.target.id;
        const value = event.target.value;

        const newPropertyState = {
            value: value,
            error: "",
        };

        const newUserState = {
            ...this.state.newUser,
            [propertyName]: newPropertyState,
        };

        this.setState({ newUser: newUserState });
    };

    handleUserTypeChange = event => {
        const value = event.value;

        const newUserState = {
            ...this.state.newUser,
            type: value,
        };

        this.setState({ newUser: newUserState });
    };

    handleSubmit = async event => {
        event.preventDefault();
        const newUser = this.state.newUser;

        if (!newUser.username.value.length) {
            log.event("valiation error: no username entered");
            const usernameState = {
                ...newUser.username,
                error: "You must enter a username",
            };
            const newUserState = {
                ...newUser,
                username: usernameState,
            };
            this.setState({ newUser: newUserState });
            return;
        }

        if (!newUser.email.value.length) {
            log.event("valiation error: no email address entered");
            const emailState = {
                ...newUser.email,
                error: "You must enter a email",
            };
            const newUserState = {
                ...newUser,
                email: emailState,
            };
            this.setState({ newUser: newUserState });
            return;
        }

        if (!newUser.password.value.length) {
            log.event("valiation error: no password entered");
            const passwordState = {
                ...newUser.password,
                error: "You must enter a password",
            };
            const newUserState = {
                ...newUser,
                password: passwordState,
            };
            this.setState({ newUser: newUserState });
            return;
        }

        this.setState({ isSubmitting: true });

        const createdUser = await this.createNewUser(this.state.newUser);

        if (createdUser) {
            this.setState({
                newUser: this.blankNewUserDetails,
                isSubmitting: false,
            });
            this.props.onCreateSuccess({
                name: newUser.username.value,
                email: newUser.email.value,
            });
            log.event("Successfully created user", log.data({ user: newUser.email.value }));
            return;
        }

        this.setState({ isSubmitting: false });
    };

    createNewUser = async newUser => {
        const newUserDetails = this.mapUserDetailsPostBody(newUser);
        const newUserPassword = this.mapUserPasswordPostBody(newUser);
        const newUserPerrmissions = this.mapUserPermissionPostBody(newUser);

        const newUserDetailsResponse = await this.postNewUserDetails(newUserDetails);
        if (newUserDetailsResponse.error) {
            const notification = {
                type: "warning",
                message: "Error mapping user details to PostBody",
                isDismissable: true,
            };
            notifications.add(notification);
            console.error("Error mapping user details to PostBody");
            log.event(
                "Error mapping user details to PostBody",
                log.data({
                    username: newUserDetails.username || null,
                    user_email: newUserDetails.email || null,
                    message: newUserDetailsResponse.error.body.message,
                }),
                log.error(newUserDetailsResponse.error)
            );
            return;
        }

        const newUserPasswordResponse = await this.postNewUserPassword(newUserPassword);
        if (newUserPasswordResponse.error) {
            const notification = {
                type: "warning",
                message: "Error mapping user password to PostBody",
                isDismissable: true,
            };
            notifications.add(notification);
            console.error("Error mapping user password to PostBody");
            log.event(
                "Error mapping user password to PostBody",
                log.data({
                    user_password: newUserPassword.password || null,
                    user_email: newUserPassword.email || null,
                    message: newUserPasswordResponse.error.body.message,
                }),
                log.error()
            );
            this.deleteErroredNewUser(newUser.email.value);
            return;
        }

        const newUserPerrmissionsResponse = await this.postNewUserPermissions(newUserPerrmissions);
        if (newUserPerrmissionsResponse.error) {
            const notification = {
                type: "warning",
                message: "Error mapping user permissions to PostBody",
                isDismissable: true,
            };
            notifications.add(notification);
            console.error("Error mapping user permissions to PostBody");
            log.event(
                "Error mapping user permissions to PostBody",
                log.data({
                    isAdmin: newUserPerrmissions.admin || false,
                    isEditor: newUserPerrmissions.editor || false,
                    user_email: newUserPerrmissions.email || null,
                    message: newUserPerrmissionsResponse.error.body.message,
                }),
                log.error()
            );
            this.deleteErroredNewUser(newUser.email.value);
            return;
        }

        return true;
    };

    mapUserDetailsPostBody = user => {
        return {
            name: user.username.value,
            email: user.email.value,
        };
    };

    mapUserPasswordPostBody = user => {
        return {
            email: user.email.value,
            password: user.password.value,
        };
    };

    mapUserPermissionPostBody = user => {
        return {
            email: user.email.value,
            admin: user.type === "admin",
            editor: user.type === "publisher",
        };
    };

    postNewUserDetails = newUserDetails => {
        return user
            .create(newUserDetails)
            .then(response => {
                return { response: response, error: null };
            })
            .catch(error => {
                log.event("Error creating user", log.data({ user: newUserDetails.email }), log.error(error));
                switch (error.status) {
                    case 403: {
                        const notification = {
                            type: "warning",
                            message: `You don't have permission to create users.`,
                            autoDismiss: 5000,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case 404: {
                        const notification = {
                            type: "warning",
                            message: `No API route available to create users.`,
                            autoDismiss: 5000,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case 409: {
                        const notification = {
                            type: "warning",
                            message: `User email "${newUserDetails.email}" already exists.`,
                            autoDismiss: 5000,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "RESPONSE_ERR": {
                        const notification = {
                            type: "warning",
                            message: "An error's occurred whilst trying to create a user.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "UNEXPECTED_ERR": {
                        const notification = {
                            type: "warning",
                            message: "An unexpected error's occurred whilst trying to create a user.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "FETCH_ERR": {
                        const notification = {
                            type: "warning",
                            message: "There's been a network error whilst trying to create a user.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    default: {
                        log.event(
                            "Unhandled error creating user",
                            log.data({
                                status_code: error.status,
                                user: newUserDetails.email,
                            }),
                            log.error(error)
                        );
                        const notification = {
                            type: "warning",
                            message: "An unexpected error's occurred whilst trying to create a user.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                }
                console.error("Error posting new user details:\n", error);
                return { response: null, error: error };
            });
    };

    postNewUserPassword = newUserPassword => {
        return user
            .setPassword(newUserPassword)
            .then(response => {
                return { response: response, error: null };
            })
            .catch(error => {
                log.event("Error seting user password", log.data({ user: newUserPassword.email }), log.error(error));
                switch (error.status) {
                    case 403: {
                        const notification = {
                            type: "warning",
                            message: `You don't have permission to set users' password.`,
                            autoDismiss: 5000,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case 404: {
                        const notification = {
                            type: "warning",
                            message: `No API route available to set users' password.`,
                            autoDismiss: 5000,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "RESPONSE_ERR": {
                        const notification = {
                            type: "warning",
                            message: "An error's occurred whilst trying to set users' password.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "UNEXPECTED_ERR": {
                        const notification = {
                            type: "warning",
                            message: "An unexpected error's occurred whilst trying to set users' password.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "FETCH_ERR": {
                        const notification = {
                            type: "warning",
                            message: "There's been a network error whilst trying to set users' password.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    default: {
                        log.event(
                            "Unhandled error seting user password",
                            log.data({
                                status_code: error.status,
                                user: newUserPassword.email,
                            }),
                            log.error(error)
                        );
                        const notification = {
                            type: "warning",
                            message: "An unexpected error's occurred whilst trying to set users' password.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                }
                console.error("Error posting new user password:\n", error);
                return { response: null, error: error };
            });
    };

    postNewUserPermissions = newUserPerrmissions => {
        return user
            .setPermissions(newUserPerrmissions)
            .then(response => {
                return { response: response, error: null };
            })
            .catch(error => {
                log.event("Error seting user permissions", log.data({ user: newUserPerrmissions.email }), log.error(error));
                switch (error.status) {
                    case 403: {
                        const notification = {
                            type: "warning",
                            message: `You don't have permission to set users' permission.`,
                            autoDismiss: 5000,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case 404: {
                        const notification = {
                            type: "warning",
                            message: `No API route available to set users' permission.`,
                            autoDismiss: 5000,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "RESPONSE_ERR": {
                        const notification = {
                            type: "warning",
                            message: "An error's occurred whilst trying to set users' permission.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "UNEXPECTED_ERR": {
                        const notification = {
                            type: "warning",
                            message: "An unexpected error's occurred whilst trying to set users' permission.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "FETCH_ERR": {
                        const notification = {
                            type: "warning",
                            message: "There's been a network error whilst trying to set users' permission.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    default: {
                        log.event(
                            "Unhandled error seting user permissions",
                            log.data({
                                status_code: error.status,
                                user: newUserPerrmissions.email,
                            }),
                            log.error(error)
                        );
                        const notification = {
                            type: "warning",
                            message: "An unexpected error's occurred whilst trying to set users' permission.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                }
                console.error("Error posting new user permissions:\n", error);
                return { response: null, error: error };
            });
    };

    deleteErroredNewUser = email => {
        user.remove(email)
            .then(response => {
                return { response: response, error: null };
            })
            .catch(error => {
                log.event("Error deleting errored user", log.data({ user: email }), log.error(error));
                notifications.add({
                    type: "warning",
                    message: "An error has occurred, the user has been created but will not work",
                    isDismissable: true,
                });
                console.error("Error deleting errored user:\n", error);
                return { response: null, error: error };
            });
    };

    render = () => {
        return (
            <div>
                <h1>Create a user</h1>
                <form name="create-new-user" onSubmit={this.handleSubmit}>
                    <Input
                        id="username"
                        label="Username"
                        type="text"
                        onChange={this.handleInputChange}
                        value={this.state.newUser.username.value}
                        error={this.state.newUser.username.error}
                    />
                    <Input
                        id="email"
                        label="Email"
                        type="email"
                        onChange={this.handleInputChange}
                        value={this.state.newUser.email.value}
                        error={this.state.newUser.email.error}
                    />
                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        onChange={this.handleInputChange}
                        value={this.state.newUser.password.value}
                        error={this.state.newUser.password.error}
                    />
                    <RadioGroup
                        radioData={[
                            { id: "admin", value: "admin", label: "Admin" },
                            {
                                id: "publisher",
                                value: "publisher",
                                label: "Publisher",
                            },
                            { id: "viewer", value: "viewer", label: "Viewer" },
                        ]}
                        groupName="user-type"
                        legend="User type"
                        onChange={this.handleUserTypeChange}
                        selectedValue={this.state.newUser.type}
                        inline={true}
                    />

                    <button type="submit" className="btn btn--positive margin-top--1" disabled={this.state.isSubmitting}>
                        Create user
                    </button>

                    {this.state.isSubmitting ? <div className="form__loader loader loader--dark margin-left--1"></div> : ""}
                </form>
            </div>
        );
    };
}

UsersCreateController.propTypes = propTypes;

export default UsersCreateController;
