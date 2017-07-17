import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { userLoggedOut } from '../config/actions';
import PropTypes from 'prop-types';

import cookies from '../utilities/cookies';

const propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    rootPath: PropTypes.string.isRequired,
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
        localStorage.removeItem("userIsAdmin");
        this.props.dispatch(userLoggedOut());
    }

    renderNavItems() {
        if (this.props.isAuthenticated) {
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
                        <Link to={`${this.props.rootPath}/teams`} activeClassName="selected" className="global-nav__link">Teams</Link>
                    </li>

                    <li className="global-nav__item">
                        <Link to={`${this.props.rootPath}/password`} activeClassName="selected" className="global-nav__link">Password</Link>
                    </li>

                    <li className="global-nav__item">
                        <Link to={`${this.props.rootPath}/login`} onClick={this.handleLogoutClick} className="global-nav__link">Logout</Link>
                    </li>
                </span>
            )
        } else {
            return (
                <li className="global-nav__item">
                    <a className="global-nav__link">Login</a>
                </li>
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