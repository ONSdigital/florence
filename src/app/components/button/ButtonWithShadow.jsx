import React from "react";
import PropTypes from "prop-types";
import Spinner from "../../icons/Spinner";
import { Link } from "react-router";

const propTypes = {
    buttonText: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    isSubmitting: PropTypes.bool,
    class: PropTypes.string,
    disabled: PropTypes.bool,
};

const ButtonWithShadow = props => {
    if (props.link) {
        if (props.newTab) {
            return (
                <Link
                    to={props.link}
                    target="_blank"
                    className={`ons-btn ${props.class ? "ons-btn--" + props.class : ""}`}
                    onClick={props.onClick}
                    disabled={props.disabled}
                >
                    <span className="ons-btn__inner">
                        {props.buttonText}
                        {props.isSubmitting && <Spinner />}
                    </span>
                </Link>
            );
        }
        return (
            <Link
                to={props.link}
                className={`ons-btn ${props.class ? "ons-btn--" + props.class : ""}`}
                onClick={props.onClick}
                disabled={props.disabled}
            >
                <span className="ons-btn__inner">
                    {props.buttonText}
                    {props.isSubmitting && <Spinner />}
                </span>
            </Link>
        );
    }

    return (
        <button
            type={props.type}
            className={`ons-btn ${props.class ? "ons-btn--" + props.class : ""}`}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            <span className="ons-btn__inner">
                {props.buttonText}
                {props.isSubmitting && <Spinner />}
            </span>
        </button>
    );
};

ButtonWithShadow.propTypes = propTypes;
export default ButtonWithShadow;
