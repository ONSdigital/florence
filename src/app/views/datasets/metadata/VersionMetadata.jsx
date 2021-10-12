import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { push } from "react-router-redux";
import PropTypes from "prop-types";

import datasets from "../../../utilities/api-clients/datasets";
import recipes from "../../../utilities/api-clients/recipes";
import notifications from "../../../utilities/notifications";
import Select from "../../../components/Select";
import Input from "../../../components/Input";
import FormErrorSummary from "../../../components/form-error-summary/FormErrorSummary";
import {
    updateActiveInstance,
    updateActiveVersion,
    updateAllRecipes,
    emptyActiveVersion,
    emptyActiveInstance,
    updateActiveVersionReviewState,
} from "../../../config/actions";
import url from "../../../utilities/url";
import CardList from "../../../components/CardList";
import Modal from "../../../components/Modal";
import uuid from "uuid/v4";
import RelatedContentForm from "./related-content/RelatedContentForm";
import log, { eventTypes } from "../../../utilities/log";
import collections from "../../../utilities/api-clients/collections";
import DatasetReviewActions from "../DatasetReviewActions";
import AlertController from "./alert/AlertController";
import UsageNotesController from "./usage-notes/UsageNotesController";
import date from "../../../utilities/date";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    rootPath: PropTypes.string.isRequired,
    userEmail: PropTypes.string.isRequired,
    collectionID: PropTypes.string.isRequired,
    router: PropTypes.shape({
        listenBefore: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
        query: PropTypes.shape({
            collection: PropTypes.string,
        }).isRequired,
    }).isRequired,
    params: PropTypes.shape({
        datasetID: PropTypes.string.isRequired,
        instanceID: PropTypes.string,
        edition: PropTypes.string,
        version: PropTypes.string,
    }).isRequired,
    recipes: PropTypes.arrayOf(
        PropTypes.shape({
            output_instances: PropTypes.arrayOf(
                PropTypes.shape({
                    editions: PropTypes.arrayOf(PropTypes.string).isRequired,
                    id: PropTypes.string,
                })
            ),
        })
    ),
    dataset: PropTypes.shape({
        title: PropTypes.string,
        collection_id: PropTypes.string,
    }),
    instance: PropTypes.shape({
        edition: PropTypes.string,
        version: PropTypes.number,
        release_date: PropTypes.string,
        state: PropTypes.string,
        id: PropTypes.string,
        usage_notes: PropTypes.arrayOf(
            PropTypes.shape({
                note: PropTypes.string,
                title: PropTypes.string,
            })
        ),
        dimensions: PropTypes.arrayOf(PropTypes.object),
        alerts: PropTypes.arrayOf(PropTypes.object),
        latest_changes: PropTypes.arrayOf(PropTypes.object),
    }),
    version: PropTypes.shape({
        edition: PropTypes.string,
        state: PropTypes.string,
        version: PropTypes.number,
        dimensions: PropTypes.arrayOf(PropTypes.object),
        release_date: PropTypes.string,
        id: PropTypes.string,
        usage_notes: PropTypes.arrayOf(
            PropTypes.shape({
                note: PropTypes.string,
                title: PropTypes.string,
            })
        ),
        alerts: PropTypes.arrayOf(PropTypes.object),
        latest_changes: PropTypes.arrayOf(PropTypes.object),
        lastEditedBy: PropTypes.string,
        reviewState: PropTypes.string,
    }),
    isInstance: PropTypes.string,
};

