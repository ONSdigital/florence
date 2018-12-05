import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import url from '../../../utilities/url'
import notifications from '../../../utilities/notifications'
import datasets from '../../../utilities/api-clients/datasets'

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
            <div className="grid grid--justify-center">
                <div className="grid__col-6 margin-bottom--1">
                    <div className="margin-top--2">
                        &#9664; <button type="button" className="btn btn--link font-size--16" onClick={this.handleBackButton}>Back</button>
                    </div>
                    <h1 className="margin-top--1 margin-bottom--1">Preview</h1>
                    <div className="font-size--18"><span className="font-weight--600">Dataset: </span>{this.state.datasetTitle}</div>
                    <div className="font-size--18"><span className="font-weight--600">Edition: </span>{this.state.edition}</div>
                    <div className="font-size--18"><span className="font-weight--600">Version: </span>{this.state.version}</div>
               </div>
               <iframe src={window.location.origin + "/datasets/" + this.state.datasetID + "/editions/" + this.state.edition + "/versions/" + this.state.version} title="ONS website preview" className="iframe--preview" width="100%" height="600px"></iframe>
               {this.props.isLoadingPreview && 
                    <div className="grid grid--align-content-center grid--full-height grid--direction-column grid--justify-center grid--align-center">
                        <p className="font-size--16 font-weight--600 margin-bottom--1">Loading preview</p>
                        <div className="loader loader--dark loader--centre loader--large"></div>
                    </div>
                }
                <div className="grid__col-6">
                {/*for grid__col child width 100% */}
                <div className="margin-top--1 margin-bottom--1">
                    <a type="button" className="btn btn--positive margin-right--1" href={window.location.origin + "/florence/collections/" + this.state.collectionID}>Continue</a>
                    <button type="button" className="btn" onClick={this.handleBackButton}>Go back</button>
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