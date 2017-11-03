import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import Preview from '../../../components/preview/Preview'
import url from '../../../utilities/url'
import datasets from '../../../utilities/api-clients/datasets'
import notifications from '../../../utilities/notifications'

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.shape({
        datasetID: PropTypes.string.isRequired
    }).isRequired
}

class DatasetPreview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            datasetTitle: null,
            isApprovingVersion: false
        }

        this.handleApproveSubmit = this.handleApproveSubmit.bind(this);
    }
    
    componentWillMount() {
        datasets.get(this.props.params.datasetID).then(dataset => {
            this.setState({datasetTitle: dataset.next.title});
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
            console.error(`Error fetching dataset ID '${this.props.params.datasetID}'`, error);
        });
    }

    handleApproveSubmit(event) {
        event.preventDefault();
        this.setState({isApprovingVersion: true});
        
        const params = this.props.params;
        datasets.approveDatasetMetadata(params.datasetID).then(() => {
            this.props.dispatch(push(url.resolve('/datasets')));
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
                        message: `The dataset '${params.datasetID}' was not recognised`,
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

    render() {
        const params = this.props.params;
        return (
            <div className="preview">
                <div className="preview__header grid grid--justify-center">
                    <div className="grid__col-6 margin-top--1 margin-bottom--1">
                        <form onSubmit={this.handleApproveSubmit}>
                            &#9664; <Link to={`${url.resolve("../")}`}>Back</Link>
                            <h2 className="inline-block margin-left--1">{this.state.datasetTitle || ""}</h2>
                            <button disabled={this.state.isApprovingVersion} className="btn btn--primary btn--block margin-left--1">Approve</button>
                            {this.state.isApprovingVersion &&
                                <div className="loader loader--dark loader--centre margin-left--1"></div>
                            }
                        </form>
                    </div>
                </div>
                <Preview 
                    path={`//${location.host}/datasets/${params.datasetID}`}
                />
            </div>
        )
    }
}

DatasetPreview.propTypes = propTypes;

export default connect()(DatasetPreview);