import React from "react";
import ValidateNewPassword from "../../components/validate-new-password/ValidateNewPassword";
import PropTypes from "prop-types";

const propTypes = {
    isSubmitting: PropTypes.bool,
    onSubmit: PropTypes.func,
    validityCheck: PropTypes.func
};

const SetForgottenPasswordRequest = props => {
    return (
        <div className="grid grid--justify-center">
            <div className="grid__col-3">
                <h1>Create a new password</h1>
                <form className="form" onSubmit={props.onSubmit}>
                    <ValidateNewPassword updateValidity={props.validityCheck} />
                    <button type="submit" className="btn btn--primary margin-top--1" disabled={props.isSubmitting}>
                        Sign in
                    </button>
                    {props.isSubmitting ? <div className="form__loader loader loader--dark margin-left--1" /> : ""}
                </form>
            </div>
        </div>
    );
};
SetForgottenPasswordRequest.propTypes = propTypes;

export default SetForgottenPasswordRequest;
