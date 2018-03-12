import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { userLoggedOut } from '../config/actions';
import PropTypes from 'prop-types';
import url from '../utilities/url'

import cookies from '../utilities/cookies';

const propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    userType: PropTypes.string.isRequired,
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
        cookies.remove('collection');
        localStorage.removeItem("loggedInAs");
        this.props.dispatch(userLoggedOut());
    }

    renderWorkingOnItem() {
        const route = this.props.location.pathname;
        const workingOn = this.props.workingOn || {};
        const showWorkingOn = workingOn.id && (route.includes(url.resolve("/datasets")) || route.includes(url.resolve("/workspace")));
        if (!showWorkingOn) {
            return
        }
        return (
            <li className="global-nav__item">
                <Link to={url.resolve(`/collections/${this.props.workingOn.id}`)} className="global-nav__link selected">
                    Working on: {this.props.workingOn.name}
                </Link>
            </li>
        )
    }

    renderNavItems() {
        const isViewer = this.props.userType == 'VIEWER';

        return (
            <span>
                {!isViewer ?
                    <span>
                        { this.renderWorkingOnItem() }

                        <li className="global-nav__item">
                            <Link to={url.resolve("/collections")} activeClassName="selected" className="global-nav__link">
                                Collections
                            </Link>
                        </li>

                        <li className="global-nav__item">
                            <Link to={url.resolve("/uploads/data")} activeClassName="selected" className="global-nav__link">
                                Datasets
                            </Link>
                        </li>

                        <li className="global-nav__item">
                            <a className="global-nav__link" href={url.resolve("/publishing-queue")}>
                                Publishing queue
                            </a>
                        </li>

                        <li className="global-nav__item">
                            <a className="global-nav__link" href={url.resolve("/reports")}>
                                Reports
                            </a>
                        </li>

                        <li className="global-nav__item">
                            <a className="global-nav__link" href={url.resolve("/users-and-access")}>
                                Users and access
                            </a>
                        </li>

                        <li className="global-nav__item">
                            <Link to={url.resolve("/teams")} activeClassName="selected" className="global-nav__link">
                                Teams
                            </Link>
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
        return (
            <ul className="global-nav__list">
                { this.props.isAuthenticated ?
                    this.renderNavItems()
                    :
                    <li className="global-nav__item">
                        <Link to={url.resolve("/login")}
                              activeClassName="selected"
                              className="global-nav__link">
                            Login
                        </Link>
                    </li>
                }
            </ul>
        )
    }

}

function mapStateToProps(state) {
    const isAuthenticated = state.state.user.isAuthenticated;
    const userType = state.state.user.userType;
    const workingOn = state.state.global.workingOn;

    return {
        isAuthenticated,
        userType,
        workingOn
    }
}

NavBar.propTypes = propTypes;

export default connect(mapStateToProps)(NavBar);