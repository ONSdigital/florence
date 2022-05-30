import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import PropTypes from "prop-types";
import LoginForm from "./SignInForm";
import notifications from "../../utilities/notifications";
import { errCodes } from "../../utilities/errorCodes";
import user from "../../utilities/api-clients/user";
import redirectToMainScreen from "../../utilities/redirect";
import log from "../../utilities/logging/log";
import ChangePasswordController from "../new-password/changePasswordController";
import ChangePasswordConfirmed from "../new-password/changePasswordConfirmed";
import sessionManagement from "../../utilities/sessionManagement";
import { status } from "../../constants/Authentication";
import { setAuthToken } from "../../utilities/auth";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    rootPath: PropTypes.string.isRequired,
    location: PropTypes.object,
};

export class LoginController extends Component {
    emailErrorMsg = "";
    passwordErrorMsg = "";
    session = "";

    constructor(props) {
        super(props);
        this.state = {
            passwordValue: "",
            emailValue: "",
            passwordType: "password",
            status: status.WAITING_USER_INITIAL_CREDS,
            firstTimeSignIn: false,
            validationErrors: {},
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.isAuthenticated) {
            this.props.dispatch(push(`${this.props.rootPath}/collections`));
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.isAuthenticated !== nextProps.isAuthenticated) return true;
        if (this.state !== nextState) return true;
        return false;
    }

    requestSignIn = credentials => {
        user.signIn(credentials)
            .then(response => {
                let newPasswordRequired = false;
                if (response.body != null && response.body.new_password_required != null) {
                    newPasswordRequired = response.body.new_password_required.toLowerCase() === "true";
                }
                if (newPasswordRequired) {
                    if (response.body != null && response.body.session != null) {
                        this.session = response.body.session;
                    }
                    this.setState({
                        firstTimeSignIn: true,
                    });
                } else {
                    if (response.body != null) {
                        sessionManagement.setSessionExpiryTime(response.body.expirationTime, response.body.refreshTokenExpirationTime);
                    }
                    this.setState(
                        {
                            status: status.SUBMITTING_PERMISSIONS,
                        },
                        this.setPermissions
                    );
                }
            })
            .catch(error => {
                if (error) {
                    this.handleLoginError(error);
                }

                this.setState({
                    status: status.WAITING_USER_INITIAL_CREDS,
                });
            });
    };

    handleLoginError = error => {
        const notification = {
            type: "warning",
            isDismissable: true,
            autoDismiss: 15000,
        };

        if (error.status != null) {
            if (error.status >= 400 && error.status < 500) {
                let errorsForBody = [];
                if (error.body != null && error.body.errors != null) {
                    error.body.errors.forEach(anError => {
                        this.addValidationError(anError, errorsForBody, notification);
                    });
                } else {
                    this.notifyUnexpectedError(notification);
                }
                this.setState({
                    validationErrors: {
                        heading: "Fix the following: ",
                        body: errorsForBody,
                    },
                });
            } else {
                this.notifyUnexpectedError(notification);
            }
        } else {
            this.notifyUnexpectedError(notification);
        }
    };

    addValidationError = (anError, errorsForBody, notification) => {
        switch (anError.code) {
            case "InvalidEmail":
                errorsForBody.push(
                    <p key="error-invalid-email">
                        <a href="javascript:document.getElementById('email').focus()" className="colour--night-shadz">
                            Enter a valid email address
                        </a>
                    </p>
                );
                this.emailErrorMsg = "Enter a valid email address";
                break;
            case "InvalidPassword":
                errorsForBody.push(
                    <p key="error-invalid-password">
                        <a href="javascript:document.getElementById('password').focus()" className="colour--night-shadz">
                            Enter a password
                        </a>
                    </p>
                );
                this.passwordErrorMsg = "Enter a password";
                break;
            case "NotAuthorised":
                errorsForBody.push(<p key="error-not-authorised">Email address or password are incorrect</p>);
                break;
            case "TooManyFailedAttempts":
                errorsForBody.push(
                    <p key="error-too-many-attempts">You've tried to sign in to your account too many times. Please try again later.</p>
                );
                break;
            default:
                // Code undefined or different to expected range of errors
                this.notifyUnexpectedError(notification);
        }
    };

    notifyUnexpectedError = notification => {
        console.error(errCodes.LOGIN_UNEXPECTED_ERR);
        notification.message = errCodes.LOGIN_UNEXPECTED_ERR;
        notifications.add(notification);
    };

    setPermissions = () => {
        user.getPermissions()
            .then(userType => {
                setAuthToken(userType);
                user.setUserState(userType);
                redirectToMainScreen(this.props.location.query.redirect);
            })
            .catch(error => {
                notifications.add({
                    type: "warning",
                    message: "Unable to login due to an error getting your account's permissions. Please refresh and try again.",
                    autoDismiss: 8000,
                    isDismissable: true,
                });
                log.event("Error getting a user's permissions on login", log.error(error));
                console.error("Error getting a user's permissions on login", error);
                user.logOut();
                if (!this.state.firstTimeSignIn) {
                    this.setState({ status: status.WAITING_USER_INITIAL_CREDS });
                }
            });
    };

