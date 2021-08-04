import React, { Component } from "react";
import PropTypes from "prop-types";
import ForgottenPasswordRequest from "./forgottenPasswordRequest";
import ForgottenPasswordEmailSent from "./forgottenPasswordEmailSent";
import http from "../../utilities/http";
import { errCodes } from "../../utilities/errorCodes";
import notifications from "../../utilities/notifications";

const propTypes = {
    dispatch: PropTypes.func.isRequired
};

export class ForgottenPasswordController extends Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            validationErrors: {},
            email: {
                value: "",
                errorMsg: ""
            },
            hasSubmitted: false,
            isSubmitting: false
        };
    }

    showValidationError(anError, errorContents) {
        // Switch so that it is easily expandable if we introduce new error types
        switch (anError.code) {
            case "JSONMarshalError":
            case "InvalidEmail":
                errorContents.errorsForBody.push(
                    <p>
                        <a href="javascript:document.getElementById('email').focus()" className={"colour--night-shadz"}>
                            Enter a valid email address
                        </a>
                    </p>
                );
                errorContents.emailMessage = "Enter a valid email address";
                break;
            case "LimitExceeded":
                let notification = {
                    type: "warning",
                    isDismissable: true,
                    autoDismiss: 15000,
                    message: errCodes.RESET_PASSWORD_REQUEST_RATE_LIMIT
                };
                console.error(errCodes.RESET_PASSWORD_REQUEST_RATE_LIMIT);
                notifications.add(notification);
                break;
            default:
                this.notifyUnexpectedError();
        }
        return errorContents;
    }

    notifyUnexpectedError() {
        let notification = {
            type: "warning",
            isDismissable: true,
            autoDismiss: 15000,
            message: errCodes.RESET_PASSWORD_REQUEST_UNEXPECTED_ERR
        };
        console.error(errCodes.RESET_PASSWORD_REQUEST_UNEXPECTED_ERR);
        notifications.add(notification);
    }

    handleResetPasswordError(error, stateToSet) {
        if (error.status != null) {
            if (error.status >= 400 && error.status < 500) {
                let errorContents = { errorsForBody: [], emailMessage: "" };
                let validationErrors = {};

                if (error.body != null && error.body.errors != null) {
                    error.body.errors.forEach(anError => {
                        errorContents = this.showValidationError(anError, errorContents);
                        validationErrors.heading = "Fix the following: ";
                    });
                } else {
                    this.notifyUnexpectedError();
                }

                validationErrors.body = errorContents.errorsForBody;
                stateToSet = {
                    ...this.state,
                    validationErrors
                };
                stateToSet.email.errorMsg = errorContents.emailMessage;
            } else {
                this.notifyUnexpectedError();
            }
        } else {
            this.notifyUnexpectedError();
        }

        return stateToSet;
    }

    postResetPassword(body) {
        return http.post("/password-reset", body, true, true);
    }

    requestEmailChange(email) {
        const body = { email: email };
        this.postResetPassword(body)
            .then(() => {
                this.setState({ isSubmitting: false, hasSubmitted: true });
            })
            .catch(error => {
                let stateToSet = {};
                if (error) {
                    stateToSet = this.handleResetPasswordError(error, stateToSet);
                }

                this.setState({
                    ...stateToSet,
                    isSubmitting: false
                });
            });
    }

    handleInputChange(event) {
        this.setState({
            email: {
                value: event.target.value,
                errorMsg: ""
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const email = this.state.email.value;
        this.setState(
            {
                hasSubmitted: false,
                isSubmitting: true
            },
            () => {
                this.requestEmailChange(email);
            }
        );
    }

    render() {
        // Type text as we don't want the browser validation as it is not the most accessible
        const emailInput = {
            id: "email",
            label: "Email",
            type: "text",
            onChange: this.handleInputChange,
            error: this.state.email.errorMsg
        };
        return (
            <div>
                {this.state.hasSubmitted ? (
                    <ForgottenPasswordEmailSent email={this.state.email.value} />
                ) : (
                    <ForgottenPasswordRequest
                        emailInput={emailInput}
                        validationErrors={this.state.validationErrors}
                        onSubmit={this.handleSubmit}
                        waitingResponse={this.state.isSubmitting}
                    />
                )}
            </div>
        );
    }
}

ForgottenPasswordController.propTypes = propTypes;

export default ForgottenPasswordController;
