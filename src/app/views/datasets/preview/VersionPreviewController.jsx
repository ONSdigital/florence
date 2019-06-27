import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import PropTypes from "prop-types";
import url from "../../../utilities/url";
import datasets from "../../../utilities/api-clients/datasets";
import notifications from "../../../utilities/notifications";
import collections from "../../../utilities/api-clients/collections";
import { updateActiveVersion, updateActiveVersionReviewState, updateActiveDataset } from "../../../config/actions";
import log, { eventTypes } from "../../../utilities/log";
import datasetHandleMetadataSaveErrors from "../metadata/datasetHandleMetadataSaveErrors";
import DatasetPreview from "./DatasetPreview";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    userEmail: PropTypes.string.isRequired,
    params: PropTypes.shape({
        datasetID: PropTypes.string.isRequired,
        edition: PropTypes.string.isRequired,
        version: PropTypes.string.isRequired
    }).isRequired,
    versionURL: PropTypes.string,
    collectionID: PropTypes.string,
    version: PropTypes.shape({
        title: PropTypes.string,
        collection_id: PropTypes.string,
        links: PropTypes.shape({
            latest_version: PropTypes.shape({
                href: PropTypes.string
            })
        }),
        reviewState: PropTypes.string,
        lastEditedBy: PropTypes.string
    }),
    dataset: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired
    })
};

