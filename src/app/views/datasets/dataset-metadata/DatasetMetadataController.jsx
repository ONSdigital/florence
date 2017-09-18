import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    id: PropTypes.string
}

class DatasetMetadataController extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <h1>Metadata</h1>
        )
    }
}

export default DatasetMetadataController