import React, { Component } from 'react';
import { Link } from 'react-router'
import { connect } from 'react-redux'

class NavBar extends Component {

    constructor(props) {
        super(props);

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
                        <Link to="/florence/collections" activeClassName="selected" className="global-nav__link">Collections</Link>
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
                        <a className="global-nav__link">Logout</a>
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

    return {
        isAuthenticated
    }
}
export default connect(mapStateToProps)(NavBar);