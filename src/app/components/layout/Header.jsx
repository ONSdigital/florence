import React from "react";
import PropTypes from "prop-types";
import OnsLogo from "../../icons/OnsLogo";

const propTypes = {
    title: PropTypes.string,
};

function Header({ title }) {
    return (
        <header className="padding-bottom--2">
            <div className="grid grid--justify-space-around">
                <div className="grid__col-8 padding-top--1 padding-bottom--1">
                    <OnsLogo />
                </div>
            </div>
            {title && (
                <div className="grid grid--justify-space-around header__title">
                    <div className="grid__col-8">
                        <h1 className="colour--white page-neutral-intro__title margin-top--2 font-weight--600">{title}</h1>
                    </div>
                </div>
            )}
        </header>
    );
}
Header.propTypes = propTypes;
export default Header;
