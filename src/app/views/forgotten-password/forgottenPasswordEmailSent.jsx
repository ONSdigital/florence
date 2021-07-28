import React from "react";
import Input from "../../components/Input";
import PropTypes from "prop-types";

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

const ForgottenPasswordEmailSent = props => {
    // TODO this page is to be done in an upcoming task
    return (
        <div className="grid grid--justify-center">
            <div className="grid__col-3">
                <h1>We sent you an email</h1>
            </div>
        </div>
    );
};
ForgottenPasswordEmailSent.propTypes = propTypes;
export default ForgottenPasswordEmailSent;
