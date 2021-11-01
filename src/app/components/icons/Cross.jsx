import React from "react";
import PropTypes from "prop-types";

const propTypes = {
    classes: PropTypes.string,
    ariaLabel: PropTypes.string,
    fill: PropTypes.string,
    viewBox: PropTypes.string,
};

const Cross = props => {
    return (
        <svg className={props.classes} viewBox={props.viewBox} xmlns="http://www.w3.org/2000/svg" role="img" aria-label={props.ariaLabel}>
            <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill={props.fill} />
        </svg>
    );
};

Cross.propTypes = propTypes;

export default Cross;
