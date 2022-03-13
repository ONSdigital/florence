import './../interactives.scss'
import React, { Component } from "react";
import logo from "../../../../img/logo.svg";

export class NavbarComponent extends Component {
    render() {
        return(
            <>
                <ul id="logo" className="global-nav__list">
                    <li className="global-nav__item">
                        <img src={logo} alt="ONS"/>
                    </li>
                </ul>
                <ul id="nav" className="global-nav__list">
                    <li className="global-nav__item">
                        <a className="global-nav__link" href="javascript:void(0)">{this.props.children}</a>
                    </li>
                </ul>
            </>
        )
    }
}