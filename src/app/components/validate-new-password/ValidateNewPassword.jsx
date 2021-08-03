import React from "react";
import Panel from "../panel/Panel";
import PropTypes from "prop-types";
import Input from "../Input";
import Checkbox from "../Checkbox";

const propTypes = {
    contents: PropTypes.array,
    label: PropTypes.string,
    id: PropTypes.string,
    override: PropTypes.bool,
    overrideLabel: PropTypes.string,
    overrideId: PropTypes.string,
    onChange: PropTypes.func
};

const ValidateNewPassword = props => {
    const validateNewPasswordPanelBody = <div></div>;
    console.log("Validate password page called");

    return (
        <div>
            <Panel type={"information"} heading={"Your password must have at least:"} body={validateNewPasswordPanelBody} />
            <Input id={"newpasswordinput"} type={"password"} label={"Password"} onChange={() => {}} disableToggleShowPassword={true} />
            {/*} <Input id={"newpasswordcheckbox"} type={"checkbox"} label={"Show password"} onChange={() => {}} reverseLabelOrder={true} inline={true} />*/}
        </div>
    );
};

ValidateNewPassword.propTypes = propTypes;
export default ValidateNewPassword;
