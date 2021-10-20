import React from "react";
import PropTypes from "prop-types";

const propTypes = {
    classes: PropTypes.string,
    fillColor: PropTypes.string,
    ariaLabel: PropTypes.string,
    viewBox: PropTypes.string.isRequired,
};
const Person = props => {
    return (
        <svg className={props.classes} viewBox={props.viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={props.ariaLabel}>
            <path
                d="M6.667 7.5a3.332 3.332 0 1 0 0-6.667 3.332 3.332 0 1 0 0 6.667Zm0 1.667C4.442 9.167 0 10.283 0 12.5v1.667h13.333V12.5c0-2.217-4.441-3.333-6.666-3.333Z"
                fill={props.fillColor}
            />
        </svg>
    );
};
Person.propTypes = propTypes;
export default Person;
