import React from "react";

import PropTypes from "prop-types";

const propTypes = {
    classes: PropTypes.string,
    fillColor: PropTypes.string,
    ariaLabel: PropTypes.string,
    viewBox: PropTypes.string.isRequired,
};

const Warning = props => {

    return (<svg
            className={props.classes}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={props.viewBox}
            focusable="false"
            role="img"
            aria-label={props.ariaLabel}
        >
            <path
                d="M256,34.297L0,477.703h512L256,34.297z M256,422.05c-9.22,0-16.696-7.475-16.696-16.696s7.475-16.696,16.696-16.696
                            c9.22,0,16.696,7.475,16.696,16.696S265.22,422.05,256,422.05z M239.304,344.137V177.181h33.391v166.956H239.304z"
            fill={props.fillColor}
            />
        </svg>

    );
};
Warning.propTypes = propTypes;
export default Warning;
