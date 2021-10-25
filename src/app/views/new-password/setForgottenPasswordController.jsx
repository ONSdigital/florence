import React, { Component } from "react";
import user from "../../utilities/api-clients/user";
import { errCodes } from "../../utilities/errorCodes";
import notifications from "../../utilities/notifications";
import log from "../../utilities/logging/log";
import ChangePasswordController from "./changePasswordController";
import SetForgottenPasswordConfirmed from "./setForgottenPasswordConfirmed";
import { status } from "../../constants/Authentication";

export class SetForgottenPasswordController extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: status.WAITING_USER_NEW_PASSWORD,
        };
    }

    requestPasswordChange = newPassword => {
        this.setState(
            {
                status: status.SUBMITTING_PASSWORD_CHANGE,
            },
            () => {
                let verificationID = new URLSearchParams(location.search).get("vid");
                let userID = new URLSearchParams(location.search).get("uid");
                // UID is sent in Email field, it was decided after initial backend development that UID is to be used instead
                // of email. Eventually the backend should be changed to use the endpoint /users/{uid}/password or at least
                // change the email field to be uid and then (TODO) this can be updated
                const body = {
                    type: "ForgottenPassword",
                    verification_token: verificationID,
                    email: userID,
                    password: newPassword,
                };
                user.setForgottenPassword(body)
                    .then(() => {
                        this.setState({
                            status: status.COMPLETED,
                        });
                    })
                    .catch(error => {
                        this.handlePasswordResetError(error);
                        this.setState({
                            status: status.WAITING_USER_NEW_PASSWORD,
                        });
                    });
            }
        );
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
                    console.error("Unable to validate the type, UID, password, or verification_token in the request");
                    log.event("Unable to validate the type, UID, password, or verification_token in the request", log.error(error));
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

    render() {
        const changePasswordProps = {
            changeConformation: <SetForgottenPasswordConfirmed />,
            requestPasswordChange: this.requestPasswordChange,
            status: this.state.status,
            heading: "Create a new password",
            buttonText: "Confirm password",
        };
        return <ChangePasswordController {...changePasswordProps} />;
    }
}

export default SetForgottenPasswordController;
