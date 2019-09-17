import React, { Component } from "react";
import { Link } from "react-router";
import PropTypes from "prop-types";
import Preview from "../../../components/preview/Preview";
import DatasetReviewActions from "../DatasetReviewActions";

const propTypes = {
    isReadOnly: PropTypes.bool,
    isFetchingCollectionData: PropTypes.bool,
    isSavingData: PropTypes.bool,
    isLoadingPreview: PropTypes.bool,
    collectionID: PropTypes.string,
    previewURL: PropTypes.string,
    userEmail: PropTypes.string.isRequired,
    dataset: PropTypes.shape({
        collection_id: PropTypes.string,
        lastEditedBy: PropTypes.string,
        reviewState: PropTypes.string
    }),
    title: PropTypes.string.isRequired,
    backLinkPath: PropTypes.string.isRequired,
    onSubmitForReview: PropTypes.func,
    onMarkAsReviewed: PropTypes.func
};

class DatasetPreview extends Component {
    constructor(props) {
        super(props);
    }

    renderReviewActions() {
        if (this.props.isReadOnly || this.props.isFetchingCollectionData) {
            return;
        }

        return (
            <DatasetReviewActions
                areDisabled={this.props.isSavingData || this.props.isReadOnly}
                includeSaveLabels={false}
                reviewState={this.props.dataset.reviewState}
                userEmail={this.props.userEmail}
                lastEditedBy={this.props.dataset.lastEditedBy}
                onSubmit={this.props.onSubmitForReview}
                onApprove={this.props.onMarkAsReviewed}
                notInCollectionYet={!this.props.dataset.collection_id}
            />
        );
    }

    render() {
        return (
            <div className="preview">
                <div className="preview__header grid grid--justify-center">
                    <div className="grid__col-6 margin-top--1 margin-bottom--1">
                        <form>
                            &#9664; <Link to={this.props.backLinkPath}>Back</Link>
                            <h2 className="inline-block margin-left--1">{this.props.title}</h2>
                            <div>{this.renderReviewActions()}</div>
                            {this.props.isSavingData && <div className="loader loader--dark loader--centre margin-left--1"></div>}
                        </form>
                    </div>
                </div>
                {this.props.isLoadingPreview && (
                    <div className="grid grid--align-content-center grid--full-height grid--direction-column grid--justify-center grid--align-center">
                        <p className="font-size--16 font-weight--600 margin-bottom--1">Loading preview</p>
                        <div className="loader loader--dark loader--centre loader--large"></div>
                    </div>
                )}
                {this.props.previewURL && <Preview hidden={false} path={this.props.previewURL} />}
            </div>
        );
    }
}

DatasetPreview.propTypes = propTypes;

export default DatasetPreview;
