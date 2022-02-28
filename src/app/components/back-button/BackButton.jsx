import React from "react";
import url from "../../utilities/url";
import { Link } from "react-router";
import clsx from "clsx";
import PropTypes from "prop-types";

function BackButton({ text = "Back", redirectUrl, classNames }) {
    const to = redirectUrl ? redirectUrl : url.resolve("../");
    return (
        <div className={clsx(classNames)}>
            &#9664;&nbsp;
            <Link role="link" to={to}>
                {text}
            </Link>
        </div>
    );
}

BackButton.propTypes = {
    classNames: PropTypes.string,
    text: PropTypes.string,
    toUrl: PropTypes.string,
};

export default BackButton;
