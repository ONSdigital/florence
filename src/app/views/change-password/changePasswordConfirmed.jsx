import React from "react";
import PropTypes from "prop-types";
import Panel from "../../components/panel/Panel";

const propTypes = {
    validationErrors: PropTypes.shape({
        hading: PropTypes.string,
        body: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    }),
    onSubmit: PropTypes.func,
    emailInput: PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string,
        type: PropTypes.string,
        onChange: PropTypes.func,
        error: PropTypes.string
    })
};

const ChangePasswordConfirmed = props => {
    const changePasswordPanelBody = (
        <p>
            If you have technical problems with your account, please email
            <a href="mailto:publishing@ons.gov.uk">publishing@ons.gov.uk</a>
        </p>
    );

    return (
        <div className="grid grid--justify-center">
            <div className="grid__col-3">
                <h1> Your password has been changed</h1>
                <a href="/florence/collections" className="margin-bottom--2 margin-right--5 anchor-btn">
                    Start using Florence
                </a>
                <Panel type={"information"} body={changePasswordPanelBody} />
            </div>
        </div>
    );
};
ChangePasswordConfirmed.propTypes = propTypes;
export default ChangePasswordConfirmed;
