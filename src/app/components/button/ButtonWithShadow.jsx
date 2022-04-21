import React from "react";
import PropTypes from "prop-types";
import Spinner from "../../icons/Spinner";

const propTypes = {
    buttonText: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool,
    class: PropTypes.string,
    disabled: PropTypes.bool,
};

const ButtonWithShadow = props => (
    <button type={props.type} className={`ons-btn ${props.class ? "ons-btn--" + props.class : ""}`} onClick={props.onClick} disabled={props.disabled}>
        <span className="ons-btn__inner">
            {props.buttonText}
            {props.isSubmitting && <Spinner />}
        </span>
    </button>
);

ButtonWithShadow.propTypes = propTypes;
export default ButtonWithShadow;
