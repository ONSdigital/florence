import React, { Component } from "react";
import PropTypes from "prop-types";

import NavBar from "./NavBar";

const propTypes = {
    children: PropTypes.node.isRequired,
    params: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
};

export default class Layout extends Component {
    render() {
        return (
            <div>
                <NavBar location={this.props.location} />
                {this.props.children}
            </div>
        );
    }
}

Layout.propTypes = propTypes;
