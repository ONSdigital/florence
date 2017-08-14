import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import Resumable from 'resumeablejs';
import recipes from '../../../utilities/api-clients/recipes';
import datasetImport from '../../../utilities/api-clients/datasetImport';
import notifications from '../../../utilities/notifications';
import http from '../../../utilities/http';
import FileUpload from '../../../components/file-upload/FileUpload';

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
    params: PropTypes.shape({
        job: PropTypes.string
    }).isRequired
}

class DatasetOverviewController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isFetchingDataset: false,
            activeDataset: null
        }

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }
    
    componentWillMount() {
        if (!this.props.datasets || this.props.datasets.length === 0) {
            this.setState({isFetchingDataset: true});
            const APIResponses = {};
            datasetImport.get(this.props.params.job).then(job => {
                APIResponses.job = job;
                return recipes.get(job.recipe);
            }).then(recipe => {
                APIResponses.recipe = recipe;
                const activeDataset = this.mapAPIResponsesToState({recipe: APIResponses.recipe, job: APIResponses.job});
                this.setState({activeDataset, isFetchingDataset: false});
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
            const job = this.props.jobs.find(job => {
                return job.job_id === this.props.params.job
            });
            const recipe = this.props.datasets.find(dataset => {
                return dataset.id === job.recipe;
            });

            const activeDataset = this.mapAPIResponsesToState({recipe, job});

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

            this.setState({activeDataset});
        }
    }

    componentDidMount() {
        if (!this.state.activeDataset) {
            return;
        }
        this.bindInputs();
    }

    componentDidUpdate() {
        if (!this.state.activeDataset) {
            return;
        }
        
        if (this.state.activeDataset.status === "submitted" && !this.state.activeDataset.dimensions) {
            datasetImport.getDimensions(this.state.activeDataset.instanceID).then(response => {
                const activeDataset = {
                    ...this.state.activeDataset,
                    dimensions: response
                }
                this.setState({activeDataset});
            })
        }
        this.bindInputs();
    }

    bindInputs() {

        document.querySelectorAll("input").forEach(input => {
            const r = new Resumable({
                target: "/upload",
                chunkSize: 5 * 1024 * 1024,
                query: {
                    aliasName: ""
                }
            });
            r.assignBrowse(input);
            r.assignDrop(input);
            r.on('fileAdded', file => {
                const aliasName = file.container.labels[0].textContent
                r.opts.query.aliasName = aliasName;
                r.upload();
                const files = this.state.activeDataset.files.map(currentFile => {
                    if (currentFile.alias_name === aliasName) {
                        currentFile.progress = 0;
                        currentFile.error = null;
                    }
                    return currentFile;
                });
                const activeDataset = {
                    ...this.state.activeDataset,
                    files
                };
                this.setState({activeDataset});
            });
            r.on('fileProgress', file => {
                const progressPercentage = Math.round(Number(file.progress() * 100));
                const files = this.state.activeDataset.files.map(currentFile => {
                    if (currentFile.alias_name === file.resumableObj.opts.query.aliasName) {
                        currentFile.progress = progressPercentage;                      
                    }
                    return currentFile;
                });
                const activeDataset = {
                    ...this.state.activeDataset,
                    files
                };
                this.setState({activeDataset});
            });
            r.on('fileError', file => {
                const files = this.state.activeDataset.files.map(currentFile => {
                    if (currentFile.alias_name === file.resumableObj.opts.query.aliasName) {
                        currentFile.error = "An error occurred whilst uploading this file"                        
                    }
                    return currentFile;
                });
                const activeDataset = {
                    ...this.state.activeDataset,
                    files
                };

                console.error("Error uploading file to server");
                this.setState({activeDataset});
            });
            r.on('fileSuccess', file => {
                const aliasName = file.resumableObj.opts.query.aliasName;
                http.get(`/upload/${file.uniqueIdentifier}`).then(response => {
                    const files = this.state.activeDataset.files.map(currentFile => {
                        if (currentFile.alias_name === aliasName) {
                            currentFile.progress = null;
                            currentFile.url = response.url;
                        }
                        return currentFile;
                    });
                    const activeDataset = {
                        ...this.state.activeDataset,
                        files
                    };

                    this.setState({activeDataset});

                    this.addUploadedFileToJob(aliasName, response.url);

                }).catch(error => {
                    const files = this.state.activeDataset.files.map(currentFile => {
                        if (currentFile.alias_name === aliasName) {
                            currentFile.error = "An error occurred whilst uploading this file"                        
                        }
                        return currentFile;
                    });
                    const activeDataset = {
                        ...this.state.activeDataset,
                        files
                    };

                    console.error("Error fetching uploaded file's URL: ", error);
                    this.setState({activeDataset});
                });
            });
        });
    }

    mapAPIResponsesToState(APIResponse) {
        const recipeAPIResponse = APIResponse.recipe;
        const jobAPIResponse = APIResponse.job;
        const fileURLs = new Map();
        jobAPIResponse.files.forEach(jobFile => {
            if (jobFile.url) {
                fileURLs.set(jobFile.alias_name, jobFile.url);
            }
        });

        const files = recipeAPIResponse.files.map(recipeFile => {
            return {
                alias_name: recipeFile.description,
                url: fileURLs.get(recipeFile.description)
            }
        })

        return {
            recipeID: recipeAPIResponse.id,
            jobID: jobAPIResponse.job_id,
            alias: recipeAPIResponse.alias,
            format: recipeAPIResponse.format,
            status: jobAPIResponse.state,
            instanceID: jobAPIResponse.instances[0].id,
            files
        }
    }

    addUploadedFileToJob(fileAlias, fileURL) {
        datasetImport.addFile(this.state.activeDataset.jobID, fileAlias, fileURL).then().catch(error => {
            switch (error.status) {
                case(400): {
                    const notification = {
                        "type": "warning",
                        "message": "There was an error when trying to add this file to your job. Please fix any errors and attempt to re-upload it.",
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
            console.error(`Error adding file to job "${this.state.activeDataset.jobID}": `, error);
        });
    }

    handleFormSubmit(event) {
        event.preventDefault();
        let filesWithoutURLS = [];

        for (var index = 0; index < this.state.activeDataset.files.length; index++) {
            const file = this.state.activeDataset.files[index]
            if (!file.url) {
                filesWithoutURLS.push(file.alias_name)
            }
        }

        if (filesWithoutURLS.length > 0) {
            const files = this.state.activeDataset.files.map(currentFile => {
                if (filesWithoutURLS.indexOf(currentFile.alias_name) >= 0) {
                    currentFile.error = "You must upload this file before submitting to publishing"                        
                }
                return currentFile;
            });
            const activeDataset = {
                ...this.state.activeDataset,
                files
            };

            this.setState({activeDataset});
            return;
        }

        datasetImport.updateStatus(this.state.activeDataset.jobID, "submitted").then(() => {
            const activeDataset = {
                ...this.state.activeDataset,
                status: "submitted"
            }
            this.setState({activeDataset});
        }).catch(error => {
            console.error(`Error updating status of job '${this.state.activeDataset.jobID}': `, error);
        });
    }

    renderFileInputs() {
        if (!this.state.activeDataset) {
            return;
        }

        return this.state.activeDataset.files.map((file, index) => {
            return (
                <FileUpload 
                    label={file.alias_name}
                    type="file"
                    id={"dataset-upload-" + index.toString()}
                    key={index}
                    accept=".xls, .xlsx, .csv"
                    url={file.url || null}
                    extension={file.extension || null}
                    error={file.error || null}
                    progress={file.progress >= 0 ? file.progress : null}
                />
            )
        })
        
    }

    renderSubmittedScreen() {
        return (
            <div>
                <p className="margin-bottom--2">Your files have been processed and are available to the publishing team</p>
                <h2 className="margin-bottom--1">What happens now?</h2>
                <ul className="list margin-bottom--2">
                    <li className="list__item">Please <a href="mailto:publishing.support.team@ons.gov.uk">contact publishing</a> to let them know your files have been submitted or if you have any questions.</li>
                    <li className="list__item">The publishing team can prepare the dataset landing page which includes the files and associated metadata.</li>
                </ul>
                <h2 className="margin-bottom--1">
                    Dimensions 
                    {(this.state.activeDataset.dimensions && this.state.activeDataset.dimensions.length > 0) && 
                        <span> ({this.state.activeDataset.dimensions.length})</span>
                    }
                </h2>
                <div className="margin-bottom--2">
                {this.state.activeDataset.dimensions ?
                    <ul className="list">
                    {this.state.activeDataset.dimensions.map((dimension, index) => {
                        return <li key={index} className="list__item">{dimension.value}</li>
                    })}
                    </ul>
                :
                    <div> 
                        <p className="margin-bottom--1">Loading dimensions for this dataset...</p>
                        <span className="loader loader--dark"></span>
                    </div>
                }
                {(this.state.activeDataset.dimensions && this.state.activeDataset.dimensions.length === 0) &&
                    <p>Dimensions are currently being processed. This could take some time.</p>
                }
                </div>
                <Link className="btn btn--primary" to={`${this.props.rootPath}/datasets`}>Your datasets</Link>
            </div>
        )
    }

    renderDatasetState() {
        switch (this.state.activeDataset.status) {
            case "created": {
                return (
                    <div>
                        <h1>Upload new file(s)</h1>
                        <div className="margin-bottom--1">
                            &#9664; <Link to={`${this.props.rootPath}/datasets`}>Return</Link>
                        </div>
                        <h2 className="margin-bottom--1">
                            {this.state.activeDataset.alias}
                        </h2>
                        <form onSubmit={this.handleFormSubmit}>
                            { this.renderFileInputs() }
                            <button className="btn btn--positive" type="submit">Submit to publishing</button>
                        </form>
                    </div>
                )
            }
            case "submitted": {
                return (
                    <div>
                        <h1>Your dataset has been submitted</h1>
                        <div className="margin-bottom--1">
                            &#9664; <Link to={`${this.props.rootPath}/datasets`}>Return</Link>
                        </div>
                        {this.renderSubmittedScreen()}
                    </div>
                )
            }
            case "error": {
                return (
                    <div>
                        <h1>An error has occurred</h1>
                        <div className="margin-bottom--1">
                            &#9664; <Link to={`${this.props.rootPath}/datasets`}>Return</Link>
                        </div>
                        <p className="margin-bottom--1">It appears as though as an error has occurred whilst submitting your dataset to publishing</p>
                        <p>Please <a href="mailto:publishing.support.team@ons.gov.uk">contact publishing support</a> and inform them of this error</p>
                    </div>
                )
            }
        }
    }

    render() {
        return(
            <div className="grid grid--justify-center">
                <div className="grid__col-6">
                    {this.state.activeDataset &&
                        this.renderDatasetState()
                    }
                    {this.state.isFetchingDataset &&
                        <div className="grid--align-center grid--align-self-center"> 
                            <div className="loader loader--large loader--dark"></div>
                        </div>
                    }
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
        rootPath: state.state.rootPath
    }
}

export default connect(mapStateToProps)(DatasetOverviewController);