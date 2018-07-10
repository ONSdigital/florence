import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { userLoggedOut } from '../config/actions';
import PropTypes from 'prop-types';

import cookies from '../utilities/cookies';

const propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    userType: PropTypes.string.isRequired,
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
        const accessTokenCookieRemoved = cookies.remove('access_token');
        if (!accessTokenCookieRemoved) {
            console.warn(`Error trying to remove 'access_token' cookie`);
            return
        }
        cookies.remove('collection');
        localStorage.removeItem("loggedInAs");
        this.props.dispatch(userLoggedOut());
    }

    renderNavItems() {
        const route = this.props.location.pathname;
        const rootPath = this.props.rootPath;
        const isViewer = this.props.userType == 'VIEWER';

        if(!this.props.isAuthenticated) {
            return (
                <ul>
                    {!isViewer ?
                        <span>
                            {route.includes(`${rootPath}/logs`) &&
                                <li className="global-nav__item">
                                    <Link to={`${rootPath}/logs`} activeClassName="selected" className="global-nav__link">Logs</Link>
                                </li>
                            }
                            <li className="global-nav__item">
                                <Link to={`${rootPath}/collections`} activeClassName="selected" className="global-nav__link">Collections</Link>
                            </li>

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
                        <Link to={`${this.props.rootPath}/login`} activeClassName="selected" className="global-nav__link">Login</Link>
                    </li>
                </ul>
            )
        }

        if (route.indexOf(`${rootPath}/collections`) >= 0 || route.indexOf(`${rootPath}/publishing-queue`) >= 0 || route.indexOf(`${rootPath}/reports`) >= 0 || route.indexOf(`${rootPath}/users-and-access`) >= 0 || route.indexOf(`${rootPath}/teams`) >= 0 || route.indexOf(`${rootPath}/not-authorised`) >= 0 ) {
            return (
                <nav>
                    <ul>
                        {!isViewer ?
                            <span>
                                <li className="global-nav__item">
                                    <a className="global-nav__link" href="/florence/collections">Collections</a>
                                </li>

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
                            <Link to={`${rootPath}/login`} onClick={this.handleLogoutClick} className="global-nav__link">Logout</Link>
                        </li>
                    </ul>
                </nav>
            )
        }

        if (route.includes(`${rootPath}/logs`)) {
            return (
                <nav>
                    <ul>
                        <li className="global-nav__item">
                            <Link to={`${rootPath}/logs`} activeClassName="selected" className="global-nav__link">Logs</Link>
                        </li>
                        <li className="global-nav__item">
                            <Link to={`${rootPath}/login`} onClick={this.handleLogoutClick} className="global-nav__link">Logout</Link>
                        </li>
                    </ul>
                </nav>
            )       
        }
    }

    render() {
        return (
            <ul className="global-nav__list">
                { this.renderNavItems() }
            </ul>
        )
    }

}

function mapStateToProps(state) {
    const isAuthenticated = state.state.user.isAuthenticated;
    const userType = state.state.user.userType;
    const rootPath = state.state.rootPath;

    return {
        isAuthenticated,
        userType,
        rootPath
    }
}

NavBar.propTypes = propTypes;

export default connect(mapStateToProps)(NavBar);