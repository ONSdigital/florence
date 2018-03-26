import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import Preview from '../../../components/preview/Preview'
import url from '../../../utilities/url'
import datasets from '../../../utilities/api-clients/datasets'
import notifications from '../../../utilities/notifications'
import collections from '../../../utilities/api-clients/collections'
import {updateActiveDataset, updateActiveDatasetReviewState} from '../../../config/actions'
import log, {eventTypes} from '../../../utilities/log'
import DatasetReviewActions from '../DatasetReviewActions'

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    userEmail: PropTypes.string.isRequired,
    params: PropTypes.shape({
        datasetID: PropTypes.string.isRequired
    }).isRequired,
    latestVersion: PropTypes.string,
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
}

class DatasetPreview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSavingData: false,
            isReadOnly: false,
            isLoadingPreview: false,
            isFetchingCollectionData: false,
            latestVersion: null
        }

        this.handleSubmitForReview = this.handleSubmitForReview.bind(this);
        this.handleMarkAsReviewed = this.handleMarkAsReviewed.bind(this);
        this.handlePreviewLoad = this.handlePreviewLoad.bind(this);
    }
    
    componentWillMount() {
        if (!this.props.collectionID) {
            this.setState({isReadOnly: true});
        }

        if (!this.props.dataset.reviewState) {
            this.updateReviewStateData();
        }

        if (this.props.dataset.links) {
            const latestVersionURL = url.resolve(this.props.dataset.links.latest_version.href);
            this.setState({
                latestVersion: latestVersionURL || ""
            })
            return;
        }

        this.setState({isLoadingPreview: true});
        datasets.get(this.props.params.datasetID).then(response => {
            const dataset = response.next || response.current;
            const latestVersionURL = url.resolve(dataset.links.latest_version.href);
            this.props.dispatch(updateActiveDataset(dataset));
            this.setState({
                latestVersion: latestVersionURL || "",
                isLoadingPreview: false
            });
        }).catch(error => {
            switch(error.status) {
                case(403): {   
                    const notification = {
                        type: "neutral",
                        message: `You do not have permission to view dataset '${this.props.params.datasetID}'`
                    }
                    notifications.add(notification);
                    break;
                }
                case(404): {
                    const notification = {
                        type: "warning",
                        message: `Dataset ID '${this.props.params.datasetID}' can't be found`
                    }
                    notifications.add(notification);
                    break;
                }
                case('FETCH_ERR'): {
                    const notification = {
                        type: "warning",
                        message: `There was a network error whilst getting dataset '${this.props.params.datasetID}'. Please check your connection and try again`
                    }
                    notifications.add(notification);
                    break;
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: `An unexpected error occurred whilst getting dataset '${this.props.params.datasetID}'`
                    }
                    notifications.add(notification);
                }
            }
            this.setState({isLoadingPreview: false});
            console.error(`Error fetching dataset ID '${this.props.params.datasetID}'`, error);
        });
    }

    handleSubmitForReview() {
        //TODO make request to submit dataset for review
    }

    handleMarkAsReviewed(event) {
        event.preventDefault();
        this.setState({isApprovingVersion: true});
        datasets.approveDatasetMetadata(this.props.params.datasetID).then(() => {
            this.setState({isApprovingVersion: false});
            this.props.dispatch(push(url.resolve('/collection/' + this.props.collectionID)));
        }).catch(error => {
            switch(error.status) {
                case(403): {
                    const notification = {
                        type: "warning",
                        message: `You do not have permission to approve this dataset`,
                        autoDismiss: 5000
                    }
                    notifications.add(notification);
                    break;
                }
                case(404): {
                    const notification = {
                        type: "warning",
                        message: `The dataset '${this.props.params.datasetID}' was not recognised`,
                        autoDismiss: 5000
                    }
                    notifications.add(notification);
                    break;
                }
                case("FETCH_ERR"): {
                    const notification = {
                        type: "warning",
                        message: `There was a network error whilst trying to approve this dataset. Please check your connection and try again`,
                        autoDismiss: 5000
                    }
                    notifications.add(notification);
                    break;
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error occurred whilst approving this dataset",
                        autoDismiss: 5000
                    }
                    notifications.add(notification);
                }
            }
            this.setState({isApprovingVersion: false});
            console.error("Error whilst approving dataset", error);
        });
    }

    getCollection(collectionID) {
        return collections.get(collectionID)
            .then(response => [null, response])
            .catch(error => [error, null]);
    }

    async updateReviewStateData() {
        this.setState({isFetchingCollectionData: true});
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
                this.setState({isFetchingCollectionData: false});
                return;
            }
            const lastEditedBy = dataset.lastEditedBy;
            const reviewState = dataset.state.charAt(0).toLowerCase() + dataset.state.slice(1); //lowercase it so it's consistent with the properties in our state (i.e. "InProgress" = "inProgress" )
            this.props.dispatch(updateActiveDatasetReviewState(lastEditedBy, reviewState));
            this.setState({isFetchingCollectionData: false});
        } catch (error) {
            this.setState({
                isFetchingCollectionData: false,
                isReadOnly: true
            });
            switch (error.status) {
                case (401): {
                    // handled by request utility function
                    break;
                }
                case (403): {
                    const notification = {
                        "type": "neutral",
                        "message": `You do not permission to get details for collection '${collectionID}'`,
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                case (404): {
                    const notification = {
                        "type": "warning",
                        "message": `Could not find collection '${collectionID}'`,
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
                    }
                    notifications.add(notification);
                    break;
                }
            }
            log.add(eventTypes.unexpectedRuntimeError, {message: "Unable to update metadata screen with version's review/edit status in collection " + collectionID + ". Error: " + JSON.stringify(error)});
            console.error("Unable to update metadata screen with version's review/edit status in collection '" + collectionID + "'", error);
        }
    }

    handlePreviewLoad() {
        //TODO Preview should wait until it's fully loaded before hiding the loader - this currently breaks because React is detecting this final state change 
        // on render for some reason. So 'hidden' property on the Preview component is hardcoded to true for now.
        this.setState({isLoadingPreview: false});
    }

    renderReviewActions() {
        if (this.state.isReadOnly || this.state.isFetchingCollectionData) {
            return;
        }

        return (
            <DatasetReviewActions
                areDisabled={this.state.isApprovingVersion || this.state.isReadOnly}
                includeSaveLabels={false}
                reviewState={this.props.dataset.reviewState}
                userEmail={this.props.userEmail}
                lastEditedBy={this.props.dataset.lastEditedBy}
                onSubmit={this.handleSubmitForReview}
                onApprove={this.handleMarkAsReviewed}
                notInCollectionYet={!this.props.dataset.collection_id}     
            />
        )
    }

    render() {
        return (
            <div className="preview">
                <div className="preview__header grid grid--justify-center">
                    <div className="grid__col-6 margin-top--1 margin-bottom--1">
                        <form onSubmit={this.handleMarkAsReviewed}>
                            &#9664; <Link to={`${url.resolve("metadata?collection="+this.props.collectionID, !this.props.collectionID)}`}>Back</Link>
                            <h2 className="inline-block margin-left--1">{this.props.dataset.title || "Loading dataset title..."}</h2>
                            {this.renderReviewActions()}
                            {this.state.isApprovingVersion &&
                                <div className="loader loader--dark loader--centre margin-left--1"></div>
                            }
                        </form>
                    </div>
                </div>
                {this.state.isLoadingPreview && 
                    <div className="grid grid--align-content-center grid--full-height grid--direction-column grid--justify-center grid--align-center">
                        <p className="font-size--16 font-weight--600 margin-bottom--1">Loading preview</p>
                        <div className="loader loader--dark loader--centre loader--large"></div>
                    </div>
                }
                {this.state.latestVersion &&
                    <Preview hidden={false} onLoad={this.handlePreviewLoad} path={`//${location.host}${this.state.latestVersion}`}/>
                }
            </div>
        )
    }
}

DatasetPreview.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        dataset: state.state.datasets.activeDataset || {},
        latestVersion: (state.state.datasets.activeDataset && state.state.datasets.activeDataset.latest_version) ? state.state.datasets.activeDataset.latest_version.href : null,
        collectionID: state.routing.locationBeforeTransitions.query.collection,
        userEmail: state.state.user.email
    }
}

export default connect(mapStateToProps)(DatasetPreview);