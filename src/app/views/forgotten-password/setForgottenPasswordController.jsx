import React, { Component } from "react";
import PropTypes from "prop-types";
import SetForgottenPasswordRequest from "./setForgottenPasswordRequest";
import SetForgottenPasswordConfirmed from "./setForgottenPasswordConfirmed";
import user from "../../utilities/api-clients/user";
import { errCodes } from "../../utilities/errorCodes";
import notifications from "../../utilities/notifications";
import log from "../../utilities/logging/log";

const propTypes = {
    dispatch: PropTypes.func.isRequired
};

export class SetForgottenPasswordController extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasSubmitted: false,
            isSubmitted: false,
            passwordIsValid: false,
            password: ""
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.validityCheck = this.validityCheck.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();
        console.log("submitting");

        const requestBody = {
            type: "ForgottenPassword",
            verification_token: this.props.location.query.vid,
            password: this.state.password
        };

        this.setState({ isSubmitting: true }, () => {
            this.requestPasswordChange(requestBody);
        });
    }

    requestPasswordChange(body) {
        console.log("submitting");
        user.setForgottenPassword(body)
            .then(() => {
                this.setState({
                    hasSubmitted: true,
                    isSubmitting: false
                });
            })
            .catch(error => {
                if (error) {
                    this.handlePasswordResetError(error);
                }
                this.setState({
                    isSubmitting: false
                });
            });
    }

    handlePasswordResetError(error) {
        const notification = {
            type: "warning",
            isDismissable: true,
            autoDismiss: 15000
        };

        if (error.status != null) {
            if (error.status === 400) {
                console.error("Unable to validate the type, email, password, or verification_token in the request");
                log.event("Unable to validate the type, email, password, or verification_token in the request", log.error(error));
                notification.message = errCodes.RESET_PASSWORD_VALIDATION_ERR;
            } else if (error.status === 500) {
                console.error("Invalid request body");
                log.event("Invalid request body", log.error(error));
                notification.message = errCodes.RESET_PASSWORD_REQUEST_UNEXPECTED_ERR;
            } else if (error.status === 501) {
                console.error("Requested unimplemented password change type");
                log.event("Requested unimplemented password change type", log.error(error));
                notification.message = errCodes.RESET_PASSWORD_REQUEST_UNEXPECTED_ERR;
            } else {
                console.error(errCodes.RESET_PASSWORD_REQUEST_UNEXPECTED_ERR);
                log.event(errCodes.RESET_PASSWORD_REQUEST_UNEXPECTED_ERR, log.error(error));
                notification.message = errCodes.RESET_PASSWORD_REQUEST_UNEXPECTED_ERR;
            }
        } else {
            console.error(errCodes.RESET_PASSWORD_REQUEST_UNEXPECTED_ERR);
            log.event(errCodes.RESET_PASSWORD_REQUEST_UNEXPECTED_ERR, log.error(error));
            notification.message = errCodes.RESET_PASSWORD_REQUEST_UNEXPECTED_ERR;
        }
        notifications.add(notification);
    }

    validityCheck(isValid, password) {
        this.setState({
            passwordIsValid: isValid,
            password: password
        });
    }

    render() {
        const screenToShow = this.state.hasSubmitted ? (
            <SetForgottenPasswordConfirmed />
        ) : (
            <SetForgottenPasswordRequest validityCheck={this.validityCheck} isValid={this.state.passwordIsValid} onSubmit={this.onSubmit} />
        );
        return <div>{screenToShow}</div>;
    }
}

SetForgottenPasswordController.propTypes = propTypes;

export default SetForgottenPasswordController;
