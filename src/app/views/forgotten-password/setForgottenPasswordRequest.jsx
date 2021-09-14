import React from "react";
import NewPasswordInput from "../../components/validate-new-password/NewPasswordInput";
import PropTypes from "prop-types";
import ButtonWithSpinner from "../../components/button/ButtonWithSpinner";

const propTypes = {
    isSubmitting: PropTypes.bool,
    onSubmit: PropTypes.func,
    validityCheck: PropTypes.func,
    heading: PropTypes.string,
    buttonText: PropTypes.string,
    showInputError: PropTypes.bool
};

const SetForgottenPasswordRequest = props => {
    return (
        <div className="grid grid--justify-center">
            <div className="grid__col-3">
                <h1>{props.heading}</h1>
                <form className="form" onSubmit={props.onSubmit}>
                    <NewPasswordInput updateValidity={props.validityCheck} inputErrored={props.showInputError} />
                    <ButtonWithSpinner isSubmitting={props.isSubmitting} buttonText={props.buttonText} />
                </form>
            </div>
        </div>
    );
};
SetForgottenPasswordRequest.propTypes = propTypes;

export default SetForgottenPasswordRequest;
