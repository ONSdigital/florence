import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import objectIsEmpty from 'is-empty-object';

import { updateActiveDataset, updateDatasetJob } from '../../../config/actions';
import recipes from '../../../utilities/api-clients/recipes';
import notifications from '../../../utilities/notifications';
import Input from '../../../components/Input';

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    rootPath: PropTypes.string.isRequired,
    datasets: PropTypes.arrayOf(PropTypes.object),
    activeDataset: PropTypes.shape({
        id: PropTypes.string,
        alias: PropTypes.string,
        files: PropTypes.arrayOf(PropTypes.shape({
            description: PropTypes.string.isRequired
        }))
    }),
    job: PropTypes.shape({
        id: PropTypes.string,
        alias: PropTypes.string,
        files: PropTypes.arrayOf(PropTypes.shape({
            alias_name: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired
        })),
        status: PropTypes.string
    }),
    params: PropTypes.shape({
        dataset: PropTypes.string.isRequired,
        job: PropTypes.string.isRequired,
    }).isRequired
}

class DatasetJobController extends Component {
    constructor(props) {
        super(props);

        this.handleFileChange = this.handleFileChange.bind(this);
    }

    componentWillMount() {
        if (!this.props.datasets || this.props.datasets.length === 0) {
            this.setState({isFetchingDataset: true});
            recipes.get(this.props.params.dataset).then(response => {
                this.props.dispatch(updateActiveDataset(response));
                this.setState({isFetchingDataset: false});
            }).catch(error => {
                switch (error.status) {
                    case(404): {
                        const notification = {
                            "type": "neutral",
                            "message": "This dataset was not recognised, so you've been redirect to the main screen.",
                            isDismissable: true
                        }
                        notifications.add(notification);
                        this.props.dispatch(push(`${this.props.rootPath}/datasets`));
                        break;
                    }
                    case("RESPONSE_ERR"):{
                        const notification = {
                            "type": "warning",
                            "message": "An error's occurred whilst trying to get this dataset.",
                            isDismissable: true
                        }
                        notifications.add(notification);
                        break;
                    }
                    case("FETCH_ERR"): {
                        const notification = {
                            type: "warning",
                            message: "There's been a network error whilst trying to get this dataset. Please check you internet connection and try again in a few moments.",
                            isDismissable: true
                        }
                        notifications.add(notification);
                        break;
                    }
                    case("UNEXPECTED_ERR"): {
                        const notification = {
                            type: "warning",
                            message: "An unexpected error has occurred whilst trying to get this dataset.",
                            isDismissable: true
                        }
                        notifications.add(notification);
                        break
                    }
                    default: {
                        const notification = {
                            type: "warning",
                            message: "An unexpected error's occurred whilst trying to get this dataset.",
                            isDismissable: true
                        }
                        notifications.add(notification);
                        break;
                    }
                }
                this.setState({isFetchingDataset: false});
            })
        } else {
            const activeDataset = this.props.datasets.find(dataset => {
                return dataset.id === this.props.params.dataset
            });

            if (!activeDataset) {
                const notification = {
                    type: "neutral",
                    message: "This dataset was not recognised, so you've been redirected to the main screen",
                    isDismissable: true
                }
                notifications.add(notification);
                this.props.dispatch(push(`${this.props.rootPath}/datasets`));
                return;
            }

            this.props.dispatch(updateActiveDataset(activeDataset));
        }
    }

    handleFileChange() {

    }

    renderFileInputs() {
        if (!this.props.activeDataset || objectIsEmpty(this.props.activeDataset)) {
            return;
        }

        return this.props.activeDataset.files.map((file, index) => {
            return (
                <Input 
                    label={file.description}
                    type="file"
                    id={"dataset-upload-" + index.toString()}
                    key={index}
                    onChange={this.handleFileChange}
                    accept=".xls, .xlsx, .csv"
                />
            )
        })
        
    }

    render() {
        return(
            <div className="grid grid--justify-center">
                <div className="grid__col-4">
                    <h1>Upload new file(s)</h1>
                    <Link to={`${this.props.rootPath}/datasets`}>Save and return</Link>
                    {!objectIsEmpty(this.props.datasets) && this.props.activeDataset ?
                        <h2>{this.props.activeDataset.alias}</h2>
                        :
                        <div className="loader loader--dark"></div>
                    }
                    { this.renderFileInputs() }
                </div>
            </div>
        ) 
    }
}

DatasetJobController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        activeDataset: state.state.datasets.active,
        datasets: state.state.datasets.all,
        rootPath: state.state.rootPath
    }
}

export default connect(mapStateToProps)(DatasetJobController);