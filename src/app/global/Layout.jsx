import React, { Component } from 'react';
import { connect } from 'react-redux'

import NavBar from './NavBar';

class Layout extends Component {
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

export default connect()(Layout);