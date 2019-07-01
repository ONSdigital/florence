import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { push } from "react-router-redux";
import PropTypes from "prop-types";
import uuid from "uuid/v4";

import datasets from "../../../utilities/api-clients/datasets";
import collections from "../../../utilities/api-clients/collections";
import notifications from "../../../utilities/notifications";
import Modal from "../../../components/Modal";
import Select from "../../../components/Select";
import Checkbox from "../../../components/Checkbox";
import Input from "../../../components/Input";
import CardList from "../../../components/CardList";
import RelatedContentForm from "./related-content/RelatedContentForm";
import { updateActiveDataset, emptyActiveDataset, updateActiveDatasetReviewState, updateActiveDatasetCollectionID } from "../../../config/actions";
import url from "../../../utilities/url";
import log, { eventTypes } from "../../../utilities/log";
import handleMetadataSaveErrors from "./datasetHandleMetadataSaveErrors";
import DatasetReviewActions from "../DatasetReviewActions";

const propTypes = {
    params: PropTypes.shape({
        datasetID: PropTypes.string.isRequired
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
    rootPath: PropTypes.string.isRequired,
    userEmail: PropTypes.string.isRequired,
    collectionID: PropTypes.string,
    router: PropTypes.shape({
        listenBefore: PropTypes.func.isRequired
    }).isRequired,
    datasets: PropTypes.arrayOf(
        PropTypes.shape({
            next: PropTypes.shape({
                title: PropTypes.string
            }),
            current: PropTypes.shape({
                title: PropTypes.string
            })
        })
    ),
    dataset: PropTypes.shape({
        title: PropTypes.string,
        id: PropTypes.string,
        description: PropTypes.string,
        keywords: PropTypes.array,
        license: PropTypes.string,
        national_statistic: PropTypes.bool,
        collection_id: PropTypes.string,
        contacts: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string,
                email: PropTypes.string,
                telephone: PropTypes.string
            })
        ),
        qmi: PropTypes.shape({
            href: PropTypes.string
        }),
        related_datasets: PropTypes.arrayOf(
            PropTypes.shape({
                href: PropTypes.string,
                title: PropTypes.string
            })
        ),
        publications: PropTypes.arrayOf(
            PropTypes.shape({
                href: PropTypes.string,
                title: PropTypes.string
            })
        ),
        methodologies: PropTypes.arrayOf(
            PropTypes.shape({
                href: PropTypes.string,
                title: PropTypes.string,
                description: PropTypes.string
            })
        ),
        release_frequency: PropTypes.string,
        state: PropTypes.string,
        links: PropTypes.shape({
            latest_version: PropTypes.shape({
                href: PropTypes.string
            })
        }),
        reviewState: PropTypes.string,
        lastEditedBy: PropTypes.string
    })
};

