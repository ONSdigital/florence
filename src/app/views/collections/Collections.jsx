import React, { Component } from 'react';
import { connect } from 'react-redux'

class Collections extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <div>This is a collections list</div>
        )
    }
}

export default connect()(Collections);