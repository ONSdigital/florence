import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import auth from '../utilities/auth';
import url from '../utilities/url';

import PreviewNav from './PreviewNav';
import user from '../utilities/api-clients/user';

const propTypes = {
    user: PropTypes.object.isRequired,
    workingOn: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string
    }),
    rootPath: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
}

class NavBar extends Component {
    constructor(props) {
        super(props);

        this.handleLogoutClick = this.handleLogoutClick.bind(this);
    }

    handleLogoutClick() {
        user.logOut();
    }

    renderWorkingOnItem() {
        const workingOn = this.props.workingOn || {};
        const showWorkingOn = workingOn.id;
        if (!showWorkingOn) {
            return
        }
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

    renderNavItems() {
        if(!auth.isAuthenticated(this.props.user)) {
            return (
                <li className="global-nav__item">
                    <Link to={`${this.props.rootPath}/login`} activeClassName="selected" className="global-nav__link">Login</Link>
                </li>
            )
        }

        const route = this.props.location.pathname;
        const rootPath = this.props.rootPath;

        if (route.indexOf(`${rootPath}/collections`) >= 0 || route.indexOf(`${rootPath}/publishing-queue`) >= 0 || route.indexOf(`${rootPath}/reports`) >= 0 || route.indexOf(`${rootPath}/users`) >= 0 || route.indexOf(`${rootPath}/teams`) >= 0 || route.indexOf(`${rootPath}/not-authorised`) >= 0 ) {
            return (
                <span>
                    { this.renderWorkingOnItem() }
                    <li className="global-nav__item">
                        <Link to={`${rootPath}/collections`} activeClassName="selected" className="global-nav__link">Collections</Link>
                    </li>
                    {auth.isAdminOrEditor(this.props.user) ?
                        <span>
                            <li className="global-nav__item">
                                <a className="global-nav__link" href="/florence/publishing-queue">Publishing queue</a>
                            </li>

                            <li className="global-nav__item">
                                <a className="global-nav__link" href="/florence/reports">Reports</a>
                            </li>

                            <li className="global-nav__item">
                            <Link to={`${rootPath}/users`} activeClassName="selected" className="global-nav__link">Users and access</Link>
                            </li>

                            <li className="global-nav__item">
                                <Link to={`${rootPath}/teams`} activeClassName="selected" className="global-nav__link">Teams</Link>
                            </li>
                        </span>
                    : "" }

                    <li className="global-nav__item">
                        <Link to={`${rootPath}/login`} onClick={this.handleLogoutClick} className="global-nav__link">Logout</Link>
                    </li>
                </span>
            )
        }
    }

    render() {
        const regex = new RegExp(`${this.props.rootPath}/collections/.*/preview`, "g");
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
        workingOn
    }
}

NavBar.propTypes = propTypes;

export default connect(mapStateToProps)(NavBar);