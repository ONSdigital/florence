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
        dataset: PropTypes.string.isRequired,
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
            const recipesFetch = recipes.get(this.props.params.dataset);
            const jobFetch = datasetImport.get(this.props.params.job);
            Promise.all([recipesFetch, jobFetch]).then(response => {
                const activeDataset = this.mapAPIResponsesToState(response);
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
        this.bindInputs();
    }

    bindInputs() {
        const r = new Resumable({
            target: "/upload",
            chunkSize: 5 * 1024 * 1024,
        });

        document.querySelectorAll("input").forEach(input => {
            r.assignBrowse(input);
            r.assignDrop(input);
            r.on('fileAdded', () => {
                r.upload();
            });
            // r.on('fileProgress', file => {
            //     console.log(file.isUploading());
            // });
            r.on('fileError', file => {
                const files = this.state.activeDataset.files.map(currentFile => {
                    if (currentFile.alias_name === file.alias_name) {
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
                const inputLabel = file.container.labels[0].textContent;
                http.get(`/upload/${file.uniqueIdentifier}`).then(response => {
                    const files = this.state.activeDataset.files.map(currentFile => {
                        if (currentFile.alias_name === inputLabel) {
                            currentFile.url = response.url;
                        }
                        return currentFile;
                    });
                    const activeDataset = {
                        ...this.state.activeDataset,
                        files
                    };

                    this.setState({activeDataset});

                    this.addUploadedFileToJob(inputLabel, response.url);

                }).catch(error => {
                    const files = this.state.activeDataset.files.map(currentFile => {
                        if (currentFile.alias_name === inputLabel) {
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

    mapAPIResponsesToState(response) {
        const recipeAPIResponse = response[0];
        const jobAPIResponse = response[1];
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

        return Object.assign({}, recipeAPIResponse, {
            recipeID: recipeAPIResponse.id,
            jobID: jobAPIResponse.job_id,
            alias: recipeAPIResponse.alias,
            format: recipeAPIResponse.format,
            status: jobAPIResponse.state,
            files
        })
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
        datasetImport.updateStatus(this.state.activeDataset.jobID, "submitted").then(() => {
            const activeDataset = {
                ...this.state.activeDataset,
                status: "submitted"
            }
            this.setState({activeDataset});
        }).catch(error => {
            console.error(`Error updating status of job '${this.state.activeDataset.id}': `, error);
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
                />
            )
        })
        
    }

    render() {
        console.log(this.state.activeDataset);
        return(
            <div className="grid grid--justify-center">
                <div className="grid__col-6">
                    <h1>
                        {this.state.activeDataset && this.state.activeDataset.status !== "submitted" ?
                            "Upload new file(s)"
                        :
                            "Submitted to publishing"
                        }
                    </h1>
                    <span className="margin-bottom--1">
                        &#9664; <Link to={`${this.props.rootPath}/datasets`}>Return</Link>
                    </span>
                    {this.state.isFetchingDataset &&
                        <div className="grid--align-center grid--align-self-center"> 
                            <div className="loader loader--large loader--dark"></div>
                        </div>
                    }
                    {this.state.activeDataset &&
                        <h2 className="margin-bottom--1">
                            {this.state.activeDataset.alias}
                        </h2>
                    }
                    <form onSubmit={this.handleFormSubmit}>
                        { this.renderFileInputs() }
                        {this.state.activeDataset && this.state.activeDataset.status !== "submitted" ?
                            <button className="btn btn--primary" type="submit">Submit to publishing</button>
                        :
                            ""
                        }
                    </form>
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