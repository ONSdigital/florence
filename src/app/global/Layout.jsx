import React, { Component } from 'react';

import NavBar from './NavBar';

export default class Layout extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <NavBar />
                {this.props.children}
            </div>
        )
    }
}