import React from "react";
import Panel from "../../components/panel/Panel";
import PropTypes from "prop-types";

const propTypes = {
    handleClick: PropTypes.func,
};

const ChangePasswordConfirmed = props => {
    const changePasswordPanelBody = [
        <p key="info-technical">
            If you have technical problems with your account, please email&nbsp;<a href="mailto:publishing@ons.gov.uk">publishing@ons.gov.uk</a>
        </p>,
    ];

    return (
        <div className="grid grid--justify-center">
            <div className="grid__col-3">
                <h1>Your password has been changed</h1>
                <p>Please Sign back in to start using Florence</p>
                <button type="button" onClick={props.handleClick} className="btn btn--primary margin-bottom--2 margin-right--5">
                    Sign back in
                </button>
                <Panel type={"information"} body={changePasswordPanelBody} />
            </div>
        </div>
    );
};

ChangePasswordConfirmed.propTypes = propTypes;

export default ChangePasswordConfirmed;
