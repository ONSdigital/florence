import React from "react";

import PropTypes from "prop-types";

const propTypes = {
    isSubmitting: PropTypes.bool.isRequired,
    buttonText: PropTypes.string.isRequired
};

const ButtonWithSpinner = props => (
    <div>
        <button type="submit" className="btn btn--primary margin-top--1" disabled={props.isSubmitting}>
            {props.isSubmitting ? <div className="loader loader--dark" /> : props.buttonText}
        </button>
    </div>
);
ButtonWithSpinner.propTypes = propTypes;
export default ButtonWithSpinner;
