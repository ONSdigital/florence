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

const status = {
    WAITING_USER_INPUT: "waiting for user input",
    SUBMITTING: "submitting",
    SUBMITTED: "submitted"
};

export class SetForgottenPasswordController extends Component {
    passwordIsValid = false;
    constructor(props) {
        super(props);
        this.state = {
            status: status.WAITING_USER_INPUT,
            password: "",
            showInputError: false
        };
    }

    onSubmit = event => {
        event.preventDefault();
        if (!this.passwordIsValid) {
            this.setState({ showInputError: true });
            return;
        }

        this.setState(
            {
                status: status.SUBMITTING
            },
            () => {
                this.requestPasswordChange();
            }
        );
    };

    requestPasswordChange() {
        let verificationID = new URLSearchParams(location.search).get("vid");
        let userID = new URLSearchParams(location.search).get("uid");
        // UID is sent in Email field, for speed of first delivery it was decided UID is to be used instead of email.
        // Eventually the backend should be changed to use the endpoint /users/{uid}/password or at least change the
        // email field to be uid and then (TODO) this can be updated
        const body = {
            type: "ForgottenPassword",
            verification_token: verificationID,
            email: userID,
            password: this.state.password
        };
        user.setForgottenPassword(body)
            .then(() => {
                this.setState({
                    status: status.SUBMITTED
                });
            })
            .catch(error => {
                this.handlePasswordResetError(error);
                this.setState({
                    status: status.WAITING_USER_INPUT
                });
            });
    }

    handlePasswordResetError(error) {
        const notification = {
            type: "warning",
            isDismissable: true,
            autoDismiss: 15000
        };
        const outputGenericError = () => {
            console.error(errCodes.RESET_PASSWORD_REQUEST_UNEXPECTED_ERR);
            log.event(errCodes.RESET_PASSWORD_REQUEST_UNEXPECTED_ERR, log.error(error));
            notification.message = errCodes.RESET_PASSWORD_REQUEST_UNEXPECTED_ERR;
        };

        if (error != null && error.status != null) {
            if (error.status === 400) {
                // All validation errors will be captured by this; if using the web interface validation is checked before you can submit
                console.error("Unable to validate the type, UID, password, or verification_token in the request");
                log.event("Unable to validate the type, UID, password, or verification_token in the request", log.error(error));
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
                outputGenericError();
            }
        } else {
            outputGenericError();
        }
        notifications.add(notification);
    }

    validityCheck = (isValid, password) => {
        // Only show input error if user had previously tried to submit password and it is still invalid
        const showInputError = !isValid && this.state.showInputError;
        this.passwordIsValid = isValid;
        this.setState({
            password: password,
            showInputError: showInputError
        });
    };

    render() {
        const setForgottenPasswordRequestProps = {
            validityCheck: this.validityCheck,
            isValid: this.passwordIsValid,
            onSubmit: this.onSubmit,
            heading: "Create a new password",
            buttonText: "Confirm password",
            showInputError: this.state.showInputError,
            isSubmitting: this.status === status.SUBMITTING
        };
        if (this.state.status === status.SUBMITTED) {
            return <SetForgottenPasswordConfirmed />;
        }
        return <SetForgottenPasswordRequest {...setForgottenPasswordRequestProps} />;
    }
}

SetForgottenPasswordController.propTypes = propTypes;

export default SetForgottenPasswordController;
