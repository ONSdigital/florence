import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const propTypes = {
    rootPath: PropTypes.string.isRequired
}

class DatasetsController extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-4">
                    <h1>Select a dataset</h1>
                    <Link to={`${this.props.rootPath}/datasets/uploads`}>Upload a dataset</Link>
                </div>
            </div>
        )
    }
}

DatasetsController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        rootPath: state.state.rootPath
    }
}

export default connect(mapStateToProps)(DatasetsController);