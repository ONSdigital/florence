import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ChangePasswordForm from './ChangePasswordForm'
import log, { eventTypes } from '../../utilities/log';
import notifications from '../../utilities/notifications';
import { errCodes } from '../../utilities/errorCodes'
import user from '../../utilities/api-clients/user';

const propTypes = {
    email: PropTypes.string.isRequired,
    currentPassword: PropTypes.string.isRequired,
    handleSuccess: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired
};

export default class ChangePasswordController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isSubmitting: false,
            newPassword: {
                value: "",
                errorMsg: ""
            }
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const id = event.target.id;
        const value = event.target.value;

        switch(id) {
            case ("new-password") : {
                this.setState({
                    newPassword: {
                        value: value,
                        errorMsg: ""
                    }
                });
                break;
            }
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        const newPassword = this.state.newPassword.value;

        if (!newPassword.match(/.+\s.+\s.+\s.+/)) {
            const newPassword = Object.assign({}, this.state.newPassword, {errorMsg: "Passphrases must contain 4 words, separated by spaces"});
            this.setState({
                newPassword: newPassword
            });
            return;
        }

        if (newPassword.length <= 15 ) {
            const newPassword = Object.assign({}, this.state.newPassword, {errorMsg: "Passphrases must contain at least 15 characters"});

            this.setState({
                newPassword: newPassword
            });
            return;
        }

        const postBody = {
            password: this.state.newPassword.value,
            email: this.props.email,
            oldPassword: this.props.currentPassword
        };

        this.setState({isSubmitting: true});

        user.updatePassword(postBody).then(() => {
            this.props.handleSuccess(this.state.newPassword.value);
            const eventPayload = {
                email: this.props.email
            };
            log.add(eventTypes.passwordChangeSuccess, eventPayload);
            const notification = {
                type: 'neutral',
                isDismissable: true,
                autoDismiss: 15000,
                message: "Password changed successfully."
            };
            notifications.add(notification);
        }).catch(error => {
            const notification = {
                type: 'warning',
                isDismissable: true,
                autoDismiss: 15000
            };
            switch (error.status) {
                case (404): {
                    notification.message = "The user you are changing the password for was not recognised";
                    notifications.add(notification);
                    this.setState({ isSubmitting: false });
                    break;
                }
                case (401): {
                    notification.message = "You are not authorised to update this password";
                    notifications.add(notification);
                    this.setState({ isSubmitting: false });
                    break;
                }
                case ('UNEXPECTED_ERR'): {
                    console.error(errCodes.UNEXPECTED_ERR);
                    notification.message = errCodes.UNEXPECTED_ERR;
                    notifications.add(notification);
                    this.setState({ isSubmitting: false });
                    break;
                }
                case ('RESPONSE_ERR'): {
                    console.error(errCodes.RESPONSE_ERR);
                    notification.message = errCodes.RESPONSE_ERR;
                    notifications.add(notification);
                    this.setState({ isSubmitting: false });
                    break;
                }
                case ('FETCH_ERR'): {
                    console.error(errCodes.FETCH_ERR);
                    notification.message = errCodes.FETCH_ERR;
                    notifications.add(notification);
                    this.setState({ isSubmitting: false });
                    break;
                }
            }
        });
    }

    render() {
        const formData = {
            inputs: [
                {
                    id: "new-password",
                    label: "New Password",
                    type: "password",
                    onChange: this.handleInputChange,
                    error: this.state.newPassword.errorMsg
                }
            ],
            onSubmit: this.handleSubmit,
            onCancel: this.props.handleCancel,
            isSubmitting: this.state.isSubmitting
        };
        return (
            <ChangePasswordForm formData={formData} />
        )
    }

}

ChangePasswordController.propTypes = propTypes;