export class DatasetMetadata extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetchingDataset: false,
            isFetchingCollectionData: false,
            isReadOnly: false,
            isSavingData: false,
            hasChanges: false,
            error: null,
            showModal: false,
            modalType: "",
            title: "",
            description: "",
            relatedBulletins: [],
            relatedQMI: "",
            relatedLinks: [],
            relatedMethodologies: [],
            keywords: "",
            titleInput: "",
            urlInput: "",
            descInput: "",
            editKey: "",
            contactName: "",
            contactEmail: "",
            contactPhone: "",
            releaseFrequency: "",
            isNationalStat: false,
            titleError: "",
            urlError: "",
            descError: "",
            latestVersion: "",
            status: "",
            license: "",
            nextRelease: ""
        };

        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleToggleChange = this.handleToggleChange.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);
        this.handleModalSubmit = this.handleModalSubmit.bind(this);
        this.handleRelatedContentCancel = this.handleRelatedContentCancel.bind(this);
        this.handleRelatedContentSubmit = this.handleRelatedContentSubmit.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleSaveAndSubmitForReview = this.handleSaveAndSubmitForReview.bind(this);
        this.handleSaveAndMarkAsReviewed = this.handleSaveAndMarkAsReviewed.bind(this);
        this.handleAddRelatedClick = this.handleAddRelatedClick.bind(this);
        this.handleDeleteRelatedClick = this.handleDeleteRelatedClick.bind(this);
        this.handleEditRelatedClick = this.handleEditRelatedClick.bind(this);
        this.editRelatedLink = this.editRelatedLink.bind(this);
    }

    componentWillMount() {
        this.removeRouteListener = this.props.router.listenBefore((nextLocation, action) => this.handleRouteChange(nextLocation, action));

        this.setState({ isFetchingDataset: true });

        datasets
            .get(this.props.params.datasetID)
            .then(response => {
                const dataset = response.next || response.current;

                this.props.dispatch(updateActiveDataset(dataset));

                if (!this.props.collectionID) {
                    this.setState({
                        isReadOnly: true
                    });
                    const notification = {
                        type: "neutral",
                        message: "You are not in a collection, so cannot edit this dataset.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    log.add(eventTypes.runtimeWarning, {
                        message: `Attempt to edit/view dataset (${this.props.params.datasetID}) without being in collection.`
                    });
                    console.warn(`Attempt to edit/view dataset (${this.props.params.datasetID}) without being in collection.`);
                }

                if (this.props.collectionID && dataset.collection_id && this.props.collectionID !== dataset.collection_id) {
                    this.setState({
                        isReadOnly: true
                    });
                    const notification = {
                        type: "neutral",
                        message: "This dataset is already in a different collection, so can't be edited.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    log.add(eventTypes.runtimeWarning, {
                        message: `Attempt to edit/view dataset that is already in collection '${dataset.collection_id}' but current collection is '${this.props.collectionID}'`
                    });
                    console.warn("Dataset is already in collection '" + dataset.collection_id + "'");
                }

                if (this.props.dataset.collection_id && this.props.collectionID) {
                    this.updateReviewStateData();
                }

                this.setState({
                    latestVersion: dataset.links.latest_version ? dataset.links.latest_version.href : "",
                    status: dataset.state
                });

                if (dataset && dataset.title) {
                    this.setState({
                        title: dataset.title
                    });
                }

                if (dataset && dataset.next_release) {
                    this.setState({
                        nextRelease: dataset.next_release
                    });
                }

                if (dataset && dataset.description) {
                    this.setState({
                        description: dataset.description
                    });
                }

                if (dataset && dataset.license) {
                    this.setState({
                        license: dataset.license
                    });
                }

                if (dataset && dataset.release_frequency) {
                    this.setState({
                        releaseFrequency: dataset.release_frequency
                    });
                }

                if (dataset && dataset.national_statistic) {
                    this.setState({
                        isNationalStat: dataset.national_statistic
                    });
                }

                if (dataset.keywords && dataset.keywords.length > 0) {
                    this.setState({
                        keywords: dataset.keywords.join(", ")
                    });
                }

                if (dataset.contacts && dataset.contacts.length > 0) {
                    const contact = dataset.contacts[0];
                    this.setState({
                        contactName: contact.name,
                        contactEmail: contact.email,
                        contactPhone: contact.telephone
                    });
                }

                if (dataset.qmi && dataset.qmi.href !== "") {
                    this.setState({ relatedQMI: dataset.qmi.href });
                }

                if (dataset.publications && dataset.publications.length > 0) {
                    const bulletins = dataset.publications.map(item => {
                        return {
                            title: item.title,
                            href: item.href,
                            key: uuid()
                        };
                    });
                    this.setState({ relatedBulletins: bulletins });
                }

                if (dataset.related_datasets && dataset.related_datasets.length > 0) {
                    const links = dataset.related_datasets.map(item => {
                        return {
                            title: item.title,
                            href: item.href,
                            key: uuid()
                        };
                    });
                    this.setState({ relatedLinks: links });
                }

                if (dataset.methodologies && dataset.methodologies.length > 0) {
                    const methodology_links = dataset.methodologies.map(item => {
                        return {
                            title: item.title,
                            href: item.href,
                            description: item.description,
                            key: uuid()
                        };
                    });
                    this.setState({ relatedMethodologies: methodology_links });
                }

                this.setState({
                    isFetchingDataset: false
                });
            })
            .catch(error => {
                this.setState({
                    isFetchingDataset: false,
                    isReadOnly: true
                });
                switch (error.status) {
                    case 403: {
                        const notification = {
                            type: "info",
                            message: "You do not permission to view this dataset",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    case 404: {
                        const notification = {
                            type: "info",
                            message: `Dataset ID '${this.props.params.datasetID}' was not recognised. You've been redirected to the datasets home screen`,
                            isDismissable: true
                        };
                        notifications.add(notification);
                        const URL = url.resolve("/datasets" + (this.props.collectionID ? "?collection=" + this.props.collectionID : ""));
                        this.props.dispatch(push(URL));
                        break;
                    }
                    default: {
                        const notification = {
                            type: "warning",
                            message: "An unexpected error's occurred whilst trying to get this dataset",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                }
                log.add(eventTypes.unexpectedRuntimeError, {
                    message: "Error getting dataset " + this.props.params.datasetID + ". Error: " + JSON.stringify(error)
                });
                console.error("Error has occurred:\n", error);
            });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.isFetchingDataset) {
            return false;
        }
        if (this.props.dataset && nextProps.dataset === null) {
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

        this.props.dispatch(emptyActiveDataset());
        action();
    }

    getCollection(collectionID) {
        return collections
            .get(collectionID)
            .then(response => [null, response])
            .catch(error => [error, null]);
    }

    async updateReviewStateData() {
        this.setState({ isFetchingCollectionData: true });
        const collectionID = this.props.collectionID;
        const datasetID = this.props.params.datasetID;

        try {
            const [error, collection] = await this.getCollection(collectionID);
            if (error) {
                throw error;
            }

            const dataset = collection.datasets.find(dataset => {
                return dataset.id === datasetID;
            });
            if (!dataset) {
                this.setState({ isFetchingCollectionData: false });
                return;
            }
            const lastEditedBy = dataset.lastEditedBy;
            const reviewState = dataset.state.charAt(0).toLowerCase() + dataset.state.slice(1); //lowercase it so it's consistent with the properties in our state (i.e. "InProgress" = "inProgress" )
            this.props.dispatch(updateActiveDatasetReviewState(lastEditedBy, reviewState));
            this.setState({ isFetchingCollectionData: false });
        } catch (error) {
            this.setState({
                isFetchingCollectionData: false,
                isReadOnly: true
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
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                case 404: {
                    const notification = {
                        type: "warning",
                        message: `Could not find collection '${collectionID}'`,
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: `An unexpected error's occurred whilst trying to get the collection '${collectionID}'`,
                        isDismissable: true
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
                    JSON.stringify(error)
            });
            console.error("Unable to update metadata screen with version's review/edit status in collection '" + collectionID + "'", error);
        }
    }

    mapStateToAPIRequest() {
        return {
            contacts: [
                {
                    email: this.state.contactEmail,
                    name: this.state.contactName,
                    telephone: this.state.contactPhone
                }
            ],
            description: this.state.description,
            next_release: this.state.nextRelease,
            release_frequency: this.state.releaseFrequency,
            title: this.state.title,
            license: this.state.license,
            national_statistic: this.state.isNationalStat,
            keywords: this.splitKeywordsString(this.state.keywords),
            qmi: {
                href: this.state.relatedQMI
            },
            publications: [...this.state.relatedBulletins],
            methodologies: [...this.state.relatedMethodologies],
            related_datasets: [...this.state.relatedLinks]
        };
    }

    mapReleaseFreqToSelectOptions() {
        const values = ["Weekly", "Monthly", "Annually"];

        return values.map(value => {
            return {
                id: value.toLowerCase(),
                name: value
            };
        });
    }

    handleSelectChange(event) {
        this.setState({
            error: "",
            releaseFrequency: event.target.value,
            hasChanges: true
        });
    }

    handleModalSubmit(event) {
        event.preventDefault();
        this.setState({ showModal: false });
        const URL = url.resolve("/datasets" + (this.props.collectionID ? "?collection=" + this.props.collectionID : ""));
        this.props.dispatch(push(URL));
    }

    handleToggleChange(isChecked) {
        this.setState({
            isNationalStat: isChecked,
            hasChanges: true
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        if (!this.state.hasChanges) {
            this.setState({ hasChanges: true });
        }

        if (name === "add-related-content-title") {
            this.setState({ titleInput: value });
            if (this.state.titleError != null) {
                this.setState({ titleError: null });
            }
        } else if (name === "add-related-content-url") {
            this.setState({ urlInput: value });
            if (this.state.urlError != null) {
                this.setState({ urlError: null });
            }
        } else if (name === "add-related-content-desc") {
            this.setState({ descInput: value });
            if (this.state.descError != null) {
                this.setState({ descError: null });
            }
        } else {
            this.setState({
                [name]: value
            });
        }
    }

    handleBackButton() {
        if (!this.state.isReadOnly && this.state.hasChanges) {
            this.setState({ showModal: true });
            return;
        }

        const URL = url.resolve("/datasets" + (this.props.collectionID ? "?collection=" + this.props.collectionID : ""));
        this.props.dispatch(push(URL));
    }

    handleRelatedContentCancel() {
        this.setState({
            showModal: false,
            modalType: "",
            editKey: "",
            urlInput: "",
            descInput: "",
            titleInput: ""
        });
    }

    handleAddRelatedClick(type) {
        this.setState({
            showModal: true,
            modalType: type
        });
    }

    handleEditRelatedClick(type, key) {
        let relatedItem;

        if (type === "bulletin") {
            relatedItem = this.state.relatedBulletins.find(bulletin => {
                return bulletin.key === key;
            });
        }

        if (type === "link") {
            relatedItem = this.state.relatedLinks.find(link => {
                return link.key === key;
            });
        }

        if (type === "methodologies") {
            relatedItem = this.state.relatedMethodologies.find(link => {
                return link.key === key;
            });
        }
        this.setState({
            showModal: true,
            modalType: type,
            editKey: key,
            urlInput: relatedItem.href || "",
            titleInput: relatedItem.title || "",
            descInput: relatedItem.description || ""
        });
    }

    handleDeleteRelatedClick(type, key) {
        function remove(items, key) {
            return items.filter(item => {
                return item.key !== key;
            });
        }

        if (type === "bulletin") {
            this.setState({
                relatedBulletins: remove(this.state.relatedBulletins, key)
            });
            return;
        }

        if (type === "link") {
            this.setState({
                relatedLinks: remove(this.state.relatedLinks, key)
            });
            return;
        }

        if (type === "methodologies") {
            this.setState({
                relatedMethodologies: remove(this.state.relatedMethodologies, key)
            });
            return;
        }

        console.warn("Attempt to remove a related content type that is not recognised", type);
        log.add(eventTypes.unexpectedRuntimeError, `Attempt to remove a related content type that is not recognised: '${type}'`);
    }

    editRelatedLink(type, key) {
        const edit = items => {
            return items.map(item => {
                if (item.key !== key) {
                    return item;
                }
                return {
                    ...item,
                    title: this.state.titleInput,
                    href: this.state.urlInput,
                    description: this.state.descInput
                };
            });
        };
        if (type === "bulletin") {
            this.setState({
                relatedBulletins: edit(this.state.relatedBulletins, key)
            });
            return;
        }

        if (type === "link") {
            this.setState({ relatedLinks: edit(this.state.relatedLinks, key) });
            return;
        }

        if (type === "methodologies") {
            this.setState({
                relatedMethodologies: edit(this.state.relatedMethodologies, key)
            });
            return;
        }

        console.warn("Attempt to edit a related content type that is not recognised", type);
        log.add(eventTypes.unexpectedRuntimeError, `Attempt to edit a related content type that is not recognised: '${type}'`);
    }

    mapTypeContentsToCard(items) {
        return items.map(item => {
            return {
                title: item.title,
                id: item.key
            };
        });
    }

    splitKeywordsString(keywords) {
        return keywords.split(",").map(keyword => {
            return keyword.trim();
        });
    }

    addDatasetToCollection(datasetID) {
        return collections.addDataset(this.props.collectionID, datasetID).catch(error => {
            log.add(eventTypes.unexpectedRuntimeError, {
                message: `Error adding dataset '${datasetID}' to collection '${this.props.collectionID}'. Error: ${JSON.stringify(error)}`
            });
            console.error(`Error adding dataset '${datasetID}' to collection '${this.props.collectionID}'`, error);
            return error;
        });
    }

    updateDatasetReviewState(datasetID, isSubmittingForReview, isMarkingAsReviewed) {
        let request = Promise.resolve;

        this.setState({ isSavingData: true });

        if (isSubmittingForReview) {
            request = collections.setDatasetStatusToComplete;
        }

        if (isMarkingAsReviewed) {
            request = collections.setDatasetStatusToReviewed;
        }

        return request(this.props.collectionID, datasetID).catch(error => {
            log.add(eventTypes.unexpectedRuntimeError, {
                message: `Error updating review state for dataset '${datasetID}' to '${isSubmittingForReview ? "Complete" : ""}${
                    isMarkingAsReviewed ? "Reviewed" : ""
                }' in collection '${this.props.collectionID}'. Error: ${JSON.stringify(error)}`
            });
            console.error(
                `Error updating review state for dataset '${datasetID}' to '${isSubmittingForReview ? "Complete" : ""}${
                    isMarkingAsReviewed ? "Reviewed" : ""
                }' in collection '${this.props.collectionID}'`,
                error
            );
            return error;
        });
    }

    updateDatasetMetadata(datasetID) {
        return datasets.updateDatasetMetadata(datasetID, this.mapStateToAPIRequest()).catch(error => {
            log.add(eventTypes.unexpectedRuntimeError, {
                message: `Error updating metadata for dataset '${datasetID}'. Error: ${JSON.stringify(error)}`
            });
            console.error(`Error updating metadata for dataset '${datasetID}'`, error);
            return error;
        });
    }

    handleRelatedContentSubmit(event) {
        event.preventDefault();

        if (this.state.titleInput == "" || this.state.urlInput == "") {
            if (this.state.titleInput == "") {
                this.setState({
                    titleError: "You must provide a title"
                });
            }
            if (this.state.urlInput == "") {
                this.setState({
                    urlError: "You must provide a url"
                });
            }
        } else {
            if (this.state.modalType === "bulletin") {
                if (this.state.editKey != "") {
                    this.editRelatedLink("bulletin", this.state.editKey);
                } else {
                    const bulletins = this.state.relatedBulletins.concat({
                        title: this.state.titleInput,
                        href: this.state.urlInput,
                        key: uuid()
                    });
                    this.setState({ relatedBulletins: bulletins });
                }
            } else if (this.state.modalType === "link") {
                if (this.state.editKey != "") {
                    this.editRelatedLink("link", this.state.editKey);
                } else {
                    const links = this.state.relatedLinks.concat({
                        title: this.state.titleInput,
                        href: this.state.urlInput,
                        key: uuid()
                    });
                    this.setState({ relatedLinks: links });
                }
            } else if (this.state.modalType === "methodologies") {
                if (this.state.editKey != "") {
                    this.editRelatedLink("methodologies", this.state.editKey);
                } else {
                    const methodology_links = this.state.relatedMethodologies.concat({
                        title: this.state.titleInput,
                        href: this.state.urlInput,
                        description: this.state.descInput,
                        key: uuid()
                    });
                    this.setState({ relatedMethodologies: methodology_links });
                }
            }

            this.setState({
                showModal: false,
                modalType: "",
                editKey: "",
                titleInput: "",
                urlInput: "",
                descInput: ""
            });
        }
    }

    async handleSave(event, isSubmittingForReview, isMarkingAsReviewed) {
        const isUpdatingReviewState = isSubmittingForReview || isMarkingAsReviewed;
        const isAddingToCollection = !this.props.dataset.collection_id && !isUpdatingReviewState;

        event.preventDefault();
        this.setState({ isSavingData: true });

        const metadataUpdateRequest = this.updateDatasetMetadata(this.props.params.datasetID);
        let metadataUpdateError;

        const reviewStateUpdatesRequest = isUpdatingReviewState
            ? this.updateDatasetReviewState(this.props.params.datasetID, isSubmittingForReview, isMarkingAsReviewed)
            : Promise.resolve();
        let reviewStateUpdatesError;

        const addToCollectionRequest = isAddingToCollection ? this.addDatasetToCollection(this.props.params.datasetID) : Promise.resolve();
        let addToCollectionError;

        [metadataUpdateError, reviewStateUpdatesError, addToCollectionError] = [
            await metadataUpdateRequest,
            await reviewStateUpdatesRequest,
            await addToCollectionRequest
        ];

        const newState = { isSavingData: false };
        if (!metadataUpdateError) {
            newState.hasChanges = false;
        }
        this.setState(newState);

        handleMetadataSaveErrors(
            metadataUpdateError,
            reviewStateUpdatesError || addToCollectionError,
            isSubmittingForReview,
            isMarkingAsReviewed,
            this.props.collectionID
        );

        if (!addToCollectionError && isAddingToCollection) {
            this.props.dispatch(updateActiveDatasetCollectionID(this.props.collectionID));
            this.props.dispatch(updateActiveDatasetReviewState(this.props.userEmail, "inProgress"));
            return;
        }
        if (!reviewStateUpdatesError && isUpdatingReviewState) {
            this.props.dispatch(push(url.resolve(`/collections/${this.props.collectionID}`)));
            return;
        }
    }

    handleSaveAndSubmitForReview() {
        this.handleSave(event, true, false);
    }

    handleSaveAndMarkAsReviewed() {
        this.handleSave(event, false, true);
    }

    renderReviewActions() {
        if (this.state.isReadOnly || this.state.isFetchingCollectionData) {
            return;
        }

        return (
            <DatasetReviewActions
                areDisabled={this.state.isSavingData || this.state.isReadOnly}
                includeSaveLabels={true}
                reviewState={this.props.dataset.reviewState}
                userEmail={this.props.userEmail}
                lastEditedBy={this.props.dataset.lastEditedBy}
                onSubmit={this.handleSaveAndSubmitForReview}
                onApprove={this.handleSaveAndMarkAsReviewed}
                notInCollectionYet={!this.props.dataset.collection_id}
            />
        );
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-4">
                    <div className="margin-top--2">
                        &#9664;{" "}
                        <button type="button" className="btn btn--link" onClick={this.handleBackButton}>
                            Back
                        </button>
                    </div>
                    <p className="margin-top--1">
                        Dataset: <strong>{this.state.title || this.props.params.datasetID + " (title not available)"}</strong>
                    </p>
                    <h1 className="margin-top--1 margin-bottom--1">Dataset details</h1>
                    <p className="margin-bottom--1">
                        This information is common across all editions of the dataset.
                        <br />
                        Changing it will affect all previous editions.
                    </p>
                    {this.state.isFetchingDataset ? (
                        <div className="loader loader--dark"></div>
                    ) : (
                        <div>
                            <h2 className="margin-top--1 margin-bottom--1">Dataset</h2>
                            <div className="margin-bottom--1">
                                <strong>ID</strong>
                                <span className="inline-block margin-left--1">{this.props.params.datasetID || "Fetching dataset ID..."}</span>
                            </div>
                            <form className="margin-bottom--4" onSubmit={this.handleSave}>
                                <Input
                                    value={this.state.title}
                                    id="title"
                                    label="Title"
                                    onChange={this.handleInputChange}
                                    disabled={this.state.isReadOnly || this.state.isSavingData}
                                />
                                <Input
                                    value={this.state.description}
                                    type="textarea"
                                    id="description"
                                    label="About this dataset"
                                    onChange={this.handleInputChange}
                                    disabled={this.state.isReadOnly || this.state.isSavingData}
                                />
                                <Input
                                    value={this.state.nextRelease}
                                    id="nextRelease"
                                    label="Next release date"
                                    onChange={this.handleInputChange}
                                    disabled={this.state.isReadOnly || this.state.isSavingData}
                                />
                                <Input
                                    value={this.state.keywords}
                                    id="keywords"
                                    label="Keywords"
                                    placeholder={`e.g. housing, inflation`}
                                    onChange={this.handleInputChange}
                                    disabled={this.state.isReadOnly || this.state.isSavingData}
                                />
                                <div className="grid__col-6 margin-top--2">
                                    <Checkbox
                                        isChecked={this.state.isNationalStat}
                                        onChange={this.handleToggleChange}
                                        disabled={this.state.isReadOnly || this.state.isSavingData}
                                        label="National statistic"
                                        id="national-statistic"
                                    />
                                </div>
                                <div className="grid__col-6 margin-bottom--1">
                                    <Select
                                        contents={this.mapReleaseFreqToSelectOptions()}
                                        selectedOption={this.state.releaseFrequency}
                                        onChange={this.handleSelectChange}
                                        error={this.state.error}
                                        label="Release frequency"
                                        id="release-frequency"
                                        disabled={this.state.isReadOnly || this.state.isSavingData}
                                    />
                                </div>
                                <h3 className="margin-bottom--1">Contact</h3>
                                <Input
                                    value={this.state.contactName}
                                    id="contactName"
                                    label="Contact name"
                                    onChange={this.handleInputChange}
                                    disabled={this.state.isReadOnly || this.state.isSavingData}
                                />
                                <Input
                                    value={this.state.contactEmail}
                                    id="contactEmail"
                                    label="Contact email"
                                    onChange={this.handleInputChange}
                                    disabled={this.state.isReadOnly || this.state.isSavingData}
                                />
                                <Input
                                    value={this.state.contactPhone}
                                    id="contactPhone"
                                    label="Contact telephone"
                                    onChange={this.handleInputChange}
                                    disabled={this.state.isReadOnly || this.state.isSavingData}
                                />
                                <h2 className="margin-top--2 margin-bottom--1">Related content</h2>
                                <div className="margin-bottom--1">
                                    <p> These are common across all editions of the dataset. Changing them will affect all previous editions.</p>
                                </div>
                                <div className="margin-bottom--2 related-datasets">
                                    <h3> Related datasets </h3>
                                    <CardList
                                        contents={this.mapTypeContentsToCard(this.state.relatedLinks)}
                                        type="link"
                                        onEdit={this.handleEditRelatedClick}
                                        onDelete={this.handleDeleteRelatedClick}
                                        disabled={this.state.isReadOnly || this.state.isSavingData}
                                    />
                                    <button
                                        disabled={this.state.isReadOnly || this.state.isSavingData}
                                        type="button"
                                        className="btn btn--link"
                                        onClick={() => {
                                            this.handleAddRelatedClick("link");
                                        }}
                                    >
                                        {" "}
                                        Add related link
                                    </button>
                                </div>
                                <div className="margin-bottom--2 related-documents">
                                    <h3> Bulletins, articles and compendia </h3>
                                    <CardList
                                        contents={this.mapTypeContentsToCard(this.state.relatedBulletins)}
                                        type="bulletin"
                                        onEdit={this.handleEditRelatedClick}
                                        onDelete={this.handleDeleteRelatedClick}
                                        disabled={this.state.isReadOnly || this.state.isSavingData}
                                    />
                                    <button
                                        disabled={this.state.isReadOnly || this.state.isSavingData}
                                        type="button"
                                        className="btn btn--link"
                                        onClick={() => {
                                            this.handleAddRelatedClick("bulletin");
                                        }}
                                    >
                                        {" "}
                                        Add document
                                    </button>
                                </div>
                                <div className="margin-bottom--2">
                                    <h3> Quality and methodology information </h3>
                                    <span>Copy the QMI web address for the dataset and paste it here</span>
                                    <Input
                                        value={this.state.relatedQMI}
                                        id="relatedQMI"
                                        label=""
                                        onChange={this.handleInputChange}
                                        disabled={this.state.isReadOnly || this.state.isSavingData}
                                    />
                                </div>
                                <div className="margin-bottom--2 related-methodologies">
                                    <h3> Methodologies </h3>
                                    <CardList
                                        contents={this.mapTypeContentsToCard(this.state.relatedMethodologies)}
                                        type="methodologies"
                                        onEdit={this.handleEditRelatedClick}
                                        onDelete={this.handleDeleteRelatedClick}
                                        disabled={this.state.isReadOnly || this.state.isSavingData}
                                    />
                                    <button
                                        disabled={this.state.isReadOnly || this.state.isSavingData}
                                        type="button"
                                        className="btn btn--link"
                                        onClick={() => {
                                            this.handleAddRelatedClick("methodologies");
                                        }}
                                    >
                                        {" "}
                                        Add methodology
                                    </button>
                                </div>
                                <div className="margin-bottom--2">
                                    <h3> Usage information </h3>
                                    <span>
                                        State if the data is free for public use or if there are restrictions on usage.
                                        <br />
                                        State what text the user should use to correctly cite the data.
                                    </span>
                                    <Input
                                        value={this.state.license}
                                        type="textarea"
                                        id="license"
                                        label=""
                                        onChange={this.handleInputChange}
                                        disabled={this.state.isReadOnly || this.state.isSavingData}
                                    />
                                </div>
                                <button
                                    id="btn-save"
                                    type="submit"
                                    className="btn btn--primary margin-bottom--1"
                                    disabled={this.state.isReadOnly || this.state.isFetchingCollectionData || this.state.isSavingData}
                                >
                                    Save
                                </button>
                                <span className="margin-left--1">{this.renderReviewActions()}</span>
                                {this.state.isSavingData && <div className="loader loader--inline loader--dark margin-left--1"></div>}
                                {this.state.latestVersion && (
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
                {this.state.showModal && (
                    <Modal sizeClass="grid__col-3">
                        {this.state.modalType ? (
                            <RelatedContentForm
                                name="related-content-modal"
                                formTitle="Add related content"
                                titleLabel={"Page title"}
                                titleInput={this.state.titleInput}
                                urlLabel={"Page URL"}
                                urlInput={this.state.urlInput}
                                descLabel={"Description"}
                                descInput={this.state.descInput}
                                onCancel={this.handleRelatedContentCancel}
                                onFormInput={this.handleInputChange}
                                onFormSubmit={this.handleRelatedContentSubmit}
                                titleError={this.state.titleError}
                                urlError={this.state.urlError}
                                requiresDescription={this.state.modalType === "methodologies" ? true : false}
                                requiresURL={true}
                            />
                        ) : (
                            <div>
                                <div className="modal__header">
                                    <h2>Warning!</h2>
                                </div>
                                <div className="modal__body">
                                    <p>You will lose any changes by going back without saving. </p>
                                    <br />
                                    <p>
                                        Click "Continue" to lose changes and go back to the previous page or click "Cancel" to stay on the current
                                        page.
                                    </p>
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
                        )}
                    </Modal>
                )}
            </div>
        );
    }
}

DatasetMetadata.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        rootPath: state.state.rootPath,
        userEmail: state.state.user.email,
        collectionID: state.routing.locationBeforeTransitions.query.collection,
        datasets: state.state.datasets.all,
        dataset: state.state.datasets.activeDataset
    };
}

export default connect(mapStateToProps)(DatasetMetadata);
