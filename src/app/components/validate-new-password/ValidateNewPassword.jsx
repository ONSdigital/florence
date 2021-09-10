import React, { Component } from "react";
import Panel from "../panel/Panel";
import PropTypes from "prop-types";
import Input from "../Input";
import { errCodes } from "../../utilities/errorCodes";
import notifications from "../../utilities/notifications";
import ValidationItemList from "../../components/validation-item-list/ValidationItemList";

const propTypes = {
    updateValidity: PropTypes.func,
    inputErrored: PropTypes.bool
};

export class ValidateNewPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: {
                value: "",
                type: "password"
            },
            minimumCharacterLimitPassed: false,
            uppercaseCharacterValidationPassed: false,
            lowercaseCharacterValidationPassed: false,
            minimumNumberLimitPassed: false
        };
    }

    checkPasswordValidation() {
        this.setState(
            {
                minimumCharacterLimitPassed: this.checkStringLength(),
                uppercaseCharacterValidationPassed: this.checkUpperCase(),
                lowercaseCharacterValidationPassed: this.checkLowerCase(),
                minimumNumberLimitPassed: this.checkNumberPresence()
            },
            () => {
                if (
                    this.state.minimumCharacterLimitPassed === false ||
                    this.state.uppercaseCharacterValidationPassed === false ||
                    this.state.lowercaseCharacterValidationPassed === false ||
                    this.state.minimumNumberLimitPassed === false
                ) {
                    this.props.updateValidity(false, this.state.password.value);
                } else {
                    this.props.updateValidity(true, this.state.password.value);
                }
            }
        );
    }

    checkStringLength() {
        const charMinLength = 13;
        return this.state.password.value.length > charMinLength;
    }

    checkUpperCase() {
        return /^.*[A-Z].*$/.test(this.state.password.value);
    }

    checkLowerCase() {
        return /^.*[a-z].*$/.test(this.state.password.value);
    }

    checkNumberPresence() {
        return /^.*[0-9].*$/.test(this.state.password.value);
    }

    togglePasswordVisibility = event => {
        const id = event.target.id;
        const value = event.target.value;
        const checked = event.target.checked;

        switch (id) {
            case "password-input": {
                this.setState(
                    {
                        password: {
                            ...this.state.password,
                            value: value
                        }
                    },
                    this.checkPasswordValidation
                );
                break;
            }
            case "password-checkbox": {
                this.setState(prevState => ({
                    password: {
                        ...prevState.password,
                        type: checked ? "text" : "password"
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
    };

    render() {
        const validateNewPasswordPanelBody = (
            <ValidationItemList
                minimumCharacterLimitPassed={this.state.minimumCharacterLimitPassed}
                uppercaseCharacterValidationPassed={this.state.uppercaseCharacterValidationPassed}
                lowercaseCharacterValidationPassed={this.state.lowercaseCharacterValidationPassed}
                minimumNumberLimitPassed={this.state.minimumNumberLimitPassed}
            />
        );
        return (
            <div>
                <div className="margin-bottom--1">
                    <Panel type="information" heading="Your password must have at least:" body={validateNewPasswordPanelBody} />
                </div>
                <Input
                    id="password-input"
                    type={this.state.password.type}
                    label="Password"
                    onChange={this.togglePasswordVisibility}
                    disableShowPasswordText={true}
                    value={this.state.password.value}
                    displayInputAsErrored={this.props.inputErrored}
                />
                <Input
                    id="password-checkbox"
                    type="checkbox"
                    label="Show password"
                    onChange={this.togglePasswordVisibility}
                    reverseLabelOrder={true}
                    inline={true}
                />
            </div>
        );
    }
}

ValidateNewPassword.propTypes = propTypes;
export default ValidateNewPassword;
