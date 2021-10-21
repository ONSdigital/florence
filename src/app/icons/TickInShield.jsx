import React from "react";
import PropTypes from "prop-types";

const propTypes = {
    classes: PropTypes.string,
    fillColor: PropTypes.string,
    ariaLabel: PropTypes.string,
    viewBox: PropTypes.string.isRequired,
};
const TickInShield = props => {
    return (
        <svg className={props.classes} viewBox={props.viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={props.ariaLabel}>
            <path
                d="M6 .167 0 2.833v4c0 3.7 2.56 7.16 6 8 3.44-.84 6-4.3 6-8v-4L6 .167ZM4.667 10.833 2 8.167l.94-.94 1.727 1.72L9.06 4.553 10 5.5l-5.333 5.333Z"
                fill={props.fillColor}
            />
        </svg>
    );
};
TickInShield.propTypes = propTypes;
export default TickInShield;
