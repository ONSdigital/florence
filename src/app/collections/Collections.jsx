import React, { Component } from 'react';
import { connect } from 'react-redux'

class Collections extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <div>This is collections list</div>
        )
    }
}

export default connect()(Collections);