import React, { Component } from "react";
import EditHomepage from "./EditHomepage";
import PropTypes from "prop-types";

import collections from "../../../utilities/api-clients/collections";
import homepage from "../../../utilities/api-clients/homepage";
import url from "../../../utilities/url";
import log from "../../../utilities/logging/log";
import notifications from "../../../utilities/notifications";

import { push } from "react-router-redux";

const propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired
    }),
    params: PropTypes.shape({
        collectionID: PropTypes.string.isRequired,
        homepageDataField: PropTypes.string,
        homepageDataFieldID: PropTypes.string
    }),
    children: PropTypes.element,
    dispatch: PropTypes.func.isRequired
};

class EditHomepageController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            initialHomepageContent: {},
            homepageData: {
                featuredContent: [],
                serviceMessage: ""
            },
            collectionState: "",
            isGettingHomepageData: false,
            hasChangesMade: false,
            maximumNumberOfEntries: 4,
            isSaving: false
        };
    }

    componentWillMount() {
        this.getHomepageData();
    }

    getHomepageData() {
        this.setState({ isGettingHomepageData: true });
        return homepage
            .get(this.props.params.collectionID)
            .then(homepageContent => {
                const mappedfeaturedContent = this.mapfeaturedContentToState(homepageContent.featuredContent);
                this.setState({
                    initialHomepageData: homepageContent,
                    homepageData: { featuredContent: mappedfeaturedContent, serviceMessage: homepageContent.serviceMessage },
                    isGettingHomepageData: false
                });
            })
            .catch(error => {
                log.event("Error getting homepage data", log.data({ collectionID: this.props.params.collectionID }), log.error(error));
                const notification = {
                    type: "warning",
                    message: "An error occurred whilst trying to get homepage data.",
                    isDismissable: true
                };
                notifications.add(notification);
                this.setState({ isGettingHomepageData: false });
            });
    }

    mapfeaturedContentToState = featuredContent => {
        try {
            return featuredContent.map((item, index) => {
                return {
                    id: index,
                    description: item.description,
                    uri: item.uri,
                    title: item.title,
                    simpleListHeading: item.title,
                    simpleListDescription: item.description
                };
            });
        } catch (error) {
            log.event("Error mapping highlighted content to state", log.data({ collectionID: this.props.params.collectionID }), log.error(error));
            throw new Error(`Error mapping highlighted content to state \n ${error}`);
        }
    };

    handleBackButton = () => {
        const previousUrl = url.resolve("../../");
        this.props.dispatch(push(previousUrl));
    };

    // Editable List handlers - add, edit, delete, cancel, success implementations
    handleSimpleEditableListAdd = stateFieldName => {
        this.props.dispatch(push(`${this.props.location.pathname}/edit/${stateFieldName}/${this.state.homepageData[stateFieldName].length}`));
    };

    handleSimpleEditableListEdit = (editedField, stateFieldName) => {
        this.props.dispatch(push(`${this.props.location.pathname}/edit/${stateFieldName}/${editedField.id}`));
    };

    handleSimpleEditableListDelete = (deletedField, stateFieldName) => {
        const newFieldState = this.state.homepageData[stateFieldName].filter(item => item.id !== deletedField.id);
        const newHomepageDataState = {
            ...this.state.homepageData,
            [stateFieldName]: newFieldState
        };
        this.setState({
            homepageData: newHomepageDataState,
            hasChangesMade: true
        });
    };

    handleSimpleEditableListEditCancel = () => {
        this.props.dispatch(push(url.resolve("../../../")));
    };

    handleSimpleEditableListEditSuccess = (newField, stateFieldName) => {
        let newHomepageDataState;
        if (newField.id === null) {
            newHomepageDataState = this.addHomepageDataField(newField, stateFieldName);
        } else {
            newHomepageDataState = this.updateHomepageDataField(newField, stateFieldName);
        }
        this.setState({
            homepageData: newHomepageDataState,
            hasChangesMade: this.checkForHomepageDataChanges(stateFieldName)
        });
        this.props.dispatch(push(url.resolve("../../../")));
    };

    addHomepageDataField = (newField, stateFieldName) => {
        const newFieldState = [...this.state.homepageData[stateFieldName]];
        newField.id = newFieldState.length;
        newFieldState.push(newField);
        const mappedNewFieldState = this.mapfeaturedContentToState(newFieldState);
        return {
            ...this.state.homepageData,
            [stateFieldName]: mappedNewFieldState
        };
    };

    updateHomepageDataField = (updatedField, stateFieldName) => {
        const newFieldState = this.state.homepageData[stateFieldName].map(field => {
            if (field.id === updatedField.id) {
                return updatedField;
            }
            return field;
        });
        const mappedNewFieldState = this.mapfeaturedContentToState(newFieldState, stateFieldName);
        return {
            ...this.state.homepageData,
            [stateFieldName]: mappedNewFieldState
        };
    };

    checkForHomepageDataChanges = fieldName => {
        if (fieldName === "featuredContent" || "serviceMessage") {
            return true;
        }
        return this.state.hasChangesMade;
    };

    handleStringInputChange = event => {
        const fieldName = event.target.name;
        const value = event.target.value;
        const newHomepageDataState = { ...this.state.homepageData, [fieldName]: value };
        this.setState({
            homepageData: newHomepageDataState,
            hasChangesMade: this.checkForHomepageDataChanges(fieldName)
        });
    };

    // Review actions handlers
    handleSaveAndPreview = async () => {
        const error = await this.handleSave();
        if (error) {
            this.setState({ isSaving: false });
            this.handleOnSaveError(`There was a problem saving your homepage changes`);
        }
        notifications.add({
            type: "positive",
            message: `Homepage content saved!`,
            isDismissable: true
        });
        this.setState({ isSaving: false });
        // window.location = window.location.origin + "/florence/collections/" + this.props.params.collectionID + "/homepage/preview";
    };

    handleSave = async () => {
        this.setState({ isSaving: true });
        let saveHomepageChangesError = false;
        if (this.state.hasChangesMade) {
            const formattedHomepageData = this.formatHomepageDataForSaving();
            saveHomepageChangesError = await this.saveHomepageChanges(this.props.params.collectionID, formattedHomepageData);
        }
        console.log("handle here");
        return saveHomepageChangesError;
    };

    formatHomepageDataForSaving = () => {
        try {
            const featuredContent = this.state.homepageData.featuredContent.map(entry => ({
                title: entry.title,
                description: entry.description,
                uri: entry.uri
            }));
            const serviceMessage = this.state.homepageData.serviceMessage;
            const initialHomepageData = this.state.initialHomepageData;
            return {
                ...initialHomepageData,
                featuredContent,
                serviceMessage
            };
        } catch (error) {
            this.handleOnSaveError("There was a problem saving your changes");
        }
    };

    saveHomepageChanges = async (collectionID, homepageContent) => {
        collections.savePageContent(collectionID, "/", homepageContent).catch(error => {
            log.event("Error saving homepage content", log.error(error));
            console.error(`Error saving homepage content for '${this.props.params.collectionID}'`, error);
            return error;
        });
    };

    handleSubmitForReview = async () => {
        try {
            const error = await this.handleSave();
            if (error) {
                this.handleOnSaveError(`There was a problem saving your changes`);
            }
            console.log("here");
            await this.submitHomepageChangesForReview(this.props.params.collectionID);
            this.setState({ isSaving: false });
            notifications.add({
                type: "positive",
                message: `Homepage content saved!`,
                isDismissable: true
            });
            window.location = window.location.origin + "/florence/collections/" + this.props.params.collectionID;
        } catch (error) {
            this.handleOnSaveError(`There was a problem saving your changes`);
        }
    };

    submitHomepageChangesForReview = async collectionID => {
        console.log(collectionID);
        try {
            return collections.setPageContentForReview(collectionID, "/");
        } catch (error) {
            log.event(
                "Error submitting homepage content for review",
                log.data({
                    collectionID: collectionID
                }),
                log.error(error)
            );
            console.error(`Error submitting homepage content for review. Collection ID: '${collectionID}' for review. Error:`, error);
            return error;
        }
    };

    handleMarkAsReviewed = async collectionID => {
        console.log(collectionID);
        try {
            return collections.setPageContentAsReviewed(collectionID, "/");
        } catch (error) {
            log.event(
                "Error marking homepage content as approved",
                log.data({
                    collectionID: collectionID
                }),
                log.error(error)
            );
            console.error(`Error submitting homepage content for review. Collection ID: '${collectionID}' for review. Error:`, error);
            return error;
        }
    };

    handleOnSaveError = message => {
        notifications.add({
            type: "warning",
            message: `${message}. You can try again by pressing save.`,
            isDismissable: true
        });
    };

    renderModal = () => {
        const modal = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                data: this.state.homepageData[this.props.params.homepageDataField][this.props.params.homepageDataFieldID],
                handleSuccessClick: this.handleSimpleEditableListEditSuccess,
                handleCancelClick: this.handleSimpleEditableListEditCancel
            });
        });
        return modal;
    };

    render() {
        return (
            <div className="grid grid--justify-center">
                <EditHomepage
                    homepageData={this.state.homepageData}
                    handleBackButton={this.handleBackButton}
                    disableForm={this.state.isGettingHomepageData}
                    isSaving={this.state.isSaving}
                    maximumNumberOfEntries={this.state.maximumNumberOfEntries}
                    handleSimpleEditableListAdd={this.handleSimpleEditableListAdd}
                    handleSimpleEditableListEdit={this.handleSimpleEditableListEdit}
                    handleSimpleEditableListDelete={this.handleSimpleEditableListDelete}
                    handleStringInputChange={this.handleStringInputChange}
                    handleSaveAndPreview={this.handleSaveAndPreview}
                    handleSubmitForReviewClick={this.handleSubmitForReview}
                    handleMarkAsReviewedClick={this.handleMarkAsReviewed}
                    collectionState={this.state.collectionState}
                />

                {this.props.params.homepageDataField && this.props.params.homepageDataFieldID ? this.renderModal() : null}
            </div>
        );
    }
}

EditHomepageController.propTypes = propTypes;

export default EditHomepageController;
