import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import PropTypes from "prop-types";
import url from "../../../utilities/url";
import datasets from "../../../utilities/api-clients/datasets";
import notifications from "../../../utilities/notifications";
import collections from "../../../utilities/api-clients/collections";
import { updateActiveDataset, updateActiveDatasetReviewState } from "../../../config/actions";
import log, { eventTypes } from "../../../utilities/log";
import datasetHandleMetadataSaveErrors from "../metadata/datasetHandleMetadataSaveErrors";
import DatasetPreview from "./DatasetPreview";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    userEmail: PropTypes.string.isRequired,
    params: PropTypes.shape({
        datasetID: PropTypes.string.isRequired
    }).isRequired,
    versionURL: PropTypes.string,
    collectionID: PropTypes.string,
    dataset: PropTypes.shape({
        title: PropTypes.string,
        collection_id: PropTypes.string,
        links: PropTypes.shape({
            latest_version: PropTypes.shape({
                href: PropTypes.string
            })
        }),
        reviewState: PropTypes.string,
        lastEditedBy: PropTypes.string
    })
};

class DatasetPreviewController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSavingData: false,
            isReadOnly: false,
            isLoadingPreview: false,
            isFetchingCollectionData: false
        };

        this.handleSubmitForReview = this.handleSubmitForReview.bind(this);
        this.handleMarkAsReviewed = this.handleMarkAsReviewed.bind(this);
        this.handlePreviewLoad = this.handlePreviewLoad.bind(this);

        this.backLinkPath = url.resolve(`metadata?collection=${this.props.collectionID}`, !this.props.collectionID);
    }

    UNSAFE_componentWillMount() {
        this.setState({ isLoadingPreview: true });

        if (!this.props.collectionID) {
            this.setState({ isReadOnly: true });
        }

        if (!this.props.dataset.reviewState) {
            this.updateReviewStateData();
        }

        datasets
            .get(this.props.params.datasetID)
            .then(response => {
                const dataset = response.next || response.current;
                this.setState({ isLoadingPreview: false });
                this.props.dispatch(updateActiveDataset(dataset));
            })
            .catch(error => {
                switch (error.status) {
                    case 403: {
                        const notification = {
                            type: "neutral",
                            message: `You do not have permission to view dataset '${this.props.params.datasetID}'`
                        };
                        notifications.add(notification);
                        break;
                    }
                    case 404: {
                        const notification = {
                            type: "warning",
                            message: `Dataset ID '${this.props.params.datasetID}' can't be found`
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "FETCH_ERR": {
                        const notification = {
                            type: "warning",
                            message: `There was a network error whilst getting dataset '${this.props.params.datasetID}'. Please check your connection and try again`
                        };
                        notifications.add(notification);
                        break;
                    }
                    default: {
                        const notification = {
                            type: "warning",
                            message: `An unexpected error occurred whilst getting dataset '${this.props.params.datasetID}'`
                        };
                        notifications.add(notification);
                    }
                }
                this.setState({ isLoadingPreview: false });
                console.error(`Error fetching dataset ID '${this.props.params.datasetID}'`, error);
            });
    }

    getCollection(collectionID) {
        return collections
            .get(collectionID)
            .then(response => [null, response])
            .catch(error => [error, null]);
    }

    async updateReviewStateData() {
        this.setState({ isFetchingCollectionData: true });
        const collectionID = this.props.collectionID;
        const datasetID = this.props.params.datasetID;

        try {
            const [error, collection] = await this.getCollection(collectionID);
            if (error) {
                throw error;
            }

            const dataset = collection.datasets.find(dataset => {
                return dataset.id === datasetID;
            });
            if (!dataset) {
                this.setState({ isFetchingCollectionData: false });
                return;
            }
            const lastEditedBy = dataset.lastEditedBy;
            const reviewState = dataset.state.charAt(0).toLowerCase() + dataset.state.slice(1); //lowercase it so it's consistent with the properties in our state (i.e. "InProgress" = "inProgress" )
            this.props.dispatch(updateActiveDatasetReviewState(lastEditedBy, reviewState));
            this.setState({ isFetchingCollectionData: false });
        } catch (error) {
            this.setState({
                isFetchingCollectionData: false,
                isReadOnly: true
            });
            switch (error.status) {
                case 401: {
                    // handled by request utility function
                    break;
                }
                case 403: {
                    const notification = {
                        type: "neutral",
                        message: `You do not permission to get details for collection '${collectionID}'`,
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                case 404: {
                    const notification = {
                        type: "warning",
                        message: `Could not find collection '${collectionID}'`,
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: `An unexpected error's occurred whilst trying to get the collection '${collectionID}'`,
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
            }
            log.add(eventTypes.unexpectedRuntimeError, {
                message:
                    "Unable to update metadata screen with version's review/edit status in collection " +
                    collectionID +
                    ". Error: " +
                    JSON.stringify(error)
            });
            console.error("Unable to update metadata screen with version's review/edit status in collection '" + collectionID + "'", error);
        }
    }

    updateDatasetReviewState(datasetID, isSubmittingForReview, isMarkingAsReviewed) {
        let request = Promise.resolve;

        if (isSubmittingForReview) {
            request = collections.setDatasetStatusToComplete;
        }

        if (isMarkingAsReviewed) {
            request = collections.setDatasetStatusToReviewed;
        }

        return request(this.props.collectionID, datasetID).catch(error => {
            log.add(eventTypes.unexpectedRuntimeError, {
                message: `Error updating review state for dataset '${datasetID}' to '${isSubmittingForReview ? "Complete" : ""}${
                    isMarkingAsReviewed ? "Reviewed" : ""
                }' in collection '${this.props.collectionID}'. Error: ${JSON.stringify(error)}`
            });
            console.error(
                `Error updating review state for dataset '${datasetID}' to '${isSubmittingForReview ? "Complete" : ""}${
                    isMarkingAsReviewed ? "Reviewed" : ""
                }' in collection '${this.props.collectionID}'`,
                error
            );
            return error;
        });
    }

    async handleUpdateReviewState(isSubmittingForReview, isMarkingAsReviewed) {
        this.setState({ isSavingData: true });

        const updateError = await this.updateDatasetReviewState(this.props.params.datasetID, isSubmittingForReview, isMarkingAsReviewed);
        if (updateError) {
            datasetHandleMetadataSaveErrors(undefined, updateError, isSubmittingForReview, isMarkingAsReviewed, this.props.collectionID);
            this.setState({ isSavingData: false });
            return;
        }

        this.props.dispatch(push(url.resolve(`/collections/${this.props.collectionID}`)));
    }

    handleSubmitForReview() {
        this.handleUpdateReviewState(true, false);
    }

    handleMarkAsReviewed() {
        this.handleUpdateReviewState(false, true);
    }

    handlePreviewLoad() {
        //TODO Preview should wait until it's fully loaded before hiding the loader - this currently breaks because React is detecting this final state change
        // on render for some reason. So 'hidden' property on the Preview component is hardcoded to true for now.
        this.setState({ isLoadingPreview: false });
    }

    render() {
        return (
            <DatasetPreview
                onSubmitForReview={this.handleSubmitForReview}
                onMarkAsReviewed={this.handleMarkAsReviewed}
                isReadOnly={this.state.isReadOnly}
                isFetchingCollectionData={this.state.isFetchingCollectionData}
                isSavingData={this.state.isSavingData}
                isLoadingPreview={this.state.isLoadingPreview}
                collectionID={this.props.collectionID}
                previewURL={this.props.versionURL ? `//${location.host}${this.props.versionURL}` : null}
                userEmail={this.props.userEmail}
                dataset={this.props.dataset}
                title={this.props.dataset.title || "Loading dataset title..."}
                backLinkPath={this.backLinkPath}
            />
        );
    }
}

DatasetPreviewController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        dataset: state.state.datasets.activeDataset || {},
        versionURL:
            state.state.datasets.activeDataset && state.state.datasets.activeDataset.links.latest_version
                ? url.resolve(state.state.datasets.activeDataset.links.latest_version.href)
                : null,
        collectionID: state.routing.locationBeforeTransitions.query.collection,
        userEmail: state.state.user.email
    };
}

export default connect(mapStateToProps)(DatasetPreviewController);
