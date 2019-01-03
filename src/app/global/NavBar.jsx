import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { userLoggedOut } from '../config/actions';
import PropTypes from 'prop-types';

import url from '../utilities/url'
import cookies from '../utilities/cookies';
import auth from '../utilities/auth';
import PreviewNav from './PreviewNav';

const propTypes = {
    config: PropTypes.shape({
        enableDatasetImport: PropTypes.bool
    }),
    user: PropTypes.object.isRequired,
    workingOn: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string
    }),
    rootPath: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
}

export class NavBar extends Component {
    constructor(props) {
        super(props);

        this.handleLogoutClick = this.handleLogoutClick.bind(this);
    }

    handleLogoutClick() {
        const accessTokenCookieRemoved = cookies.remove('access_token');
        if (!accessTokenCookieRemoved) {
            console.warn(`Error trying to remove 'access_token' cookie`);
            return
        }
        cookies.remove('collection');
        localStorage.removeItem("loggedInAs");
        this.props.dispatch(userLoggedOut());
    }

    renderWorkingOnItem() {
        const workingOn = this.props.workingOn || {};
        const showWorkingOn = workingOn.id;    
        if (!showWorkingOn) {
            return
        }
        
        const route = this.props.location.pathname;
        if (route.indexOf(`/datasets`) >= 0 || route.indexOf(`/preview`) >= 0) {
            return (
                // The class 'global-nav__item--working-on' is used for the acceptance tests, so we can easily select this element
                <li className="global-nav__item global-nav__item--working-on">
                    <Link to={url.resolve(`/collections/${this.props.workingOn.id}`)} className="global-nav__link selected">
                        Working on:&nbsp;
                        {this.props.workingOn.name || 
                            <div className="margin-left--1 inline-block">
                                <div className="loader loader--inline loader--small"></div>
                            </div>
                        }
                    </Link>
                </li>
            )
        }
    }

    renderNavItems() {
        if(!auth.isAuthenticated(this.props.user)) {
            return (
                <li className="global-nav__item">
                    <Link to={`${this.props.rootPath}/login`} activeClassName="selected" className="global-nav__link">Login</Link>
                </li>
            )
        }

        const rootPath = this.props.rootPath;
        return (
            <span>
                { this.renderWorkingOnItem() }
                <li className="global-nav__item">
                    <Link to={`${rootPath}/collections`} activeClassName="selected" className="global-nav__link">Collections</Link>
                </li>
                {auth.isAdminOrEditor(this.props.user) ?
                    <span>
                        {this.props.config.enableDatasetImport &&
                            <li className="global-nav__item">
                                <Link to={url.resolve("/uploads/data")} activeClassName="selected" className="global-nav__link">
                                    Datasets
                                </Link>
                            </li>
                        }
                        <li className="global-nav__item">
                            <a className="global-nav__link" href="/florence/publishing-queue">Publishing queue</a>
                        </li>

                        <li className="global-nav__item">
                            <a className="global-nav__link" href="/florence/reports">Reports</a>
                        </li>

                        <li className="global-nav__item">
                            <a className="global-nav__link" href="/florence/users-and-access">Users and access</a>
                        </li>

                        <li className="global-nav__item">
                            <Link to={`${rootPath}/teams`} activeClassName="selected" className="global-nav__link">Teams</Link>
                        </li>
                    </span>
                : "" }
                <li className="global-nav__item">
                    <Link to={url.resolve("/login")} onClick={this.handleLogoutClick} className="global-nav__link">
                        Logout
                    </Link>
                </li>
            </span>
        )
    }

    render() {
        //const regex = new RegExp(`${this.props.rootPath}/collections/.*/preview`, "g");
        const regex = new RegExp(`${this.props.rootPath}/collections/[\\w|-]*/preview`, "g");
        const isViewingPreview = regex.test(this.props.location.pathname);
        return (
            <ul className="global-nav__list">
                {isViewingPreview && <PreviewNav />}
                {this.renderNavItems()}
            </ul>
        )
    }

}

function mapStateToProps(state) {
    const user = state.state.user;
    const rootPath = state.state.rootPath;
    const workingOn = state.state.global ? state.state.global.workingOn : null;

    return {
        user,
        rootPath,
        workingOn,
        config: state.state.config
    }
}

NavBar.propTypes = propTypes;

export default connect(mapStateToProps)(NavBar);