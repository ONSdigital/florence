import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import PropTypes from "prop-types";

import LoginForm from "./SignInForm";
import Modal from "../../components/Modal";
import ChangePasswordController from "../../components/change-password/ChangePasswordController";
import notifications from "../../utilities/notifications";

import http from "../../utilities/http";
import { errCodes } from "../../utilities/errorCodes";
import user from "../../utilities/api-clients/user";
import redirectToMainScreen from "../../utilities/redirectToMainScreen";
import log from "../../utilities/logging/log";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    rootPath: PropTypes.string.isRequired,
    location: PropTypes.object,
    enableNewSignIn: PropTypes.bool
};

export class LoginController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            validationErrors: {},
            email: {
                value: "",
                errorMsg: ""
            },
            password: {
                value: "",
                errorMsg: "",
                type: "password"
            },
            requestPasswordChange: false,
            isSubmitting: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePasswordChangeCancel = this.handlePasswordChangeCancel.bind(this);
        this.handlePasswordChangeSuccess = this.handlePasswordChangeSuccess.bind(this);
    }

    componentWillMount() {
        if (this.props.isAuthenticated) {
            this.props.dispatch(push(`${this.props.rootPath}/collections`));
        }
    }

    requestLogin(credentials) {
        user.signIn(credentials)
            .then(() => {
                this.handleLogin();
            })
            .catch(error => {
                let stateToSet = {};
                if (error) {
                    stateToSet = this.handleLoginError(error, stateToSet);
                }

                this.setState({
                    ...stateToSet,
                    isSubmitting: false
                });
            });
    }

    handleLoginError(error, stateToSet) {
        const notification = {
            type: "warning",
            isDismissable: true,
            autoDismiss: 15000
        };

        if (error.status != null) {
            if (error.status >= 400 && error.status < 500) {
                let errorContents = { errorsForBody: [], emailMessage: "", passwordMessage: "" };
                let validationErrors = {
                    heading: "Fix the following: "
                };

                if (error.body != null && error.body.errors != null) {
                    error.body.errors.forEach(anError => {
                        errorContents = this.showValidationError(anError, errorContents, notification);
                    });
                } else {
                    this.notifyUnexpectedError(notification);
                }

                validationErrors.body = errorContents.errorsForBody;
                stateToSet = {
                    ...this.state,
                    validationErrors
                };
                stateToSet.email.errorMsg = errorContents.emailMessage;
                stateToSet.password.errorMsg = errorContents.passwordMessage;
                // Temporary code until login work is connected to dp-identity-api
                if (error.status === 417) {
                    stateToSet.requestPasswordChange = true;
                }
                // End of temporary code
            } else {
                this.notifyUnexpectedError(notification);
            }
        } else {
            this.notifyUnexpectedError(notification);
        }

        return stateToSet;
    }

    showValidationError(anError, errorContents, notification) {
        switch (anError.code) {
            case "InvalidEmail":
                errorContents.errorsForBody.push(
                    <p key="error-invalid-email">
                        <a href="javascript:document.getElementById('email').focus()" className="colour--night-shadz">
                            Enter a valid email address
                        </a>
                    </p>
                );
                errorContents.emailMessage = "Enter a valid email address";
                break;
            case "InvalidPassword":
                errorContents.errorsForBody.push(
                    <p key="error-invalid-password">
                        <a href="javascript:document.getElementById('password').focus()" className="colour--night-shadz">
                            Enter a password
                        </a>
                    </p>
                );
                errorContents.passwordMessage = "Enter a password";
                break;
            case "NotAuthorised":
                errorContents.errorsForBody.push(<p key="error-not-authorised">Email address or password are incorrect</p>);
                break;
            case "TooManyFailedAttempts":
                errorContents.errorsForBody.push(
                    <p key="error-too-many-attempts">You've tried to sign in to your account too many times. Please try again later.</p>
                );
                break;
            default:
                // Code undefined or different to expected range of errors
                this.notifyUnexpectedError(notification);
        }
        return errorContents;
    }

    notifyUnexpectedError(notification) {
        console.error(errCodes.LOGIN_UNEXPECTED_ERR);
        notification.message = errCodes.LOGIN_UNEXPECTED_ERR;
        notifications.add(notification);
    }

    handleLogin() {
        user.getPermissions(this.state.email.value)
            .then(userType => {
                user.setUserState(userType);
                redirectToMainScreen(this.props.location.query.redirect);
            })
            .catch(error => {
                this.setState({ isSubmitting: false });
                notifications.add({
                    type: "warning",
                    message: "Unable to login due to an error getting your account's permissions. Please refresh and try again.",
                    autoDismiss: 8000,
                    isDismissable: true
                });
                log.event("Error getting a user's permissions on login", log.error(error));
                console.error("Error getting a user's permissions on login", error);
            });
    }

    handleSubmit(event) {
        event.preventDefault();

        const credentials = {
            email: this.state.email.value,
            password: this.state.password.value
        };

        this.setState({ isSubmitting: true });

        this.requestLogin(credentials);
    }

    handleInputChange(event) {
        const id = event.target.id;
        const value = event.target.value;
        const checked = event.target.checked;

        switch (id) {
            case "email": {
                this.setState({
                    email: {
                        value: value,
                        errorMsg: ""
                    }
                });
                break;
            }
            case "password": {
                this.setState(prevState => ({
                    password: {
                        ...prevState.password,
                        value: value,
                        errorMsg: ""
                    }
                }));
                break;
            }
            case "toggle-password": {
                this.setState(prevState => ({
                    password: {
                        ...prevState.password,
                        type: checked && this.props.enableNewSignIn ? "text" : "password"
                    }
                }));
                break;
            }
            default: {
                const notification = {
                    type: "warning",
                    isDismissable: true,
                    autoDismiss: 15000
                };
                console.error(errCodes.UNEXPECTED_ERR);
                notification.message = errCodes.UNEXPECTED_ERR;
                notifications.add(notification);
            }
        }
    }

    handlePasswordChangeSuccess(newPassword) {
        const credentials = {
            email: this.state.email.value,
            password: newPassword
        };

        this.requestLogin(credentials);
    }

    handlePasswordChangeCancel(event) {
        event.preventDefault();

        this.setState({
            requestPasswordChange: false
        });
    }

    render() {
        const inputs = [
            {
                id: "email",
                label: "Email",
                type: "email",
                onChange: this.handleInputChange,
                error: this.state.email.errorMsg
            },
            {
                id: "password",
                label: "Password",
                type: this.state.password.type,
                onChange: this.handleInputChange,
                error: this.state.password.errorMsg,
                disableShowPasswordText: this.props.enableNewSignIn
            },
            {
                id: "toggle-password",
                label: "Show password",
                type: "checkbox",
                reverseLabelOrder: true,
                inline: true,
                onChange: this.handleInputChange
            }
        ];

        return (
            <div>
                <LoginForm
                    inputs={inputs}
                    isSubmitting={this.state.isSubmitting}
                    onSubmit={this.handleSubmit}
                    validationErrors={this.state.validationErrors}
                />

                {this.state.requestPasswordChange ? (
                    <Modal sizeClass={"grid__col-3"}>
                        <ChangePasswordController
                            handleCancel={this.handlePasswordChangeCancel}
                            handleSuccess={this.handlePasswordChangeSuccess}
                            currentPassword={this.state.password.value}
                            email={this.state.email.value}
                        />
                    </Modal>
                ) : (
                    ""
                )}
            </div>
        );
    }
}

LoginController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        isAuthenticated: state.state.user.isAuthenticated,
        rootPath: state.state.rootPath,
        enableNewSignIn: state.state.config.enableNewSignIn
    };
}

export default connect(mapStateToProps)(LoginController);
