import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import Modal from '../../../components/Modal';
import url from '../../../utilities/url';
import ChangePasswordForm from '../../../components/change-password/ChangePasswordForm';
import validatePassword from '../../../components/change-password/validatePassword';
import user from '../../../utilities/api-clients/user';
import log, { eventTypes } from '../../../utilities/log';
import notifications from '../../../utilities/notifications';

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.shape({
        userID: PropTypes.string.isRequired
    }).isRequired,
    currentUser: PropTypes.shape({
        isAdmin: PropTypes.bool.isRequired
    })
};

export class ChangeUserPasswordController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPassword: {
                value: "",
                error: ""
            },
            newPassword: {
                value: "",
                error: ""
            },
            isSubmitting: false
        }
    }

    handleError = error => {
        console.log(error);
    }

    handleCancel = () => {
        this.props.dispatch(push(url.resolve("../")));
    }

    handleInputChange = (value, property) => {
        this.setState({
            [property]: {
                value,
                error: ""
            }
        });
    }

    handleSubmit = event => {
        event.preventDefault();
        let hasError = false;
        let newState = {...this.state};

        if (!this.props.currentUser.isAdmin && !this.state.currentPassword.value) {
            newState = {
                ...newState,
                currentPassword: {
                    ...newState.currentPassword,
                    error: "You must enter your current password"
                }
            }
            hasError = true;
        }

        const validatedPassword = validatePassword(this.state.newPassword.value);
        if (!validatedPassword.isValid) {
            newState = {
                ...newState,
                newPassword: {
                    ...newState.newPassword,
                    error: validatedPassword.error
                }
            }
            hasError = true;
        }

        if (hasError) {
            this.setState(newState);
            return;
        }

        const passwordUpdate = {
            oldPassword: this.state.currentPassword.value,
            password: this.state.newPassword.value,
            email: this.props.params.userID
        };
        this.setState({isSubmitting: true});
        user.updatePassword(passwordUpdate).then(() => {
            this.props.dispatch(push(url.resolve("../")));
            notifications.add({
                type: "positive",
                isDismissable: true,
                autoDismiss: 7000,
                message: "Password successfully changed"
            });
        }).catch(error => {
            this.setState({isSubmitting: false});
            
            if (error.status === 401) {
                this.setState(state => ({
                    currentPassword: {
                        ...state.currentPassword,
                        error: "Incorrect password"
                    }
                }));
                return;
            }

            let notification = {
                type: "warning",
                isDismissable: true,
                message: "Unable to change user's password due to an unexpected error"
            };
            switch (error.status) {
                case(403): {
                    notification.message = "Unable to change user's password because you don't have permissions to do so";
                    break;
                }
                case(404): {
                    notification.message = "Unable to change user's password because this user doesn't longer exist";
                    break;
                }
                case("FETCH_ERR"): {
                    notification.message = "Unable to changes user's password due to a network error. Please check your connection and try again."
                }
            }
            console.error("Error changing a user's password", error);
            log.add(eventTypes.unexpectedRuntimeError, {message: `Error changing a user's password: ${JSON.stringify(error)}`});
            notifications.add(notification);
        });
    }

    formInputs = () => {
        let inputs = [{
                id: "new-password",
                label: "New password",
                type: "password",
                onChange: e => this.handleInputChange(e.target.value, "newPassword"),
                error: this.state.newPassword.error
        }];

        if (!this.props.currentUser.isAdmin) {
            inputs.splice(0, 0, {
                id: "current-password",
                label: "Current password",
                type: "password",
                onChange: e => this.handleInputChange(e.target.value, "currentPassword"),
                error: this.state.currentPassword.error
            });
        }

        return inputs;
    }

    render() {
        return (
            <Modal sizeClass="grid__col-xs-10 grid__col-md-6 grid__col-lg-4">
                <ChangePasswordForm
                    formData={{
                        inputs: this.formInputs(),
                        onSubmit: this.handleSubmit,
                        onCancel: this.handleCancel,
                        isSubmitting: this.state.isSubmitting
                    }}
                />
            </Modal>
        )
    }
}

ChangeUserPasswordController.propTypes = propTypes;

export function mapStateToProps(state) {
    return {
        currentUser: state.state.user
    }
}

export default connect(mapStateToProps)(ChangeUserPasswordController);