import React, { Component } from 'react';
import PropTypes from 'prop-types';

import NavBar from './NavBar';

Layout.propTypes = {
    children: PropTypes.Component.isRequired
};

export default class Layout extends Component {
    render() {
        return (
            <div>
                <NavBar />
                {this.props.children}
            </div>
        )
    }
}