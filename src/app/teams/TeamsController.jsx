import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const propTypes = {
    dispatch: PropTypes.func.isRequired
}

class TeamsController extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <p>Teams</p>
        )
    }
}

TeamsController.propTypes = propTypes;

export default connect()(TeamsController);