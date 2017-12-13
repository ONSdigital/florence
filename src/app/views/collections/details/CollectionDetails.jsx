import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    collectionID: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    isLoadingDetails: PropTypes.bool,
    inProgress: PropTypes.array,
    complete: PropTypes.array,
    reviewed: PropTypes.array
};

export class CollectionDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    renderInProgress() {
        return this.props.inProgress.map(page => {
            return (
                <li key={page.uri}>{page.description.title}</li>
            )
        });
    }
    
    renderWaitingReview() {
        return this.props.complete.map(page => {
            return (
                <li key={page.uri}>{page.description.title}</li>
            )
        });
    }
    
    renderReviewed() {
        return this.props.reviewed.map(page => {
            return (
                <li key={page.uri}>{page.description.title}</li>
            )
        });
    }

    render () {
        return (
            <div className="drawer__container">
                <h2 className="drawer__heading">{this.props.name}</h2>
                <div className="drawer__body">
                    {this.props.isLoadingDetails ?
                        <div className="grid grid--align-center margin-top--4">
                            <div className="loader loader--large loader--dark"></div>
                        </div>
                        :
                        <div>
                            <h3>Pages in progress ({this.props.inProgress.length})</h3>
                            {this.renderInProgress()}
                            <h3>Pages waiting review ({this.props.complete.length})</h3>
                            {this.renderWaitingReview()}
                            <h3>Pages reviewed ({this.props.reviewed.length})</h3>
                            {this.renderReviewed()}
                        </div>
                    }
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