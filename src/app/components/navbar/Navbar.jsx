import React, { useEffect } from "react";
import { Link } from "react-router";
import PropTypes from "prop-types";
import url from "../../utilities/url";
import cookies from "../../utilities/cookies";
import auth from "../../utilities/auth";
import user from "../../utilities/api-clients/user";
import PreviewNav from "./preview-nav";

const Navbar = ({ user, rootPath, workingOn, config, location }) => {
    const authenticated = auth.isAuthenticated(user) || false;
    const routeIsACollectionPage = path => {
        return path.indexOf(`/collections`) >= 0;
    };

    // useEffect(() => {
    //     isViewingPreview();
    // }, [location])

    const handleLogoutClick = () => {
        user.logOut();
    };

    const renderWorkingOnItem = workingOn => {
        if (!workingOn) return null;
        if (routeIsACollectionPage(location.pathname)) {
            return (
                // The class 'global-nav__item--working-on' is used for the acceptance tests, so we can easily select this element
                <li className="global-nav__item global-nav__item--working-on">
                    <Link to={url.resolve(`/collections/${workingOn.id}`)} className="global-nav__link selected">
                        Working on:&nbsp;
                        {workingOn.name || (
                            <div className="margin-left--1 inline-block">
                                <div className="loader loader--inline loader--small"></div>
                            </div>
                        )}
                    </Link>
                </li>
            );
        }
    };

    const renderNavItems = () => {
        if (!user.isAuthenticated) {
            return (
                <li className="global-nav__item">
                    <Link to={`${rootPath}/login`} activeClassName="selected" className="global-nav__link sign-in">
                        Sign in
                    </Link>
                </li>
            );
        }

        return (
            <>
                <li className="global-nav__item">
                    <Link to={`${rootPath}/collections`} activeClassName="selected" className="global-nav__link">
                        Collections
                    </Link>
                </li>
                {auth.isAdminOrEditor(user) && (
                    <>
                        {config.enableDatasetImport && (
                            <li className="global-nav__item">
                                <Link
                                    to={url.resolve("/uploads/data")}
                                    data-testId="datasets"
                                    activeClassName="selected"
                                    className="global-nav__link"
                                >
                                    Datasets
                                </Link>
                            </li>
                        )}
                        <li className="global-nav__item">
                            <a className="global-nav__link" href="/florence/publishing-queue">
                                Publishing queue
                            </a>
                        </li>

                        <li className="global-nav__item">
                            <a className="global-nav__link" href="/florence/reports">
                                Reports
                            </a>
                        </li>

                        <li className="global-nav__item">
                            <Link to={`${rootPath}/users`} activeClassName="selected" className="global-nav__link">
                                Users and access
                            </Link>
                        </li>

                        <li className="global-nav__item">
                            <Link to={`${rootPath}/teams`} activeClassName="selected" className="global-nav__link">
                                Teams
                            </Link>
                        </li>
                    </>
                )}
                <li className="global-nav__item">
                    <Link to={url.resolve("/login")} onClick={() => user.logOut()} className="global-nav__link">
                        Sign out
                    </Link>
                </li>
            </>
        );
    };


    // const isViewingPreview = () => {
    //     const regex = new RegExp(`${rootPath}/collections/[\\w|-]*/preview`, "g");
    //     return regex.test(location.pathname);
    // }

    return (
        <ul className="global-nav__list" role="navigation">
            {<PreviewNav />}
            {renderWorkingOnItem(workingOn)}
            {renderNavItems()}
        </ul>
    );
};

export default Navbar;

Navbar.propTypes = {
    config: PropTypes.shape({
        enableDatasetImport: PropTypes.bool
    }),
    user: PropTypes.object.isRequired,
    workingOn: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string
    }),
    rootPath: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired
};