    clearErrors = () => {
        this.setState({
            validationErrors: {},
        });
        this.emailErrorMsg = "";
        this.passwordErrorMsg = "";
    };

    submitSignIn = event => {
        event.preventDefault();

        const credentials = {
            email: this.state.emailValue,
            password: this.state.passwordValue,
        };
        this.clearErrors();
        this.setState({ status: status.SUBMITTING_SIGN_IN }, () => {
            this.requestSignIn(credentials);
        });
    };

    handleEmailInputChanged = event => {
        const value = event.target.value;
        this.emailErrorMsg = "";
        this.setState({
            emailValue: value,
        });
    };

    handlePasswordInputChanged = event => {
        const value = event.target.value;
        this.passwordErrorMsg = "";
        this.setState({
            passwordValue: value,
        });
    };

    toggleShowHidePassword = event => {
        const checked = event.target.checked;
        this.setState({
            passwordType: checked ? "text" : "password",
        });
    };

    handlePasswordResetError = error => {
        const notification = {
            type: "warning",
            isDismissable: true,
            autoDismiss: 15000,
        };
        const outputGenericError = () => {
            console.error(errCodes.RESET_PASSWORD_REQUEST_UNEXPECTED_ERR);
            log.event(errCodes.RESET_PASSWORD_REQUEST_UNEXPECTED_ERR, log.error(error));
            notification.message = errCodes.RESET_PASSWORD_REQUEST_UNEXPECTED_ERR;
        };

        if (error != null && error.status != null) {
            switch (error.status) {
                case 400:
                    // All validation errors will be captured by this; if using the web interface validation is checked before you can submit
                    console.error("Unable to validate the type, email, password, or session in the request");
                    log.event("Unable to validate the type, email, password, or session in the request", log.error(error));
                    notification.message = errCodes.SET_PASSWORD_VALIDATION_ERR;
                    break;
                case 500:
                    console.error("Invalid request body");
                    log.event("Invalid request body", log.error(error));
                    notification.message = errCodes.RESET_PASSWORD_REQUEST_UNEXPECTED_ERR;
                    break;
                case 501:
                    console.error("Requested unimplemented password change type");
                    log.event("Requested unimplemented password change type", log.error(error));
                    notification.message = errCodes.RESET_PASSWORD_REQUEST_UNEXPECTED_ERR;
                    break;
                default:
                    outputGenericError();
            }
        } else {
            outputGenericError();
        }
        notifications.add(notification);
    };

    passwordChangeSuccess = response => {
        sessionManagement.setSessionExpiryTime(response.body.expirationTime, response.body.refreshTokenExpirationTime);
        this.setState({
            status: status.SUBMITTED_PASSWORD_CHANGE,
        });
    };

    passwordChangeFail = error => {
        this.handlePasswordResetError(error);
        this.setState({
            status: status.WAITING_USER_NEW_PASSWORD,
        });
    };

    requestPasswordChange = newPassword => {
        this.setState({ status: status.SUBMITTING_PASSWORD_CHANGE }, () => {
            const body = {
                type: "NewPasswordRequired",
                email: this.state.emailValue,
                password: newPassword,
                session: this.session,
            };
            user.setForgottenPassword(body)
                .then(response => {
                    this.passwordChangeSuccess(response);
                })
                .catch(error => {
                    this.passwordChangeFail(error);
                });
        });
    };

    render() {
        if (this.state.firstTimeSignIn) {
            const changePasswordProps = {
                heading: "Change your password",
                buttonText: "Change password",
                requestPasswordChange: this.requestPasswordChange,
                changeConformation: <ChangePasswordConfirmed handleClick={this.setPermissions} />,
                status: this.state.status,
            };

            return <ChangePasswordController {...changePasswordProps} />;
        } else {
            const inputs = [
                {
                    id: "email",
                    label: "Email",
                    type: "email",
                    onChange: this.handleEmailInputChanged,
                    error: this.emailErrorMsg,
                },
                {
                    id: "password",
                    label: "Password",
                    type: this.state.passwordType,
                    onChange: this.handlePasswordInputChanged,
                    error: this.passwordErrorMsg,
                    disableShowPasswordText: true,
                },
                {
                    id: "toggle-password",
                    label: "Show password",
                    type: "checkbox",
                    reverseLabelOrder: true,
                    inline: true,
                    onChange: this.toggleShowHidePassword,
                },
            ];
            return (
                <LoginForm
                    inputs={inputs}
                    isSubmitting={this.state.status === status.SUBMITTING_SIGN_IN || this.state.status === status.SUBMITTING_PERMISSIONS}
                    onSubmit={this.submitSignIn}
                    validationErrors={this.state.validationErrors}
                />
            );
        }
    }
}

LoginController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        isAuthenticated: state.user.isAuthenticated,
        rootPath: state.state.rootPath,
    };
}

export default connect(mapStateToProps)(LoginController);
