import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    collectionID: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired
};

export class CollectionDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render () {
        return (
            <div className="drawer__container">
                <h2 className="drawer__heading">{this.props.name}</h2>
                <div className="drawer__body">

                </div>
                <div className="drawer__footer">
                    <button className="btn" onClick={this.props.onCancel}>Cancel</button>
                </div>
            </div>
        )
    }
}

CollectionDetails.propTypes = propTypes;

export default CollectionDetails;