import React, { Component } from "react";
import logo from "../../../../img/logo.svg";

export class NavbarComponent extends Component {
    render() {
        const logoStyles = {float: "left", position: "absolute", top: "50%", transform: "translateY(-50%)", left: "42px"}
        const wellStyles = {float: "left", color: "#FFFFFF", fontSize : "30px", fontFamily: "Open Sans", fontWeight: '700'}
        return(
            <>
            <ul className="global-nav__list" style={{backgroundColor: "#033E58"}}>
                <li className="global-nav__item" style={logoStyles}>
                    <img src={logo} alt="ONS"/>
                </li>
            </ul>
            <ul className="global-nav__list" style={{backgroundColor: "#3B7A9E"}}>
                <li className="global-nav__item" style={wellStyles}>
                    <a className="global-nav__link" href="/florence/collections">{this.props.children}</a>
                </li>
            </ul>
            </>
        )
    }
}