import React, { Component } from 'react';
import { Link } from 'react-router'

export default class NavBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            authenticated: true
        }
    }

    render() {
        return (
            <ul className="nav__list">

                { this.renderNavItems() }

            </ul>
        )
    }

    renderNavItems() {
        if (this.state.authenticated) {
            return (
                <span>
                    <li className="nav__item">
                        <Link to="/florence/collections" activeClassName="selected" className="nav__link">Collections</Link>
                    </li>

                    <li className="nav__item">
                        <a className="nav__link">Publishing queue</a>
                    </li>

                    <li className="nav__item">
                        <a className="nav__link">Reports</a>
                        </li>

                        <li className="nav__item">
                        <a className="nav__link">Users and access</a>
                    </li>

                    <li className="nav__item">
                        <a className="nav__link">Teams</a>
                    </li>

                    <li className="nav__item">
                        <a className="nav__link">Logout</a>
                    </li>
                </span>
            )
        } else {
            return (
                <li className="nav__item">
                    <a className="nav__link">Login</a>
                </li>
            )
        }
    }

}