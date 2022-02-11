import React from "react";
import url from "../../utilities/url";
import { Link } from "react-router";
import clsx from "clsx";
import PropTypes from "prop-types";

function BackButton({ text = "Back", classNames }) {
    return (
        <div className={clsx(classNames)}>
            &#9664;&nbsp;<Link to={url.resolve("../")}>{text}</Link>
        </div>
    );
}

BackButton.propTypes = {
    classNames: PropTypes.string,
    text: PropTypes.string,
};

export default BackButton;
