import React, { Component } from 'react';
import { connect } from 'react-redux'

import Layout from '../global/Layout';

class Login extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout >
                <div>This is login</div>
            </Layout>
        )
    }
}

export default connect()(Layout);