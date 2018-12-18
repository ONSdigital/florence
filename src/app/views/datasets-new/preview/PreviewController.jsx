import React, { Component } from 'react';
import { push } from 'react-router-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import url from '../../../utilities/url'
import notifications from '../../../utilities/notifications'
import datasets from '../../../utilities/api-clients/datasets'

import Iframe from '../../../components/iframe/Iframe';

const propTypes = {
    params: PropTypes.shape({
        collectionID: PropTypes.string.isRequired,
        datasetID: PropTypes.string.isRequired,
        editionID: PropTypes.string.isRequired,
        versionID: PropTypes.string.isRequired,
    }),
    dispatch: PropTypes.func.isRequired
}

export class PreviewController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingDataset: false,
            dataset: {}
        }
    }
    
    componentWillMount() {
        this.getDataset(this.props.params.datasetID);
    }

    getDataset = datasetID => {
        this.setState({isFetchingDataset: true});
        return datasets.get(datasetID + "101839").then(datatset => {
            this.setState({isFetchingDataset: false, dataset: this.mapDatasetToState(datatset)});
        })
        .catch(error => {
            switch(error.status) {
                case(403): {   
                    const notification = {
                        type: "neutral",
                        message: `You do not have permission to view dataset '${this.props.params.datasetID}'`,
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                case(404): {
                    const notification = {
                        type: "warning",
                        message: `Dataset ID '${this.props.params.datasetID}' can't be found`,
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                case('FETCH_ERR'): {
                    const notification = {
                        type: "warning",
                        message: `There was a network error whilst getting dataset '${this.props.params.datasetID}'. Please check your connection and try again`,
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: `An unexpected error occurred whilst getting dataset '${this.props.params.datasetID}'`,
                        isDismissable: true
                    }
                    notifications.add(notification);
                }
            }
            this.setState({isFetchingDataset: false});
            console.error(`Error fetching dataset ID '${this.props.params.datasetID}'`, error);
        })
    }

    mapDatasetToState = datasetResponse => {
        try {
            const dataset = datasetResponse.current || datasetResponse.next || datasetResponse;
            return {
                title: dataset.title
            }
        } catch (error) {
            const notification = {
                type: "warning",
                message: "An unexpected error occurred when trying to get dataset details, so some functionality in Florence may not work as expected. Try refreshing the page",
                isDismissable: true
            }
            notifications.add(notification);
            console.error("Error getting dataset details to state:\n", error);
        }
    }

    handleBackButton = () => {
        const previousUrl = url.resolve("../");
        this.props.dispatch(push(previousUrl));
    }

    render() {
        return (
            <div>
            <div className="grid grid--justify-center">
                <div className="grid__col-6 margin-bottom--1">
                    <div className="margin-top--2">
                        &#9664; <button type="button" className="btn btn--link" onClick={this.handleBackButton}>Back</button>
                    </div>
                    <h1 className="margin-top--1 margin-bottom--1">Preview</h1>
                    <p className="margin-bottom--1 font-size--18"><span className="font-weight--600">Dataset</span>: {this.state.dataset.title ? this.state.dataset.title : "loading..."}</p>
                    <p className="margin-bottom--1 font-size--18"><span className="font-weight--600">Edition</span>: {this.props.params.editionID}</p>
                    <p className="margin-bottom--1 font-size--18"><span className="font-weight--600">Version</span>: {this.props.params.versionID}</p>
               </div>
            </div>
            <div className="preview--half preview--borders">
                <Iframe path={`/datasets/${this.props.params.datasetID}/editions/${this.props.params.editionID}/versions/${this.props.params.versionID}`}/>
            </div>
            <div className="grid grid--justify-center">
                <div className="grid__col-6">
                    <div className="margin-top--1 margin-bottom--1">
                        <Link className="btn btn--positive margin-right--1" to={window.location.origin + "/florence/collections/" + this.props.params.collectionID}>Continue</Link>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

PreviewController.propTypes = propTypes;

export default PreviewController;