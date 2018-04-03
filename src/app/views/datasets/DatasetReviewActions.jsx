import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    areDisabled: PropTypes.bool,
    includeSaveLabels: PropTypes.bool,
    reviewState: PropTypes.string,
    userEmail: PropTypes.string.isRequired,
    lastEditedBy: PropTypes.string,
    onSubmit: PropTypes.func,
    onApprove: PropTypes.func,
    notInCollectionYet: PropTypes.bool
};

class DatasetReviewActions extends Component {
    constructor(props) {
        super(props);
    }

    renderSubmit() {
        return (
            <button id="submit-for-review" type="button" onClick={this.props.onSubmit} disabled={this.props.areDisabled} className="btn btn--positive">
                {this.props.includeSaveLabels ? 
                    "Save and submit for review"
                :
                    "Submit for review"
                }
            </button>
        )
    }

    renderApprove() {
        return (
            <button id="mark-as-reviewed" type="button" onClick={this.props.onApprove} disabled={this.props.areDisabled} className="btn btn--positive">
                {this.props.includeSaveLabels ? 
                    "Save and submit for approval"
                :
                    "Submit for approval"
                }
            </button>
        )
    }

    render() {
        if (this.props.reviewState === "reviewed") {
            return <span></span>;
        }

        if (this.props.notInCollectionYet || this.props.reviewState === "inProgress") {
            return this.renderSubmit();
        }
        
        if (this.props.userEmail === this.props.lastEditedBy && this.props.reviewState === "complete") {
            return this.renderSubmit();
        }

        if (this.props.userEmail !== this.props.lastEditedBy && this.props.reviewState === "complete") {
            return this.renderApprove();
        }

        return <span></span>;
        
    }
}

DatasetReviewActions.propTypes = propTypes;

export default DatasetReviewActions;