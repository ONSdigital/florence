import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import Preview from '../../../components/preview/Preview'
import url from '../../../utilities/url'
import datasets from '../../../utilities/api-clients/datasets'
import notifications from '../../../utilities/notifications'

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.shape({
        datasetID: PropTypes.string.isRequired,
        edition: PropTypes.string.isRequired,
        version: PropTypes.string.isRequired
    }).isRequired
}

class InstancePreview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            datasetTitle: null
        }
    }
    
    componentWillMount() {
        datasets.get(this.props.params.datasetID).then(dataset => {
            this.setState({datasetTitle: dataset.title});
        }).catch(error => {
            switch(error.status) {
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

    render() {
        const params = this.props.params;
        return (
            <div>
                <div className="margin-top--1 grid grid--justify-center">
                    <div className="grid__col-6 margin-bottom--1">
                        <div>
                            &#9664; <Link to={`${url.resolve("collection")}`}>Back</Link>
                        </div>
                    </div>
                </div>
                <Preview 
                    path={`//${location.host}/datasets/${params.datasetID}/editions/${params.edition}/versions/${params.version}`}
                />
            </div>
        )
    }
}

InstancePreview.propTypes = propTypes;

export default connect()(InstancePreview);