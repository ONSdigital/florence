import React, { Component } from "react";
import { push } from "react-router-redux";
import PropTypes from "prop-types";
import _ from "lodash";

import date from "../../../utilities/date";
import datasets from "../../../utilities/api-clients/datasets";
import topics from "../../../utilities/api-clients/topics";
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
            canonicalTopicsMenuArr: [],
            secondaryTopicsMenuArr: [],
            allTopicsArr: [],
            topicsErr: "",
            refreshCantabularMetadataState: {
                showUpdateCantabularMetadataPopout: false,
                refreshCantabularMetadata: false,
                showRevertChangesButton: false,
                isRevertChangesClicked: false,
                highlightCantabularMetadataChanges: false,
                cantabularMetadataUpdatedFields: {},
            },
            metadata: {
                title: "",
                summary: "",
                keywords: "",
                nationalStatistic: false,
                licence: "",
                contactName: "",
                contactEmail: {
                    value: "",
                    error: "",
                },
                contactTelephone: {
                    value: "",
                    error: "",
                },
                relatedDatasets: [],
                relatedPublications: [],
                relatedMethodologies: [],
                releaseFrequency: "",
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
                canonicalTopic: {},
                secondaryTopics: [],
                census: false,
                relatedContent: [],
            },
            fieldsReturned: {
                title: false,
                summary: false,
                keywords: false,
                contactName: false,
                contactEmail: false,
                contactTelephone: false,
                unitOfMeasure: false,
                dimensions: false,
            },
            cantabularMetadata: {
                dataset: {
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

    async UNSAFE_componentWillMount() {
        const datasetID = this.props.params.datasetID;
        const editionID = this.props.params.editionID;
        const versionID = this.props.params.versionID;
        await this.getTopics();
        this.getMetadata(datasetID, editionID, versionID);
    }

    getTopics = async () => {
        try {
            const extractTopicItems = ({ items }) => items;
            let rootTopicsArr = await topics.getRootTopics().then(extractTopicItems);
            const getSubtopics = ({ id }) => topics.getSubtopics(id).then(extractTopicItems);
            let allSubtopics = await Promise.all(rootTopicsArr.map(getSubtopics)).then(subtopics => subtopics.flat());
            const extractTopicOptions = ({ id, next: { title } }) => ({ value: id, label: title });
            const rootTopics = {
                id: "primaryTopics",
                label: "Primary topics",
                options: rootTopicsArr.map(extractTopicOptions),
            };
            const subtopics = {
                id: "secondaryTopics",
                label: "Secondary topics",
                options: allSubtopics.map(extractTopicOptions),
            };
            const allTopics = [rootTopics, subtopics];
            this.setState({
                canonicalTopicsMenuArr: [...allTopics],
                secondaryTopicsMenuArr: [...allTopics],
                allTopicsArr: [...rootTopics.options, ...subtopics.options],
            });
        } catch (error) {
            log.event(
                "get topics: error retrieving topic list from dp-topic-api service",
                log.data({
                    datasetID: this.props.params.datasetID,
                    editionID: this.props.params.editionID,
                    versionID: this.props.params.versionID,
                }),
                log.error()
            );
            notifications.add({
                type: "warning",
                message: `An error occurred when attempting to retrieve the topic list. Please try refreshing the page`,
                isDismissable: true,
            });
            console.error("get topics: error retrieving topic list from dp-topic-api service", error);
        }
    };

    getMetadata = (datasetID, editionID, versionID) => {
        this.setState({ isGettingMetadata: true });
        return datasets
            .getEditMetadata(datasetID, editionID, versionID)
            .then(metadata => {
                this.setState({ isGettingMetadata: false });
                this.getCantabularMetadata(datasetID, metadata).then(() =>
                    this.checkDimensions(metadata.version.dimensions, this.state.cantabularMetadata.version.dimensions)
                );
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
                    message: `An error occurred when getting information about this dataset version metadata. Please try refresh the page`,
                    isDismissable: true,
                });
                console.error("get metadata: error GETting dataset metadata from controller", error);
            });
    };

    checkCantabularMetadataUpdate = (datasetMetadata, cantabularMetadata) => {
        const datasetMetadataCantabularFields = {
            dataset: {
                title: "title" in datasetMetadata.dataset ? datasetMetadata.dataset.title : "",
                description: "description" in datasetMetadata.dataset ? datasetMetadata.dataset.description : "",
                keywords: "keywords" in datasetMetadata.dataset ? datasetMetadata.dataset.keywords : [],
                unit_of_measure: "unit_of_measure" in datasetMetadata.dataset ? datasetMetadata.dataset.unit_of_measure : "",
                contacts:
                    "contacts" in datasetMetadata.dataset
                        ? [
                              {
                                  name: datasetMetadata.dataset.contacts?.[0].name || "",
                                  email: datasetMetadata.dataset.contacts?.[0].email || "",
                                  telephone: datasetMetadata.dataset.contacts?.[0].telephone || "",
                              },
                          ]
                        : [
                              {
                                  name: "",
                                  email: "",
                                  telephone: "",
                              },
                          ],
            },
            version: {
                dimensions:
                    "dimensions" in datasetMetadata.version
                        ? datasetMetadata.version.dimensions.map(dimension => ({
                              id: "id" in dimension ? dimension.id : "",
                              name: "name" in dimension ? dimension.name : "",
                              description: "description" in dimension ? dimension.description : "",
                              label: "label" in dimension ? dimension.label : "",
                              quality_statement_text: "quality_statement_text" in dimension ? dimension.quality_statement_text : "",
                              quality_statement_url: "quality_statement_url" in dimension ? dimension.quality_statement_url : "",
                          }))
                        : [],
            },
        };
        if (!_.isEqual(datasetMetadataCantabularFields, cantabularMetadata)) {
            let cantabularMetadataObjFieldsDiff = this.getObjectDiff(datasetMetadataCantabularFields, cantabularMetadata);
            this.mapUpdatedFieldsToState(cantabularMetadataObjFieldsDiff);
            this.setState({
                refreshCantabularMetadataState: { ...this.state.refreshCantabularMetadataState, showUpdateCantabularMetadataPopout: true },
            });
        }
    };

    mapUpdatedFieldsToState = obj => {
        let cantabularMetadataFlatFieldList = ["title", "keywords", "unit_of_measure"];
        if (obj?.dataset?.description) {
            this.setState({
                refreshCantabularMetadataState: {
                    ...this.state.refreshCantabularMetadataState,
                    cantabularMetadataUpdatedFields: {
                        ...this.state.refreshCantabularMetadataState.cantabularMetadataUpdatedFields,
                        description: true,
                    },
                },
            });
        }
        Object.keys(obj).forEach(key => {
            if (cantabularMetadataFlatFieldList.includes(key)) {
                this.setState({
                    refreshCantabularMetadataState: {
                        ...this.state.refreshCantabularMetadataState,
                        cantabularMetadataUpdatedFields: {
                            ...this.state.refreshCantabularMetadataState.cantabularMetadataUpdatedFields,
                            [key]: true,
                        },
                    },
                });
            } else if (key === "contacts") {
                Object.keys(obj[key][0]).forEach(contact => {
                    let contactDetails = `contact${contact.charAt(0).toUpperCase() + contact.slice(1)}`;
                    this.setState({
                        refreshCantabularMetadataState: {
                            ...this.state.refreshCantabularMetadataState,
                            cantabularMetadataUpdatedFields: {
                                ...this.state.refreshCantabularMetadataState.cantabularMetadataUpdatedFields,
                                [contactDetails]: true,
                            },
                        },
                    });
                });
            } else if (key === "dimensions") {
                obj[key].forEach(dimensionObj => {
                    for (const key in dimensionObj) {
                        if (dimensionObj.hasOwnProperty(key) && key !== "id") {
                            dimensionObj[key] = true;
                        }
                    }
                });
                this.setState({
                    refreshCantabularMetadataState: {
                        ...this.state.refreshCantabularMetadataState,
                        cantabularMetadataUpdatedFields: {
                            ...this.state.refreshCantabularMetadataState.cantabularMetadataUpdatedFields,
                            dimensions: [...obj[key]],
                        },
                    },
                });
            }
            if (typeof obj[key] === "object" && obj[key] !== null) {
                this.mapUpdatedFieldsToState(obj[key]);
            }
        });
    };

    getObjectDiff = (object, base) => {
        function changes(object, base) {
            return _.transform(object, function (result, value, key) {
                if (!_.isEqual(value, base[key])) {
                    if (key === "dimensions") {
                        result[key] = _.isObject(value) && _.isObject(base[key]) ? changes(value, base[key]) : value;
                        base[key].forEach((dimension, i) => {
                            result[key][i]["id"] = dimension.id;
                        });
                    } else {
                        result[key] = _.isObject(value) && _.isObject(base[key]) ? changes(value, base[key]) : value;
                    }
                }
            });
        }
        return changes(object, base);
    };

    checkDimensions = (datasetDimensions, cantabularDimensions) => {
        const datasetDimensionsArr = datasetDimensions.map(dimension => dimension.id);
        const cantabularMetadataDimensionsArr = cantabularDimensions.map(dimension => dimension.id);
        let datasetDimensionsErrs = [];
        let cantabularDimensionsErrs = [];
        datasetDimensionsArr.forEach(dimension => {
            if (!cantabularMetadataDimensionsArr.includes(dimension)) {
                datasetDimensionsErrs.push(dimension);
            }
        });
        cantabularMetadataDimensionsArr.forEach(dimension => {
            if (!datasetDimensionsArr.includes(dimension)) {
                cantabularDimensionsErrs.push(dimension);
            }
        });
        if (datasetDimensionsErrs.length > 0) {
            notifications.add({
                type: "neutral",
                message: `Error: dimensions ${datasetDimensionsErrs.join(", ")} present in recipe but not in Cantabular metadata`,
                isDismissable: true,
            });
            console.error(`Error: dimensions ${datasetDimensionsErrs.join(", ")} present in recipe but not in Cantabular metadata`);
        }
        if (cantabularDimensionsErrs.length > 0) {
            notifications.add({
                type: "neutral",
                message: `Error: dimensions ${cantabularDimensionsErrs.join(", ")} present in Cantabular metadata but not in recipe`,
                isDismissable: true,
            });
            console.error(`Error: dimensions ${cantabularDimensionsErrs.join(", ")} present in Cantabular metadata but not in recipe`);
        }
    };

    getCantabularMetadata = (datasetID, nonCantDatasetMetadata) => {
        const language = cookies.get("lang") || "en";
        return datasets
            .getCantabularMetadata(datasetID, language)
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
                    log.data({ datasetID, language }),
                    log.error()
                );
                notifications.add({
                    type: "warning",
                    message: `Error occurred during dataset selection, please try again`,
                    isDismissable: true,
                });
                console.error("get cantabular metadata: error GETting cantabular metadata from cantabular metadata server", error);
            });
    };

    integrateDimensions = (datasetVersionDimensions, cantabularMetadataDimensions, versionID) => {
        try {
            return datasetVersionDimensions.map(versionDimension => {
                let cantabularDimension = cantabularMetadataDimensions.find(cantDimension => cantDimension.id == versionDimension.id);
                return {
                    ...versionDimension,
                    description: cantabularDimension.description,
                    quality_statement_text: cantabularDimension.quality_statement_text,
                    quality_statement_url: cantabularDimension.quality_statement_url,
                    name: cantabularDimension.name,
                    label: cantabularDimension.label,
                };
            });
        } catch (err) {
            log.event("Error integrating Cantabular dimensions with recipe dimensions", log.data({ versionID: versionID }), log.error(err));
            throw new Error(`Error integrating Cantabular dimensions with recipe dimensions \n ${err}`);
        }
    };

    mapMetadataToState = (nonCantDatasetMetadata, cantabularMetadata = null) => {
        const dataset = nonCantDatasetMetadata.dataset;
        const version = nonCantDatasetMetadata.version;
        const collectionState = nonCantDatasetMetadata.collection_state.trim();
        const useCantabularMetadata = !collectionState || this.state.refreshCantabularMetadataState.refreshCantabularMetadata;
        try {
            const mappedMetadata = {
                title: useCantabularMetadata ? cantabularMetadata.dataset.title : dataset.title,
                summary: useCantabularMetadata ? cantabularMetadata.dataset.description : dataset.description,
                keywords: useCantabularMetadata
                    ? cantabularMetadata.dataset?.keywords?.join().replace(",", ", ")
                    : dataset?.keywords?.join().replace(",", ", "),
                nationalStatistic: dataset.national_statistic ? dataset.national_statistic : false,
                licence: dataset.license ? dataset.license : "",
                relatedDatasets: dataset.related_datasets ? this.mapRelatedContentToState(dataset.related_datasets, dataset.id) : [],
                relatedPublications: dataset.publications ? this.mapRelatedContentToState(dataset.publications, dataset.id) : [],
                relatedMethodologies: dataset.methodologies ? this.mapRelatedContentToState(dataset.methodologies, dataset.id) : [],
                releaseFrequency: dataset.release_frequency || "",
                unitOfMeasure: useCantabularMetadata ? cantabularMetadata.dataset.unit_of_measure : dataset.unit_of_measure,
                nextReleaseDate: dataset.next_release || "",
                qmi: dataset.qmi?.href || "",
                edition: version.edition,
                version: version.version,
                versionID: version.id,
                releaseDate: {
                    value: version.release_date || "",
                    error: "",
                },
                notices: version.alerts ? this.mapNoticesToState(version.alerts, version.version || version.id) : [],
                dimensions: useCantabularMetadata
                    ? this.integrateDimensions(version.dimensions, cantabularMetadata.version.dimensions, version.version || version.id)
                    : version.dimensions,
                usageNotes: version.usage_notes ? this.mapUsageNotesToState(version.usage_notes, version.version || version.id) : [],
                latestChanges: version.latest_changes ? this.mapLatestChangesToState(version.latest_changes, version.version || version.id) : [],
                contactName: useCantabularMetadata ? cantabularMetadata.dataset.contacts?.[0].name : dataset.contacts?.[0].name,
                contactEmail: {
                    value: useCantabularMetadata ? cantabularMetadata.dataset.contacts?.[0].email : dataset.contacts?.[0].email,
                    error: "",
                },
                contactTelephone: {
                    value: useCantabularMetadata ? cantabularMetadata.dataset.contacts?.[0].telephone : dataset.contacts?.[0].telephone,
                    error: "",
                },
                canonicalTopic: "canonical_topic" in dataset ? this.state.allTopicsArr.find(topic => topic.value == dataset.canonical_topic) : {},
                secondaryTopics: dataset.subtopics
                    ? dataset.subtopics.map(topicID => this.state.allTopicsArr.find(topic => topic.value == topicID))
                    : [],
                census: dataset.survey ? true : false,
                relatedContent: dataset.related_content ? this.mapRelatedContentToState(dataset.related_content, dataset.id) : [],
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
            title: !!cantResponse.table_query_result.service.tables[0].name,
            summary: !!cantResponse.table_query_result.service.tables[0].description,
            keywords: !!cantResponse.table_query_result.service.tables[0].vars.length,
            contactName: !!cantResponse.dataset_query_result.dataset.meta.source.contact.contact_name,
            contactEmail: !!cantResponse.dataset_query_result.dataset.meta.source.contact.contact_email,
            contactTelephone: !!cantResponse.dataset_query_result.dataset.meta.source.contact.contact_phone,
            unitOfMeasure: !!cantResponse.table_query_result.service.tables[0].meta.statistical_unit.statistical_unit,
            dimensions: !!cantResponse.dataset_query_result.dataset.vars.length,
        };
        return { ...this.state.fieldsReturned, ...areMetadataFieldsReturned };
    };

    marshalCantabularMetadata = cantResponse => {
        return {
            dataset: {
                title: cantResponse.table_query_result.service.tables[0].label,
                description: cantResponse.table_query_result.service.tables[0].description,
                keywords: cantResponse.table_query_result.service.tables[0].vars,
                unit_of_measure: cantResponse.table_query_result.service.tables[0].meta.statistical_unit.statistical_unit,
                contacts: [
                    {
                        name: cantResponse.dataset_query_result.dataset.meta.source.contact.contact_name,
                        email: cantResponse.dataset_query_result.dataset.meta.source.contact.contact_email,
                        telephone: cantResponse.dataset_query_result.dataset.meta.source.contact.contact_phone,
                    },
                ],
            },
            version: {
                dimensions: cantResponse.dataset_query_result.dataset.vars.map(dimension => {
                    return {
                        id: dimension.name,
                        name: dimension.name,
                        description: dimension.description,
                        label: dimension.label,
                        quality_statement_text: dimension.meta.ONS_Variable.quality_statement_text,
                        quality_statement_url: dimension.meta.ONS_Variable.quality_summary_url,
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
        if (
            mapped.datasetCollectionState === "inProgress" &&
            !this.state.refreshCantabularMetadataState.refreshCantabularMetadata &&
            !this.state.refreshCantabularMetadataState.isRevertChangesClicked
        ) {
            this.checkCantabularMetadataUpdate(nonCantDatasetMetadata, cantabularMetadata);
        }
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
        if (this.state.refreshCantabularMetadataState.refreshCantabularMetadata) {
            this.setState({
                refreshCantabularMetadataState: {
                    ...this.state.refreshCantabularMetadataState,
                    refreshCantabularMetadata: false,
                    showUpdateCantabularMetadataPopout: false,
                    showRevertChangesButton: true,
                },
            });
        }
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
        if (["contactEmail", "contactTelephone"].includes(event.target.name)) {
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

    handleRadioGroupComponentChange = event => {
        const fieldName = event.name;
        const value = event.value === "true" ? true : false;
        const newMetadataState = {
            ...this.state.metadata,
            [fieldName]: value,
        };
        this.setState({
            metadata: newMetadataState,
            datasetMetadataHasChanges: this.datasetMetadataHasChanges(fieldName),
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
            case "relatedContent":
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
            fieldName === "nextReleaseDate" ||
            fieldName === "canonicalTopic" ||
            fieldName === "secondaryTopics" ||
            fieldName === "census" ||
            fieldName === "relatedContent"
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
                release_frequency: this.state.metadata.releaseFrequency,
                contacts: [
                    {
                        name: this.state.metadata.contactName,
                        email: this.state.metadata.contactEmail.value,
                        telephone: this.state.metadata.contactTelephone.value,
                    },
                ],
                next_release: this.state.metadata.nextReleaseDate,
                unit_of_measure: this.state.metadata.unitOfMeasure,
                canonical_topic: Object.keys(this.state.metadata.canonicalTopic).length ? this.state.metadata.canonicalTopic.value : "",
                subtopics: this.state.metadata.secondaryTopics.length > 0 ? this.state.metadata.secondaryTopics.map(({ value }) => value) : [],
                survey: this.state.metadata.census ? "census" : "",
                related_content: this.state.metadata.relatedContent,
            },
            version: {
                id: this.state.metadata.versionID,
                release_date: this.state.metadata.releaseDate.value,
                alerts: this.state.metadata.notices,
                usage_notes: this.state.metadata.usageNotes,
                latest_changes: this.state.metadata.latestChanges,
                dimensions: [...this.state.metadata.dimensions],
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
                    message: `An error occurred when saving this dataset version metadata. Please try again`,
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
                message: `An error occurred when attempting to retrieve saved dataset metadata. Please try refreshing the page`,
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
            document.getElementById("release-dates-heading").scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        } else if (!this.state.metadata.contactEmail.value) {
            const newContactEmail = {
                value: "",
                error: "You must enter a contact email",
            };
            const newMetadataState = {
                ...this.state.metadata,
                contactEmail: newContactEmail,
            };
            this.setState({ metadata: newMetadataState });
            document.getElementById("contact-details-heading").scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        } else if (!this.state.metadata.contactTelephone.value) {
            const newContactTelephone = {
                value: "",
                error: "You must enter a contact telephone number",
            };
            const newMetadataState = {
                ...this.state.metadata,
                contactTelephone: newContactTelephone,
            };
            this.setState({ metadata: newMetadataState });
            document.getElementById("contact-details-heading").scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        } else if (this.state.metadata.secondaryTopics.length > 0 && Object.keys(this.state.metadata.canonicalTopic).length == 0) {
            this.setState({ topicsErr: "You cannot enter a secondary topic without a canonical topic" });
            document.getElementById("topic-tags-heading").scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        }
        return true;
    };

    saveAndRetrieveDatasetMetadata = (isSubmittingForReview, isMarkingAsReviewed) => {
        const mandatoryFieldsAreCompleted = this.checkMandatoryFields();
        if (mandatoryFieldsAreCompleted) {
            this.setState({
                refreshCantabularMetadataState: {
                    ...this.state.refreshCantabularMetadataState,
                    refreshCantabularMetadata: false,
                    showUpdateCantabularMetadataPopout: false,
                    showRevertChangesButton: false,
                },
            });
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

    handleCantabularMetadataUpdate = () => {
        this.setState({
            refreshCantabularMetadataState: {
                ...this.state.refreshCantabularMetadataState,
                refreshCantabularMetadata: true,
                highlightCantabularMetadataChanges: true,
            },
        });
        this.getMetadata(this.props.params.datasetID, this.props.params.editionID, this.props.params.versionID);
    };

    handleRevertChangesButton = () => {
        this.setState({
            refreshCantabularMetadataState: {
                ...this.state.refreshCantabularMetadataState,
                refreshCantabularMetadata: false,
                showUpdateCantabularMetadataPopout: false,
                showRevertChangesButton: false,
                isRevertChangesClicked: true,
                highlightCantabularMetadataChanges: false,
            },
        });
        this.getMetadata(this.props.params.datasetID, this.props.params.editionID, this.props.params.versionID);
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
                    handleNationalStatisticChange={this.handleRadioGroupComponentChange}
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
                    canonicalTopicsMenuArr={this.state.canonicalTopicsMenuArr}
                    secondaryTopicsMenuArr={this.state.secondaryTopicsMenuArr}
                    handleCanonicalTopicTagFieldChange={selectedOption => {
                        this.setState({
                            metadata: {
                                ...this.state.metadata,
                                canonicalTopic: selectedOption || {},
                            },
                            topicsErr: "",
                        });
                    }}
                    handleSecondaryTopicTagsFieldChange={selectedOptions => {
                        this.setState({
                            metadata: {
                                ...this.state.metadata,
                                secondaryTopics: selectedOptions,
                            },
                        });
                        if (selectedOptions.length === 0) {
                            this.setState({ topicsErr: "" });
                        }
                    }}
                    topicsErr={this.state.topicsErr}
                    handleCensusContentChange={this.handleRadioGroupComponentChange}
                    refreshCantabularMetadataState={this.state.refreshCantabularMetadataState}
                    handleCantabularMetadataUpdate={this.handleCantabularMetadataUpdate}
                    hideUpdateCantabularMetadataPopout={() =>
                        this.setState({
                            refreshCantabularMetadataState: {
                                ...this.state.refreshCantabularMetadataState,
                                showUpdateCantabularMetadataPopout: false,
                            },
                        })
                    }
                    handleRevertChangesButton={this.handleRevertChangesButton}
                />

                {this.props.params.metadataField && this.props.params.metadataItemID ? this.renderModal() : null}
            </div>
        );
    }
}

CantabularMetadataController.propTypes = propTypes;

export default CantabularMetadataController;
