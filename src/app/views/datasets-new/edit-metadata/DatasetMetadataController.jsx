import React, { Component } from "react";
import { push } from "react-router-redux";
import PropTypes from "prop-types";

import date from "../../../utilities/date";
import datasets from "../../../utilities/api-clients/datasets";
import collections from "../../../utilities/api-clients/collections";
import notifications from "../../../utilities/notifications";
import url from "../../../utilities/url";
import log from "../../../utilities/logging/log";

import DatasetMetadata from "./DatasetMetadata";

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
};

export class DatasetMetadataController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            disableScreen: false,
            isGettingMetadata: false,
            isSaving: false,
            datasetIsInCollection: false,
            versionIsInCollection: false,
            versionIsPublished: false,
            datasetState: "",
            datasetCollectionState: "",
            versionCollectionState: "",
            lastEditedBy: "",
            dimensionsUpdated: false,
            datasetMetadataHasChanges: false,
            versionMetadataHasChanges: false,
            metadata: {
                title: "",
                summary: "",
                keywords: "",
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
                versionID: "",
                releaseDate: {
                    value: "",
                    error: ""
                },
                nextReleaseDate: "",
                unitOfMeasure: "",
                notices: [],
                dimensions: [],
                usageNotes: [],
                latestChanges: [],
                qmi: ""
            }
        };
    }

    componentWillMount() {
        const datasetID = this.props.params.datasetID;
        const editionID = this.props.params.editionID;
        const versionID = this.props.params.versionID;
        //this.getDataset(datasetID);
        //this.getVersion(datasetID, editionID, versionID);
        this.getMetadata(datasetID, editionID, versionID);
    }

    getMetadata = (datasetID, editionID, versionID) => {
        this.setState({ isGettingMetadata: true });
        return datasets
            .getEditMetadata(datasetID, editionID, versionID)
            .then(metadata => {
                this.setState({ isGettingMetadata: false });
                this.handleGETSuccess(metadata);
            })
            .catch(error => {
                this.setState({ isGettingMetadata: false });
                log.event("get metadata: error GETting metadata from controller", log.data({ datasetID, editionID, versionID }), log.error());
                notifications.add({
                    type: "warning",
                    message: `An error occured when getting information about this dataset version metadata. Please try refresh the page`,
                    isDismissable: true
                });
                console.error("get metadata: error GETting metadata from controller", error);
            });
    };

    mapMetadataToState = metadata => {
        const dataset = metadata.dataset;
        const version = metadata.version;
        const dimensions = metadata.dimensions;
        try {
            const mappedMetadata = {
                title: dataset.title,
                summary: dataset.description,
                keywords: dataset.keywords ? dataset.keywords.join().replace(",", ", ") : "",
                nationalStatistic: dataset.national_statistic,
                licence: dataset.license || "",
                relatedDatasets: dataset.related_datasets ? this.mapRelatedContentToState(dataset.related_datasets, dataset.id) : [],
                relatedPublications: dataset.publications ? this.mapRelatedContentToState(dataset.publications, dataset.id) : [],
                relatedMethodologies: dataset.methodologies ? this.mapRelatedContentToState(dataset.methodologies, dataset.id) : [],
                releaseFrequency: dataset.release_frequency || "",
                unitOfMeasure: dataset.unit_of_measure || "",
                nextReleaseDate: dataset.next_release,
                qmi: dataset.qmi ? dataset.qmi.href : "",
                edition: version.edition,
                version: version.version,
                versionID: version.id,
                releaseDate: { value: version.release_date || "", error: "" },
                notices: version.alerts ? this.mapNoticesToState(version.alerts, version.version || version.id) : [],
                dimensions: dimensions.length ? dimensions : version.dimensions,
                usageNotes: version.usage_notes ? this.mapUsageNotesToState(version.usage_notes, version.version || version.id) : [],
                latestChanges: version.latest_changes ? this.mapLatestChangesToState(version.latest_changes, version.version || version.id) : []
            };
            if (dataset.contacts) {
                mappedMetadata.contactName = dataset.contacts[0].name ? dataset.contacts[0].name : "";
                mappedMetadata.contactEmail = dataset.contacts[0].email ? dataset.contacts[0].email : "";
                mappedMetadata.contactTelephone = dataset.contacts[0].telephone ? dataset.contacts[0].telephone : "";
            }
            return {
                metadata: { ...this.state.metadata, ...mappedMetadata },
                collection: metadata.dataset.collection_id || false,
                datasetCollectionState: metadata.collection_state || null,
                versionCollectionState: metadata.collection_state || null,
                lastEditedBy: metadata.collection_last_edited_by || null
            };
        } catch (error) {
            log.event("error mapping metadata to to state", log.data({ datasetID: dataset.id, versionID: version.id }), log.error(error));
            notifications.add({
                type: "warning",
                message: `An unexpected error occurred when trying to get data for this dataset version. Try refreshing the page`,
                isDismissable: true
            });
            console.error(`Error mapping metadata to to state. \n ${error}`);
        }
    };

    handleGETSuccess = response => {
        const mappedMetadata = this.mapMetadataToState(response);
        if (mappedMetadata.state === "associated" && mappedMetadata.collection !== this.props.params.collectionID) {
            this.setState({ disableScreen: true });
            notifications.add({
                type: "neutral",
                message: `This dataset is in another collection.`,
                isDismissable: true
            });
        }
        this.setState({
            metadata: mappedMetadata.metadata,
            datasetIsInCollection: mappedMetadata.collection,
            datasetState: mappedMetadata.state
        });
    };

    // NO LONGER NEEDED
    // getDataset = datasetID => {
    //     datasets.get(datasetID).then(dataset => {
    //         console.log(dataset);
    //         const mappedDataset = this.mapDatasetToState(dataset);
    //         if (mappedDataset.state === "associated" && mappedDataset.collection !== this.props.params.collectionID) {
    //             this.setState({ disableScreen: true });
    //             notifications.add({
    //                 type: "neutral",
    //                 message: `This dataset is in another collection.`,
    //                 isDismissable: true
    //             });
    //         }
    //         if (mappedDataset.collection) {
    //             this.getAndUpdateReviewStateData();
    //         }
    //         this.setState({
    //             metadata: mappedDataset.metadata,
    //             datasetIsInCollection: mappedDataset.collection,
    //             datasetState: mappedDataset.state
    //         });
    //     });
    // };

    // NO LONGER NEEDED
    // mapDatasetToState = datasetResponse => {
    //     try {
    //         const dataset = datasetResponse.next || datasetResponse.current || datasetResponse;

    //         const mappedDataset = {
    //             title: dataset.title,
    //             summary: dataset.description,
    //             keywords: dataset.keywords ? dataset.keywords.join().replace(",", ", ") : "",
    //             nationalStatistic: dataset.national_statistic,
    //             licence: dataset.license || "",
    //             relatedDatasets: dataset.related_datasets ? this.mapRelatedContentToState(dataset.related_datasets, datasetResponse.id) : [],
    //             relatedPublications: dataset.publications ? this.mapRelatedContentToState(dataset.publications, datasetResponse.id) : [],
    //             relatedMethodologies: dataset.methodologies ? this.mapRelatedContentToState(dataset.methodologies, datasetResponse.id) : [],
    //             releaseFrequency: dataset.release_frequency || "",
    //             unitOfMeasure: dataset.unit_of_measure || "",
    //             nextReleaseDate: dataset.next_release,
    //             qmi: dataset.qmi ? dataset.qmi.href : ""
    //         };
    //         if (dataset.contacts) {
    //             mappedDataset.contactName = dataset.contacts[0].name ? dataset.contacts[0].name : "";
    //             mappedDataset.contactEmail = dataset.contacts[0].email ? dataset.contacts[0].email : "";
    //             mappedDataset.contactTelephone = dataset.contacts[0].telephone ? dataset.contacts[0].telephone : "";
    //         }
    //         return {
    //             metadata: { ...this.state.metadata, ...mappedDataset },
    //             collection: dataset.collection_id || false,
    //             state: dataset.state
    //         };
    //     } catch (error) {
    //         log.event("Error mapping dataset to state", log.data({ datasetID: datasetResponse.id }), log.error(error));
    //         notifications.add({
    //             type: "warning",
    //             message: `An unexpected error occurred when trying to get dataset '${datasetResponse.id}'. Try refreshing the page`,
    //             isDismissable: true
    //         });
    //         console.error(`Error mapping dataset '${datasetResponse.id}' to to state. \n ${error}`);
    //     }
    // };

    mapRelatedContentToState = (relatedDatasets, datasetID) => {
        try {
            return relatedDatasets.map((link, index) => {
                return {
                    id: index,
                    description: link.description,
                    href: link.href,
                    title: link.title,
                    simpleListHeading: link.title,
                    simpleListDescription: link.description
                };
            });
        } catch (error) {
            log.event("Error mapping related links to state", log.data({ datasetID: datasetID }), log.error(error));
            // throw an error to let parent mapper catch and display notification
            // this will prevent the page loading with half loaded/mapped data
            throw new Error(`Error mapping related links to state \n ${error}`);
        }
    };

    // NO LONGER NEEDED
    // getVersion = (datasetID, editionID, versionID) => {
    //     datasets.getVersion(datasetID, editionID, versionID).then(version => {
    //         const mappedVersion = this.mapVersionToState(version);
    //         this.setState({
    //             metadata: mappedVersion.metadata,
    //             versionIsInCollection: mappedVersion.collection,
    //             instanceID: mappedVersion.instanceID,
    //             versionIsPublished: mappedVersion.versionIsPublished
    //         });

    //         // if version state is edition-confirmed load in dimensions
    //         // labels and descriptions from last published version
    //         if ("edition-confirmed" === version.state) {
    //             this.getPreviousVersionDimensions(datasetID);
    //         }
    //     });
    // };

    // NO LONGER NEEDED
    // mapVersionToState = version => {
    //     try {
    //         const mappedVersion = {
    //             edition: version.edition,
    //             version: version.version,
    //             releaseDate: { value: version.release_date || "", error: "" },
    //             notices: version.alerts ? this.mapNoticesToState(version.alerts, version.version || version.id) : [],
    //             dimensions: version.dimensions || [],
    //             usageNotes: version.usage_notes ? this.mapUsageNotesToState(version.usage_notes, version.version || version.id) : [],
    //             latestChanges: version.latest_changes ? this.mapLatestChangesToState(version.latest_changes, version.version || version.id) : []
    //         };
    //         return {
    //             metadata: { ...this.state.metadata, ...mappedVersion },
    //             collection: version.collection_id || false,
    //             instanceID: version.id,
    //             versionIsPublished: version.state === "published"
    //         };
    //     } catch (error) {
    //         log.event("Error mapping version to state", log.data({ versionID: version.version || version.id }), log.error(error));
    //         notifications.add({
    //             type: "warning",
    //             message: `An unexpected error occurred when trying to get version '${version.version || version.id}'. Try refreshing the page`,
    //             isDismissable: true
    //         });
    //         console.error(`Error mapping dataset '${version.version || version.id}' to to state. \n ${error}`);
    //     }
    // };

    mapNoticesToState = (notices, versionID) => {
        try {
            return notices.map((notice, index) => {
                return {
                    id: index,
                    type: notice.type,
                    date: notice.date,
                    description: notice.description,
                    simpleListHeading: `${notice.type} (${date.format(notice.date, "dd mmmm yyyy")})`,
                    simpleListDescription: notice.description
                };
            });
        } catch (error) {
            log.event("Error mapping notices to state", log.data({ versionID: versionID }), log.error(error));
            // throw an error to let parent mapper catch and display notification
            // this will prevent the page loading with half loaded/mapped data
            throw new Error(`Error mapping notices to state \n ${error}`);
        }
    };

    mapUsageNotesToState = (usageNotes, versionID) => {
        try {
            return usageNotes.map((note, index) => {
                return {
                    id: index,
                    title: note.title,
                    note: note.note,
                    simpleListHeading: note.title,
                    simpleListDescription: note.note
                };
            });
        } catch (error) {
            log.event("Error mapping usage notes to state", log.data({ versionID: versionID }), log.error(error));
            // throw an error to let parent mapper catch and display notification
            // this will prevent the page loading with half loaded/mapped data
            throw new Error(`Error mapping usage notes to state \n ${error}`);
        }
    };

    mapLatestChangesToState = (latestChanges, versionID) => {
        try {
            return latestChanges.map((latestChange, index) => {
                return {
                    id: index,
                    title: latestChange.title,
                    description: latestChange.description,
                    simpleListHeading: latestChange.title,
                    simpleListDescription: latestChange.description
                };
            });
        } catch (error) {
            log.event("Error mapping usage notes to state", log.data({ versionID: versionID }), log.error(error));
            // throw an error to let parent mapper catch and display notification
            // this will prevent the page loading with half loaded/mapped data
            throw new Error(`Error mapping latest changes to state \n ${error}`);
        }
    };

    // NO LONGER NEEDED
    // getPreviousVersionDimensions = datasetID => {
    //     log.event("getting dimensions from last published version", log.data(datasetID));
    //     datasets
    //         .getLatestVersion(datasetID)
    //         .then(previousVersion => {
    //             const metadata = {
    //                 ...this.state.metadata,
    //                 dimensions: previousVersion.dimensions
    //             };
    //             this.setState({ metadata: metadata });
    //         })
    //         .catch(error => {
    //             log.event("error getting dimensions from last published version", log.data(datasetID), log.error(error));
    //             switch (error.status) {
    //                 case 404: {
    //                     const notification = {
    //                         type: "warning",
    //                         message:
    //                             "Unable to get last published version. Dimension data will not have auto populated. You can try refreshing the page.",
    //                         isDismissable: true
    //                     };
    //                     notifications.add(notification);
    //                     break;
    //                 }
    //                 case "RESPONSE_ERR": {
    //                     const notification = {
    //                         type: "warning",
    //                         message:
    //                             "An error's occurred whilst trying to get last published version. Dimension data will not have auto populated. You can try refreshing the page.",
    //                         isDismissable: true
    //                     };
    //                     notifications.add(notification);
    //                     break;
    //                 }
    //                 case "FETCH_ERR": {
    //                     const notification = {
    //                         type: "warning",
    //                         message:
    //                             "There's been a network error whilst trying to get last published version. Dimension data will not have auto populated. You can try refreshing the page.",
    //                         isDismissable: true
    //                     };
    //                     notifications.add(notification);
    //                     break;
    //                 }
    //                 default: {
    //                     const notification = {
    //                         type: "warning",
    //                         message:
    //                             "An unexpected error's occurred whilst trying to get last published version. Dimension data will not have auto populated. You can try refreshing the page.",
    //                         isDismissable: true
    //                     };
    //                     notifications.add(notification);
    //                     break;
    //                 }
    //             }
    //             console.error(`Error getting latest published version):\n`, error);
    //         });
    // };

    // NO LONGER NEEDED
    // getAndUpdateReviewStateData = () => {
    //     collections.get(this.props.params.collectionID).then(collection => {
    //         if (collection.datasets.length) {
    //             const datasetCollectionState = collection.datasets.length ? this.mapDatasetCollectionStateToState(collection.datasets) : null;
    //             const versionCollectionState = collection.datasetVersions.length
    //                 ? this.mapVersionCollectionStateToState(collection.datasetVersions)
    //                 : null;
    //             this.setState({
    //                 lastEditedBy: versionCollectionState.lastEditedBy,
    //                 datasetCollectionState: datasetCollectionState.reviewState,
    //                 versionCollectionState: versionCollectionState.reviewState
    //             });
    //         }
    //     });
    // };

    // NO LONGER NEEDED
    // mapDatasetCollectionStateToState = datasets => {
    //     try {
    //         const dataset = datasets.find(dataset => {
    //             return dataset.id === this.props.params.datasetID;
    //         });

    //         if (!dataset) {
    //             return { lastEditedBy: null, reviewState: null };
    //         }

    //         //lowercase it so it's consistent with the properties in our state (i.e. "InProgress" = "inProgress"
    //         return {
    //             lastEditedBy: dataset.lastEditedBy,
    //             reviewState: dataset.state.charAt(0).toLowerCase() + dataset.state.slice(1)
    //         };
    //     } catch (error) {
    //         log.event("Error mapping dataset collection state to component state", log.error(error));
    //         notifications.add({
    //             type: "warning",
    //             message: `An unexpected error occurred when trying to get information about this datasets collection state'. Try refreshing the page`,
    //             isDismissable: true
    //         });
    //         console.error(`Error mapping dataset collection state to to state. \n ${error}`);
    //     }
    // };

    // NO LONGER NEEDED
    // mapVersionCollectionStateToState = versions => {
    //     try {
    //         const version = versions.find(version => {
    //             return (
    //                 version.version === this.props.params.versionID &&
    //                 version.edition === this.props.params.editionID &&
    //                 version.id === this.props.params.datasetID
    //             );
    //         });

    //         if (!version) {
    //             return { lastEditedBy: null, reviewState: null };
    //         }

    //         //lowercase it so it's consistent with the properties in our state (i.e. "InProgress" = "inProgress"
    //         return {
    //             lastEditedBy: version.lastEditedBy,
    //             reviewState: version.state.charAt(0).toLowerCase() + version.state.slice(1)
    //         };
    //     } catch (error) {
    //         log.event("Error mapping version collection state to component state", log.error(error));
    //         notifications.add({
    //             type: "warning",
    //             message: `An unexpected error occurred when trying to get information about this versions collection state'. Try refreshing the page`,
    //             isDismissable: true
    //         });
    //         console.error(`Error mapping version collection state to to state. \n ${error}`);
    //     }
    // };

    handleStringInputChange = event => {
        const fieldName = event.target.name;
        const value = event.target.value;
        const newMetadataState = { ...this.state.metadata, [fieldName]: value };
        this.setState({
            metadata: newMetadataState,
            datasetMetadataHasChanges: this.datasetMetadataHasChanges(fieldName),
            versionMetadataHasChanges: this.versionMetadataHasChanges(fieldName)
        });
    };

    handleDateInputChange = event => {
        const fieldName = event.target.name;
        const value = event.target.value;
        const ISODate = new Date(value).toISOString();
        const newMetadataState = {
            ...this.state.metadata,
            [fieldName]: { value: ISODate, error: "" }
        };
        this.setState({
            metadata: newMetadataState,
            datasetMetadataHasChanges: this.datasetMetadataHasChanges(fieldName),
            versionMetadataHasChanges: this.versionMetadataHasChanges(fieldName)
        });
    };

    handleNationalStaticticChange = event => {
        const value = event.value === "true" ? true : false;
        const newMetadataState = {
            ...this.state.metadata,
            nationalStatistic: value
        };
        this.setState({
            metadata: newMetadataState,
            datasetMetadataHasChanges: true
        });
    };

    handleDimensionNameChange = event => {
        const value = event.target.value;
        const dimensionID = event.target.name.substring(16);
        const newDimensionMetadata = this.state.metadata.dimensions.map(dimension => {
            if (dimension.id === dimensionID) {
                dimension.label = value;
            }
            return dimension;
        });
        const newMetadataState = {
            ...this.state.metadata,
            dimensions: newDimensionMetadata
        };
        this.setState({ metadata: newMetadataState, dimensionsUpdated: true });
    };

    handleDimensionDescriptionChange = event => {
        const value = event.target.value;
        const dimensionID = event.target.name.substring(22);
        const newDimensionMetadata = this.state.metadata.dimensions.map(dimension => {
            if (dimension.id === dimensionID) {
                dimension.description = value;
            }
            return dimension;
        });
        const newMetadataState = {
            ...this.state.metadata,
            dimensions: newDimensionMetadata
        };
        this.setState({ metadata: newMetadataState, dimensionsUpdated: true });
    };

    handleSimpleEditableListAdd = stateFieldName => {
        this.props.dispatch(push(`${this.props.location.pathname}/edit/${stateFieldName}/${this.state.metadata[stateFieldName].length}`));
    };

    handleSimpleEditableListEdit = (editedField, stateFieldName) => {
        this.props.dispatch(push(`${this.props.location.pathname}/edit/${stateFieldName}/${editedField.id}`));
    };

    handleSimpleEditableListDelete = (deletedField, stateFieldName) => {
        const newFieldState = this.state.metadata[stateFieldName].filter(item => item.id !== deletedField.id);
        const newMetadataState = {
            ...this.state.metadata,
            [stateFieldName]: newFieldState
        };
        this.setState({
            metadata: newMetadataState,
            datasetMetadataHasChanges: this.datasetMetadataHasChanges(stateFieldName),
            versionMetadataHasChanges: this.versionMetadataHasChanges(stateFieldName)
        });
    };

    handleSimpleEditableListEditSuccess = (newField, stateFieldName) => {
        let newMetadataState;
        if (newField.id === null) {
            newMetadataState = this.addMetadataField(newField, stateFieldName);
        } else {
            newMetadataState = this.updateMetadataField(newField, stateFieldName);
        }
        this.setState({
            metadata: newMetadataState,
            datasetMetadataHasChanges: this.datasetMetadataHasChanges(stateFieldName),
            versionMetadataHasChanges: this.versionMetadataHasChanges(stateFieldName)
        });
        this.props.dispatch(push(url.resolve("../../../")));
    };

    addMetadataField = (newField, stateFieldName) => {
        const newFieldState = [...this.state.metadata[stateFieldName]];
        newField.id = newFieldState.length;
        newFieldState.push(newField);
        const mappedNewFieldState = this.mapMetadataFieldToState(newFieldState, stateFieldName);
        return {
            ...this.state.metadata,
            [stateFieldName]: mappedNewFieldState
        };
    };

    updateMetadataField = (updatedField, stateFieldName) => {
        const newFieldState = this.state.metadata[stateFieldName].map(field => {
            if (field.id === updatedField.id) {
                return updatedField;
            }
            return field;
        });
        const mappedNewFieldState = this.mapMetadataFieldToState(newFieldState, stateFieldName);
        return {
            ...this.state.metadata,
            [stateFieldName]: mappedNewFieldState
        };
    };

    mapMetadataFieldToState = (newState, stateFieldName) => {
        switch (stateFieldName) {
            case "notices": {
                return this.mapNoticesToState(newState);
            }
            case "relatedDatasets":
            case "relatedPublications":
            case "relatedMethodologies": {
                return this.mapRelatedContentToState(newState);
            }
            case "usageNotes": {
                return this.mapUsageNotesToState(newState);
            }
            case "latestChanges": {
                return this.mapLatestChangesToState(newState);
            }
            default: {
                log.event("Error mapping metadata field to state. Unknown field name.", log.data({ fieldName: stateFieldName }), log.error());
                notifications.add({
                    type: "warning",
                    message: `An when adding metadata item, changes or additions won't be save. Refresh the page and try again`,
                    isDismissable: true
                });
                console.error(`Error mapping metadata field to state. Unknown field name '${stateFieldName}'`);
            }
        }
    };

    handleSimpleEditableListEditCancel = () => {
        this.props.dispatch(push(url.resolve("../../../")));
    };

    datasetMetadataHasChanges = fieldName => {
        if (
            fieldName === "title" ||
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
            fieldName === "nextReleaseDate"
        ) {
            return true;
        }
        return this.state.datasetMetadataHasChanges;
    };

    versionMetadataHasChanges = fieldName => {
        if (fieldName === "releaseDate" || fieldName === "notices" || fieldName === "usageNotes" || fieldName === "latestChanges") {
            return true;
        }
        return this.state.versionMetadataHasChanges;
    };

    handleBackButton = () => {
        const previousUrl = url.resolve("../../");
        this.props.dispatch(push(previousUrl));
    };

    mapMetadataToPutBody = (isSubmittingForReview, isMarkingAsReviewed) => {
        return {
            dataset: {
                id: this.props.params.datasetID,
                title: this.state.metadata.title,
                description: this.state.metadata.summary,
                keywords: this.state.metadata.keywords ? this.state.metadata.keywords.split(", ") : [],
                national_statistic: this.state.metadata.nationalStatistic,
                license: this.state.metadata.licence,
                related_datasets: this.state.metadata.relatedDatasets,
                publications: this.state.metadata.relatedPublications,
                methodologies: this.state.metadata.relatedMethodologies,
                qmi: {
                    href: this.state.metadata.qmi
                },
                release_frequency: this.state.metadata.releaseFrequency,
                contacts: [
                    {
                        name: this.state.metadata.contactName,
                        email: this.state.metadata.contactEmail,
                        telephone: this.state.metadata.contactTelephone
                    }
                ],
                next_release: this.state.metadata.nextReleaseDate,
                unit_of_measure: this.state.metadata.unitOfMeasure
            },
            version: {
                id: this.state.metadata.versionID,
                release_date: this.state.metadata.releaseDate.value,
                alerts: this.state.metadata.notices,
                usage_notes: this.state.metadata.usageNotes,
                lastest_changes: this.state.metadata.latestChanges
            },
            dimensions: [...this.state.metadata.dimensions],
            collection_id: this.props.params.collectionID,
            collection_state: this.mapCollectionState(isSubmittingForReview, isMarkingAsReviewed)
        };
    };

    mapCollectionState = (isSubmittingForReview, isMarkingAsReviewed) => {
        const StatusInProgress = "InProgress";
        const StatusComplete = "Complete";
        const StatusReviewed = "Reviewed";
        if (isSubmittingForReview) {
            return StatusComplete;
        }
        if (isMarkingAsReviewed) {
            return StatusReviewed;
        }
        return StatusInProgress;
    };

    saveMetadata = (datasetID, editionID, versionID, body, isSubmittingForReview, isMarkingAsReviewed) => {
        this.setState({ isSaving: true });
        return datasets
            .putEditMetadata(datasetID, editionID, versionID, body)
            .then(() => {
                this.setState(() => {
                    return { isSaving: false };
                });

                notifications.add({
                    type: "positive",
                    message: `${this.state.metadata.title} saved!`,
                    isDismissable: true
                });

                if (isMarkingAsReviewed || isSubmittingForReview) {
                    this.props.dispatch(push("/florence/collections/" + this.props.params.collectionID));
                }
            })
            .catch(error => {
                this.setState({ isSaving: false });
                log.event("save metadata: error PUTting metadata to controller", log.data({ datasetID, editionID, versionID }), log.error());
                notifications.add({
                    type: "warning",
                    message: `An error occured when saving this dataset version metadata. Please try again`,
                    isDismissable: true
                });
                console.error("save metadata: error PUTting metadata to controller", error);
            });
    };

    handleSave = (isSubmittingForReview, isMarkingAsReviewed) => {
        console.log("handle save called");
        if (!this.state.metadata.releaseDate.value) {
            const newReleaseDateState = {
                value: "",
                error: "You must set a release date"
            };
            const newMetadataState = {
                ...this.state.metadata,
                releaseDate: newReleaseDateState
            };
            this.setState({ metadata: newMetadataState });
            window.scrollTo(0, 0);
            return;
        }

        const datasetID = this.props.params.datasetID;
        const editionID = this.props.params.editionID;
        const versionID = this.props.params.versionID;
        const body = this.mapMetadataToPutBody(isSubmittingForReview, isMarkingAsReviewed);
        console.log("BODY >>>", body);

        this.saveMetadata(datasetID, editionID, versionID, body, isSubmittingForReview, isMarkingAsReviewed);
    };

    // NOT NEEDED
    // handleSave = async (isSubmittingForReview, isMarkingAsReviewed) => {
    //     if (!this.state.metadata.releaseDate.value) {
    //         const newReleaseDateState = {
    //             value: "",
    //             error: "You must set a release date"
    //         };
    //         const newMetadataState = {
    //             ...this.state.metadata,
    //             releaseDate: newReleaseDateState
    //         };
    //         this.setState({ metadata: newMetadataState });
    //         window.scrollTo(0, 0);
    //         return;
    //     }

    //     this.setState({ isSaving: true });
    //     const collectionID = this.props.params.collectionID;
    //     const datasetID = this.props.params.datasetID;
    //     const editionID = this.props.params.editionID;
    //     const versionID = this.props.params.versionID;
    //     const instanceID = this.state.instanceID;
    //     const datasetIsInCollection = this.state.datasetIsInCollection;
    //     const versionIsInCollection = this.state.versionIsInCollection;
    //     const dimensionsUpdated = this.state.dimensionsUpdated;
    //     const versionIsPublished = this.state.versionIsPublished;
    //     const datasetState = this.state.datasetState;
    //     const addDatasetToCollection =
    //         (!isSubmittingForReview || !isMarkingAsReviewed) &&
    //         (!datasetIsInCollection || datasetState !== "associated") &&
    //         datasetIsInCollection !== collectionID;
    //     const addVersionToCollection = (!isSubmittingForReview || !isMarkingAsReviewed) && !versionIsInCollection;
    //     const datasetMetadataHasChanges = this.state.datasetMetadataHasChanges;
    //     const versionMetadataHasChanges = this.state.versionMetadataHasChanges;
    //     const datasetBody = this.mapDatasetToPutBody();
    //     const versionBody = this.mapVersionToPutBody();

    //     let saveDatasetError = false;
    //     if (datasetMetadataHasChanges) {
    //         saveDatasetError = await this.saveDatasetChanges(datasetID, datasetBody);
    //     }
    //     if (saveDatasetError) {
    //         this.setState({ isSaving: false });
    //         this.handleOnSaveError(`There was a problem saving your changes to this dataset`);
    //         return;
    //     }

    //     let saveVersionError = false;
    //     if (versionMetadataHasChanges) {
    //         saveVersionError = await this.saveVersionChanges(datasetID, editionID, versionID, versionBody);
    //     }
    //     if (saveVersionError) {
    //         this.setState({ isSaving: false });
    //         this.handleOnSaveError(`There was a problem saving your changes to this version`);
    //         return;
    //     }

    //     if (dimensionsUpdated) {
    //         const saveDimensionsError = await this.saveDimensionChanges(instanceID, this.state.metadata.dimensions);
    //         if (saveDimensionsError) {
    //             this.setState({ isSaving: false });
    //             this.handleOnSaveError(`There was a problem saving your changes to this dataset`);
    //             return;
    //         }
    //     }

    //     if (addDatasetToCollection) {
    //         let datasetToCollectionError = false;
    //         datasetToCollectionError = await this.addDatasetToCollection(collectionID, datasetID);
    //         if (datasetToCollectionError) {
    //             this.setState({ isSaving: false });
    //             this.handleOnSaveError(`There was a problem adding this dataset to your collection`);
    //             return;
    //         } else {
    //             this.setState({
    //                 datasetIsInCollection: collectionID,
    //                 datasetCollectionState: "inProgress"
    //             });
    //         }
    //     }

    //     if (addVersionToCollection) {
    //         let versionToCollectionError = false;
    //         versionToCollectionError = await this.addVersionToCollection(collectionID, datasetID, editionID, versionID);
    //         if (versionToCollectionError) {
    //             this.setState({ isSaving: false });
    //             this.handleOnSaveError(`There was a problem adding this version to your collection`);
    //             return;
    //         } else {
    //             this.setState({ versionIsInCollection: collectionID });
    //         }
    //     }

    //     if (isSubmittingForReview) {
    //         const submitDatasetForReviewError = await this.submitDatasetForReview(collectionID, datasetID);
    //         let submitVersionForReviewError = false;
    //         if (!versionIsPublished) {
    //             submitVersionForReviewError = await this.submitVersionForReview(collectionID, datasetID, editionID, versionID);
    //         }
    //         if (submitDatasetForReviewError || submitVersionForReviewError) {
    //             this.setState({ isSaving: false });
    //             this.handleOnSaveError(`There was a problem saving your changes to this dataset`);
    //             return;
    //         }
    //     }

    //     if (isMarkingAsReviewed) {
    //         const markDatasetAsReviewedError = await this.markDatasetAsReviewed(collectionID, datasetID);
    //         let markVersionAsReviewedError = false;
    //         if (!versionIsPublished) {
    //             markVersionAsReviewedError = await this.markVersionAsReviewed(collectionID, datasetID, editionID, versionID);
    //         }
    //         if (markDatasetAsReviewedError || markVersionAsReviewedError) {
    //             this.setState({ isSaving: false });
    //             this.handleOnSaveError(`There was a problem saving your changes to this dataset`);
    //             return;
    //         }
    //     }

    //     this.setState({ isSaving: false });
    //     notifications.add({
    //         type: "positive",
    //         message: `${this.state.metadata.title} saved!`,
    //         isDismissable: true
    //     });
    //     if (isMarkingAsReviewed || isSubmittingForReview) {
    //         window.location = window.location.origin + "/florence/collections/" + this.props.params.collectionID;
    //     }
    // };

    handleSaveClick = () => {
        this.handleSave(false, false);
    };

    handleSubmitForReviewClick = () => {
        this.handleSave(true, false);
    };

    handleMarkAsReviewedClick = () => {
        this.handleSave(false, true);
    };

    handleOnSaveError = message => {
        notifications.add({
            type: "warning",
            message: `${message}. You can try again by pressing save.`,
            isDismissable: true
        });
    };

    mapDatasetToPutBody = () => {
        return {
            id: this.props.params.datasetID,
            title: this.state.metadata.title,
            description: this.state.metadata.summary,
            keywords: this.state.metadata.keywords ? this.state.metadata.keywords.split(", ") : [],
            national_statistic: this.state.metadata.nationalStatistic,
            license: this.state.metadata.licence,
            related_datasets: this.state.metadata.relatedDatasets,
            publications: this.state.metadata.relatedPublications,
            methodologies: this.state.metadata.relatedMethodologies,
            qmi: {
                href: this.state.metadata.qmi
            },
            release_frequency: this.state.metadata.releaseFrequency,
            contacts: [
                {
                    name: this.state.metadata.contactName,
                    email: this.state.metadata.contactEmail,
                    telephone: this.state.metadata.contactTelephone
                }
            ],
            next_release: this.state.metadata.nextReleaseDate,
            unit_of_measure: this.state.metadata.unitOfMeasure
        };
    };

    mapVersionToPutBody = () => {
        return {
            release_date: this.state.metadata.releaseDate.value,
            alerts: this.state.metadata.notices,
            usage_notes: this.state.metadata.usageNotes,
            lastest_changes: this.state.metadata.latestChanges
        };
    };

    addDatasetToCollection = (collectionID, datasetID) => {
        return collections.addDataset(collectionID, datasetID).catch(error => {
            log.event("Error adding dataset to collection", log.data({ collectionID: collectionID, datasetID: datasetID }, log.error(error)));
            console.error(`Error adding dataset '${datasetID}' to collection '${this.props.params.collectionID}'`, error);
            return error;
        });
    };

    addVersionToCollection = (collectionID, datasetID, editionID, versionID) => {
        return collections.addDatasetVersion(collectionID, datasetID, editionID, versionID).catch(error => {
            log.event(
                "Error adding version to collection",
                log.data({
                    collectionID: collectionID,
                    version: `${datasetID}/editions/${editionID}/versions/${versionID}`
                }),
                log.error(error)
            );
            console.error(
                `Error adding version '${datasetID}/editions/${editionID}/versions/${versionID}' to collection '${this.props.params.collectionID}'`,
                error
            );
            return error;
        });
    };

    saveDatasetChanges = (datasetID, metadata) => {
        return datasets.updateDatasetMetadata(datasetID, metadata).catch(error => {
            log.event("Error saving dataset changes to dataset API", log.data({ datasetID: datasetID }), log.error(error));
            console.error(`Error saving dataset '${datasetID}' changes to dataset API '${this.props.params.collectionID}'`, error);
            return error;
        });
    };

    saveVersionChanges = (datasetID, editionID, versionID, metadata) => {
        return datasets.updateVersionMetadata(datasetID, editionID, versionID, metadata).catch(error => {
            log.event(
                "Error saving version changes to dataset API",
                log.data({
                    version: `${datasetID}/editions/${editionID}/versions/${versionID}`
                }),
                log.error(error)
            );
            console.error(
                `Error saving version '${datasetID}/editions/${editionID}/versions/${versionID}' changes to dataset API '${this.props.params.collectionID}'`,
                error
            );
            return error;
        });
    };

    saveDimensionChanges = (instanceID, dimensions) => {
        return datasets.updateInstanceDimensions(instanceID, dimensions).catch(error => {
            log.event("Error saving dimensions on instance to dataset API", log.data({ instanceID: instanceID }), log.error(error));
            console.error(`Error saving dimensions on instance '${instanceID}' to dataset API '${this.props.params.collectionID}'`, error);
            return error;
        });
    };

    submitDatasetForReview = (collectionID, datasetID) => {
        return collections.setDatasetStatusToComplete(collectionID, datasetID).catch(error => {
            log.event(
                "Error submitting dataset for review",
                log.data({
                    collectionID: collectionID,
                    datasetID: datasetID
                }),
                log.error(error)
            );
            console.error(`Error submitting dataset '${datasetID}' for review. Error:`, error);
            return error;
        });
    };

    markDatasetAsReviewed = (collectionID, datasetID) => {
        return collections.setDatasetStatusToReviewed(collectionID, datasetID).catch(error => {
            log.event(
                "Error marking dataset as reviewed",
                log.data({
                    collectionID: collectionID,
                    datasetID: datasetID
                }),
                log.error(error)
            );
            console.error(`Error marking dataset '${datasetID}' as reviewed. Error:`, error);
            return error;
        });
    };

    submitVersionForReview = (collectionID, datasetID, editionID, versionID) => {
        return collections.setDatasetVersionStatusToComplete(collectionID, datasetID, editionID, versionID).catch(error => {
            log.event(
                "Error submitting version for review",
                log.data({
                    collectionID: collectionID,
                    version: `${datasetID}/editions/${editionID}/versions/${versionID}`
                }),
                log.error(error)
            );
            console.error(`Error marking dataset '${datasetID}/editions/${editionID}/versions/${versionID}' as reviewed. Error:`, error);
            return error;
        });
    };

    markVersionAsReviewed = (collectionID, datasetID, editionID, versionID) => {
        return collections.setDatasetVersionStatusToReviewed(collectionID, datasetID, editionID, versionID).catch(error => {
            log.event(
                "Error marking version as reviewed",
                log.data({
                    collectionID: collectionID,
                    version: `${datasetID}/editions/${editionID}/versions/${versionID}`
                }),
                log.error(error)
            );
            console.error(`Error marking dataset '${datasetID}/editions/${editionID}/versions/${versionID}' as reviewed. Error:`, error);
            return error;
        });
    };

    renderModal = () => {
        const modal = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                data: this.state.metadata[this.props.params.metadataField][this.props.params.metadataItemID],
                handleSuccessClick: this.handleSimpleEditableListEditSuccess,
                handleCancelClick: this.handleSimpleEditableListEditCancel
            });
        });
        return modal;
    };

    render() {
        return (
            <div className="grid grid--justify-center">
                <DatasetMetadata
                    metadata={this.state.metadata}
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
                    disableForm={this.state.disableScreen || this.state.isSaving || this.state.isGettingMetadata}
                    collectionState={this.state.versionIsPublished ? this.state.datasetCollectionState : this.state.versionCollectionState}
                    handleSubmitForReviewClick={this.handleSubmitForReviewClick}
                    handleMarkAsReviewedClick={this.handleMarkAsReviewedClick}
                />

                {this.props.params.metadataField && this.props.params.metadataItemID ? this.renderModal() : null}
            </div>
        );
    }
}

DatasetMetadataController.propTypes = propTypes;

export default DatasetMetadataController;
