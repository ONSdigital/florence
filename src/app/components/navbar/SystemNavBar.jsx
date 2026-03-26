import React from "react";
import PropTypes from "prop-types";
import { OnsLogoWhite } from "../../icons/OnsLogo";
import auth from "../../utilities/auth";

import { Link } from "react-router";

const propTypes = {
    rootPath: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
};

function SystemNavBar({ rootPath, user }) {
    return (
        <nav className="system-nav">
            <div className="system-nav__logo">
                <OnsLogoWhite height={24} width={250} />
            </div>
            {!auth.isAuthenticated(user) && (
                <span id="system-nav__descriptor" className="system-nav__descriptor">
                    Dissemination services
                </span>
            )}

            {auth.isAuthenticated(user) && (
                <>
                    <span id="system-nav__descriptor" className="system-nav__descriptor">
                        Dissemination services:
                    </span>
                    <ul className="system-nav__list" aria-labelledby="system-nav__descriptor">
                        <li className="system-nav__item">
                            <Link to={`/florence/collections`} className="system-nav__link selected">
                                Florence
                            </Link>
                        </li>
                        <li className="system-nav__item">
                            <a href="/wagtail-admin/" className="system-nav__link">
                                Wagtail
                            </a>
                        </li>
                        <li className="system-nav__item">
                            <a href="/data-admin" className="system-nav__link">
                                Dataset Catalogue Manager
                            </a>
                        </li>
                    </ul>
                </>
            )}
        </nav>
    );
}
SystemNavBar.propTypes = propTypes;
export default SystemNavBar;
