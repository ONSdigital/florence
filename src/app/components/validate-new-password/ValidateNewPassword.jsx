import React, { Component } from "react";
import Panel from "../panel/Panel";
import PropTypes from "prop-types";
import Input from "../Input";
import Checkbox from "../Checkbox";
import { errCodes } from "../../utilities/errorCodes";
import notifications from "../../utilities/notifications";
import ValidationItemList from "../../components/validation-item-list/ValidationItemList";
import { prototype } from "../../../node_modules/handsontable/handsontable";

const propTypes = {
    updateValidity: PropTypes.func
};

export class ValidateNewPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            validationErrors: {},
            password: {
                value: "",
                type: "password"
            },
            validationRules: this.validationRules
        };

        console.log("Validate password page called");
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    validationRules = [
        {
            name: "14 characters",
            checked: this.checkStringLength(),
            id: "minimum-character-limit",
            enabled: true
        },
        {
            name: "1 uppercase character",
            checked: this.checkUpperCase(),
            id: "uppercase-character-validation",
            enabled: true
        },
        {
            name: "1 lowercase character",
            checked: this.checkLowerCase(),
            id: "lowercase-character-validation",
            enabled: true
        },
        {
            name: "1 number",
            checked: this.checkNumberPresence(),
            id: "minimum-number-limit",
            enabled: true
        }
    ];

    checkPasswordValidation() {
        console.log("checking validation rule index[2] " + this.state.validationRules[2].checked);
        let newValidationRules = this.validationRules;
        console.log("output of new validation rule: " + JSON.stringify(newValidationRules));
        this.setState(
            {
                validationRules: [
                    {
                        name: "14 characters",
                        checked: this.checkStringLength(),
                        id: "minimum-character-limit",
                        enabled: true
                    },
                    {
                        name: "1 uppercase character",
                        checked: this.checkUpperCase(),
                        id: "uppercase-character-validation",
                        enabled: true
                    },
                    {
                        name: "1 lowercase character",
                        checked: this.checkLowerCase(),
                        id: "lowercase-character-validation",
                        enabled: true
                    },
                    {
                        name: "1 number",
                        checked: this.checkNumberPresence(),
                        id: "minimum-number-limit",
                        enabled: true
                    }
                ]
            },

            () => {
                let ruleChecked = true;
                this.state.validationRules.map(rule => {
                    if (!rule.checked) {
                        ruleChecked = false;
                    }
                });
                this.props.updateValidity(ruleChecked);
            }
        );

        console.log("password value is: " + this.state.password.value);
        console.log("checkStringlenght: " + this.checkStringLength());
        console.log("checkuppercase: " + this.checkUpperCase());
        console.log("checkLowercase: " + this.checkLowerCase());
        console.log("checkNumberpresence: " + this.checkNumberPresence());
    }
    checkStringLength() {
        const charMinLength = 13;
        console.log("I am inside check string length ");
        if (this.state == null || this.state.password == null || this.state.password.value == null) {
            return false;
        }
        return this.state.password.value.length > charMinLength;
    }
    checkUpperCase() {
        console.log("I am inside check upper case");
        if (this.state == null || this.state.password == null || this.state.password.value == null) {
            return false;
        }
        return /^.*[A-Z].*$/.test(this.state.password.value);
    }
    checkLowerCase() {
        console.log("I am inside check lower case");
        if (this.state == null || this.state.password == null || this.state.password.value == null) {
            return false;
        }
        return /^.*[a-z].*$/.test(this.state.password.value);
    }
    checkNumberPresence() {
        console.log("I am inside check number");
        if (this.state == null || this.state.password == null || this.state.password.value == null) {
            return false;
        }
        return /^.*[0-9].*$/.test(this.state.password.value);
    }

    handleInputChange(event) {
        console.log("I am inside handleInputChange");
        const id = event.target.id;
        const value = event.target.value;
        const checked = event.target.checked;
        console.log("value inside handleinputchange function" + value);

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
    }

    render() {
        const validateNewPasswordPanelBody = <ValidationItemList validationRules={this.state.validationRules} />;
        return (
            <div>
                <div className="margin-bottom--1">
                    <Panel type={"information"} heading={"Your password must have at least:"} body={validateNewPasswordPanelBody} />
                </div>
                <Input
                    id={"password-input"}
                    type={this.state.password.type}
                    label={"Password"}
                    onChange={this.handleInputChange}
                    disableShowPasswordText={true}
                />
                <Input
                    id={"password-checkbox"}
                    type={"checkbox"}
                    label={"Show password"}
                    onChange={this.handleInputChange}
                    reverseLabelOrder={true}
                    inline={true}
                />
            </div>
        );
    }
}

ValidateNewPassword.propTypes = propTypes;
export default ValidateNewPassword;
