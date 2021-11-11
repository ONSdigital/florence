import React from "react";
import PropTypes from "prop-types";

const propTypes = {
    classes: PropTypes.string,
    fill: PropTypes.string,
    url: PropTypes.string,
};

const BackButton = props => {
    const additionalClasses = props.classes ? props.classes : "";
    return (
        <a href={props.url} className="back-button">
            <svg className={`back-button__icon ${additionalClasses}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21">
                <path d="M 0,10 20,0 20,20 Z" fill={props.fill} />
            </svg>
            Back
        </a>
    );
};

BackButton.propTypes = propTypes;

export default BackButton;