class VersionPreviewController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSavingData: false,
            isReadOnly: false,
            isLoadingPreview: false,
            isFetchingCollectionData: false,
            isFetchingDatasetData: false,
            errorFetchingDataset: false
        };

        this.handleSubmitForReview = this.handleSubmitForReview.bind(this);
        this.handleMarkAsReviewed = this.handleMarkAsReviewed.bind(this);
        this.handlePreviewLoad = this.handlePreviewLoad.bind(this);

        this.backLinkPath = url.resolve(`metadata?collection=${this.props.collectionID}`, !this.props.collectionID);
    }

    componentWillMount() {
        this.setState({ isLoadingPreview: true });

        if (!this.props.collectionID) {
            this.setState({ isReadOnly: true });
        }

        if (!this.props.version.reviewState) {
            this.updateReviewStateData();
        }

        if (!this.props.dataset || this.props.dataset.id !== this.props.params.datasetID) {
            this.updateDatasetData();
        }

        datasets
            .getVersion(this.props.params.datasetID, this.props.params.edition, this.props.params.version)
            .then(response => {
                this.setState({ isLoadingPreview: false });
                this.props.dispatch(updateActiveVersion(response));
            })
            .catch(error => {
                const versionURL = `/datasets/${this.props.params.datasetID}/editions/${this.props.params.edition}/versions/${this.props.params.version}`;
                switch (error.status) {
                    case 401: {
                        // handled by request utility function
                        break;
                    }
                    case 403: {
                        const notification = {
                            type: "neutral",
                            message: `You do not have permission to view dataset version '${versionURL}'`
                        };
                        notifications.add(notification);
                        break;
                    }
                    case 404: {
                        const notification = {
                            type: "warning",
                            message: `Dataset version '${versionURL}' can't be found`
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "FETCH_ERR": {
                        const notification = {
                            type: "warning",
                            message: `There was a network error whilst getting dataset version '${versionURL}'. Please check your connection and try again`
                        };
                        notifications.add(notification);
                        break;
                    }
                    default: {
                        const notification = {
                            type: "warning",
                            message: `An unexpected error occurred whilst getting dataset version '${versionURL}'`
                        };
                        notifications.add(notification);
                    }
                }
                this.setState({ isLoadingPreview: false });
                console.error(`Error fetching dataset version '${versionURL}'`, error);
            });
    }

    updateDatasetData() {
        this.setState({ isFetchingDatasetData: true });
        const datasetID = this.props.params.datasetID;
        datasets
            .get(datasetID)
            .then(response => {
                const dataset = response.next || response.current;
                this.props.dispatch(updateActiveDataset(dataset));
                this.setState({ isFetchingDatasetData: false });
            })
            .catch(error => {
                console.error("Error fetching dataset on version preview screen", error);
                log.add(eventTypes.unexpectedRuntimeError, {
                    message: `Error fetching dataset on version preview screen. Error:${JSON.stringify(error)}`
                });
                this.setState({
                    isFetchingDatasetData: false,
                    errorFetchingDataset: true
                });
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
        const edition = this.props.params.edition;
        const version = this.props.params.version;

        try {
            const [error, collection] = await this.getCollection(collectionID);
            if (error) {
                throw error;
            }

            const collectionVersion = collection.datasetVersions.find(datasetVersion => {
                return datasetVersion.id === datasetID && datasetVersion.edition === edition && datasetVersion.version === version;
            });
            if (!collectionVersion) {
                this.setState({ isFetchingCollectionData: false });
                return;
            }
            const lastEditedBy = collectionVersion.lastEditedBy;
            const reviewState = collectionVersion.state.charAt(0).toLowerCase() + collectionVersion.state.slice(1); //lowercase it so it's consistent with the properties in our state (i.e. "InProgress" = "inProgress" )
            this.props.dispatch(updateActiveVersionReviewState(lastEditedBy, reviewState));
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
                message: "Unable to update metadata screen with version's review/edit status in collection " + collectionID + ". Error: " + JSON.stringify(error)
            });
            console.error("Unable to update metadata screen with version's review/edit status in collection '" + collectionID + "'", error);
        }
    }

    updateDatasetReviewState(isSubmittingForReview, isMarkingAsReviewed) {
        let request = Promise.resolve;

        if (isSubmittingForReview) {
            request = collections.setDatasetVersionStatusToComplete;
        }

        if (isMarkingAsReviewed) {
            request = collections.setDatasetVersionStatusToReviewed;
        }

        return request(this.props.collectionID, this.props.params.datasetID, this.props.params.edition, this.props.params.version).catch(error => {
            log.add(eventTypes.unexpectedRuntimeError, {
                message: `Error updating review state for dataset version '${this.props.versionURL}' to '${isSubmittingForReview ? "Complete" : ""}${
                    isMarkingAsReviewed ? "Reviewed" : ""
                }' in collection '${this.props.collectionID}'. Error: ${JSON.stringify(error)}`
            });
            console.error(
                `Error updating review state for dataset '${this.props.versionURL}' to '${isSubmittingForReview ? "Complete" : ""}${
                    isMarkingAsReviewed ? "Reviewed" : ""
                }' in collection '${this.props.collectionID}'`,
                error
            );
            return error;
        });
    }

    async handleUpdateReviewState(isSubmittingForReview, isMarkingAsReviewed) {
        this.setState({ isSavingData: true });

        const updateError = await this.updateDatasetReviewState(isSubmittingForReview, isMarkingAsReviewed);
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

    renderDatasetTitle() {
        if (this.state.isFetchingDatasetData) {
            return "Loading dataset title...";
        }

        if (this.state.errorFetchingDataset || !this.props.dataset || !this.props.dataset.title) {
            return `[failed to get dataset title]: ${this.props.params.edition} (version ${this.props.params.version})`;
        }

        return `${this.props.dataset.title}: ${this.props.params.edition} (version ${this.props.params.version})`;
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
                dataset={this.props.version}
                title={this.renderDatasetTitle()}
                backLinkPath={this.backLinkPath}
            />
        );
    }
}

VersionPreviewController.propTypes = propTypes;

function buildVersionPath(version) {
    try {
        const path = `/datasets/${version.links.dataset.id}/editions/${version.edition}/versions/${version.version}`;
        return path;
    } catch (error) {
        console.error("Error attempting to build path for a dataset version", error, version);
        log.add(eventTypes.unexpectedRuntimeError, {
            message: `Error attempting to build path for a dataset version. Error: ${JSON.stringify(error)}. Version data: ${JSON.stringify}`
        });
        notifications.add({
            type: "warning",
            message: "Unable to build path for this version, so some functionality may not work as expected",
            autoDismiss: 6000,
            isDismissable: true
        });
        return "";
    }
}

function mapStateToProps(state) {
    return {
        version: state.state.datasets.activeVersion || {},
        dataset: state.state.datasets.activeDataset,
        versionURL: state.state.datasets.activeVersion ? buildVersionPath(state.state.datasets.activeVersion) : null,
        collectionID: state.routing.locationBeforeTransitions.query.collection,
        userEmail: state.state.user.email
    };
}

export default connect(mapStateToProps)(VersionPreviewController);
