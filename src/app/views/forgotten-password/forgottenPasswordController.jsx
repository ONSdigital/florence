import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import PropTypes from "prop-types";
import ForgottenPasswordRequest from "./forgottenPasswordRequest";
import ForgottenPasswordEmailSent from "./forgottenPasswordEmailSent";
import http from "../../utilities/http";
import { errCodes } from "../../utilities/errorCodes";
import notifications from "../../utilities/notifications";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    rootPath: PropTypes.string.isRequired,
    location: PropTypes.object
};

export class ForgottenPasswordController extends Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.requestEmailChange = this.requestEmailChange.bind(this);
        this.postResetPassword = this.postResetPassword.bind(this);
        this.handleResetPasswordError = this.handleResetPasswordError.bind(this);
        this.showValidationError = this.showValidationError.bind(this);
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
            .then(response => {
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
        const screenToShow = this.state.hasSubmitted ? (
            <ForgottenPasswordEmailSent />
        ) : (
            <ForgottenPasswordRequest emailInput={emailInput} validationErrors={this.state.validationErrors} onSubmit={this.handleSubmit} />
            // <ForgottenPasswordRequest validationErrors={this.state.validationErrors} />
        );
        return <div>{screenToShow}</div>;
    }
}

ForgottenPasswordController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        isAuthenticated: state.state.user.isAuthenticated,
        rootPath: state.state.rootPath
    };
}

export default connect(mapStateToProps)(ForgottenPasswordController);
