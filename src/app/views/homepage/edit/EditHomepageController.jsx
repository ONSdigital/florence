import React, { Component } from "react";
import EditHomepage from "./EditHomepage";
import PropTypes from "prop-types";
import collections from "../../../utilities/api-clients/collections";
import homepage from "../../../utilities/api-clients/homepage";
import url from "../../../utilities/url";
import log from "../../../utilities/logging/log";
import notifications from "../../../utilities/notifications";
import { push } from "react-router-redux";
import { connect } from "react-redux";

const propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired
    }),
    params: PropTypes.shape({
        collectionID: PropTypes.string.isRequired,
        homepageDataField: PropTypes.string,
        homepageDataFieldID: PropTypes.string
    }),
    userEmail: PropTypes.string,
    currentCollection: PropTypes.object,
    children: PropTypes.element,
    dispatch: PropTypes.func.isRequired
};

export class EditHomepageController extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialHomepageData: {},
            homepageData: {
                featuredContent: [],
                serviceMessage: ""
            },
            collectionState: "",
            lastEditedBy: "",
            formIsDisabled: true,
            hasChangesMade: false,
            maximumNumberOfEntries: 4,
            isSaving: false
        };
    }

    async componentDidMount() {
        await this.setCollectionState();
        await this.getHomepageData();
        this.checkIfHomepageIsInAnotherCollection();
    }

    setCollectionState = async () => {
        await collections
            .getContentCollectionDetails(this.props.params.collectionID)
            .then(collection => {
                const pageHasEvent = collection.hasOwnProperty("eventsByUri") && collection.eventsByUri.hasOwnProperty("/data.json");
                if (pageHasEvent) {
                    const homepageCollectionEventHistory = collection.eventsByUri["/data.json"];
                    const lastEventIndex = homepageCollectionEventHistory.length - 1;
                    const lastEvent = homepageCollectionEventHistory[lastEventIndex];
                    let collectionState = "";

                    switch (lastEvent.type) {
                        case "COMPLETED":
                            collectionState = "complete";
                            break;
                        case "EDITED":
                            collectionState = "inProgress";
                            break;
                        default:
                            collectionState = "reviewed";
                    }

                    this.setState({
                        lastEditedBy: lastEvent.email,
                        collectionState
                    });
                }
                return;
            })
            .catch(error => {
                this.setState({
                    formIsDisabled: true
                });
                log.event(
                    "error retrieving the homepage's collection state",
                    log.data({ collectionID: this.props.params.collectionID }),
                    log.error(error)
                );
                notifications.add({
                    type: "warning",
                    message: `Error retrieving the homepage's collection state. Please try refreshing the page.`,
                    isDismissable: true
                });
            });
    };

    getHomepageData = async () => {
        this.setState({ formIsDisabled: true });
        return homepage
            .get(this.props.params.collectionID)
            .then(homepageData => {
                const mappedfeaturedContent = this.mapfeaturedContentToState(homepageData.featuredContent);
                this.setState({
                    initialHomepageData: homepageData,
                    homepageData: { featuredContent: mappedfeaturedContent, serviceMessage: homepageData.serviceMessage }
                });
                return;
            })
            .catch(error => {
                log.event("Error getting homepage data", log.data({ collectionID: this.props.params.collectionID }), log.error(error));
                notifications.add({
                    type: "warning",
                    message: "An error occurred whilst trying to get homepage data.",
                    isDismissable: true
                });
                this.setState({ formIsDisabled: true });
            });
    };

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

    checkIfHomepageIsInAnotherCollection() {
        collections
            .checkContentIsInCollection("/")
            .then(response => {
                if (response !== this.props.currentCollection.name) {
                    log.event(
                        "the homepage is already being edited in another collection.",
                        log.data({ collectionHomepageIsIn: response }),
                        log.error(response)
                    );
                    notifications.add({
                        type: "neutral",
                        message: `The homepage is already being edited in another collection: ${response}`,
                        isDismissable: true
                    });
                    this.setState({ formIsDisabled: true });
                    return;
                }
                this.setState({ formIsDisabled: false });
            })
            .catch(error => {
                log.event("error occurred when trying to check if homepage is being edited in another collection", log.error(error));
            });
    }

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
        const options = {
            isPreviewing: true,
            isSubmittingForReview: false
        };
        this.handleSave(options);
    };

    handleSubmitForReview = async () => {
        const options = {
            isPreviewing: false,
            isSubmittingForReview: true
        };
        this.handleSave(options);
    };

    handleSave = async actions => {
        let featuredContent = [];
        let serviceMessage = "";
        let initialHomepageData = this.state.initialHomepageData;
        let formattedHomepageData = {};

        this.setState({ isSaving: true });
        let saveHomepageChangesError = false;
        if (this.state.hasChangesMade) {
            featuredContent = this.state.homepageData.featuredContent.map(entry => ({
                title: entry.title,
                description: entry.description,
                uri: entry.uri
            }));
            serviceMessage = this.state.homepageData.serviceMessage;
            initialHomepageData = this.state.initialHomepageData;
            formattedHomepageData = { ...initialHomepageData, featuredContent, serviceMessage };
            saveHomepageChangesError = await this.saveHomepageChanges(this.props.params.collectionID, formattedHomepageData);
        }

        if (saveHomepageChangesError) {
            this.setState({ isSaving: false });
            this.handleOnSaveError(`There was a problem saving your homepage changes`);
        }

        if (actions.isPreviewing) {
            this.redirectTo(`/florence/collections/${this.props.params.collectionID}/homepage/preview`);
        }

        if (actions.isSubmittingForReview) {
            const sendToReviewError = await this.sendToReview(this.props.params.collectionID, "/", formattedHomepageData);
            this.setState({ isSaving: false });
            notifications.add({
                type: "positive",
                message: `Homepage content saved!`,
                isDismissable: true
            });

            if (sendToReviewError) {
                this.setState({ isSaving: false });
                this.handleOnSaveError(`There was a problem saving your homepage changes`);
            } else {
                this.redirectTo(`/florence/collections/${this.props.params.collectionID}`);
            }
        }
    };

    saveHomepageChanges = async (collectionID, homepageData) => {
        await collections.savePageContent(collectionID, "/", homepageData).catch(error => {
            log.event("Error saving homepage content", log.error(error));
            console.error(`Error saving homepage content for '${this.props.params.collectionID}'`, error);
            return error;
        });
    };

    sendToReview = async (collectionID, homepageData) => {
        await collections.setContentStatusToComplete(collectionID, "/", homepageData).catch(error => {
            log.event("Error submitting for review", log.error(error));
            console.error(`Error submitting for review '${this.props.params.collectionID}'`, error);
            return error;
        });
    };

    handleMarkAsReviewed = async () => {
        try {
            await collections.setPageContentAsReviewed(this.props.params.collectionID, "/");
            this.redirectTo(`/florence/collections/${this.props.params.collectionID}`);
        } catch (error) {
            log.event(
                "Error reviewing homepage content",
                log.data({
                    collectionID: this.props.params.collectionID
                }),
                log.error(error)
            );
            console.error(`Error reviewing content. Collection ID: '${this.props.params.collectionID}' for review. Error:`, error);
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

    redirectTo = route => {
        this.props.dispatch(push(route));
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
                    disableForm={this.state.formIsDisabled}
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
                    userEmail={this.props.userEmail}
                    lastEditedBy={this.state.lastEditedBy}
                />
                {this.props.params.homepageDataField && this.props.params.homepageDataFieldID ? this.renderModal() : null}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        userEmail: state.state.user.email,
        currentCollection: state.state.global.workingOn
    };
}

EditHomepageController.propTypes = propTypes;
export default connect(mapStateToProps)(EditHomepageController);
