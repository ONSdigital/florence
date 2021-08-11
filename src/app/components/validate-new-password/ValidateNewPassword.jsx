import React, { Component } from "react";
import Panel from "../panel/Panel";
import PropTypes from "prop-types";
import Input from "../Input";
import Checkbox from "../Checkbox";
import { errCodes } from "../../utilities/errorCodes";
import notifications from "../../utilities/notifications";
import ValidationItemList from "../../components/validation-item-list/ValidationItemList";

const propTypes = {
    contents: PropTypes.array,
    label: PropTypes.string,
    id: PropTypes.string,
    override: PropTypes.bool,
    overrideLabel: PropTypes.string,
    overrideId: PropTypes.string,
    onChange: PropTypes.func
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
            ruleState: {
                stringLenght: false,
                upperCase: false,
                lowerCase: false,
                numberPresence: false
            }
        };

        console.log("Validate password page called");
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    checkPasswordValidation() {
        this.setState(
            {
                ruleState: {
                    stringLenght: this.checkStringLength(),
                    upperCase: this.checkUpperCase(),
                    lowerCase: this.checkLowerCase(),
                    numberPresence: this.checkNumberPresence()
                }
            },
            this.checkPasswordValidation
        );
        console.log("password value is: " + this.state.password.value);
        console.log("checkStringlenght: " + this.checkStringLength());
        console.log("checkuppercase: " + this.checkUpperCase());
        console.log("checkLowercase: " + this.checkLowerCase());
        console.log("checkNumberpresence: " + this.checkNumberPresence());
    }
    checkStringLength() {
        const charMinLength = 13;
        console.log("I am inside check string length");
        return this.state.password.value.length > charMinLength;
    }
    checkUpperCase() {
        console.log("I am inside check upper case");
        return /^.*[A-Z].*$/.test(this.state.password.value);
    }
    checkLowerCase() {
        console.log("I am inside check lower case");
        return /^.*[a-z].*$/.test(this.state.password.value);
    }
    checkNumberPresence() {
        console.log("I am inside check number");
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
        const validateNewPasswordPanelBody = <ValidationItemList ruleStates={this.state.ruleState} />;
        return (
            <div>
                <Panel type={"information"} heading={"Your password must have at least:"} body={validateNewPasswordPanelBody} />
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
