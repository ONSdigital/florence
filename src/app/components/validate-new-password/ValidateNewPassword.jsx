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
            }
        };

        console.log("Validate password page called");
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        console.log("I am inside handleInputChange");
        const id = event.target.id;
        const value = event.target.value;
        const checked = event.target.checked;

        switch (id) {
            case "password-input": {
                this.setState(prevState => ({
                    password: {
                        ...prevState.password,
                        value: value
                    }
                }));
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
        const validateNewPasswordPanelBody = <ValidationItemList />;
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
