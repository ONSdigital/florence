import React, { Component } from 'react';
import { connect } from 'react-redux'

import Layout from '../global/Layout'

class Collections extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <Layout >
                <div>This is collections list</div>
            </Layout>
        )
    }
}

export default connect()(Collections);