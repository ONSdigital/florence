import React, {Component} from "react";
import PropTypes from "prop-types";
import SetForgottenPasswordRequest from "./setForgottenPasswordRequest";
import SetForgottenPasswordConfirmed from "./setForgottenPasswordConfirmed";
import user from "../../utilities/api-clients/user";
import {errCodes} from "../../utilities/errorCodes";
import notifications from "../../utilities/notifications";
import log from "../../utilities/logging/log";

const propTypes = {
    changeConformation: PropTypes.element,
    email: PropTypes.string,
    requestPasswordChange: PropTypes.func,
    status: PropTypes.string
};

const status = {
    WAITING_USER_NEW_PASSWORD: "waiting user new password",
    SUBMITTING_PASSWORD_CHANGE: "submitting password change",
    SUBMITTED_PASSWORD_CHANGE: "submitted password change",
};

export class FirstTimeSignInPasswordReset extends Component {
    passwordIsValid = false;

    constructor(props) {
        super(props);
        this.state = {
            status: status.WAITING_USER_NEW_PASSWORD,
            password: "",
            showInputError: false
        };
    }

    onSubmit = event => {
        event.preventDefault();
        if (!this.passwordIsValid) {
            this.setState({showInputError: true});
            return;
        }

        this.setState(
            {
                status: status.SUBMITTING_PASSWORD_CHANGE
            },
            () => {
                this.props.requestPasswordChange();
            }
        );
    };

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
            isSubmitting: this.status === status.SUBMITTING_PASSWORD_CHANGE
        };
        if (this.state.status === status.SUBMITTED_PASSWORD_CHANGE) {
            return this.props.changeConformation;
        }
        return <SetForgottenPasswordRequest {...setForgottenPasswordRequestProps} />;
    }
}

FirstTimeSignInPasswordReset.propTypes = propTypes;

export default FirstTimeSignInPasswordReset;
