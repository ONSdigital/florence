import React from "react";
import PropTypes from "prop-types";

const propTypes = {
    classes: PropTypes.string,
    ariaLabel: PropTypes.string,
    fill: PropTypes.string,
    viewBox: PropTypes.string,
};

const Search = props => (
    <svg className={props.classes} viewBox={props.viewBox} xmlns="http://www.w3.org/2000/svg" role="presentation" aria-label={props.ariaLabel}>
        <path
            d="m20.011 16.352h-1.2647l-0.4482-0.4014c1.5689-1.6947 2.5134-3.8948 2.5134-6.2881 0-5.3368-4.6587-9.6627-10.406-9.6627-5.7472 0-10.406 4.3259-10.406 9.6627 0 5.3367 4.6587 9.6626 10.406 9.6626 2.5775 0 4.9469-0.877 6.7719-2.3339l0.4323 0.4163v1.1743l8.0045 7.418 2.3854-2.215-7.9886-7.4328zm-9.6055 0c-3.9862 0-7.2041-2.988-7.2041-6.6895s3.2178-6.6895 7.2041-6.6895c3.9863 0 7.2042 2.988 7.2042 6.6895s-3.2179 6.6895-7.2042 6.6895z"
            fill="#808080"
        />
    </svg>
);

Search.propTypes = propTypes;

export default Search;
