import React, { Component } from "react";
import Panel from "../panel/Panel";
import PropTypes from "prop-types";
import Input from "../Input";
import ValidationItemList from "../../components/validation-item-list/ValidationItemList";

const propTypes = {
    updateValidity: PropTypes.func,
    inputErrored: PropTypes.bool
};

export class NewPasswordInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "password",
            password: "",
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
                let passwordIsValid = true;
                if (
                    !this.state.minimumCharacterLimitPassed ||
                    !this.state.uppercaseCharacterValidationPassed ||
                    !this.state.lowercaseCharacterValidationPassed ||
                    !this.state.minimumNumberLimitPassed
                ) {
                    passwordIsValid = false;
                }
                this.props.updateValidity(passwordIsValid, this.state.password);
            }
        );
    }

    checkStringLength() {
        const charMinLength = 13;
        return this.state.password.length > charMinLength;
    }

    checkUpperCase() {
        return /^.*[A-Z].*$/.test(this.state.password);
    }

    checkLowerCase() {
        console.log("this.state.password is: " + this.state.password)
        return /^.*[a-z].*$/.test(this.state.password);
    }

    checkNumberPresence() {
        return /^.*[0-9].*$/.test(this.state.password);
    }

    handleInputChange = event => {
        const passwordValue = event.target.value
        this.setState({
            password: passwordValue
        },  this.checkPasswordValidation)
    };

    togglePasswordVisibility = event => {
        const showPassword = event.target.checked;
        this.setState(() => ({
            type: showPassword ? "text" : "password"
        }));
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
                    type={this.state.type}
                    label="Password"
                    onChange={this.handleInputChange}
                    disableShowPasswordText={true}
                    value={this.state.password}
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

NewPasswordInput.propTypes = propTypes;
export default NewPasswordInput;
