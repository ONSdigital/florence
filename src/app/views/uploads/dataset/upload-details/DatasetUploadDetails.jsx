import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { connect } from "react-redux";
import { push } from "react-router-redux";

import Resumable from "resumeablejs";
import recipes from "../../../../utilities/api-clients/recipes";
import datasetImport from "../../../../utilities/api-clients/datasetImport";
import notifications from "../../../../utilities/notifications";
import http from "../../../../utilities/http";
import FileUpload from "../../../../components/file-upload/FileUpload";
import url from "../../../../utilities/url";

const DatasetUploadController = props => {
    const [isFetchingDataset, setIsFetchingDataset] = useState(false);
    const [loadingPageForFirstTime, setLoadingPageForFirstTime] = useState(false);
    const [activeDataset, setActiveDataset] = useState(null);
    const [isCantabular, setIsCantabular] = useState(false);

    const intervalID = 0;

    useEffect(() => {
        if (!props.recipes || props.recipes.length === 0) {
            repeatUploadStatusCheck();
        } else {
            const job = props.jobs.find(job => {
                return job.id === props.params.jobID;
            });
            const recipe = props.recipes.find(dataset => {
                return dataset.id === job.recipe;
            });
            const activeDatasetAPIResponse = mapAPIResponsesToState({ recipe, job });

            if (!activeDatasetAPIResponse) {
                const notification = {
                    type: "neutral",
                    message: "This dataset was not recognised, so you've been redirected to the main screen",
                    isDismissable: true,
                };
                notifications.add(notification);
                props.dispatch(push(url.resolve("../")));
                return;
            }
            setActiveDataset({ activeDatasetAPIResponse });

            if (activeDataset.status === "completed" && !activeDataset.dimensions) {
                datasetImport.getDimensions(activeDataset.instanceID).then(response => {
                    const activeDatasetWithDimensions = {
                        ...activeDataset,
                        dimensions: [],
                    };
                    response.map(dimension => {
                        activeDatasetWithDimensions.dimensions.push(dimension.name);
                    });
                    setActiveDataset({ activeDatasetWithDimensions });
                });
            }
            bindInputs();
        }
    }, []);

    const repeatUploadStatusCheck = () => {
        setIsFetchingDataset(true);
        setLoadingPageForFirstTime(true);
        getUploadStatus();

        intervalID = setInterval(async () => {
            if (!isFetchingDataset) {
                setIsFetchingDataset(true);
                getUploadStatus();
            }
        }, 5000);
    };

    const getUploadStatus = () => {
        const APIResponses = {};
        datasetImport
            .get(props.params.jobID)
            .then(job => {
                APIResponses.job = job;
                return recipes.get(job.recipe);
            })
            .then(recipe => {
                APIResponses.recipe = recipe;
                const activeDatasetAPIResponse = mapAPIResponsesToState({
                    recipe: APIResponses.recipe,
                    job: APIResponses.job,
                });
                setActiveDataset(activeDatasetAPIResponse);
                setIsFetchingDataset(false);
                setLoadingPageForFirstTime(false);
            })
            .catch(error => {
                setIsFetchingDataset(false);
                setLoadingPageForFirstTime(false);
                clearInterval(intervalID);
                switch (error.status) {
                    case 404: {
                        const notification = {
                            type: "neutral",
                            message: `The job '${props.params.jobID}' was not recognised, so you've been redirected to the dataset upload screen.`,
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        props.dispatch(push(url.resolve("../")));
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

    const bindInputs = () => {
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
                const files = activeDataset.files.map(currentFile => {
                    if (currentFile.alias_name === aliasName) {
                        currentFile.progress = 0;
                        currentFile.error = null;
                    }
                    return currentFile;
                });
                const activeDatasetFiles = {
                    ...activeDataset,
                    files,
                };
                setActiveDataset(activeDatasetFiles);
            });
            r.on("fileProgress", file => {
                const progressPercentage = Math.round(Number(file.progress() * 100));
                const files = activeDataset.files.map(currentFile => {
                    if (currentFile.alias_name === file.resumableObj.opts.query.aliasName) {
                        currentFile.progress = progressPercentage;
                    }
                    return currentFile;
                });
                const activeDatasetFiles = {
                    ...activeDataset,
                    files,
                };
                setActiveDataset(activeDatasetFiles);
            });
            r.on("fileError", file => {
                const files = activeDataset.files.map(currentFile => {
                    if (currentFile.alias_name === file.resumableObj.opts.query.aliasName) {
                        currentFile.error = "An error occurred whilst uploading this file.";
                    }
                    return currentFile;
                });
                const activeDatasetFiles = {
                    ...activeDataset,
                    files,
                };
                setActiveDataset(activeDatasetFiles);
                console.error("Error uploading file to server");
            });
            r.on("fileSuccess", file => {
                const aliasName = file.resumableObj.opts.query.aliasName;
                http.get(`/upload/${file.uniqueIdentifier}`)
                    .then(response => {
                        const files = activeDataset.files.map(currentFile => {
                            if (currentFile.alias_name === aliasName) {
                                currentFile.progress = null;
                                currentFile.url = response.url;
                            }
                            return currentFile;
                        });
                        const activeDatasetFiles = {
                            ...activeDataset,
                            files,
                        };
                        setActiveDataset(activeDatasetFiles);
                        addUploadedFileToJob(aliasName, response.url);
                    })
                    .catch(error => {
                        const files = activeDataset.files.map(currentFile => {
                            if (currentFile.alias_name === aliasName) {
                                currentFile.error = "An error occurred whilst uploading this file";
                            }
                            return currentFile;
                        });
                        const activeDatasetFiles = {
                            ...activeDataset,
                            files,
                        };
                        setActiveDataset(activeDatasetFiles);
                        console.error("Error fetching uploaded file's URL: ", error);
                    });
            });
        });
    };

    const mapAPIResponsesToState = APIResponse => {
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
            clearInterval(intervalID);
        }

        if (recipeAPIResponse.format === "cantabular_table" || recipeAPIResponse.format === "cantabular_blob") {
            setIsCantabular(true);
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
    };

    const addUploadedFileToJob = (fileAlias, fileURL) => {
        datasetImport
            .addFile(activeDataset.jobID, fileAlias, fileURL)
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
                console.error(`Error adding file to job "${activeDataset.jobID}": `, error);
            });
    };

    const handleFormSubmit = event => {
        event.preventDefault();
        if (isCantabular) {
            props.dispatch(push(`${location.pathname}`));
        }

        let filesWithoutURLS = [];

        for (let index = 0; index < activeDataset.files.length; index++) {
            const file = activeDataset.files[index];
            if (!file.url) {
                filesWithoutURLS.push(file.alias_name);
            }
        }

        if (filesWithoutURLS.length > 0) {
            const files = activeDataset.files.map(currentFile => {
                if (filesWithoutURLS.indexOf(currentFile.alias_name) >= 0) {
                    currentFile.error = "You must upload this file before submitting to publishing";
                }
                return currentFile;
            });
            const activeDatasetFiles = {
                ...activeDataset,
                files,
            };
            setActiveDataset(activeDatasetFiles);
            return;
        }

        props.dispatch(push(`${location.pathname}/metadata`));
    };

    const handleRetryClick = aliasName => {
        const files = activeDataset.files.map(currentFile => {
            if (currentFile.alias_name === aliasName) {
                currentFile.progress = null;
                currentFile.error = "";
            }
            return currentFile;
        });
        const activeDatasetFiles = {
            ...activeDataset,
            files,
        };
        setActiveDataset(activeDatasetFiles);
    };

    const renderFileInputs = () => {
        if (activeDataset) {
            return;
        }

        return activeDataset.files.map((file, index) => {
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
                    onRetry={handleRetryClick}
                />
            );
        });
    };

    const renderSubmittedScreen = () => {
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
    };

    const renderCompletedScreen = () => {
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
                    {activeDataset.dimensions && activeDataset.dimensions.length > 0 && <span> ({activeDataset.dimensions.length})</span>}
                </h2>
                <div className="margin-bottom--2">
                    {activeDataset.dimensions ? (
                        <ul className="list">
                            {activeDataset.dimensions.map((dimension, index) => {
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
    };

    const renderDatasetState = () => {
        switch (activeDataset.status) {
            case "created": {
                return (
                    <div>
                        <div className="margin-top--2">
                            &#9664; <Link to={url.resolve("../")}>Back</Link>
                        </div>
                        <div className="simple-select-list__item">
                            <h1 className="margin-top--1 margin-bottom--1">Uploads</h1>
                            <p className="font-size--18">
                                <span className="font-weight--600">Dataset</span>: {activeDataset.alias ? activeDataset.alias : "loading..."}
                            </p>
                        </div>
                        <form className="simple-select-list__item" onSubmit={handleFormSubmit}>
                            <h2 className="margin-top--0 margin-bottom--0">Create new instance</h2>
                            {!isCantabular && renderFileInputs()}
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
                        {renderSubmittedScreen()}
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
                        {renderCompletedScreen()}
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
    };

    const render = () => {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-9">
                    {activeDataset && renderDatasetState()}
                    {loadingPageForFirstTime && (
                        <div className="grid--align-center grid--align-self-center">
                            <div className="loader loader--large loader--dark"></div>
                        </div>
                    )}
                </div>
            </div>
        );
    };
};

DatasetUploadController.propTypes = {
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

const mapStateToProps = state => {
    return {
        datasets: state.state.datasets.all,
        jobs: state.state.datasets.jobs,
    };
};

export default connect(mapStateToProps)(DatasetUploadController);
