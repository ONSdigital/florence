import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import cookies from '../utilities/cookies';

class NavBar extends Component {

    constructor(props) {
        super(props);

        this.handleLogoutClick = this.handleLogoutClick.bind(this);
    }

    handleLogoutClick() {
        const cookieRemoved = cookies.remove('access_token');
        if (!cookieRemoved) {
            console.warn(`Error trying to remove 'access_token' cookie`);
        }
    }

    render() {
        return (
            <ul className="global-nav__list">
                { this.renderNavItems() }
            </ul>
        )
    }

    renderNavItems() {
        if (this.props.isAuthenticated) {
            return (
                <span>
                    <li className="global-nav__item">
                        <Link to={`${this.props.rootPath}/collections`} activeClassName="selected" className="global-nav__link">Collections</Link>
                    </li>

                    <li className="global-nav__item">
                        <a className="global-nav__link">Publishing queue</a>
                    </li>

                    <li className="global-nav__item">
                        <a className="global-nav__link">Reports</a>
                    </li>

                    <li className="global-nav__item">
                        <a className="global-nav__link">Users and access</a>
                    </li>

                    <li className="global-nav__item">
                        <a className="global-nav__link">Teams</a>
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

}

function mapStateToProps(state) {
    const isAuthenticated = state.state.user.isAuthenticated;
    const rootPath = state.state.rootPath;

    return {
        isAuthenticated,
        rootPath
    }
}
export default connect(mapStateToProps)(NavBar);