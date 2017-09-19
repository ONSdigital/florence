import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import dataset from '../../../utilities/api-clients/datasets';
import notifications from '../../../utilities/notifications';

const propTypes = {
    instance_id: PropTypes.string,
    params: PropTypes.shape({
        instance: PropTypes.string
    }),
    dispatch: PropTypes.func.isRequired,
    rootPath: PropTypes.string.isRequired
}

class DatasetMetadataController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingInstance: false,
            instance: null
        };
    }

    componentWillMount() {
        this.setState({isFetchingInstance: true});
        dataset.getInstance(this.props.params.instance).then(instance => {
            this.setState({
                instance,
                isFetchingInstance: false
            });
        }).catch(error => {
            switch (error.status) {
                case(403):{
                    const notification = {
                        "type": "info",
                        "message": "You do not permission to view the metadata for this dataset",
                        isDismissable: true
                    }
                    notifications.add(notification)
                    break;
                }
                case (404): {
                    const notification = {
                        "type": "info",
                        "message": `Dataset ID '${this.props.params.instance}' was not recognised. You've been redirected to the datasets home screen`,
                        isDismissable: true
                    };
                    notifications.add(notification);
                    this.props.dispatch(push(`${this.props.rootPath}/datasets`));
                    break;
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error's occurred whilst trying to get this dataset",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
            }
        });
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-4">
                    <h1>Metadata</h1>
                    {this.state.isFetchingInstance ?
                        <div className="loader loader--dark"></div>
                    :
                        <p>Loadeded</p>
                    }
                </div>
            </div>
        )
    }
}

DatasetMetadataController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        rootPath: state.state.rootPath
    }
}

export default connect(mapStateToProps)(DatasetMetadataController);