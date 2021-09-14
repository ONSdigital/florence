import React, {Component} from "react";
import {connect} from "react-redux";
import {push} from "react-router-redux";
import PropTypes from "prop-types";

import LoginForm from "./SignInForm";
import notifications from "../../utilities/notifications";

import {errCodes} from "../../utilities/errorCodes";
import user from "../../utilities/api-clients/user";
import redirectToMainScreen from "../../utilities/redirectToMainScreen";
import log from "../../utilities/logging/log";
import {FirstTimeSignInPasswordReset} from "../forgotten-password/firstTimeSignInPasswordReset";
import SetForgottenPasswordConfirmed from "../forgotten-password/setForgottenPasswordConfirmed";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    rootPath: PropTypes.string.isRequired,
    location: PropTypes.object,
    enableNewSignIn: PropTypes.bool
};
const status = {
    WAITING_USER_INITIAL_CREDS: "waiting users initial creds",
    SUBMITTING_SIGN_IN: "submitting sign in",
    SUBMITTING_PERMISSIONS: "submitting permissions",
    SUBMITTED_PERMISSIONS: "submitted permissions",
    WAITING_USER_NEW_PASSWORD: "waiting user new password",
    SUBMITTING_PASSWORD_CHANGE: "submitting password change",
    SUBMITTED_PASSWORD_CHANGE: "submitted password change"
};


export class LoginController extends Component {

    validationErrors = {};
    emailErrorMsg = "";
    passwordErrorMsg = "";
    session="";

    constructor(props) {
        super(props);
        this.state = {
            errorsPresent: false,
            passwordValue: "",
            emailValue: "",
            passwordType: "password",
            status: status.WAITING_USER_INITIAL_CREDS,
            requestPasswordChange: false,
        };
    }

    componentWillMount() {
        if (this.props.isAuthenticated) {
            this.props.dispatch(push(`${this.props.rootPath}/collections`));
        }
    }

    requestSignIn = (credentials) => {
        user.signIn(credentials)
            .then((response) => {
                //202
                let newPasswordRequired = false;
                // We only care about this one value in the whole response, no point parsing it all
                if(response.body != null && response.body.new_password_required !== null){
                    newPasswordRequired = JSON.parse(response.body["new_password_required"].toLowerCase());
                }
                if (newPasswordRequired) {
                    if(response.body != null && response.body.session !== null)
                    this.session = response.body.session
                    this.setState({
                        requestPasswordChange: true
                    })
                } else {
                    console.log("shouldn't have gotten into here")
                    this.setState({
                        errorsPresent: false,
                        status: status.SUBMITTED_PERMISSIONS
                    }, this.setPermissions)
                }

            })
            .catch(error => {
                if (error) {
                    // TODO refactor stateToSet
                    this.handleLoginError(error);
                }

                this.setState({
                    errorsPresent: error != null,
                    status: status.WAITING_USER_INITIAL_CREDS
                });
            });
    }

    handleLoginError = (error) => {
        const notification = {
            type: "warning",
            isDismissable: true,
            autoDismiss: 15000
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

                this.validationErrors = {
                    heading: "Fix the following: ",
                    body: errorsForBody
                };
            } else {
                this.notifyUnexpectedError(notification);
            }
        } else {
            this.notifyUnexpectedError(notification);
        }
    }

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
                        <a href="javascript:document.getElementById('password').focus()"
                           className="colour--night-shadz">
                            Enter a password
                        </a>
                    </p>
                );
                this.passwordErrorMsg = "Enter a password";
                break;
            case "NotAuthorised":
                errorsForBody.push(<p key="error-not-authorised">Email address or password are
                    incorrect</p>);
                break;
            case "TooManyFailedAttempts":
                errorsForBody.push(
                    <p key="error-too-many-attempts">You've tried to sign in to your account too many times. Please try
                        again later.</p>
                );
                break;
            default:
                // Code undefined or different to expected range of errors
                this.notifyUnexpectedError(notification);
        }
    }

    notifyUnexpectedError = (notification) => {
        console.error(errCodes.LOGIN_UNEXPECTED_ERR);
        notification.message = errCodes.LOGIN_UNEXPECTED_ERR;
        notifications.add(notification);
    }

    setPermissions = () => {
        user.getPermissions(this.state.emailValue)
            .then(userType => {
                this.setState({
                    status: status.SUBMITTED_PERMISSIONS
                }, () => {
                    user.setUserState(userType);
                    redirectToMainScreen(this.props.location.query.redirect);
                })
            })
            .catch(error => {
                this.setState({status: status.WAITING_USER_INITIAL_CREDS});
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

    clearErrors = () => {
        this.validationErrors = {};
        this.emailErrorMsg = "";
        this.passwordErrorMsg = "";
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const credentials = {
            email: this.state.emailValue,
            password: this.state.passwordValue
        };
        this.clearErrors();
        this.setState({status: status.SUBMITTING_SIGN_IN}, () => {
            this.requestSignIn(credentials)
        });
    }

    handleEmailInputChanged = (event) => {
        const value = event.target.value;
        this.emailErrorMsg = ""
        this.setState({
            emailValue: value
        });
    }

    handlePasswordInputChanged = (event) => {
        const value = event.target.value;
        this.passwordErrorMsg = ""
        this.setState({
            passwordValue: value
        });
    }
    toggleShowHidePassword = (event) => {
        const checked = event.target.checked;
        this.setState({
            passwordType: checked ? "text" : "password"
        });
    }

    handlePasswordChangeSuccess = (newPassword) => {
        const credentials = {
            email: this.state.emailValue,
            password: newPassword
        };

        this.requestSignIn(credentials);
    }

    handlePasswordChangeCancel = (event) => {
        event.preventDefault();

        this.setState({
            requestPasswordChange: false
        });
    }

    handlePasswordResetError = (error) => {
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

    requestPasswordChange = () => {
        const body = {
            type: "NewPasswordRequired",
            email: this.state.emailValue,
            password: this.state.passwordValue,
            session: this.session
        };
        user.setForgottenPassword(body)
            .then(() => {
                this.setState({
                    status: status.SUBMITTED_PASSWORD_CHANGE
                });
            })
            .catch(error => {
                this.handlePasswordResetError(error);
                this.setState({
                    status: status.WAITING_USER_NEW_PASSWORD
                });
            });
    }

    render() {
        const inputs = [
            {
                id: "email",
                label: "Email",
                type: "email",
                onChange: this.handleEmailInputChanged,
                error: this.emailErrorMsg
            },
            {
                id: "password",
                label: "Password",
                type: this.state.passwordType,
                onChange: this.handlePasswordInputChanged,
                error: this.passwordErrorMsg,
                disableShowPasswordText: this.props.enableNewSignIn
            },
            {
                id: "toggle-password",
                label: "Show password",
                type: "checkbox",
                reverseLabelOrder: true,
                inline: true,
                onChange: this.toggleShowHidePassword
            }
        ];
        if (this.state.requestPasswordChange) {
            return (<FirstTimeSignInPasswordReset email={this.state.emailValue}
                                                  requestPasswordChange={this.requestPasswordChange}
                                                  changeConformation={<SetForgottenPasswordConfirmed/>}
                                                  status={this.state.status}/>)
        } else {
            return (
                <LoginForm
                    inputs={inputs}
                    isSubmitting={this.state.status === status.SUBMITTING_SIGN_IN || this.state.status === status.SUBMITTING_PERMISSIONS}
                    onSubmit={this.handleSubmit}
                    validationErrors={this.validationErrors}
                />
            )
        }
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
