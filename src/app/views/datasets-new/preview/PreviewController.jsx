import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Link } from 'react-router';

import url from '../../../utilities/url'
import notifications from '../../../utilities/notifications'
import datasets from '../../../utilities/api-clients/datasets'

import Preview from '../../../components/preview/Preview'
import Iframe from '../../../components/iframe/Iframe';

const propTypes = {
    
}

export class PreviewController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoadingPreview: false,
            errorFetchingDataset: false,
            collectionID: "",
            datasetID: "",
            datasetTitle: "",
            edition: "",
            version: ""
        }

    }
    
    async componentWillMount() {
        const getDatasetresponse = await this.getDataset(this.props.params.datasetID) 

        this.setState({
            collectionID: this.props.params.collectionID,
            datasetID: this.props.params.datasetID,
            datasetTitle: getDatasetresponse.title,
            edition: this.props.params.edition,
            version: this.props.params.version
        });
    }

    async getDataset(datasetID) {
        this.state.isLoadingPreview = true
        return await datasets.get(datasetID)
        .then(response => {
            this.setState({isLoadingPreview: false});
            return response.current || response.next
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
            this.state.errorFetchingDataset = true
            this.state.isLoadingPreview = false
            console.error(`Error fetching dataset ID '${this.props.params.datasetID}'`, error);
        })
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
                    <p className="margin-bottom--1 font-size--18"><span className="font-weight--600">Dataset</span>: {this.state.title ? this.state.title : "loading..."}</p>
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

function mapStateToProps(state) {
    return {
        
    }
}

export default connect(mapStateToProps)(PreviewController);