import React, { Component } from 'react';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import date from '../../../utilities/date'
import datasets from '../../../utilities/api-clients/datasets';
import collections from '../../../utilities/api-clients/collections';
import notifications from '../../../utilities/notifications';
import url from '../../../utilities/url';
import log, {eventTypes} from '../../../utilities/log';

import DatasetMetadata from './DatasetMetadata';

const propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired
    }),
    params: PropTypes.shape({
        collectionID: PropTypes.string.isRequired,
        datasetID: PropTypes.string.isRequired,
        editionID: PropTypes.string.isRequired,
        versionID: PropTypes.string.isRequired,
        metadataField: PropTypes.string,
        metadataItemID: PropTypes.string
    }),
    children: PropTypes.element,
    dispatch: PropTypes.func.isRequired
}

export class DatasetMetadataController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            disableScreen: false,
            isGettingDatasetMetadata: false,
            isGettingVersionMetadata: false,
            isGettingCollectionData: false,
            isSaving: false,
            datasetIsInCollection: false,
            versionIsInCollection: false,
            versionIsPublished: false,
            datasetState: "",
            datasetCollectionState: "",
            lastEditedBy: "", 
            instanceID: "",
            dimensionsUpdated: false,
            datasetMetadataHasChanges: false,
            versionMetadataHasChanges: false,
            metadata: {
                title: "",
                summary: "",
                keywords: [],
                nationalStatistic: false,
                licence: "",
                contactName: "",
                contactEmail: "",
                contactTelephone: "",
                relatedDatasets: [],
                relatedPublications: [],
                relatedMethodologies: [],
                releaseFrequency: "",
                edition: "",
                version: 0,
                releaseDate: {
                    value: "",
                    error: ""
                },
                nextReleaseDate: "",
                unitOfMeasure: "",
                notices: [],
                dimensions: [],
                usageNotes: [],
                latestChanges: []
            }
        }

    }

    componentWillMount() {
        const datasetID = this.props.params.datasetID;
        const editionID = this.props.params.editionID;
        const versionID = this.props.params.versionID; 
        this.getDataset(datasetID)
        this.getVersion(datasetID, editionID, versionID)
    }

    getDataset = (datasetID) => {
        this.setState({isGettingDatasetMetadata: true})
        datasets.get(datasetID).then(dataset => {
            const mappedDataset = this.mapDatasetToState(dataset);
            if (mappedDataset.state === "associated" && mappedDataset.collection !== this.props.params.collectionID) {
                this.setState({disableScreen: true});
                notifications.add({
                    type: "neutral",
                    message: `This dataset is in another collection.`,
                    isDismissable: true
                });
            }
            if (mappedDataset.collection) {
                this.getAndUpdateReviewStateData();
            }
            this.setState({metadata: mappedDataset.metadata, 
                isGettingDatasetMetadata: false, 
                datasetIsInCollection: mappedDataset.collection,
                datasetState: mappedDataset.state
            })
        })
    }

    mapDatasetToState = datasetResponse => {
        try {
            const dataset = datasetResponse.next || datasetResponse.current || datasetResponse;
            
            const mappedDataset = {
                title: dataset.title,
                summary: dataset.description,
                keywords: dataset.keywords,
                nationalStatistic: dataset.national_statistic,
                licence: dataset.license || "", 
                relatedDatasets: dataset.related_datasets ? this.mapRelatedContentToState(dataset.related_datasets) : [],
                relatedPublications: dataset.publications ? this.mapRelatedContentToState(dataset.publications) : [],
                relatedMethodologies: dataset.methodologies ? this.mapRelatedContentToState(dataset.methodologies) : [],
                releaseFrequency: dataset.release_frequency || "",
                unitOfMeasure: dataset.unit_of_measure || "",
                nextReleaseDate: dataset.next_release,
                qmi: dataset.qmi.href
            }
            if (dataset.contacts) {
                mappedDataset.contactName = dataset.contacts[0].name ? dataset.contacts[0].name : "";
                mappedDataset.contactEmail = dataset.contacts[0].email ? dataset.contacts[0].email : "";
                mappedDataset.contactTelephone = dataset.contacts[0].telephone ? dataset.contacts[0].telephone : "";
            }
            return {
                metadata: {...this.state.metadata, ...mappedDataset}, 
                collection: dataset.collection_id || false,
                state: dataset.state
            }
        } catch (error) {
            log.add(eventTypes.unexpectedRuntimeError, {message: `Error mapping dataset '${datasetResponse.id}' to to state. \n ${error}`});
            notifications.add({
                type: "warning",
                message: `An unexpected error occurred when trying to get dataset '${datasetResponse.id}'. Try refreshing the page`,
                isDismissable: true
            });
            console.error(`Error mapping dataset '${datasetResponse.id}' to to state. \n ${error}`)
        }
    }

    mapRelatedContentToState = (relatedDatasets) => {
        try {
            return relatedDatasets.map((link, index) => {
                return {
                    id: index,
                    description: link.description,
                    href: link.href,
                    title: link.title,
                    simpleListHeading: link.title,
                    simpleListDescription: link.description,
                }
            })
        } catch(error) {
            log.add(eventTypes.unexpectedRuntimeError, {message: `Error mapping related links to state \n ${error}`});
            // throw an error to let parent mapper catch and display notification
            // this will prevent the page loading with half loaded/mapped data
            throw new Error(`Error mapping related links to state \n ${error}`);
        }
    }

    getVersion = (datasetID, editionID, versionID) => {
        this.setState({isGettingVersionMetadata: true})
        datasets.getVersion(datasetID, editionID, versionID).then(version => {
            const mappedVersion = this.mapVersionToState(version)
            this.setState({metadata: mappedVersion.metadata, 
                isGettingVersionMetadata: false, 
                versionIsInCollection: mappedVersion.collection, 
                instanceID: mappedVersion.instanceID, 
                versionIsPublished: mappedVersion.versionIsPublished});
        })
    }

    mapVersionToState = version => {
        try {
            const mappedVersion =  {
                edition: version.edition,
                version: version.version,
                releaseDate: {value: version.release_date || "", error: ""},
                notices: version.alerts ? this.mapNoticesToState(version.alerts) : [],
                dimensions: version.dimensions || [],
                usageNotes: version.usage_notes ? this.mapUsageNotesToState(version.usage_notes) : [],
                latestChanges: version.latest_changes ? this.mapLatestChangesToState(version.latest_changes) : []
            }
            return {
                metadata: {...this.state.metadata, ...mappedVersion}, 
                collection: version.collection_id || false, 
                instanceID: version.id,
                versionIsPublished: version.state === "published" 
            }
        } catch (error) {
            log.add(eventTypes.unexpectedRuntimeError, {message: `Error mapping version '${version.version || version.id}' to to state. \n ${error}`});
            notifications.add({
                type: "warning",
                message: `An unexpected error occurred when trying to get version '${version.version || version.id}'. Try refreshing the page`,
                isDismissable: true
            });
            console.error(`Error mapping dataset '${version.version || version.id}' to to state. \n ${error}`)
        }
    }

    mapNoticesToState = (notices) => {
        try {
            return notices.map((notice, index) => {
                return {
                    id: index,
                    type: notice.type,
                    date: notice.date,
                    description: notice.description,
                    simpleListHeading: `${notice.type} (${date.format(notice.date, "dd mmmm yyyy")})`,
                    simpleListDescription: notice.description,
                }
            })
        } catch(error) {
            log.add(eventTypes.unexpectedRuntimeError, {message: `Error mapping notices to state \n ${error}`});
            // throw an error to let parent mapper catch and display notification
            // this will prevent the page loading with half loaded/mapped data
            throw new Error(`Error mapping notices to state \n ${error}`);
        }
    }

    mapUsageNotesToState = (usageNotes) => {
        try {
            return usageNotes.map((note, index) => {
                return {
                    id: index,
                    title: note.title,
                    note: note.note,
                    simpleListHeading: note.title,
                    simpleListDescription: note.note,
                }
            })
        } catch(error) {
            log.add(eventTypes.unexpectedRuntimeError, {message: `Error mapping usage notes to state \n ${error}`});
            // throw an error to let parent mapper catch and display notification
            // this will prevent the page loading with half loaded/mapped data
            throw new Error(`Error mapping usage notes to state \n ${error}`);
        }
    }

    mapLatestChangesToState = (latestChanges) => {
        try {
            return latestChanges.map((latestChange, index) => {
                return {
                    id: index,
                    title: latestChange.title,
                    description: latestChange.description,
                    simpleListHeading: latestChange.title,
                    simpleListDescription: latestChange.description,
                }
            })
        } catch(error) {
            log.add(eventTypes.unexpectedRuntimeError, {message: `Error mapping latest changes to state \n ${error}`});
            // throw an error to let parent mapper catch and display notification
            // this will prevent the page loading with half loaded/mapped data
            throw new Error(`Error mapping latest changes to state \n ${error}`);
        }
    }

    getAndUpdateReviewStateData = () => {
        this.setState({isGettingCollectionData: true});
        collections.get(this.props.params.collectionID).then(collection => {
            if (collection.datasets.length) {
                const datasetCollectionState = this.mapDatasetCollectionStateToState(collection.datasets)
                this.setState({isGettingCollectionData: false, 
                    lastEditedBy: datasetCollectionState.lastEditedBy, 
                    datasetCollectionState: datasetCollectionState.reviewState
                });
            }
            this.setState({isGettingCollectionData: false});
        })
    }

    mapDatasetCollectionStateToState = (datasets) => {
        try {
            const dataset = datasets.find(dataset => {
                return (
                    dataset.id === this.props.params.datasetID
                )
            });

            //lowercase it so it's consistent with the properties in our state (i.e. "InProgress" = "inProgress"
            return {lastEditedBy: dataset.lastEditedBy, reviewState: dataset.state.charAt(0).toLowerCase() + dataset.state.slice(1)}
        } catch (error) {
            log.add(eventTypes.unexpectedRuntimeError, {message: `Error mapping version collection state to to state. \n ${error}`});
            notifications.add({
                type: "warning",
                message: `An unexpected error occurred when trying to get information about this versions collection state'. Try refreshing the page`,
                isDismissable: true
            });
            console.error(`Error mapping version collection state to to state. \n ${error}`)
        }
    }

    handleStringInputChange = event => {
        const fieldName = event.target.name;
        const value = event.target.value;
        const newMetadataState = {...this.state.metadata, [fieldName]: value};
        this.setState({metadata: newMetadataState, 
            datasetMetadataHasChanges: this.datasetMetadataHasChanges(fieldName), 
            versionMetadataHasChanges: this.versionMetadataHasChanges(fieldName)
        });
    }

    handleDateInputChange = event => {
        const fieldName = event.target.name;
        const value = event.target.value;
        const ISODate = new Date(value).toISOString();
        const newMetadataState = {...this.state.metadata, [fieldName]: {value: ISODate, error: ""}};
        this.setState({metadata: newMetadataState, 
            datasetMetadataHasChanges: this.datasetMetadataHasChanges(fieldName), 
            versionMetadataHasChanges: this.versionMetadataHasChanges(fieldName)
        });
    }

    handleNationalStaticticChange = event => {
        const value = event.value === "true" ? true : false;
        const newMetadataState = {
            ...this.state.metadata,
            nationalStatistic: value
        };
        this.setState({metadata: newMetadataState, datasetMetadataHasChanges: true});
    }

    handleDimensionNameChange = event => {
        const value = event.target.value;
        const dimensionID = event.target.name.substring(16);
        const newDimensionMetadata = this.state.metadata.dimensions.map(dimension => {
            if (dimension.id === dimensionID) {
                dimension.name = value;
            }
            return dimension;
        })
        const newMetadataState = {...this.state.metadata, dimensions: newDimensionMetadata};
        this.setState({metadata: newMetadataState, dimensionsUpdated: true});
    }

    handleDimensionDescriptionChange = event => {
        const value = event.target.value;
        const dimensionID = event.target.name.substring(22);
        const newDimensionMetadata = this.state.metadata.dimensions.map(dimension => {
            if (dimension.id === dimensionID) {
                dimension.description = value;
            }
            return dimension;
        })
        const newMetadataState = {...this.state.metadata, dimensions: newDimensionMetadata};
        this.setState({metadata: newMetadataState, dimensionsUpdated: true});
    }

    handleSimpleEditableListAdd = (stateFieldName) => {
        this.props.dispatch(push(`${this.props.location.pathname}/edit/${stateFieldName}/${this.state.metadata[stateFieldName].length}`));
    }

    handleSimpleEditableListEdit = (editedField, stateFieldName) => {
        this.props.dispatch(push(`${this.props.location.pathname}/edit/${stateFieldName}/${editedField.id}`));
    }

    handleSimpleEditableListDelete = (deletedField, stateFieldName) => {
        const newFieldState = this.state.metadata[stateFieldName].filter(item => item.id !== deletedField.id)
        const newMetadataState = {...this.state.metadata, [stateFieldName]: newFieldState};
        this.setState({metadata: newMetadataState});
    }

    handleSimpleEditableListEditSuccess = (newField, stateFieldName) => {
        let newMetadataState;
        if (newField.id === null) {
            newMetadataState = this.addMetadataField(newField, stateFieldName)
        } else {
            newMetadataState = this.updateMetadataField(newField, stateFieldName)
        }
        this.setState({metadata: newMetadataState, 
            datasetMetadataHasChanges: this.datasetMetadataHasChanges(stateFieldName), 
            versionMetadataHasChanges: this.versionMetadataHasChanges(stateFieldName)
        });
        this.props.dispatch(push(url.resolve("../../../")));
    }

    addMetadataField = (newField, stateFieldName) => {
        const newFieldState = [...this.state.metadata[stateFieldName]];
        newField.id = newFieldState.length;
        newFieldState.push(newField);
        const mappedNewFieldState = this.mapMetadataFieldToState(newFieldState, stateFieldName)
        return {...this.state.metadata, [stateFieldName]: mappedNewFieldState};
    }

    updateMetadataField = (updatedField, stateFieldName) => {
        const newFieldState = this.state.metadata[stateFieldName].map(field => {
            if (field.id === updatedField.id) {
                return updatedField
            }
            return field
        });
        const mappedNewFieldState = this.mapMetadataFieldToState(newFieldState, stateFieldName)
        return {...this.state.metadata, [stateFieldName]: mappedNewFieldState};
    }

    mapMetadataFieldToState = (newState, stateFieldName) => {
        switch (stateFieldName) {
            case ("notices"): {
                return this.mapNoticesToState(newState);
            }
            case("relatedDatasets"):
            case("relatedPublications"):
            case("relatedMethodologies"): {
                return this.mapRelatedContentToState(newState);
            }
            case ("usageNotes"): {
                return this.mapUsageNotesToState(newState);
            }
            case ("latestChanges"): {
                return this.mapLatestChangesToState(newState);
            }
            default: {
                log.add(eventTypes.unexpectedRuntimeError, {message: `Error mapping metadata field to state. Unknown field name '${stateFieldName}'`});
                notifications.add({
                    type: "warning",
                    message: `An when adding metadata item, changes or additions won't be save. Refresh the page and try again`,
                    isDismissable: true
                });
                console.error(`Error mapping metadata field to state. Unknown field name '${stateFieldName}'`)
            }
        }
    }

    handleSimpleEditableListEditCancel = () => {
        this.props.dispatch(push(url.resolve("../../../")));
    }

    datasetMetadataHasChanges = (fieldName) => {
        if (fieldName === "title" ||
            fieldName === "summary" ||
            fieldName === "keywords" ||
            fieldName === "nationalStatistic" ||
            fieldName === "licence" ||
            fieldName === "contactName" ||
            fieldName === "contactEmail" ||
            fieldName === "contactTelephone" ||
            fieldName === "relatedDatasets" ||
            fieldName === "relatedPublication" ||
            fieldName === "relatedMethodologies" ||
            fieldName === "releaseFrequency" ||
            fieldName === "unitOfMeasure" ||
            fieldName === "qmi" ||
            fieldName === "nextReleaseDate") {
                return true;
        }
        return false;
    }

    versionMetadataHasChanges = (fieldName) => {
        if (fieldName === "releaseDate" ||
            fieldName === "notices" ||
            fieldName === "usageNotes" ||
            fieldName === "latestChanges") {
            return true;
        }
        return false;
    }

    handleBackButton = () => {
        const previousUrl = url.resolve("../../");
        this.props.dispatch(push(previousUrl));
    }

    handleSave = async(isSubmittingForReview, isMarkingAsReviewed) => {
        if (!this.state.metadata.releaseDate.value) {
            const newReleaseDateState = {value: "", error: "You must set a release date"};
            console.log(newReleaseDateState);
            const newMetadataState = {...this.state.metadata, releaseDate: newReleaseDateState};
            this.setState({metadata: newMetadataState});
            window.scrollTo(0,0);
            return;
        }

        this.setState({isSaving: true});
        const collectionID = this.props.params.collectionID;
        const datasetID = this.props.params.datasetID;
        const editionID = this.props.params.editionID;
        const versionID = this.props.params.versionID;
        const instanceID = this.state.instanceID;
        const datasetIsInCollection = this.state.datasetIsInCollection;
        const versionIsInCollection = this.state.versionIsInCollection;
        const dimensionsUpdated = this.state.dimensionsUpdated;
        const versionIsPublished = this.state.versionIsPublished;
        const datasetState = this.state.datasetState;
        const addDatasetToCollection = (!isSubmittingForReview || !isMarkingAsReviewed) && 
            (!datasetIsInCollection || datasetState !== "associated") &&
            (datasetIsInCollection !== collectionID);
        const addVersionToCollection = (!isSubmittingForReview || !isMarkingAsReviewed) && !versionIsInCollection;
        const datasetMetadataHasChanges = this.state.datasetMetadataHasChanges;
        const versionMetadataHasChanges = this.state.versionMetadataHasChanges;
        const datasetBody = this.mapDatasetToPutBody();
        const versionBody = this.mapVersionToPutBody();  
        
        let saveDatasetError;
        if (datasetMetadataHasChanges) {
            saveDatasetError = await this.saveDatasetChanges(datasetID, datasetBody)
        }
        if (saveDatasetError) {
            this.setState({isSaving: false});
            this.handleOnSaveError(`There was a problem saving your changes to this dataset`)
            return
        }

        let saveVersionError;
        if (versionMetadataHasChanges) {
            saveVersionError = await this.saveVersionChanges(datasetID, editionID, versionID, versionBody)
        }
        if (saveVersionError) {
            this.setState({isSaving: false});
            this.handleOnSaveError(`There was a problem saving your changes to this version`)
            return
        }

        if (dimensionsUpdated) {
            const saveDimensionsError = await this.saveDimensionChanges(instanceID, this.state.metadata.dimensions);
            if (saveDimensionsError) {
                this.setState({isSaving: false});
                this.handleOnSaveError(`There was a problem saving your changes to this dataset`)
                return
            }
        }

        let datasetToCollectionError;
        if (addDatasetToCollection) {
            datasetToCollectionError = await this.addDatasetToCollection(collectionID, datasetID);
            this.setState({datasetIsInCollection: collectionID, datasetCollectionState: "inProgress"})
        }
        if (datasetToCollectionError) {
            this.setState({isSaving: false});
            this.handleOnSaveError(`There was a problem adding this dataset to your collection`)
            return;
        }

        let versionToCollectionError;
        if (addVersionToCollection) {
            versionToCollectionError = await this.addVersionToCollection(collectionID, datasetID, editionID, versionID);
            this.setState({versionIsInCollection: collectionID})
        }
        if (versionToCollectionError) {
            this.setState({isSaving: false});
            this.handleOnSaveError(`There was a problem adding this version to your collection`)
            return
        }

        if (isSubmittingForReview) {
            const submitDatasetForReviewError = await this.submitDatasetForReview(collectionID, datasetID);
            let submitVersionForReviewError = false;
            if (!versionIsPublished) {
                submitVersionForReviewError = await this.submitVersionForReview(collectionID, datasetID, editionID, versionID);
            }
            if (submitDatasetForReviewError || submitVersionForReviewError) {
                this.setState({isSaving: false});
                this.handleOnSaveError(`There was a problem saving your changes to this dataset`)
                return
            }
        }

        if (isMarkingAsReviewed) {
            const markDatasetAsReviewedError = await this.markDatasetAsReviewed(collectionID, datasetID);
            let markVersionAsReviewedError = false;
            if (!versionIsPublished) {
                markVersionAsReviewedError = await this.markVersionAsReviewed(collectionID, datasetID, editionID, versionID);
            }
            if (markDatasetAsReviewedError || markVersionAsReviewedError) {
                this.setState({isSaving: false});
                this.handleOnSaveError(`There was a problem saving your changes to this dataset`)
                return
            }
        }

        this.setState({isSaving: false});
        notifications.add({
            type: "positive",
            message: `${this.state.metadata.title} saved!`,
            isDismissable: true
        })
    }

    handleSaveClick = () => {
        this.handleSave(false, false);
    }

    handleSubmitForReviewClick = () => {
        this.handleSave(true, false);
    }

    handleMarkAsReviewedClick = () => {
        this.handleSave(false, true);
    }

    handleOnSaveError = (message) => {
        notifications.add({
            type: "warning",
            message: `${message}. You can try again by pressing save.`,
            isDismissable: true
        })
    }

    mapDatasetToPutBody = () => {
        return {
            id: this.props.params.datasetID,
            title: this.state.metadata.title,
            description: this.state.metadata.summary,
            keywords: this.state.metadata.keywords,
            national_statistic: this.state.metadata.nationalStatistic,
            license: this.state.metadata.licence, 
            related_datasets: this.state.metadata.relatedDatasets,
            publications: this.state.metadata.relatedPublications,
            methodologies: this.state.metadata.relatedMethodologies,
            qmi: {
                href: this.state.metadata.qmi
            },
            release_frequency: this.state.metadata.releaseFrequency,
            contacts: [{
                name: this.state.metadata.contactName,
                email: this.state.metadata.contactEmail,
                telephone: this.state.metadata.contactTelephone
            }],
            next_release: this.state.metadata.nextReleaseDate,
            unit_of_measure: this.state.metadata.unitOfMeasure
        }
    }

    mapVersionToPutBody = () => {
        return {
            release_date: this.state.metadata.releaseDate.value,
            alerts: this.state.metadata.notices,
            usage_notes: this.state.metadata.usageNotes,
            lastest_changes: this.state.metadata.latestChanges
        }
    }

    addDatasetToCollection = (collectionID, datasetID) => {
        return collections.addDataset(collectionID, datasetID)
            .catch(error => {
                log.add(eventTypes.requestFailed, {message: `Error adding dataset '${datasetID}' to collection '${this.props.params.collectionID}'. Error: ${JSON.stringify(error)}`});
                console.error(`Error adding dataset '${datasetID}' to collection '${this.props.params.collectionID}'`, error);
                return error;
            });
    }

    addVersionToCollection = (collectionID, datasetID, editionID, versionID) => {
        return collections.addDatasetVersion(collectionID, datasetID, editionID, versionID) 
            .catch(error => {
                log.add(eventTypes.requestFailed, {message: `Error adding version '${datasetID}/editions/${editionID}/versions/${versionID}' to collection '${this.props.params.collectionID}'. Error: ${JSON.stringify(error)}`});
                console.error(`Error adding version '${datasetID}/editions/${editionID}/versions/${versionID}' to collection '${this.props.params.collectionID}'`, error);
                return error;
            });
    }

    saveDatasetChanges = (datasetID, metadata) => {
        return datasets.updateDatasetMetadata(datasetID, metadata)
            .catch(error => {
                log.add(eventTypes.requestFailed, {message: `Error saving dataset '${datasetID}' changes to dataset API. Error: ${JSON.stringify(error)}`});
                console.error(`Error saving dataset '${datasetID}' changes to dataset API '${this.props.params.collectionID}'`, error);
                return error;
            });
    }

    saveVersionChanges = (datasetID, editionID, versionID, metadata) => {
        return datasets.updateVersionMetadata(datasetID, editionID, versionID, metadata)
            .catch(error => {
                log.add(eventTypes.requestFailed, {message: `Error saving version '${datasetID}/editions/${editionID}/versions/${versionID}' changes to dataset API. Error: ${JSON.stringify(error)}`});
                console.error(`Error saving version '${datasetID}/editions/${editionID}/versions/${versionID}' changes to dataset API '${this.props.params.collectionID}'`, error);
                return error;
            })
    }

    saveDimensionChanges = (instanceID, dimensions) => {
        return datasets.updateInstanceDimensions(instanceID, dimensions)
            .catch(error => {
                log.add(eventTypes.requestFailed, {message: `Error saving dimensions on instance '${instanceID}' to dataset API. Error: ${JSON.stringify(error)}`});
                console.error(`Error saving dimensions on instance '${instanceID}' to dataset API '${this.props.params.collectionID}'`, error);
                return error;
            })
    }

    submitDatasetForReview = (collectionID, datasetID) => {
        return collections.setDatasetStatusToComplete(collectionID, datasetID)
            .catch(error => {
                log.add(eventTypes.requestFailed, {message: `Error submitting dataset '${datasetID}' for review. Error: ${JSON.stringify(error)}`});
                console.error(`Error submitting dataset '${datasetID}' for review. Error:`, error);
                return error;
            })
    }

    markDatasetAsReviewed = (collectionID, datasetID) => {
        return collections.setDatasetStatusToReviewed(collectionID, datasetID)
            .catch(error => {
                log.add(eventTypes.requestFailed, {message: `Error marking dataset '${datasetID}' as reviewed. Error: ${JSON.stringify(error)}`});
                console.error(`Error marking dataset '${datasetID}' as reviewed. Error:`, error);
                return error;
            })
    }

    submitVersionForReview = (collectionID, datasetID, editionID, versionID) => {
        return collections.setDatasetVersionStatusToComplete(collectionID, datasetID, editionID, versionID)
            .catch(error => {
                log.add(eventTypes.requestFailed, {message: `Error marking dataset '${datasetID}/editions/${editionID}/versions/${versionID}' as reviewed. Error: ${JSON.stringify(error)}`});
                console.error(`Error marking dataset '${datasetID}/editions/${editionID}/versions/${versionID}' as reviewed. Error:`, error);
                return error;
            })
    }

    markVersionAsReviewed = (collectionID, datasetID, editionID, versionID) => {
        return collections.setDatasetVersionStatusToReviewed(collectionID, datasetID, editionID, versionID)
            .catch(error => {
                log.add(eventTypes.requestFailed, {message: `Error marking dataset '${datasetID}/editions/${editionID}/versions/${versionID}' as reviewed. Error: ${JSON.stringify(error)}`});
                console.error(`Error marking dataset '${datasetID}/editions/${editionID}/versions/${versionID}' as reviewed. Error:`, error);
                return error;
            })
    }

    renderModal = () => {
        const modal = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                data: this.state.metadata[this.props.params.metadataField][this.props.params.metadataItemID],
                handleSuccessClick: this.handleSimpleEditableListEditSuccess,
                handleCancelClick: this.handleSimpleEditableListEditCancel
            })
        })
        return (modal)
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <DatasetMetadata metadata={this.state.metadata} 
                    handleBackButton={this.handleBackButton}
                    handleDateInputChange={this.handleDateInputChange}
                    handleStringInputChange={this.handleStringInputChange}
                    handleDimensionNameChange={this.handleDimensionNameChange}
                    handleDimensionDescriptionChange={this.handleDimensionDescriptionChange}
                    handleNationalStaticticChange={this.handleNationalStaticticChange}
                    handleSimpleEditableListAdd={this.handleSimpleEditableListAdd}
                    handleSimpleEditableListDelete={this.handleSimpleEditableListDelete}
                    handleSimpleEditableListEdit={this.handleSimpleEditableListEdit}
                    handleSave={this.handleSaveClick}
                    isSaving={this.state.isSaving}
                    versionIsPublished={this.state.versionIsPublished}
                    lastEditedBy={this.state.lastEditedBy}
                    disableForm={this.state.disableScreen || this.state.isSaving || this.state.isGettingDatasetMetadata || this.state.isGettingVersionMetadata || this.state.isGettingCollectionData}
                    datasetCollectionState={this.state.datasetCollectionState}
                    handleSubmitForReviewClick={this.handleSubmitForReviewClick}
                    handleMarkAsReviewedClick={this.handleMarkAsReviewedClick}
                />
                
                {this.props.params.metadataField && this.props.params.metadataItemID ? this.renderModal() : null}
            </div>
        )
    }
}

DatasetMetadataController.propTypes = propTypes;

export default DatasetMetadataController;

