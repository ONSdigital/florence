import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import objectIsEmpty from 'is-empty-object';
import { updateActiveDataset } from '../../../config/actions';
import recipes from '../../../utilities/api-clients/recipes';
import datasetImport from '../../../utilities/api-clients/datasetImport';
import notifications from '../../../utilities/notifications';
import Input from '../../../components/Input';

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    rootPath: PropTypes.string.isRequired,
    datasets: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        alias: PropTypes.string.isRequired
    })),
    jobs: PropTypes.arrayOf(PropTypes.shape({
        job_id: PropTypes.string.isRequired,
        recipe: PropTypes.string.isRequired
    })),
    activeDataset: PropTypes.shape({
        recipeID: PropTypes.string,
        jobID: PropTypes.string,
        alias: PropTypes.string,
        files: PropTypes.arrayOf(PropTypes.shape({
            alias_name: PropTypes.string.isRequired
        }))
    }),
    params: PropTypes.shape({
        dataset: PropTypes.string.isRequired,
        job: PropTypes.string
    }).isRequired
}

class DatasetOverviewController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isFetchingDataset: false,
            // jobID: this.props.params.job || "",
            textareaTimer: null
        }

        this.handleFileChange = this.handleFileChange.bind(this);
    }
    
    componentWillMount() {
        if (!this.props.datasets || this.props.datasets.length === 0) {
            this.setState({isFetchingDataset: true});
            const recipesFetch = recipes.get(this.props.params.dataset);
            const jobFetch = datasetImport.get(this.props.params.job);
            Promise.all([recipesFetch, jobFetch]).then(response => {
                const activeDataset = this.mapAPIResponsesToState(response);
                this.props.dispatch(updateActiveDataset(activeDataset));
                this.setState({isFetchingDataset: false});
            }).catch(error => {
                this.setState({isFetchingDataset: false});
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
                console.error('Error getting job and recipe data: ', error);
            })
        } else {
            const recipe = this.props.datasets.find(dataset => {
                return dataset.id === this.props.params.dataset;
            });
            const job = this.props.jobs.find(job => {
                return job.job_id === this.props.params.job
            });

            const activeDataset = this.mapAPIResponsesToState({0: recipe, 1: job});

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

    mapAPIResponsesToState(response) {
        const recipeAPIResponse = response[0];
        const jobAPIResponse = response[1];

        return Object.assign({}, recipeAPIResponse, {
            recipeID: recipeAPIResponse.id,
            jobID: jobAPIResponse.job_id,
            alias: recipeAPIResponse.alias,
            format: recipeAPIResponse.format,
            files: recipeAPIResponse.files.map(recipeFile => {
                return {
                    alias_name: recipeFile.description,
                    url: jobAPIResponse.files.find(jobFile => {
                        if (jobFile.alias_name === recipeFile.alias_name) {
                            return jobFile.url
                        }
                        return false;
                    })
                }
            }),
            status: jobAPIResponse.state
        })
    }

    handleFileChange(event) {

        // if (this.state.jobID.length === 0) {
        //     datasetImport.create(this.props.activeDataset.recipeID).then(response => {
        //         console.log(response);
        //         this.setState({jobID: response.job_id});
        //     }).catch(error => {
        //         console.error("Error creating new job: ", error);
        //     });
        //     return;
        // }

        const formData = new FormData();
        formData.append('url', event.target.files[0]);
        formData.append('alias_name', '');
        datasetImport.addFile(this.state.jobID, formData).then(response => {
            console.log(response);
        }).catch(error => {
            switch (error.status) {
                case(400): {
                    const notification = {
                        "type": "warning",
                        "message": "There was an error with the file you tried to upload. Please fix any errors and attempt to re-upload it.",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                case(404): {
                    const notification = {
                        "type": "neutral",
                        "message": "This job was not recognised, so you've been redirected to the main screen.",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    this.props.dispatch(push(`${this.props.rootPath}/datasets`));
                    break;
                }
                case(413): {
                    const notification = {
                        "type": "warning",
                        "message": "An error occurred because this file was too big.",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                case(415): {
                    const notification = {
                        "type": "warning",
                        "message": "An error occurred because this file-type is not supported.",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                case("RESPONSE_ERR"):{
                    const notification = {
                        "type": "warning",
                        "message": "An error's occurred whilst trying to upload this file.",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                case("FETCH_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "There's been a network error whilst trying to upload this file. Please check you internet connection and try again in a few moments.",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                case("UNEXPECTED_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error has occurred whilst trying to upload this file.",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error's occurred whilst trying to upload this file.",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
            }
            console.error(`Error adding file to job "${this.state.jobID}": `, error);
        });
    }

    renderFileInputs() {
        if (!this.props.activeDataset || objectIsEmpty(this.props.activeDataset)) {
            return;
        }

        return this.props.activeDataset.files.map((file, index) => {
            if (!file.jobID) {
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
            }
        })
        
    }

    render() {
        return(
            <div className="grid grid--justify-center">
                <div className="grid__col-6">
                    <h1>Upload new file(s)</h1>
                    <Link to={`${this.props.rootPath}/datasets`}>Save and return</Link>
                    {this.state.isFetchingDataset &&
                        <div className="grid--align-center grid--align-self-center"> 
                            <div className="loader loader--large loader--dark"></div>
                        </div>
                    }
                    <h2>
                        {!objectIsEmpty(this.props.datasets) && this.props.activeDataset ?
                            this.props.activeDataset.alias
                            :
                            ""
                        }
                    </h2>
                    { this.renderFileInputs() }
                </div>
            </div>
        )
    }
}

DatasetOverviewController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        datasets: state.state.datasets.all,
        jobs: state.state.datasets.jobs,
        activeDataset: state.state.datasets.active,
        rootPath: state.state.rootPath
    }
}

export default connect(mapStateToProps)(DatasetOverviewController);