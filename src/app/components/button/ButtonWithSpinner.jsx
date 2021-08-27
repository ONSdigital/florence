import React from "react";

import PropTypes from "prop-types";

const propTypes = {
    isSubmitting: PropTypes.bool,
};

const ButtonWithSpinner = props => {
    return (
        <div>
            <button type="submit" className="btn btn--primary margin-top--1" disabled={props.isSubmitting}>
                Sign in
            </button>
            {props.isSubmitting ? <div className="form__loader loader loader--dark margin-left--1" /> : ""}
        </div>
    );
};
ButtonWithSpinner.propTypes = propTypes;
export default ButtonWithSpinner;
