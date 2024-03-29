import React, { Component } from "react";
import { connect } from "react-redux";
import { push, replace } from "react-router-redux";
import PropTypes from "prop-types";

import Modal from "../../../components/Modal";
import url from "../../../utilities/url";
import ChangePasswordForm from "../../../components/change-password/ChangePasswordForm";
import validatePassword from "../../../components/change-password/validatePassword";
import user from "../../../utilities/api-clients/user";
import log from "../../../utilities/logging/log";
import notifications from "../../../utilities/notifications";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.shape({
        userID: PropTypes.string.isRequired,
    }).isRequired,
    loggedInUser: PropTypes.shape({
        isAdmin: PropTypes.bool.isRequired,
        email: PropTypes.string.isRequired,
    }).isRequired,
    rootPath: PropTypes.string.isRequired,
};

export class ChangeUserPasswordController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPassword: {
                value: "",
                error: "",
            },
            newPassword: {
                value: "",
                error: "",
            },
            isSubmitting: false,
        };
    }

    UNSAFE_componentWillMount() {
        if (!this.props.loggedInUser.isAdmin && this.props.params.userID !== this.props.loggedInUser.email) {
            this.props.dispatch(replace(`${this.props.rootPath}/users/${this.props.params.userID}`));
        }
    }

    handleCancel = () => {
        this.props.dispatch(push(url.resolve("../")));
    };

    handleInputChange = (value, property) => {
        if (!property) {
            console.warn("No input ID given to change handle function");
            return;
        }
        this.setState({
            [property]: {
                value,
                error: "",
            },
        });
    };

    handleSubmit = event => {
        event.preventDefault();
        let hasError = false;
        let newState = { ...this.state };

        if (!this.props.loggedInUser.isAdmin && !this.state.currentPassword.value) {
            newState = {
                ...newState,
                currentPassword: {
                    ...newState.currentPassword,
                    error: "You must enter your current password",
                },
            };
            hasError = true;
        }

        const validatedPassword = validatePassword(this.state.newPassword.value);
        if (!validatedPassword.isValid) {
            newState = {
                ...newState,
                newPassword: {
                    ...newState.newPassword,
                    error: validatedPassword.error,
                },
            };
            hasError = true;
        }

        if (hasError) {
            this.setState(newState);
            return;
        }

        const passwordUpdate = {
            oldPassword: this.state.currentPassword.value,
            password: this.state.newPassword.value,
            email: this.props.params.userID,
        };
        this.setState({ isSubmitting: true });
        return user
            .updatePassword(passwordUpdate)
            .then(() => {
                this.props.dispatch(push(url.resolve("../")));
                notifications.add({
                    type: "positive",
                    isDismissable: true,
                    autoDismiss: 7000,
                    message: "Password successfully changed",
                });
                log.event("Successfully changed password of user", log.data({ user: passwordUpdate.email }));
            })
            .catch(error => {
                this.setState({ isSubmitting: false });
                log.event(
                    "Error changing password of user",
                    log.data({
                        user: passwordUpdate.email,
                        logged_in_user: this.props.loggedInUser.email,
                        is_admin: this.props.loggedInUser.isAdmin,
                    }),
                    log.error(error)
                );

                if (error.status === 401 && !this.props.loggedInUser.isAdmin) {
                    this.setState(state => ({
                        currentPassword: {
                            ...state.currentPassword,
                            error: "Incorrect password",
                        },
                    }));
                    return;
                }

                if (error.status === 401 && this.props.loggedInUser.isAdmin) {
                    user.logOut();
                    return;
                }

                let notification = {
                    type: "warning",
                    isDismissable: true,
                    message: "",
                };
                switch (error.status) {
                    case 403: {
                        notification.message = "Unable to change user's password because you don't have permissions to do so";
                        break;
                    }
                    case 404: {
                        notification.message = "Unable to change user's password because this user doesn't exist";
                        break;
                    }
                    case "FETCH_ERR": {
                        notification.message =
                            "Unable to changes user's password due to a network error. Please check your connection and try again.";
                        break;
                    }
                    case "UNEXPECTED_ERR": {
                        notification.message = "Unable to change user's password due to an unexpected error";
                        break;
                    }
                    default: {
                        log.event("Unhandled error changing password of user", log.data({ user: passwordUpdate.email }), log.error(error));
                        notification.message = "Unable to change user's password due to an unexpected error";
                        break;
                    }
                }
                console.error("Error changing a user's password", error);
                notifications.add(notification);
            });
    };

    formInputs = () => {
        let inputs = [
            {
                id: "new-password",
                label: "New password",
                type: "password",
                onChange: e => this.handleInputChange(e.target.value, "newPassword"),
                error: this.state.newPassword.error,
            },
        ];

        if (!this.props.loggedInUser.isAdmin) {
            inputs.splice(0, 0, {
                id: "current-password",
                label: "Current password",
                type: "password",
                onChange: e => this.handleInputChange(e.target.value, "currentPassword"),
                error: this.state.currentPassword.error,
            });
        }

        return inputs;
    };

    render() {
        return (
            <Modal sizeClass="grid__col-xs-10 grid__col-md-6 grid__col-lg-4">
                <ChangePasswordForm
                    formData={{
                        inputs: this.formInputs(),
                        onSubmit: this.handleSubmit,
                        onCancel: this.handleCancel,
                        isSubmitting: this.state.isSubmitting,
                    }}
                />
            </Modal>
        );
    }
}

ChangeUserPasswordController.propTypes = propTypes;

export function mapStateToProps(state) {
    return {
        rootPath: state.state.rootPath,
        loggedInUser: state.user,
    };
}

export default connect(mapStateToProps)(ChangeUserPasswordController);
