import React, { Component } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import PropTypes from "prop-types";

import Resumable from "resumeablejs";
import recipes from "../../../../utilities/api-clients/recipes";
import datasetImport from "../../../../utilities/api-clients/datasetImport";
import notifications from "../../../../utilities/notifications";
import http from "../../../../utilities/http";
import FileUpload from "../../../../components/file-upload/FileUpload";
import url from "../../../../utilities/url";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    recipes: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            alias: PropTypes.string.isRequired,
        })
    ),
    jobs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            recipe: PropTypes.string.isRequired,
        })
    ),
    params: PropTypes.shape({
        jobID: PropTypes.string,
    }).isRequired,
};

class DatasetUploadController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingDataset: false,
            loadingPageForFirstTime: false,
            activeDataset: null,
            isCantabular: false,
        };

        let intervalID = 0;
    }

    UNSAFE_componentWillMount() {
        if (!this.props.recipes || this.props.recipes.length === 0) {
            this.repeatUploadStatusCheck();
        } else {
            const job = this.props.jobs.find(job => {
                return job.id === this.props.params.jobID;
            });
            const recipe = this.props.recipes.find(dataset => {
                return dataset.id === job.recipe;
            });
            const activeDataset = this.mapAPIResponsesToState({ recipe, job });

            if (!activeDataset) {
                const notification = {
                    type: "neutral",
                    message: "This dataset was not recognised, so you've been redirected to the main screen",
                    isDismissable: true,
                };
                notifications.add(notification);
                this.props.dispatch(push(url.resolve("../")));
                return;
            }

            this.setState({ activeDataset });
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

        if (this.state.activeDataset.status === "completed" && !this.state.activeDataset.dimensions) {
            datasetImport.getDimensions(this.state.activeDataset.instanceID).then(response => {
                const activeDataset = {
                    ...this.state.activeDataset,
                    dimensions: [],
                };
                response.map(dimension => {
                    activeDataset.dimensions.push(dimension.name);
                });
                this.setState({ activeDataset });
            });
        }
        this.bindInputs();
    }

    repeatUploadStatusCheck = () => {
        this.setState(
            {
                isFetchingDataset: true,
                loadingPageForFirstTime: true,
            },
            () => {
                this.getUploadStatus();
            }
        );
        this.intervalID = setInterval(async () => {
            if (!this.state.isFetchingDataset) {
                this.setState({ isFetchingDataset: true }, () => {
                    this.getUploadStatus();
                });
            }
        }, 5000);
    };

    getUploadStatus = () => {
        const APIResponses = {};
        datasetImport
            .get(this.props.params.jobID)
            .then(job => {
                APIResponses.job = job;
                return recipes.get(job.recipe);
            })
            .then(recipe => {
                APIResponses.recipe = recipe;
                const activeDataset = this.mapAPIResponsesToState({
                    recipe: APIResponses.recipe,
                    job: APIResponses.job,
                });
                this.setState({ activeDataset, isFetchingDataset: false, loadingPageForFirstTime: false });
            })
            .catch(error => {
                this.setState({ isFetchingDataset: false, loadingPageForFirstTime: false });
                clearInterval(this.intervalID);
                switch (error.status) {
                    case 404: {
                        const notification = {
                            type: "neutral",
                            message: `The job '${this.props.params.jobID}' was not recognised, so you've been redirected to the dataset upload screen.`,
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        this.props.dispatch(push(url.resolve("../")));
                        break;
                    }
                    case "RESPONSE_ERR": {
                        const notification = {
                            type: "warning",
                            message: "An error's occurred whilst trying to get this job.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "FETCH_ERR": {
                        const notification = {
                            type: "warning",
                            message:
                                "There's been a network error whilst trying to get this job. Please check you internet connection and try again in a few moments.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "UNEXPECTED_ERR": {
                        const notification = {
                            type: "warning",
                            message: "An unexpected error has occurred whilst trying to get this job.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    default: {
                        const notification = {
                            type: "warning",
                            message: "An unexpected error's occurred whilst trying to get this job.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                }
                console.error("Error getting job and recipe data: ", error);
            });
        return APIResponses;
    };

    bindInputs() {
        document.querySelectorAll('input[type="file"]').forEach(input => {
            const r = new Resumable({
                target: "/upload",
                chunkSize: 5 * 1024 * 1024,
                query: {
                    aliasName: "",
                },
                forceChunkSize: true,
                simultaneousUploads: 1,
            });
            r.assignBrowse(input);
            r.assignDrop(input);
            r.on("fileAdded", file => {
                const aliasName = file.container.name;
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
                    files,
                };
                this.setState({ activeDataset });
            });
            r.on("fileProgress", file => {
                const progressPercentage = Math.round(Number(file.progress() * 100));
                const files = this.state.activeDataset.files.map(currentFile => {
                    if (currentFile.alias_name === file.resumableObj.opts.query.aliasName) {
                        currentFile.progress = progressPercentage;
                    }
                    return currentFile;
                });
                const activeDataset = {
                    ...this.state.activeDataset,
                    files,
                };
                this.setState({ activeDataset });
            });
            r.on("fileError", file => {
                const files = this.state.activeDataset.files.map(currentFile => {
                    if (currentFile.alias_name === file.resumableObj.opts.query.aliasName) {
                        currentFile.error = "An error occurred whilst uploading this file.";
                    }
                    return currentFile;
                });
                const activeDataset = {
                    ...this.state.activeDataset,
                    files,
                };

                console.error("Error uploading file to server");
                this.setState({ activeDataset });
            });
            r.on("fileSuccess", file => {
                const aliasName = file.resumableObj.opts.query.aliasName;
                http.get(`/upload/${file.uniqueIdentifier}`)
                    .then(response => {
                        const files = this.state.activeDataset.files.map(currentFile => {
                            if (currentFile.alias_name === aliasName) {
                                currentFile.progress = null;
                                currentFile.url = response.url;
                            }
                            return currentFile;
                        });
                        const activeDataset = {
                            ...this.state.activeDataset,
                            files,
                        };

                        this.setState({ activeDataset });

                        this.addUploadedFileToJob(aliasName, response.url);
                    })
                    .catch(error => {
                        const files = this.state.activeDataset.files.map(currentFile => {
                            if (currentFile.alias_name === aliasName) {
                                currentFile.error = "An error occurred whilst uploading this file";
                            }
                            return currentFile;
                        });
                        const activeDataset = {
                            ...this.state.activeDataset,
                            files,
                        };

                        console.error("Error fetching uploaded file's URL: ", error);
                        this.setState({ activeDataset });
                    });
            });
        });
    }

    mapAPIResponsesToState(APIResponse) {
        const recipeAPIResponse = APIResponse.recipe;
        const jobAPIResponse = APIResponse.job;
        const fileURLs = new Map();
        let files = new Map();
        if (jobAPIResponse.files.length > 0) {
            jobAPIResponse.files.forEach(jobFile => {
                if (jobFile.url) {
                    fileURLs.set(jobFile.alias_name, jobFile.url);
                }
            });
        }

        if (recipeAPIResponse.files) {
            files = recipeAPIResponse.files.map(recipeFile => {
                return {
                    alias_name: recipeFile.description,
                    url: fileURLs.get(recipeFile.description),
                };
            });
        }

        const editionsList = recipeAPIResponse.output_instances.map((output, i) => {
            const editions = recipeAPIResponse.output_instances[i].editions;
            return editions;
        });

        const editionOverride = recipeAPIResponse.output_instances.editions_override;

        if (jobAPIResponse.state === "completed" || jobAPIResponse.state === "error") {
            clearInterval(this.intervalID);
        }

        if (recipeAPIResponse.format === "cantabular_table" || recipeAPIResponse.format === "cantabular_blob") {
            this.setState({ isCantabular: true });
        }

        return {
            recipeID: recipeAPIResponse.id,
            jobID: jobAPIResponse.id,
            alias: recipeAPIResponse.alias,
            format: recipeAPIResponse.format,
            status: jobAPIResponse.state,
            instanceID: jobAPIResponse.links.instances ? jobAPIResponse.links.instances[0].id : "",
            files,
            editionsList,
            editionOverride,
        };
    }

    addUploadedFileToJob(fileAlias, fileURL) {
        datasetImport
            .addFile(this.state.activeDataset.jobID, fileAlias, fileURL)
            .then()
            .catch(error => {
                switch (error.status) {
                    case 400: {
                        const notification = {
                            type: "warning",
                            message:
                                "There was an error when trying to add this file to your job. Please fix any errors and attempt to re-upload it.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case 404: {
                        const notification = {
                            type: "neutral",
                            message: "This job was not recognised, another user may have deleted it.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case 413: {
                        const notification = {
                            type: "warning",
                            message: "An error occurred because this file was too big.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case 415: {
                        const notification = {
                            type: "warning",
                            message: "An error occurred because this file-type is not supported.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "RESPONSE_ERR": {
                        const notification = {
                            type: "warning",
                            message: "An error's occurred whilst trying to upload this file.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "FETCH_ERR": {
                        const notification = {
                            type: "warning",
                            message:
                                "There's been a network error whilst trying to upload this file. Please check you internet connection and try again in a few moments.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "UNEXPECTED_ERR": {
                        const notification = {
                            type: "warning",
                            message: "An unexpected error has occurred whilst trying to upload this file.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    default: {
                        const notification = {
                            type: "warning",
                            message: "An unexpected error's occurred whilst trying to upload this file.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                }
                console.error(`Error adding file to job "${this.state.activeDataset.jobID}": `, error);
            });
    }

    handleFormSubmit = event => {
        event.preventDefault();
        if (this.state.isCantabular) {
            this.props.dispatch(push(`${location.pathname}`));
        }

        let filesWithoutURLS = [];

        for (let index = 0; index < this.state.activeDataset.files.length; index++) {
            const file = this.state.activeDataset.files[index];
            if (!file.url) {
                filesWithoutURLS.push(file.alias_name);
            }
        }

        if (filesWithoutURLS.length > 0) {
            const files = this.state.activeDataset.files.map(currentFile => {
                if (filesWithoutURLS.indexOf(currentFile.alias_name) >= 0) {
                    currentFile.error = "You must upload this file before submitting to publishing";
                }
                return currentFile;
            });
            const activeDataset = {
                ...this.state.activeDataset,
                files,
            };

            this.setState({ activeDataset });
            return;
        }

        this.props.dispatch(push(`${location.pathname}/metadata`));
    };

    handleRetryClick = aliasName => {
        const files = this.state.activeDataset.files.map(currentFile => {
            if (currentFile.alias_name === aliasName) {
                currentFile.progress = null;
                currentFile.error = "";
            }
            return currentFile;
        });
        const activeDataset = {
            ...this.state.activeDataset,
            files,
        };

        this.setState({ activeDataset });
    };

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
                    onRetry={this.handleRetryClick}
                />
            );
        });
    }

    renderSubmittedScreen() {
        return (
            <div>
                <p className="margin-bottom--2">Your files are being processed.</p>
                <h2 className="margin-bottom--1">What happens now?</h2>
                <ul className="list margin-bottom--2">
                    <li className="list__item">
                        Please <a href="mailto:publishing.support.team@ons.gov.uk">contact publishing</a> to let them know your files have been
                        submitted or if you have any questions.
                    </li>
                    <li className="list__item">
                        The publishing team can prepare the dataset landing page which includes the files and associated metadata when the upload is
                        complete.
                    </li>
                </ul>
            </div>
        );
    }

    renderCompletedScreen() {
        return (
            <div>
                <p className="margin-bottom--2">Your files have been processed and are available to the publishing team.</p>
                <h2 className="margin-bottom--1">What happens now?</h2>
                <ul className="list margin-bottom--2">
                    <li className="list__item">
                        Please <a href="mailto:publishing.support.team@ons.gov.uk">contact publishing</a> to let them know your files have been
                        submitted or if you have any questions.
                    </li>
                    <li className="list__item">
                        The publishing team can prepare the dataset landing page which includes the files and associated metadata.
                    </li>
                </ul>
                <h2 className="margin-bottom--1">
                    Dimensions
                    {this.state.activeDataset.dimensions && this.state.activeDataset.dimensions.length > 0 && (
                        <span> ({this.state.activeDataset.dimensions.length})</span>
                    )}
                </h2>
                <div className="margin-bottom--2">
                    {this.state.activeDataset.dimensions ? (
                        <ul className="list">
                            {this.state.activeDataset.dimensions.map((dimension, index) => {
                                return (
                                    <li key={index} className="list__item">
                                        {dimension}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p>Dimensions are currently being processed. This could take some time.</p>
                    )}
                </div>
            </div>
        );
    }

    renderDatasetState() {
        switch (this.state.activeDataset.status) {
            case "created": {
                return (
                    <div>
                        <div className="margin-top--2">
                            &#9664; <Link to={url.resolve("../")}>Back</Link>
                        </div>
                        <div className="simple-select-list__item">
                            <h1 className="margin-top--1 margin-bottom--1">Uploads</h1>
                            <p className="font-size--18">
                                <span className="font-weight--600">Dataset</span>:{" "}
                                {this.state.activeDataset.alias ? this.state.activeDataset.alias : "loading..."}
                            </p>
                        </div>
                        <form className="simple-select-list__item" onSubmit={this.handleFormSubmit}>
                            <h2 className="margin-top--0 margin-bottom--0">Create new instance</h2>
                            {!this.state.isCantabular && this.renderFileInputs()}
                            <button className="btn btn--positive" type="submit">
                                Save and continue
                            </button>
                        </form>
                    </div>
                );
            }
            case "submitted": {
                return (
                    <div>
                        <div className="margin-top--2">
                            &#9664; <Link to={url.resolve("../")}>Return</Link>
                        </div>
                        <h1 className="margin-top--1">Your dataset has been submitted</h1>
                        {this.renderSubmittedScreen()}
                    </div>
                );
            }
            case "completed": {
                return (
                    <div>
                        <div className="margin-top--2">
                            &#9664; <Link to={url.resolve("../")}>Return</Link>
                        </div>
                        <h1 className="margin-top--1">Your dataset upload is complete</h1>
                        {this.renderCompletedScreen()}
                    </div>
                );
            }
            case "error": {
                return (
                    <div>
                        <div className="margin-top--2">
                            &#9664; <Link to={url.resolve("../")}>Return</Link>
                        </div>
                        <h1 className="margin-top--1">An error has occurred</h1>
                        <p className="margin-bottom--1">It appears as though as an error has occurred whilst submitting your dataset to publishing</p>
                        <p>
                            Please <a href="mailto:publishing.support.team@ons.gov.uk">contact publishing support</a> and inform them of this error
                        </p>
                    </div>
                );
            }
            case "failed": {
                return (
                    <div>
                        <div className="margin-top--2">
                            &#9664; <Link to={url.resolve("../")}>Return</Link>
                        </div>
                        <h1 className="margin-top--1">An error has occurred</h1>
                        <p className="margin-bottom--1">Your dataset has failed to upload</p>
                        <p>
                            Please <a href="mailto:publishing.support.team@ons.gov.uk">contact publishing support</a> and inform them of this error
                        </p>
                    </div>
                );
            }
        }
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-9">
                    {this.state.activeDataset && this.renderDatasetState()}
                    {this.state.loadingPageForFirstTime && (
                        <div className="grid--align-center grid--align-self-center">
                            <div className="loader loader--large loader--dark"></div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

DatasetUploadController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        datasets: state.state.datasets.all,
        jobs: state.state.datasets.jobs,
    };
}

export default connect(mapStateToProps)(DatasetUploadController);
