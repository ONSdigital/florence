import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { userLoggedOut } from '../config/actions';
import PropTypes from 'prop-types';

import cookies from '../utilities/cookies';

const propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
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
        const cookieRemoved = cookies.remove('access_token');
        if (!cookieRemoved) {
            console.warn(`Error trying to remove 'access_token' cookie`);
            return
        }
        localStorage.removeItem("loggedInAs");
        this.props.dispatch(userLoggedOut());
    }

    renderNavItems() {
        if(!this.props.isAuthenticated) {
            return (
                <li className="global-nav__item">
                    <Link to={`${this.props.rootPath}/login`} activeClassName="selected" className="global-nav__link">Login</Link>
                </li>
            )
        }

        const route = this.props.location.pathname;
        const rootPath = this.props.rootPath;

        if (route.includes(`${rootPath}/collections`) || route.includes(`${rootPath}/publishing-queue`) || route.includes(`${rootPath}/reports`) || route.includes(`${rootPath}/users-and-access`) || route.includes(`${rootPath}/teams`) ) {
            return (
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

                    <li className="global-nav__item">
                        <Link to={`${rootPath}/login`} onClick={this.handleLogoutClick} className="global-nav__link">Logout</Link>
                    </li>
                </span>
            )
        }

        if (route.includes(`${rootPath}/datasets`)) {
            return (
                <span>
                    <li className="global-nav__item">
                        <Link to={`${rootPath}/datasets`} activeClassName="selected" className="global-nav__link">Datasets</Link>
                    </li>
                    <li className="global-nav__item">
                        <Link to={`${rootPath}/login?redirect=${rootPath}/datasets`} onClick={this.handleLogoutClick} className="global-nav__link">Logout</Link>
                    </li>
                </span>
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
    const rootPath = state.state.rootPath;

    return {
        isAuthenticated,
        rootPath
    }
}

NavBar.propTypes = propTypes;

export default connect(mapStateToProps)(NavBar);