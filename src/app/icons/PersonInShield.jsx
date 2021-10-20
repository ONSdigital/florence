import React from "react";
import PropTypes from "prop-types";

const propTypes = {
    classes: PropTypes.string,
    fillColor: PropTypes.string,
    ariaLabel: PropTypes.string,
    viewBox: PropTypes.string.isRequired,
};
const PersonInShield = props => {
    return (
        <svg className={props.classes} viewBox={props.viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={props.ariaLabel}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 .167 0 2.833v4c0 3.7 2.56 7.16 6 8 3.44-.84 6-4.3 6-8v-4L6 .167Zm2 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm1.858 5.007A4.704 4.704 0 0 0 6 8.167a4.704 4.704 0 0 0-3.858 2.007C2.99 11.749 4.383 12.956 6 13.428c1.617-.472 3.011-1.68 3.858-3.254Z"
                fill={props.fillColor}
            />
        </svg>
    );
};
PersonInShield.propTypes = propTypes;
export default PersonInShield;
