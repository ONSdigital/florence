import React, { Component } from "react";
import logo from "../../../../img/logo-dark.svg";

export class FooterComponent extends Component {
    render() {
        return(
            <>
                <ul id="footer" className="global-nav__list">
                    <li className="global-nav__item">
                        <img src={logo} alt="ONS"/>
                    </li>
                </ul>
            </>
        )
    }
}