export class VersionMetadata extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingData: false,
            isSavingData: false,
            isReadOnly: false,
            isFetchingCollectionData: false,
            isFetchingDimensionsData: false,
            isInstance: null,
            hasChanges: false,
            edition: null,
            title: null,
            releaseDate: "",
            releaseDateError: "",
            dimensions: [],
            versionID: "",
            showModal: false,
            modalType: "",
            modalTitle: "",
            alerts: [],
            changes: [],
            editKey: "",
            titleInput: "",
            descInput: "",
            checkboxInput: false,
            formErrors: [],
            usageNotes: [],
        };
    }

    UNSAFE_componentWillMount() {
        this.removeRouteListener = this.props.router.listenBefore((nextLocation, action) => this.handleRouteChange(nextLocation, action));

        this.setState({
            isFetchingData: true,
            activeCollectionID: this.props.collectionID,
        });

        const getMetadata = [Promise.resolve(), Promise.resolve(), Promise.resolve()];

        if (!this.props.collectionID) {
            this.setState({
                isReadOnly: true,
            });

            const notification = {
                type: "neutral",
                message: "You are not in a collection, so cannot edit this version.",
                isDismissable: true,
            };
            notifications.add(notification);
            log.add(eventTypes.runtimeWarning, {
                message: `Attempt to edit/view version (${this.props.params.datasetID}) without being in collection.`,
            });
            console.warn(`Attempt to edit/view version (${this.props.params.datasetID}) without being in collection.`);
        }

        if (!this.props.params.instanceID && this.props.collectionID) {
            this.updateReviewStateData();
        }

        if (this.props.params.instanceID) {
            getMetadata[1] = datasets.getInstance(this.props.params.instanceID);
            this.setState({ isInstance: true });
        } else {
            getMetadata[1] = datasets.getVersion(this.props.params.datasetID, this.props.params.edition, this.props.params.version);
            this.setState({ isInstance: false });
        }

        getMetadata[0] = recipes.getAll();
        getMetadata[2] = datasets.get(this.props.params.datasetID);

        Promise.all(getMetadata)
            .then(responses => {
                const dataset = responses[2].next || responses[2].current;
                const version = responses[1];

                if (this.props.recipes.length === 0) {
                    this.props.dispatch(updateAllRecipes(responses[0].items));
                }

                if (this.props.params.instanceID) {
                    this.props.dispatch(updateActiveInstance(responses[1]));
                    this.setState({
                        dimensions: this.props.instance.dimensions,
                        edition: this.props.instance.edition,
                    });
                    this.populateDimensionInputs();
                }

                if (this.props.params.version) {
                    this.props.dispatch(updateActiveVersion(responses[1]));

                    let alerts = [];
                    if (this.props.version.alerts) {
                        this.props.version.alerts.map(alert => {
                            alert.key = uuid();
                            alerts.push(alert);
                        });
                    }

                    let changes = [];
                    if (this.props.version.latest_changes) {
                        this.props.version.latest_changes.map(change => {
                            change.key = uuid();
                            changes.push(change);
                        });
                    }

                    let usageNotes = [];
                    if (this.props.version.usage_notes) {
                        this.props.version.usage_notes.map(usageNote => {
                            usageNote.key = uuid();
                            usageNotes.push(usageNote);
                        });
                    }

                    this.setState({
                        dimensions: this.props.version.dimensions,
                        edition: this.props.version.edition,
                        state: this.props.version.state,
                        versionID: this.props.version.id,
                        alerts: alerts,
                        changes: changes,
                        releaseDate: this.props.version.release_date ? new Date(this.props.version.release_date) : "",
                        usageNotes,
                    });
                }

                if (this.props.collectionID && version.collection_id && this.props.collectionID !== version.collection_id) {
                    this.setState({
                        isReadOnly: true,
                    });
                    const notification = {
                        type: "neutral",
                        message: "This dataset is already in a different collection, so can't be edited.",
                        isDismissable: true,
                    };
                    notifications.add(notification);
                    log.add(eventTypes.runtimeWarning, {
                        message: `Attempt to edit/view dataset version that is already in collection 'dataset.collection_id' but current collection is '${this.props.collectionID}'`,
                    });
                    console.warn(
                        `Dataset version is already in collection '${dataset.collection_id}' but current collection is '${this.props.collectionID}'`
                    );
                }

                this.setState({
                    title: dataset.title,
                    isFetchingData: false,
                });
            })
            .catch(error => {
                switch (error.status) {
                    case 403: {
                        const notification = {
                            type: "neutral",
                            message: "You do not permission to access the metadata for this dataset",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case 404: {
                        const notification = {
                            type: "neutral",
                            message: `Dataset ID '${this.props.params.datasetID}' was not recognised. You've been redirected to the datasets home screen`,
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        this.props.dispatch(push(url.resolve("/datasets")));
                        break;
                    }
                    default: {
                        const notification = {
                            type: "warning",
                            message: "An unexpected error's occurred whilst trying to get this dataset",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                }
                console.error("Error has occurred:\n", error);
            });
    }

    shouldComponentUpdate(nextProps, nextState) {
        // No need to re-render, this state update does not impact the view.
        if (nextState.isFetchingData) {
            return false;
        }
        if (this.props.version && nextProps.version === null) {
            return false;
        }
        return true;
    }

    componentWillUnmount() {
        this.removeRouteListener();
    }

    handleRouteChange(nextLocation, action) {
        // Do not empty the active dataset data if we're going to the preview page, to save us GETting it again when we already have it in state.
        if (nextLocation.pathname === url.resolve("preview")) {
            action();
            return;
        }

        if (this.state.isInstance) {
            this.props.dispatch(emptyActiveInstance());
        } else {
            this.props.dispatch(emptyActiveVersion());
        }
        action();
    }

    populateDimensionInputs = () => {
        this.setState({ isFetchingDimensionsData: true });
        datasets
            .getLatestVersion(this.props.params.datasetID)
            .then(latestVersion => {
                if (!latestVersion) {
                    this.setState({ isFetchingDimensionsData: false });
                    return;
                }

                this.setState({
                    dimensions: latestVersion.dimensions.map(dimension => ({
                        ...dimension,
                        hasChanged: true,
                    })),
                    isFetchingDimensionsData: false,
                });
            })
            .catch(error => {
                this.setState({ isFetchingDimensionsData: false });
                this.handleRequestError("auto-populate the dimension metadata", error.status);
                console.error("Error getting latest published version to auto-populate dimensions inputs", error);
                log.add(eventTypes.unexpectedRuntimeError, {
                    message: `Error getting latest published version to auto-populate dimensions inputs. Error: ${JSON.stringify(error)}`,
                });
            });
    };

    async updateReviewStateData() {
        this.setState({ isFetchingCollectionData: true });
        const collectionID = this.props.collectionID;
        const params = this.props.params;

        try {
            const collection = await collections.get(collectionID);
            const version = collection.datasetVersions.find(datasetVersion => {
                return (
                    datasetVersion.id === params.datasetID && datasetVersion.edition === params.edition && datasetVersion.version === params.version
                );
            });
            if (!version) {
                this.setState({ isFetchingCollectionData: false });
                return;
            }
            const lastEditedBy = version.lastEditedBy;
            const reviewState = version.state.charAt(0).toLowerCase() + version.state.slice(1); //lowercase it so it's consistent with the properties in our state (i.e. "InProgress" = "inProgress" )
            this.props.dispatch(updateActiveVersionReviewState(lastEditedBy, reviewState));
            this.setState({ isFetchingCollectionData: false });
        } catch (error) {
            this.setState({
                isFetchingCollectionData: false,
                isReadOnly: true,
            });
            switch (error.status) {
                case 401: {
                    // handled by request utility function
                    break;
                }
                case 403: {
                    const notification = {
                        type: "neutral",
                        message: `You do not permission to get details for collection '${collectionID}'`,
                        isDismissable: true,
                    };
                    notifications.add(notification);
                    break;
                }
                case 404: {
                    const notification = {
                        type: "warning",
                        message: `Could not find collection '${collectionID}'`,
                        isDismissable: true,
                    };
                    notifications.add(notification);
                    break;
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: `An unexpected error's occurred whilst trying to get the collection '${collectionID}'`,
                        isDismissable: true,
                    };
                    notifications.add(notification);
                    break;
                }
            }
            log.add(eventTypes.unexpectedRuntimeError, {
                message:
                    "Unable to update metadata screen with version's review/edit status in collection " +
                    collectionID +
                    ". Error: " +
                    JSON.stringify(error),
            });
            console.error("Unable to update metadata screen with version's review/edit status in collection " + collectionID, error);
        }
    }

    handleRequestError(attemptedAction, status) {
        switch (status) {
            case 401: {
                // handled by request utility function
                break;
            }
            case 400: {
                const notification = {
                    type: "warning",
                    message: `Unable to ${attemptedAction} due to invalid values being submitted. Please check your updates for any issues and try again`,
                    isDismissable: true,
                    autoDismiss: 10000,
                };
                notifications.add(notification);
                break;
            }
            case 403: {
                const notification = {
                    type: "neutral",
                    message: `Unable to ${attemptedAction} because you do not have the correct permissions`,
                    isDismissable: true,
                    autoDismiss: 10000,
                };
                notifications.add(notification);
                break;
            }
            case 404: {
                const notification = {
                    type: "warning",
                    message: `Unable to ${attemptedAction} because this version couldn't be found`,
                    isDismissable: true,
                    autoDismiss: 10000,
                };
                notifications.add(notification);
                break;
            }
            case "FETCH_ERR": {
                const notification = {
                    type: "warning",
                    message: `Unable to ${attemptedAction} due to a network issue. Please check your internet connection and try again`,
                    isDismissable: true,
                    autoDismiss: 10000,
                };
                notifications.add(notification);
                break;
            }
            default: {
                const notification = {
                    type: "warning",
                    message: `Unable to ${attemptedAction} due to an unexpected error`,
                    isDismissable: true,
                    autoDismiss: 10000,
                };
                notifications.add(notification);
                break;
            }
        }
    }

    updateVersionReviewState(datasetID, edition, version, isSubmittingForReview, isMarkingAsReviewed) {
        let request = Promise.resolve();

        this.setState({ isSavingData: true });

        if (isSubmittingForReview) {
            request = collections.setDatasetVersionStatusToComplete;
        }

        if (isMarkingAsReviewed) {
            request = collections.setDatasetVersionStatusToReviewed;
        }

        return request(this.props.collectionID, datasetID, edition, version).catch(error => {
            this.handleRequestError(
                `submit version for ${isSubmittingForReview ? "review" : ""}${isMarkingAsReviewed ? "approval" : ""}`,
                error.status
            );

            log.add(eventTypes.unexpectedRuntimeError, {
                message: `Error updating review state for version ${datasetID}/editions/${edition}/versions/${version} to '${
                    isSubmittingForReview ? "Complete" : ""
                }${isMarkingAsReviewed ? "Reviewed" : ""}' in collection '${this.props.collectionID}'. Error: ${JSON.stringify(error)}`,
            });

            console.error(
                `Error updating review state for version ${datasetID}/editions/${edition}/versions/${version} to '${
                    isSubmittingForReview ? "Complete" : ""
                }${isMarkingAsReviewed ? "Reviewed" : ""}' in collection '${this.props.collectionID}'`,
                error
            );

            return error;
        });
    }

    updateVersionMetadata(datasetID, edition, version, body) {
        return datasets
            .updateVersionMetadata(this.props.params.datasetID, this.props.params.edition, this.props.params.version, body)
            .catch(error => {
                this.handleRequestError("save version metadata updates", error.status);

                console.error(`Unable to save version metadata updates for '${this.state.versionID}'`, error);

                log.add(eventTypes.unexpectedRuntimeError, {
                    message: `Unable to save version metadata updates for '${this.state.versionID}'. Error: ${JSON.stringify(error)}`,
                });

                return error;
            });
    }

    updateDimensions(instanceID) {
        const dimensionsHaveUpdated = this.state.dimensions.some(dimension => dimension.hasChanged);
        if (!dimensionsHaveUpdated) {
            return Promise.resolve();
        }

        return datasets.updateInstanceDimensions(instanceID, this.state.dimensions).catch(error => {
            this.handleRequestError(`save updates to dimensions`, error.status);

            console.error(`Unable to save version dimension updates for dimensions - '${instanceID}'`, error);

            log.add(eventTypes.unexpectedRuntimeError, {
                message: `Unable to save version dimension updates for dimensions - '${instanceID}'. Error: ${JSON.stringify(error)}`,
            });

            return error;
        });
    }

    confirmEditionAndCreateVersion(instanceID, selectedEdition, body) {
        return datasets.confirmEditionAndCreateVersion(instanceID, selectedEdition, body).catch(error => {
            this.handleRequestError("save version metadata updates", error.status);

            console.error(`Unable to confirm instance edition for '${instanceID}'`, error);

            log.add(eventTypes.unexpectedRuntimeError, {
                message: `Unable to confirm instance edition for '${instanceID}'. Error: ${JSON.stringify(error)}`,
            });

            return error;
        });
    }

    getNewVersion(instanceID) {
        return datasets
            .getInstance(instanceID)
            .then(response => [null, response])
            .catch(error => {
                this.handleRequestError("get details for this version", error.status);
                console.error(`Unable to get version '${this.state.versionID}'`, error);
                log.add(eventTypes.unexpectedRuntimeError, {
                    message: `Unable to get version '${this.state.versionID}'. Error: ${JSON.stringify(error)}`,
                });
                [error, null];
            });
    }

    addVersionToCollection(datasetID, edition, version) {
        return collections.addDatasetVersion(this.props.collectionID, datasetID, edition, version).catch(error => {
            this.handleRequestError("add version to this collection", error.status);
            console.error(
                `Unable to add version 'datasets/${datasetID}/editions/${edition}/versions/${version}' to the collection '${this.props.collectionID}'`,
                error
            );
            log.add(eventTypes.unexpectedRuntimeError, {
                message: `Unable to add version 'datasets/${datasetID}/editions/${edition}/versions/${version}' to the collection '${
                    this.props.collectionID
                }'. Error: ${JSON.stringify(error)}`,
            });
            return error;
        });
    }

    async updateInstanceVersion(body, isSubmittingForReview, isMarkingAsReviewed) {
        const isUpdatingReviewState = isSubmittingForReview || isMarkingAsReviewed;
        const datasetID = this.props.params.datasetID;

        this.setState({ isSavingData: true });

        if (this.state.isInstance) {
            const [createVersionErr, updateDimensionsErr] = [
                await this.confirmEditionAndCreateVersion(this.props.params.instanceID, this.state.selectedEdition, body),
                await this.updateDimensions(this.props.params.instanceID),
            ];
            if (isUpdatingReviewState && createVersionErr) {
                this.handleRequestError(
                    `submit version for ${isSubmittingForReview ? "review" : ""}${isMarkingAsReviewed ? "approval" : ""}`,
                    undefined
                );
            }
            if (updateDimensionsErr && createVersionErr) {
                this.setState({ isSavingData: false });
                return;
            }
            if (createVersionErr) {
                this.setState({ isSavingData: false });
                return;
            }

            const [newVersionError, newVersion] = await this.getNewVersion(this.props.params.instanceID);
            if (newVersionError) {
                this.setState({ isSavingData: false });
                return;
            }

            const edition = newVersion.edition;
            const version = newVersion.version;

            if (this.state.isInstance && !isUpdatingReviewState) {
                const addToCollectionErr = await this.addVersionToCollection(datasetID, edition, version);
                if (!addToCollectionErr) {
                    this.props.dispatch(
                        push(
                            url.resolve(
                                `/datasets/${datasetID}/editions/${edition}/versions/${version}/metadata?collection=${this.props.collectionID}`
                            )
                        )
                    );
                    return;
                }

                this.setState({ isSavingData: false });
                return;
            }

            if (!isUpdatingReviewState) {
                this.setState({ isSavingData: false });
                return;
            }

            const updateReviewStateErr = await this.updateVersionReviewState(datasetID, edition, version, isSubmittingForReview, isMarkingAsReviewed);
            if (updateReviewStateErr) {
                console.log("updateReviewStateErr: " + updateReviewStateErr);
                this.setState({ isSavingData: false });
                return;
            }

            this.setState({ isSavingData: false });
            this.props.dispatch(push(url.resolve(`/collections/${this.props.collectionID}`)));
            return;
        }

        const edition = this.props.params.edition;
        const version = this.props.params.version;
        const [updateVersionErr, updateReviewStateErr] = [
            await this.updateVersionMetadata(datasetID, edition, version, body),
            isUpdatingReviewState
                ? await this.updateVersionReviewState(datasetID, edition, version, isSubmittingForReview, isMarkingAsReviewed)
                : await Promise.resolve(),
            await this.updateDimensions(this.state.versionID),
        ];

        if (updateVersionErr) {
            this.setState({ isSavingData: false });
            return;
        }
        if (updateReviewStateErr) {
            this.setState({ isSavingData: false });
            return;
        }

        this.setState({ isSavingData: false });

        if (isUpdatingReviewState) {
            this.props.dispatch(push(url.resolve(`/collections/${this.props.collectionID}`)));
        }
    }

    mapTypeContentsToCard(items, type) {
        if (type === "usageNotes") {
            return items.map(item => ({
                title: item.title,
                id: item.key,
            }));
        }

        return items.map(item => {
            return {
                title: type === "alerts" ? date.format(item.date, "dddd, dd/mm/yyyy h:MMTT") : item.name,
                id: item.key,
            };
        });
    }

    mapEditionsToSelectOptions() {
        const recipe = this.props.recipes.find(recipe => {
            return recipe.output_instances[0].dataset_id === this.props.params.datasetID;
        });

        const editions = recipe.output_instances[0].editions;
        return editions.map(edition => {
            return { id: edition, name: edition };
        });
    }

    mapDimensionsToInputs(dimensions) {
        return dimensions.map(dimension => {
            return (
                <div key={dimension.id}>
                    <Input
                        value={dimension.label ? dimension.label : dimension.name.charAt(0).toUpperCase() + dimension.name.slice(1)}
                        id={dimension.name}
                        name="dimension-name"
                        label="Dimension title"
                        onChange={this.handleInputChange}
                        disabled={this.state.isReadOnly || this.state.isSavingData || this.state.isFetchingDimensionsData}
                    />
                    <Input
                        value={dimension.description}
                        type="textarea"
                        id={dimension.name}
                        name="dimension-description"
                        label="Learn more (optional)"
                        onChange={this.handleInputChange}
                        disabled={this.state.isReadOnly || this.state.isSavingData || this.state.isFetchingDimensionsData}
                    />
                </div>
            );
        });
    }

    handleEditRelatedClick = (type, key) => {
        let newState = {
            showModal: true,
            modalType: type,
            editKey: key,
            hasChanges: true,
        };
        let relatedItem;
        if (type === "alerts") {
            relatedItem = this.state.alerts.find(alert => {
                return alert.key === key;
            });
            newState = {
                ...newState,
                titleInput: relatedItem.date,
                descInput: relatedItem.description,
                checkboxInput: true,
            };
        }

        if (type === "changes") {
            relatedItem = this.state.changes.find(change => {
                return change.key === key;
            });
            newState = {
                ...newState,
                titleInput: relatedItem.name,
                descInput: relatedItem.description,
            };
        }

        if (type === "usageNotes") {
            relatedItem = this.state.usageNotes.find(usageNote => {
                return usageNote.key === key;
            });
            newState = {
                ...newState,
                titleInput: relatedItem.title,
                descInput: relatedItem.note,
            };
        }

        if (!relatedItem) {
            console.error("Unable to find data for content item:", type, key);
            log.add(eventTypes.runtimeWarning, {
                message: `Unable to find data for content item. Type: '${type}', key: '${key}'`,
            });
            return;
        }

        this.setState(newState);
    };

    handleDeleteRelatedClick = (type, key) => {
        function remove(items, key) {
            return items.filter(item => {
                return item.key !== key;
            });
        }

        if (type === "alerts") {
            this.setState({
                alerts: remove(this.state.alerts, key),
                hasChanges: true,
            });
            return;
        }

        if (type === "changes") {
            this.setState({
                changes: remove(this.state.changes, key),
                hasChanges: true,
            });
            return;
        }

        if (type === "usageNotes") {
            this.setState({
                usageNotes: remove(this.state.usageNotes, key),
                hasChanges: true,
            });
            return;
        }

        console.warn("Attempt to remove a related content type that is not recognised", type);
        log.add(eventTypes.unexpectedRuntimeError, `Attempt to remove a related content type that is not recognised: '${type}'`);
    };

    editRelatedLink = (type, key) => {
        const edit = items => {
            return items.map(item => {
                if (item.key !== key) {
                    return item;
                }
                if (type === "alerts") {
                    return {
                        ...item,
                        date: this.state.titleInput,
                        description: this.state.descInput,
                        type: "alert",
                        hasChanged: true,
                    };
                }
                if (type === "changes") {
                    return {
                        ...item,
                        name: this.state.titleInput,
                        description: this.state.descInput,
                        type: "summary of changes",
                        hasChanged: true,
                    };
                }
            });
        };
        if (type === "alerts") {
            this.setState({
                alerts: edit(this.state.alerts, key),
                hasChanges: true,
            });
            return;
        }

        if (type === "changes") {
            this.setState({
                changes: edit(this.state.changes, key),
                hasChanges: true,
            });
        }

        console.warn("Attempt to edit a related content type that is not recognised", type);
        log.add(eventTypes.unexpectedRuntimeError, `Attempt to edit a related content type that is not recognised: '${type}'`);
    };

    handleBackButton = () => {
        if (this.state.hasChanges) {
            this.setState({ showModal: true });
            return;
        }

        const URL = url.resolve("/datasets" + (this.props.collectionID ? "?collection=" + this.props.collectionID : ""));
        this.props.dispatch(push(URL));
    };

    handleRelatedContentCancel = () => {
        this.setState({
            showModal: false,
            modalType: "",
            editKey: "",
            descInput: "",
            titleInput: "",
        });
    };

    handleAddRelatedClick = (type, title) => {
        this.setState({
            showModal: true,
            modalType: type,
            modalTitle: title,
        });
    };

    handleInputChange = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const id = target.id;

        if (name === "add-related-content-title") {
            this.setState({ titleInput: value });
            if (this.state.titleError != null) {
                this.setState({ titleError: null });
            }
        } else if (name === "add-related-content-desc") {
            this.setState({ descInput: value });
            if (this.state.descError != null) {
                this.setState({ descError: null });
            }
        } else if (name === "dimension-name") {
            let dimensionLabel;
            dimensionLabel = this.state.dimensions.map(dimension => {
                if (dimension.name === id) {
                    return {
                        ...dimension,
                        label: value,
                        hasChanged: true,
                    };
                }

                return dimension;
            });
            this.setState({
                dimensions: dimensionLabel,
            });
        } else if (name === "dimension-description") {
            let dimensionDesc;
            dimensionDesc = this.state.dimensions.map(dimension => {
                if (dimension.name === id) {
                    return {
                        ...dimension,
                        description: value,
                        hasChanged: true,
                    };
                }

                return dimension;
            });
            this.setState({
                dimensions: dimensionDesc,
            });
        } else {
            this.setState({
                [name]: value,
            });
        }

        if (!this.state.hasChanges) {
            this.setState({ hasChanges: true });
        }
    };

    handleSelectChange = event => {
        const target = event.target;
        const id = target.id;
        let value = target.value;
        if (value === "default-option") {
            value = "";
        }
        this.setState({
            [id]: value,
            hasChanges: true,
        });
    };

    handleReleaseDateChange = event => {
        const value = event.target.value;
        const releaseDate = value ? new Date(value) : "";
        this.setState({
            releaseDateError: "",
            releaseDate,
            hasChanges: true,
        });
    };

    handleRelatedContentSubmit = event => {
        event.preventDefault();

        if (this.state.titleInput == "" || this.state.descInput == "") {
            if (this.state.titleInput == "") {
                this.setState({
                    titleError: "You must provide a value",
                });
            }
            if (this.state.descInput == "") {
                this.setState({
                    descError: "You must provide a description",
                });
            }
        } else {
            if (this.state.modalType === "alerts") {
                if (this.state.editKey != "") {
                    this.editRelatedLink("alerts", this.state.editKey);
                } else {
                    const alerts = this.state.alerts.concat({
                        date: this.state.titleInput,
                        description: this.state.descInput,
                        key: uuid(),
                        hasChanged: true,
                        type: "alert",
                    });
                    this.setState({ alerts: alerts });
                }
            } else if (this.state.modalType === "changes") {
                if (this.state.editKey != "") {
                    this.editRelatedLink("changes", this.state.editKey);
                } else {
                    const changes = this.state.changes.concat({
                        name: this.state.titleInput,
                        description: this.state.descInput,
                        key: uuid(),
                        hasChanged: true,
                        type: "summary of changes",
                    });
                    this.setState({ changes: changes });
                }
            }

            this.setState({
                showModal: false,
                modalType: "",
                editKey: "",
                titleInput: "",
                descInput: "",
                hasChanges: true,
            });
        }
    };

    handleUsageNoteSave = newUsageNote => {
        const newState = {
            showModal: false,
            modalType: "",
            editKey: "",
            titleInput: "",
            descInput: "",
            checkboxInput: false,
            hasChanges: true,
        };

        // No existing usage notes so we just add our new one into state - stops any runtime errors if we set
        // 'usageNotes' to null or undefined anywhere (because `.some()` would fail later)
        if (!this.state.usageNotes || this.state.usageNotes.length === 0) {
            const usageNotes = [
                {
                    key: newUsageNote.id,
                    title: newUsageNote.title,
                    note: newUsageNote.note,
                    hasChanged: true,
                    type: "usageNotes",
                },
            ];
            this.setState({
                ...newState,
                usageNotes,
            });
            return;
        }

        const isExistingUsageNote = this.state.usageNotes.some(usageNote => usageNote.key === newUsageNote.id);

        if (isExistingUsageNote) {
            const usageNotes = this.state.usageNotes.map(usageNote => {
                if (usageNote.key !== newUsageNote.id) {
                    return usageNote;
                }
                return {
                    ...usageNote,
                    hasChanged: true,
                    title: newUsageNote.title,
                    note: newUsageNote.note,
                    type: "usageNotes",
                };
            });

            this.setState({
                ...newState,
                usageNotes,
            });

            return;
        }

        const usageNotes = [...this.state.usageNotes];
        usageNotes.push({
            key: newUsageNote.id,
            title: newUsageNote.title,
            note: newUsageNote.note,
            hasChanged: true,
            type: "usageNotes",
        });

        this.setState({
            ...newState,
            usageNotes,
        });
    };

    handleAlertSave = newAlert => {
        const newState = {
            showModal: false,
            modalType: "",
            editKey: "",
            titleInput: "",
            descInput: "",
            checkboxInput: false,
            hasChanges: true,
        };

        // No existing alerts so we just add our new one into state - stops any runtime errors if we set
        // 'alerts' to null or undefined anywhere (because `.some()` would fail later)
        if (!this.state.alerts || this.state.alerts.length === 0) {
            const alerts = [
                {
                    key: newAlert.id,
                    date: newAlert.date,
                    description: newAlert.description,
                    hasChanged: true,
                    type: newAlert.isCorrection ? "correction" : "",
                },
            ];
            this.setState({
                ...newState,
                alerts,
            });
            return;
        }

        const isExistingAlert = this.state.alerts.some(alert => alert.key === newAlert.id);

        if (isExistingAlert) {
            const alerts = this.state.alerts.map(alert => {
                if (alert.key !== newAlert.id) {
                    return alert;
                }
                return {
                    ...alert,
                    hasChanged: true,
                    date: newAlert.date,
                    description: newAlert.description,
                    type: newAlert.isCorrection ? "correction" : "",
                };
            });

            this.setState({
                ...newState,
                alerts,
            });

            return;
        }

        const alerts = [...this.state.alerts];
        alerts.push({
            key: newAlert.id,
            date: newAlert.date,
            description: newAlert.description,
            hasChanged: true,
            type: newAlert.isCorrection ? "correction" : "",
        });

        this.setState({
            ...newState,
            alerts,
        });
    };

    addErrorToSummary(errorMsg, arr) {
        const errorAlreadyInSummary = arr.some(error => {
            return error === errorMsg;
        });

        if (errorAlreadyInSummary) {
            return arr;
        }

        return [...arr, errorMsg];
    }

    removeErrorFromSummary(errorMsg, arr) {
        const errorAlreadyInSummary = arr.some(error => {
            return error === errorMsg;
        });

        if (errorAlreadyInSummary) {
            const filteredArr = arr.filter(error => {
                return error !== errorMsg;
            });
            return filteredArr;
        }

        return arr;
    }

    handleSave = (event, isSubmittingForReview, isMarkingAsReviewed) => {
        event.preventDefault();

        let haveError = false;
        let formErrors = this.state.formErrors;

        if (!this.state.edition) {
            this.setState({
                editionError: "You must select an edition",
            });
            formErrors = this.addErrorToSummary("You must select an edition", formErrors);
            haveError = true;
        } else {
            formErrors = this.removeErrorFromSummary("You must select an edition", formErrors);
        }

        if (!this.state.releaseDate) {
            this.setState({
                releaseDateError: "You must add a release date",
            });
            formErrors = this.addErrorToSummary("You must add a release date", formErrors);
            haveError = true;
        } else {
            formErrors = this.removeErrorFromSummary("You must add a release date", formErrors);
        }

        this.setState({
            formErrors: formErrors,
        });

        if (formErrors.length) {
            window.scrollTo(0, 0);
        }

        const alerts = this.state.alerts.filter(alert => {
            return alert.hasChanged;
        });

        const changes = this.state.changes.filter(change => {
            return change.hasChanged;
        });

        if (this.state.edition && this.state.isInstance && !haveError) {
            const instanceMetadata = {
                edition: this.state.edition,
                alerts: alerts,
                latest_changes: changes,
                usage_notes: this.state.usageNotes,
            };
            if (this.state.releaseDate) {
                instanceMetadata.release_date = this.state.releaseDate.toISOString();
            }
            this.updateInstanceVersion(instanceMetadata, isSubmittingForReview, isMarkingAsReviewed);
            return;
        }

        if (!this.state.isInstance && !haveError) {
            this.updateInstanceVersion(
                {
                    release_date: this.state.releaseDate.toISOString(),
                    alerts: alerts,
                    latest_changes: changes,
                    usage_notes: this.state.usageNotes,
                },
                isSubmittingForReview,
                isMarkingAsReviewed
            );
        }
    };

    handleSaveAndSubmitForReview = event => {
        this.handleSave(event, true, false);
    };

    handleSaveAndMarkAsReviewed = event => {
        this.handleSave(event, false, true);
    };

    renderReviewActions() {
        if (!this.props.instance && !this.props.version) {
            return;
        }
        const instanceOrVersionData = this.state.isInstance ? this.props.instance : this.props.version;

        if (this.state.isReadOnly || this.state.isFetchingCollectionData) {
            return;
        }

        return (
            <DatasetReviewActions
                areDisabled={this.state.isSavingData || this.state.isReadOnly}
                includeSaveLabels={true}
                reviewState={instanceOrVersionData.reviewState}
                userEmail={this.props.userEmail}
                lastEditedBy={instanceOrVersionData.lastEditedBy}
                onSubmit={this.handleSaveAndSubmitForReview}
                onApprove={this.handleSaveAndMarkAsReviewed}
                notInCollectionYet={!instanceOrVersionData.collection_id}
            />
        );
    }

    renderModal() {
        if (this.state.showModal !== true) {
            return;
        }

        if (this.state.modalType === "alerts") {
            return (
                <AlertController
                    date={this.state.titleInput}
                    description={this.state.descInput}
                    isCorrection={this.state.checkboxInput}
                    onSave={this.handleAlertSave}
                    onCancel={this.handleRelatedContentCancel}
                    id={this.state.editKey}
                />
            );
        }

        if (this.state.modalType === "usageNotes") {
            return (
                <UsageNotesController
                    title={this.state.titleInput}
                    note={this.state.descInput}
                    onSave={this.handleUsageNoteSave}
                    onCancel={this.handleRelatedContentCancel}
                    id={this.state.editKey}
                />
            );
        }

        if (this.state.modalType) {
            return (
                <Modal sizeClass="grid__col-lg-5 grid__col-md-8 grid__col-xs-10">
                    <RelatedContentForm
                        name="related-content-modal"
                        formTitle={this.state.modalTitle}
                        titleInput={this.state.titleInput}
                        descInput={this.state.descInput}
                        titleLabel={"Name"}
                        descLabel={"Description"}
                        onCancel={this.handleRelatedContentCancel}
                        onFormInput={this.handleInputChange}
                        onFormSubmit={this.handleRelatedContentSubmit}
                        titleError={this.state.titleError}
                        descError={this.state.descError}
                        requiresDescription={true}
                        requiresURL={false}
                    />
                </Modal>
            );
        }

        return (
            <Modal sizeClass="grid__col-lg-5 grid__col-md-8 grid__col-xs-10">
                <div>
                    <div className="modal__header">
                        <h2>Warning!</h2>
                    </div>
                    <div className="modal__body">
                        <p>You will lose any changes by going back without saving. </p>
                        <br />
                        <p>Click "Continue" to lose changes and go back to the previous page or click "Cancel" to stay on the current page.</p>
                    </div>
                    <div className="modal__footer">
                        <button type="button" className="btn btn--primary btn--margin-right" onClick={this.handleModalSubmit}>
                            Continue
                        </button>
                        <button type="button" className="btn" onClick={this.handleRelatedContentCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-xs-10 grid__col-md-6 grid__col-lg-4">
                    <div className="margin-top--2">
                        &#9664;{" "}
                        <button type="button" className="btn btn--link" onClick={this.handleBackButton}>
                            Back
                        </button>
                    </div>
                    <h1 className="margin-top--1 margin-bottom--1">Metadata</h1>
                    <p>This information is specific to this new data and can be updated each time new data is added.</p>
                    {this.state.isFetchingData ? (
                        <div className="margin-top--2">
                            <div className="loader loader--dark"></div>
                        </div>
                    ) : (
                        <div className="padding-bottom--2">
                            <h2 className="margin-top--1">{this.state.title || this.props.params.datasetID + " (title not available)"}</h2>

                            <FormErrorSummary errors={this.state.formErrors} />

                            <form onSubmit={this.handleSave}>
                                <div className="margin-bottom--2">
                                    <div className="grid__col-6">
                                        <Select
                                            id="edition"
                                            label="Edition"
                                            contents={this.mapEditionsToSelectOptions()}
                                            onChange={this.handleSelectChange}
                                            error={this.state.editionError}
                                            selectedOption={this.state.edition}
                                            disabled={this.state.isReadOnly || this.state.isSavingData}
                                        />
                                        <Input
                                            id="release_date"
                                            label="Release date"
                                            type="date"
                                            value={this.state.releaseDate && this.state.releaseDate.toISOString().substring(0, 10)}
                                            onChange={this.handleReleaseDateChange}
                                            error={this.state.releaseDateError}
                                            selectedOption={this.state.edition}
                                            disabled={this.state.isReadOnly || this.state.isSavingData}
                                        />
                                    </div>
                                    <div className="grid grid--justify-space-between">
                                        <h2 className="inline-block"> In this dataset </h2>
                                        <div>
                                            <button onClick={this.populateDimensionInputs} className="btn btn--primary margin-left--1" type="button">
                                                Fill from latest version
                                            </button>
                                        </div>
                                    </div>
                                    {this.mapDimensionsToInputs(this.state.dimensions)}
                                    <div className="margin-bottom--1">
                                        <h2 className="margin-top--2 margin-bottom--1">What's changed</h2>
                                        <p>The information below can change with each edition/version.</p>
                                        <div className="margin-bottom--1">
                                            <h3 className="margin-top--1 margin-bottom--1">Alerts and corrections</h3>
                                            <CardList
                                                contents={this.mapTypeContentsToCard(this.state.alerts, "alerts")}
                                                type="alerts"
                                                onEdit={this.handleEditRelatedClick}
                                                onDelete={this.handleDeleteRelatedClick}
                                                disabled={this.state.isReadOnly || this.state.isSavingData}
                                            />
                                            <button
                                                disabled={this.state.isReadOnly || this.state.isSavingData}
                                                type="button"
                                                className="btn btn--link"
                                                onClick={() => {
                                                    this.handleAddRelatedClick("alerts");
                                                }}
                                            >
                                                Add an alert
                                            </button>
                                        </div>
                                        <div className="margin-bottom--1">
                                            <h3 className="margin-top--1 margin-bottom--1">Summary of changes</h3>
                                            <CardList
                                                contents={this.mapTypeContentsToCard(this.state.changes, "changes")}
                                                type="changes"
                                                onEdit={this.handleEditRelatedClick}
                                                onDelete={this.handleDeleteRelatedClick}
                                            />
                                            <button
                                                disabled={this.state.isSavingData || this.state.isReadOnly}
                                                type="button"
                                                className="btn btn--link"
                                                onClick={() => {
                                                    this.handleAddRelatedClick("changes", "Add a change");
                                                }}
                                            >
                                                Add change
                                            </button>
                                        </div>
                                    </div>
                                    <div className="margin-bottom--1">
                                        <h2 className="margin-top--2 margin-bottom--1">Usage notes</h2>
                                        <CardList
                                            contents={this.mapTypeContentsToCard(this.state.usageNotes, "usageNotes")}
                                            type="usageNotes"
                                            onEdit={this.handleEditRelatedClick}
                                            onDelete={this.handleDeleteRelatedClick}
                                        />
                                        <button
                                            disabled={this.state.isSavingData || this.state.isReadOnly}
                                            type="button"
                                            className="btn btn--link"
                                            onClick={() => {
                                                this.handleAddRelatedClick("usageNotes", "Add a usage note");
                                            }}
                                        >
                                            Add usage note
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn--primary margin-bottom--1"
                                    disabled={this.state.isReadOnly || this.state.isFetchingCollectionData || this.state.isSavingData}
                                >
                                    Save
                                </button>
                                <span className="margin-left--1">{this.renderReviewActions()}</span>
                                {this.state.isSavingData && <div className="loader loader--dark loader--inline margin-left--1"></div>}
                                {!this.state.isInstance && (
                                    <Link
                                        className="margin-left--1"
                                        to={url.resolve(`preview?collection=${this.props.collectionID}`, !this.props.collectionID)}
                                    >
                                        Preview
                                    </Link>
                                )}
                            </form>
                        </div>
                    )}
                </div>
                {this.state.showModal === true && this.renderModal()}
            </div>
        );
    }
}

VersionMetadata.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        rootPath: state.state.rootPath,
        userEmail: state.state.user.email,
        collectionID: state.routing.locationBeforeTransitions.query.collection,
        instance: state.state.datasets.activeInstance,
        version: state.state.datasets.activeVersion,
        recipes: state.state.datasets.recipes,
        dataset: state.state.datasets.activeDataset,
    };
}

export default connect(mapStateToProps)(VersionMetadata);
