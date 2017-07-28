import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class DatasetsController extends Component {
    render() {
        return (
            <p>Dataset page</p>
        )
    }
}

export default connect()(DatasetsController);