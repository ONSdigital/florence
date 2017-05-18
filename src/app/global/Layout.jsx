import React, { Component } from 'react';
import PropTypes from 'prop-types';

import NavBar from './NavBar';

const propTypes = {
    children: PropTypes.node.isRequired,
    params: PropTypes.object.isRequired
};

export default class Layout extends Component {
    render() {
        return (
            <div>
                <NavBar params={this.props.params} />
                {this.props.children}
            </div>
        )
    }
}

Layout.propTypes = propTypes;