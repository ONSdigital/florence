import React, { Component } from "react";
import { push } from "react-router-redux";
import PropTypes from "prop-types";

import date from "../../../utilities/date";
import datasets from "../../../utilities/api-clients/datasets";
import notifications from "../../../utilities/notifications";
import url from "../../../utilities/url";
import log from "../../../utilities/logging/log";
import cookies from "../../../utilities/cookies";

import CantabularMetadata from "./CantabularMetadata";

const propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }),
    params: PropTypes.shape({
        collectionID: PropTypes.string.isRequired,
        datasetID: PropTypes.string.isRequired,
        editionID: PropTypes.string.isRequired,
        versionID: PropTypes.string.isRequired,
        metadataField: PropTypes.string,
        metadataItemID: PropTypes.string,
    }),
    children: PropTypes.element,
    dispatch: PropTypes.func.isRequired,
};

export class CantabularMetadataController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            disableScreen: false,
            isGettingMetadata: false,
            isSaving: false,
            datasetIsInCollection: false,
            versionIsInCollection: false,
            versionIsPublished: false,
            allowPreview: false,
            disableCancel: false,
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
                releaseFrequency: {
                    value: "",
                    error: "",
                },
                edition: "",
                version: 0,
                versionID: "",
                releaseDate: {
                    value: "",
                    error: "",
                },
                nextReleaseDate: "",
                unitOfMeasure: "",
                notices: [],
                dimensions: [],
                usageNotes: [],
                latestChanges: [],
                qmi: "",
            },
            fieldsReturned: {
                title: false,
                summary: false,
                keywords: false,
                nationalStatistic: false,
                licence: false,
                contactName: false,
                contactEmail: false,
                contactTelephone: false,
                relatedDatasets: false,
                relatedPublications: false,
                relatedMethodologies: false,
                releaseFrequency: false,
                releaseDate: false,
                nextReleaseDate: false,
                unitOfMeasure: false,
                notices: false,
                dimensions: false,
                usageNotes: false,
                latestChanges: false,
                qmi: false,
            },
            cantabularMetadata: {
                dataset: {
                    qmi: {},
                    contacts: [
                        {
                            name: "",
                            email: "",
                            telephone: "",
                        },
                    ],
                },
                version: {},
            },
        };
    }

    UNSAFE_componentWillMount() {
        const datasetID = this.props.params.datasetID;
        const editionID = this.props.params.editionID;
        const versionID = this.props.params.versionID;
        this.getMetadata(datasetID, editionID, versionID);
    }

    getMetadata = (datasetID, editionID, versionID) => {
        this.setState({ isGettingMetadata: true });
        return datasets
            .getEditMetadata(datasetID, editionID, versionID)
            .then(metadata => {
                this.setState({ isGettingMetadata: false });
                this.getCantabularMetadata(datasetID, metadata);
            })
            .catch(error => {
                this.setState({
                    isGettingMetadata: false,
                    disableScreen: true,
                    allowPreview: false,
                    disableCancel: false,
                });
                log.event("get metadata: error GETting dataset metadata from controller", log.data({ datasetID, editionID, versionID }), log.error());
                notifications.add({
                    type: "warning",
                    message: `An error occured when getting information about this dataset version metadata. Please try refresh the page`,
                    isDismissable: true,
                });
                console.error("get metadata: error GETting dataset metadata from controller", error);
            });
    };

    getCantabularMetadata = (datasetID, nonCantDatasetMetadata) => {
        return datasets
            .get(datasetID)
            .then(dataset => {
                const cantabularDatasetId = dataset.next.is_based_on["@id"];
                const language = cookies.get("lang") || "en";
                datasets
                    // .getCantabularMetadata(datasetID, cantabularDatasetId, language)
                    // should be removed when the cantabular metadata extractor returns 2021 metadata
                    .getMockCantabularMetadata()
                    .then(cantMetadata => {
                        this.setState({
                            cantabularMetadata: this.marshalCantabularMetadata(cantMetadata),
                        });
                        this.setState({
                            fieldsReturned: this.checksFieldsReturned(cantMetadata),
                        });
                        this.handleGETSuccess(nonCantDatasetMetadata, this.state.cantabularMetadata);
                    })
                    .catch(error => {
                        this.setState({
                            isGettingMetadata: false,
                            disableScreen: true,
                            allowPreview: false,
                            disableCancel: false,
                        });
                        log.event(
                            "get cantabular metadata: error GETting cantabular metadata from cantabular metadata server",
                            log.data({ datasetID, cantabularDatasetId, language }),
                            log.error()
                        );
                        notifications.add({
                            type: "warning",
                            message: `Error occurred during dataset selection, please try again`,
                            isDismissable: true,
                        });
                        console.error("get cantabular metadata: error GETting cantabular metadata from cantabular metadata server", error);
                    });
            })
            .catch(error => {
                this.setState({
                    isGettingMetadata: false,
                    disableScreen: true,
                    allowPreview: false,
                    disableCancel: false,
                });
                log.event("get cantabular dataset id: error GETting cantabular dataset id", log.data({ datasetID }), log.error());
                notifications.add({
                    type: "warning",
                    message: `Error occurred during dataset selection, please try again`,
                    isDismissable: true,
                });
                console.error("get cantabular dataset id: error GETting cantabular dataset id", error);
            });
    };

    mapMetadataToState = (nonCantDatasetMetadata, cantabularMetadata = null) => {
        const dataset = nonCantDatasetMetadata.dataset;
        const version = nonCantDatasetMetadata.version;
        const collectionState = nonCantDatasetMetadata.collection_state.trim();
        try {
            const mappedMetadata = {
                title: !collectionState ? cantabularMetadata.dataset.title : dataset.title,
                summary: !collectionState ? cantabularMetadata.dataset.description : dataset.description,
                keywords: !collectionState
                    ? cantabularMetadata.dataset?.keywords?.join().replace(",", ", ")
                    : dataset?.keywords?.join().replace(",", ", "),
                nationalStatistic: !collectionState ? cantabularMetadata.dataset.national_statistic : dataset.national_statistic,
                licence: !collectionState ? cantabularMetadata.dataset.license : dataset.license,
                relatedDatasets: !collectionState
                    ? this.mapRelatedContentToState(cantabularMetadata.dataset?.related_datasets, this.props.params.datasetID)
                    : this.mapRelatedContentToState(dataset?.related_datasets, dataset.id),
                relatedPublications: !collectionState
                    ? this.mapRelatedContentToState(cantabularMetadata.dataset?.publications, this.props.params.datasetID)
                    : this.mapRelatedContentToState(dataset?.publications, dataset.id),
                relatedMethodologies: dataset.methodologies ? this.mapRelatedContentToState(dataset.methodologies, dataset.id) : [],
                releaseFrequency: {
                    value: dataset.release_frequency || "",
                    error: "",
                },
                unitOfMeasure: !collectionState ? cantabularMetadata.dataset.unit_of_measure : dataset.unit_of_measure,
                nextReleaseDate: dataset.next_release,
                qmi: !collectionState ? cantabularMetadata.dataset.qmi.href : dataset.qmi?.href,
                edition: version.edition,
                version: version.version,
                versionID: version.id,
                releaseDate: {
                    value: version.release_date || "",
                    error: "",
                },
                notices: version.alerts ? this.mapNoticesToState(version.alerts, version.version || version.id) : [],
                dimensions: !collectionState ? cantabularMetadata.version?.dimensions : version?.dimensions,
                usageNotes: version.usage_notes ? this.mapUsageNotesToState(version.usage_notes, version.version || version.id) : [],
                latestChanges: version.latest_changes ? this.mapLatestChangesToState(version.latest_changes, version.version || version.id) : [],
                contactName: !collectionState ? cantabularMetadata.dataset.contacts[0]?.name : dataset.contacts[0]?.name,
                contactEmail: !collectionState ? cantabularMetadata.dataset.contacts[0]?.email : dataset.contacts[0]?.email,
                contactTelephone: !collectionState ? cantabularMetadata.dataset.contacts[0]?.telephone : dataset.contacts[0]?.telephone,
            };
            return {
                metadata: { ...this.state.metadata, ...mappedMetadata },
                collection: nonCantDatasetMetadata.dataset.collection_id || false,
                datasetCollectionState:
                    nonCantDatasetMetadata.collection_state.charAt(0).toLowerCase() + nonCantDatasetMetadata.collection_state.slice(1) || "",
                versionCollectionState:
                    nonCantDatasetMetadata.collection_state.charAt(0).toLowerCase() + nonCantDatasetMetadata.collection_state.slice(1) || "",
                lastEditedBy: nonCantDatasetMetadata.collection_last_edited_by || null,
                versionIsPublished: version.state === "published",
                state: dataset.state,
            };
        } catch (error) {
            log.event("error mapping metadata to to state", log.data({ datasetID: dataset.id, versionID: version.id }), log.error(error));
            notifications.add({
                type: "warning",
                message: `An unexpected error occurred when trying to get data for this dataset version. Try refreshing the page`,
                isDismissable: true,
            });
            console.error(`Error mapping metadata to to state. \n ${error}`);
        }
    };

    checksFieldsReturned = cantResponse => {
        const areMetadataFieldsReturned = {
            title: cantResponse.table_query_result.service.tables[0].name ? true : false,
            summary: cantResponse.table_query_result.service.tables[0].description ? true : false,
            keywords: cantResponse.table_query_result.service.tables[0].vars.length ? true : false,
            nationalStatistic: cantResponse.dataset_query_result.dataset.meta.source.national_statistic_certified ? true : false,
            licence: cantResponse.dataset_query_result.dataset.meta.source.licence ? true : false,
            contactName: cantResponse.dataset_query_result.dataset.meta.source.contact.contact_name ? true : false,
            contactEmail: cantResponse.dataset_query_result.dataset.meta.source.contact.contact_email ? true : false,
            contactTelephone: cantResponse.dataset_query_result.dataset.meta.source.contact.contact_phone ? true : false,
            relatedDatasets: cantResponse.table_query_result.service.tables[0].meta.related_datasets.length ? true : false,
            relatedPublications: cantResponse.table_query_result.service.tables[0].meta.publications.length ? true : false,
            unitOfMeasure: cantResponse.table_query_result.service.tables[0].meta.statistical_unit.statistical_unit ? true : false,
            dimensions: cantResponse.dataset_query_result.dataset.vars.length ? true : false,
            qmi: cantResponse.dataset_query_result.dataset.meta.source.methodology_link ? true : false,
        };
        return { ...this.state.fieldsReturned, ...areMetadataFieldsReturned };
    };

    marshalCantabularMetadata = cantResponse => {
        return {
            dataset: {
                title: `${cantResponse.table_query_result.service.tables[0].name} (${cantResponse.table_query_result.service.tables[0].label})`,
                description: cantResponse.table_query_result.service.tables[0].description,
                keywords: cantResponse.table_query_result.service.tables[0].vars,
                national_statistic:
                    cantResponse.dataset_query_result.dataset.meta.source.national_statistic_certified.toUpperCase() === "Y" ? true : false,
                license: cantResponse.dataset_query_result.dataset.meta.source.licence,
                related_datasets: cantResponse.table_query_result.service.tables[0].meta.related_datasets,
                publications: cantResponse.table_query_result.service.tables[0].meta.publications,
                unit_of_measure: cantResponse.table_query_result.service.tables[0].meta.statistical_unit.statistical_unit,
                qmi: {
                    href: cantResponse.dataset_query_result.dataset.meta.source.methodology_link,
                },
                contacts: [
                    {
                        name: cantResponse.dataset_query_result.dataset.meta.source.contact.contact_name,
                        email: cantResponse.dataset_query_result.dataset.meta.source.contact.contact_email,
                        telephone: cantResponse.dataset_query_result.dataset.meta.source.contact.contact_phone,
                        website: cantResponse.dataset_query_result.dataset.meta.source.contact.contact_website,
                    },
                ],
            },
            version: {
                dimensions: cantResponse.dataset_query_result.dataset.vars.map(dimension => {
                    return {
                        name: dimension.name,
                        description: dimension.description,
                        label: dimension.label,
                    };
                }),
            },
        };
    };

    checksMandatoryFieldsReturnedByMetadataExtractor = (hasTitle, hasDimensions) => {
        if (!hasTitle || !hasDimensions) {
            this.setState({ disableScreen: true, allowPreview: false, disableCancel: true });
            notifications.add({
                type: "warning",
                message: `There has been an error sourcing one or more of the following: dataset title,dimension title, dimension description. Please correct in order to publish.`,
                isDismissable: true,
            });
        }
    };

    handleGETSuccess = (nonCantDatasetMetadata, cantabularMetadata = null) => {
        const mapped = this.mapMetadataToState(nonCantDatasetMetadata, cantabularMetadata);
        if (mapped.state === "associated" && mapped.collection !== this.props.params.collectionID) {
            this.setState({ disableScreen: true });
            notifications.add({
                type: "neutral",
                message: `This dataset is in another collection.`,
                isDismissable: true,
            });
        }
        const isCreated = mapped.state === "created";
        this.setState({ allowPreview: !isCreated, disableCancel: !isCreated });
        this.setState({
            metadata: mapped.metadata,
            datasetIsInCollection: mapped.collection,
            datasetCollectionState: mapped.datasetCollectionState,
            versionCollectionState: mapped.versionCollectionState,
            datasetState: mapped.state,
            lastEditedBy: mapped.lastEditedBy,
            versionIsPublished: mapped.versionIsPublished,
        });

        this.checksMandatoryFieldsReturnedByMetadataExtractor(this.state.fieldsReturned.title, this.state.fieldsReturned.dimensions);
    };

    mapRelatedContentToState = (relatedDatasets, datasetID) => {
        try {
            return relatedDatasets?.map((link, index) => ({
                id: index,
                description: link.description,
                href: link.href,
                title: link.title,
                simpleListHeading: link.title,
                simpleListDescription: link.description,
            }));
        } catch (error) {
            log.event("Error mapping related links to state", log.data({ datasetID: datasetID }), log.error(error));
            // throw an error to let parent mapper catch and display notification
            // this will prevent the page loading with half loaded/mapped data
            throw new Error(`Error mapping related links to state \n ${error}`);
        }
    };

    mapNoticesToState = (notices, versionID) => {
        try {
            return notices?.map((notice, index) => ({
                id: index,
                type: notice.type,
                date: notice.date,
                description: notice.description,
                simpleListHeading: `${notice.type} (${date.format(notice.date, "dd mmmm yyyy")})`,
                simpleListDescription: notice.description,
            }));
        } catch (error) {
            log.event("Error mapping notices to state", log.data({ versionID: versionID }), log.error(error));
            // throw an error to let parent mapper catch and display notification
            // this will prevent the page loading with half loaded/mapped data
            throw new Error(`Error mapping notices to state \n ${error}`);
        }
    };

    mapUsageNotesToState = (usageNotes, versionID) => {
        try {
            return usageNotes?.map((note, index) => ({
                id: index,
                title: note.title,
                note: note.note,
                simpleListHeading: note.title,
                simpleListDescription: note.note,
            }));
        } catch (error) {
            log.event("Error mapping usage notes to state", log.data({ versionID: versionID }), log.error(error));
            // throw an error to let parent mapper catch and display notification
            // this will prevent the page loading with half loaded/mapped data
            throw new Error(`Error mapping usage notes to state \n ${error}`);
        }
    };

    mapLatestChangesToState = (latestChanges, versionID) => {
        try {
            return latestChanges?.map((latestChange, index) => ({
                id: index,
                title: latestChange.title,
                description: latestChange.description,
                simpleListHeading: latestChange.title,
                simpleListDescription: latestChange.description,
            }));
        } catch (error) {
            log.event("Error mapping usage notes to state", log.data({ versionID: versionID }), log.error(error));
            // throw an error to let parent mapper catch and display notification
            // this will prevent the page loading with half loaded/mapped data
            throw new Error(`Error mapping latest changes to state \n ${error}`);
        }
    };

    handleStringInputChange = event => {
        const fieldName = event.target.name;
        const value = event.target.value;
        if (event.target.name === "releaseFrequency") {
            const newMetadataState = { ...this.state.metadata, [fieldName]: { value: value, error: "" } };
            this.setState({
                metadata: newMetadataState,
                datasetMetadataHasChanges: this.datasetMetadataHasChanges(fieldName),
                versionMetadataHasChanges: this.versionMetadataHasChanges(fieldName),
            });
        } else {
            const newMetadataState = { ...this.state.metadata, [fieldName]: value };
            this.setState({
                metadata: newMetadataState,
                datasetMetadataHasChanges: this.datasetMetadataHasChanges(fieldName),
                versionMetadataHasChanges: this.versionMetadataHasChanges(fieldName),
            });
        }
    };

    handleDateInputChange = event => {
        const fieldName = event.target.name;
        const value = event.target.value;
        const ISODate = new Date(value).toISOString();
        const newMetadataState = {
            ...this.state.metadata,
            [fieldName]: { value: ISODate, error: "" },
        };
        this.setState({
            metadata: newMetadataState,
            datasetMetadataHasChanges: this.datasetMetadataHasChanges(fieldName),
            versionMetadataHasChanges: this.versionMetadataHasChanges(fieldName),
        });
    };

    handleNationalStatisticChange = event => {
        const value = event.value === "true" ? true : false;
        const newMetadataState = {
            ...this.state.metadata,
            nationalStatistic: value,
        };
        this.setState({
            metadata: newMetadataState,
            datasetMetadataHasChanges: true,
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
            dimensions: newDimensionMetadata,
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
            dimensions: newDimensionMetadata,
        };
        this.setState({ metadata: newMetadataState, dimensionsUpdated: true });
    };

    handleSimpleEditableListAdd = stateFieldName => {
        const path = `${this.props.location.pathname}/edit/${stateFieldName}/${this.state.metadata[stateFieldName].length}`;
        this.props.dispatch(push(path));
    };

    handleSimpleEditableListEdit = (editedField, stateFieldName) => {
        this.props.dispatch(push(`${this.props.location.pathname}/edit/${stateFieldName}/${editedField.id}`));
    };

    handleSimpleEditableListDelete = (deletedField, stateFieldName) => {
        const newFieldState = this.state.metadata[stateFieldName].filter(item => item.id !== deletedField.id);
        const newMetadataState = {
            ...this.state.metadata,
            [stateFieldName]: newFieldState,
        };
        this.setState({
            metadata: newMetadataState,
            datasetMetadataHasChanges: this.datasetMetadataHasChanges(stateFieldName),
            versionMetadataHasChanges: this.versionMetadataHasChanges(stateFieldName),
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
            versionMetadataHasChanges: this.versionMetadataHasChanges(stateFieldName),
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
            [stateFieldName]: mappedNewFieldState,
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
            [stateFieldName]: mappedNewFieldState,
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
                    isDismissable: true,
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
        const previousUrl = url.resolve("../../../");
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
                    href: this.state.metadata.qmi,
                },
                release_frequency: this.state.metadata.releaseFrequency.value,
                contacts: [
                    {
                        name: this.state.metadata.contactName,
                        email: this.state.metadata.contactEmail,
                        telephone: this.state.metadata.contactTelephone,
                    },
                ],
                next_release: this.state.metadata.nextReleaseDate,
                unit_of_measure: this.state.metadata.unitOfMeasure,
            },
            version: {
                id: this.state.metadata.versionID,
                release_date: this.state.metadata.releaseDate.value,
                alerts: this.state.metadata.notices,
                usage_notes: this.state.metadata.usageNotes,
                lastest_changes: this.state.metadata.latestChanges,
            },
            dimensions: [...this.state.metadata.dimensions],
            collection_id: this.props.params.collectionID,
            collection_state: this.mapCollectionState(isSubmittingForReview, isMarkingAsReviewed),
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

    saveDatasetMetadata = async (isSubmittingForReview, isMarkingAsReviewed) => {
        const body = this.mapMetadataToPutBody(isSubmittingForReview, isMarkingAsReviewed);
        return this.saveMetadata(
            this.props.params.datasetID,
            this.props.params.editionID,
            this.props.params.versionID,
            body,
            isSubmittingForReview,
            isMarkingAsReviewed
        );
    };

    saveMetadata = (datasetID, editionID, versionID, body, isSubmittingForReview, isMarkingAsReviewed) => {
        this.setState({ isSaving: true });
        return datasets
            .putEditMetadata(datasetID, editionID, versionID, body)
            .then(() => {
                this.setState(() => {
                    return { isSaving: false, allowPreview: true, disableCancel: true };
                });

                notifications.add({
                    type: "positive",
                    message: `${this.state.metadata.title} saved!`,
                    isDismissable: true,
                });

                if (isMarkingAsReviewed || isSubmittingForReview) {
                    this.props.dispatch(push("/florence/collections/" + this.props.params.collectionID));
                }
            })
            .catch(error => {
                this.setState({ isSaving: false, allowPreview: false, disableCancel: false });
                log.event("save metadata: error PUTting metadata to controller", log.data({ datasetID, editionID, versionID }), log.error());
                notifications.add({
                    type: "warning",
                    message: `An error occured when saving this dataset version metadata. Please try again`,
                    isDismissable: true,
                });
                console.error("save metadata: error PUTting metadata to controller", error);
            });
    };

    retrieveDatasetMetadata = async () => {
        try {
            const datasetMetadata = await datasets.getEditMetadata(
                this.props.params.datasetID,
                this.props.params.editionID,
                this.props.params.versionID
            );
            this.mapMetadataToState(datasetMetadata);
        } catch (error) {
            log.event(
                "get metadata: error retrieving saved dataset metadata from controller",
                log.data({ datasetID: this.props.params.datasetID, editionID: this.props.params.editionID, versionID: this.props.params.versionID }),
                log.error()
            );
            notifications.add({
                type: "warning",
                message: `An error occured when attempting to retrieve saved dataset metadata. Please try refreshing the page`,
                isDismissable: true,
            });
            console.error("get metadata: error retrieving saved dataset metadata from controller", error);
        }
    };

    checkMandatoryFields = () => {
        if (!this.state.metadata.releaseDate.value) {
            const newReleaseDateState = {
                value: "",
                error: "You must set a release date",
            };
            const newMetadataState = {
                ...this.state.metadata,
                releaseDate: newReleaseDateState,
            };
            this.setState({ metadata: newMetadataState });
            window.scrollTo(0, 0);
        }
        if (!this.state.metadata.releaseFrequency.value) {
            const newReleaseFrequency = {
                value: "",
                error: "You must enter the release frequency",
            };
            const newMetadataState = {
                ...this.state.metadata,
                releaseFrequency: newReleaseFrequency,
            };
            this.setState({ metadata: newMetadataState });
            window.scrollTo(0, 0);
        }
    };

    saveAndRetrieveDatasetMetadata = (isSubmittingForReview, isMarkingAsReviewed) => {
        this.checkMandatoryFields();
        if (this.state.metadata.releaseDate.value && this.state.metadata.releaseFrequency.value) {
            this.saveDatasetMetadata(isSubmittingForReview, isMarkingAsReviewed)
                .then(this.retrieveDatasetMetadata)
                .catch(error => error);
        }
    };

    handleRedirectOnReject = isCancellingPublication => {
        if (isCancellingPublication) {
            notifications.add({
                type: "neutral",
                message: `Dataset selection cancelled`,
                isDismissable: true,
            });
            this.props.dispatch(push("/florence/collections/" + this.props.params.collectionID));
        }
    };

    handleSaveClick = () => {
        this.saveAndRetrieveDatasetMetadata(false, false);
    };

    handleCancelClick = () => {
        this.handleRedirectOnReject(true);
    };

    handleSubmitForReviewClick = () => {
        this.saveAndRetrieveDatasetMetadata(true, false);
    };

    handleMarkAsReviewedClick = () => {
        this.saveAndRetrieveDatasetMetadata(false, true);
    };

    renderModal = () => {
        const modal = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                data: this.state.metadata[this.props.params.metadataField][this.props.params.metadataItemID],
                handleSuccessClick: this.handleSimpleEditableListEditSuccess,
                handleCancelClick: this.handleSimpleEditableListEditCancel,
            });
        });
        return modal;
    };

    render() {
        return (
            <div className="grid grid--justify-center">
                <CantabularMetadata
                    metadata={this.state.metadata}
                    handleBackButton={this.handleBackButton}
                    handleDateInputChange={this.handleDateInputChange}
                    handleStringInputChange={this.handleStringInputChange}
                    handleDimensionNameChange={this.handleDimensionNameChange}
                    handleDimensionDescriptionChange={this.handleDimensionDescriptionChange}
                    handleNationalStatisticChange={this.handleNationalStatisticChange}
                    handleSimpleEditableListAdd={this.handleSimpleEditableListAdd}
                    handleSimpleEditableListDelete={this.handleSimpleEditableListDelete}
                    handleSimpleEditableListEdit={this.handleSimpleEditableListEdit}
                    handleSave={this.handleSaveClick}
                    allowPreview={this.state.allowPreview}
                    disableCancel={this.state.disableCancel}
                    isSaving={this.state.isSaving}
                    versionIsPublished={this.state.versionIsPublished}
                    lastEditedBy={this.state.lastEditedBy}
                    disableForm={this.state.disableScreen || this.state.isSaving || this.state.isGettingMetadata}
                    collectionState={this.state.versionIsPublished ? this.state.datasetCollectionState : this.state.versionCollectionState}
                    handleSubmitForReviewClick={this.handleSubmitForReviewClick}
                    handleMarkAsReviewedClick={this.handleMarkAsReviewedClick}
                    fieldsReturned={this.state.fieldsReturned}
                    handleRedirectOnReject={this.handleCancelClick}
                />

                {this.props.params.metadataField && this.props.params.metadataItemID ? this.renderModal() : null}
            </div>
        );
    }
}

CantabularMetadataController.propTypes = propTypes;

export default CantabularMetadataController;
