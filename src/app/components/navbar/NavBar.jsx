import React from "react";
import { Link } from "react-router";
import PropTypes from "prop-types";
import url from "../../utilities/url";
import auth from "../../utilities/auth";
import user from "../../utilities/api-clients/user";
import PreviewNav from "../preview-nav";

const NavBar = props => {
    const renderWorkingOnItem = () => {
        const workingOn = props.workingOn || {};
        const showWorkingOn = workingOn.id;
        if (!showWorkingOn) {
            return;
        }

        const path = props.location.pathname;
        if (routeIsACollectionPage(path)) {
            return (
                // The class 'global-nav__item--working-on' is used for the acceptance tests, so we can easily select this element
                <li className="global-nav__item global-nav__item--working-on">
                    <Link to={url.resolve(`/collections/${props.workingOn.id}`)} className="global-nav__link selected">
                        Working on:&nbsp;
                        {props.workingOn.name || (
                            <div className="margin-left--1 inline-block">
                                <div className="loader loader--inline loader--small"></div>
                            </div>
                        )}
                    </Link>
                </li>
            );
        }
    };

    const routeIsACollectionPage = path => {
        return path.indexOf(`/collections`) >= 0;
    };

    const renderNavItems = () => {
        if (!auth.isAuthenticated(props.user)) {
            return (
                <li className="global-nav__item">
                    <Link to={`${props.rootPath}/login`} activeClassName="selected" className="global-nav__link">
                        Sign in
                    </Link>
                </li>
            );
        }

        const rootPath = props.rootPath;
        return (
            <>
                {renderWorkingOnItem()}
                <li className="global-nav__item">
                    <Link to={`${rootPath}/collections`} activeClassName="selected" className="global-nav__link">
                        Collections
                    </Link>
                </li>
                {auth.isAdminOrEditor(props.user) && (
                    <>
                        {props.config.enableDatasetImport && (
                            <li className="global-nav__item">
                                <Link to={url.resolve("/uploads/data")} activeClassName="selected" className="global-nav__link">
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
                        {props.config?.enableNewSignIn && (
                            <li className="global-nav__item">
                                <Link to={`${rootPath}/groups`} activeClassName="selected" className="global-nav__link">
                                    Preview teams
                                </Link>
                            </li>
                        )}
                        {!props.config?.enableNewSignIn && (
                            <li className="global-nav__item">
                                <Link to={`${rootPath}/teams`} activeClassName="selected" className="global-nav__link">
                                    Teams
                                </Link>
                            </li>
                        )}
                    </>
                )}
                {auth.isAdmin(props.user) && (
                    <li className="global-nav__item">
                        <Link to={`${rootPath}/security`} activeClassName="selected" className="global-nav__link">
                            Security
                        </Link>
                    </li>
                )}
                <li className="global-nav__item">
                    <Link to={url.resolve("/login")} onClick={() => user.logOut()} className="global-nav__link">
                        Sign out
                    </Link>
                </li>
            </>
        );
    };

    const regex = new RegExp(`${props.rootPath}/collections/[\\w|-]*/preview`, "g");
    const isViewingPreview = regex.test(props.location.pathname);
    return (
        <ul className="global-nav__list">
            {isViewingPreview && <PreviewNav />}
            {renderNavItems()}
        </ul>
    );
};

NavBar.propTypes = {
    config: PropTypes.shape({
        enableDatasetImport: PropTypes.bool,
        enableNewSignIn: PropTypes.bool,
    }),
    user: PropTypes.object.isRequired,
    workingOn: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string,
    }),
    rootPath: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
};

export default NavBar;
