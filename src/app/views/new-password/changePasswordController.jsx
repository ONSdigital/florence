import React, { Component } from "react";
import PropTypes from "prop-types";
import ChangePasswordForm from "./changePasswordForm";
import { status } from "../../constants/changePassword";

const propTypes = {
    changeConformation: PropTypes.element,
    requestPasswordChange: PropTypes.func,
    status: PropTypes.string,
    heading: PropTypes.string,
    buttonText: PropTypes.string

};

export class ChangePasswordController extends Component {
    passwordIsValid = false;

    constructor(props) {
        super(props);
        this.state = {
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
        this.props.requestPasswordChange(this.state.password);
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
        const changePasswordFormProps = {
            validityCheck: this.validityCheck,
            onSubmit: this.onSubmit,
            heading: this.props.heading,
            buttonText: this.props.buttonText,
            showInputError: this.state.showInputError,
            isSubmitting: this.props.status === status.SUBMITTING_PASSWORD_CHANGE
        };
        if (this.props.status === status.COMPLETED || this.props.status === status.SUBMITTED_PASSWORD_CHANGE) {
            return this.props.changeConformation;
        }
        return <ChangePasswordForm {...changePasswordFormProps} />;
    }
}

ChangePasswordController.propTypes = propTypes;

export default ChangePasswordController;
