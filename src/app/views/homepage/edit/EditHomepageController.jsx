import React, { Component } from "react";
import EditHomepage from "./EditHomepage";
import PropTypes from "prop-types";

import url from "../../../utilities/url";
import notifications from "../../../utilities/notifications";
import log from "../../../utilities/logging/log";

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
            homepageData: {
                highlightedContent: [],
                serviceMessage: ""
            },
            isGettingHomepageData: false,
            hasChangesMade: false,
            maximumNumberOfEntries: 4
        };
    }

    componentWillMount() {
        this.getHomepageData();
    }

    getHomepageData() {
        this.setState({ isGettingHomepageData: true });
        // API call to be set up at a later point
        const mockAPIResponse = {
            highlightedContent: [
                {
                    title: "Weekly deaths",
                    description: "The most up-to-date provisional figures for deaths involving the coronavirus (COVID-19) in England and Wales.",
                    uri: "/",
                    image: null
                },
                {
                    title: "Coronavirus - faster indicators",
                    description: "The latest data and experimental indicators on the UK economy and society.",
                    uri: "/",
                    image: null
                },
                {
                    title: "Coronavirus roundup",
                    description: "Our summary of the latest data and analysis related to the coronavirus pandemic.",
                    uri: "/",
                    image: null
                },
                {
                    title: "ONS blogs",
                    description: "Find out more about the work ONS is doing to respond to the challenge of the pandemic.",
                    uri: "/",
                    image: null
                }
            ],
            serviceMessage: "This is a default service message for mock testing"
        };

        const mappedHighlightedContent = this.mapHighlightedContentToState(mockAPIResponse.highlightedContent);

        this.setState({
            homepageData: { highlightedContent: mappedHighlightedContent, serviceMessage: mockAPIResponse.serviceMessage },
            isGettingHomepageData: false
        });
    }

    handleBackButton = () => {
        const previousUrl = url.resolve("../../");
        this.props.dispatch(push(previousUrl));
    };

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

    checkForHomepageDataChnges = fieldName => {
        if (fieldName === "highlightedContent") {
            return true;
        }
        return this.state.hasChangesMade;
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
            hasChangesMade: this.checkForHomepageDataChnges(stateFieldName)
        });
        this.props.dispatch(push(url.resolve("../../../")));
    };

    addHomepageDataField = (newField, stateFieldName) => {
        const newFieldState = [...this.state.homepageData[stateFieldName]];
        newField.id = newFieldState.length;
        newFieldState.push(newField);
        const mappedNewFieldState = this.mapHighlightedContentToState(newFieldState);
        return {
            ...this.state.homepageData,
            [stateFieldName]: mappedNewFieldState
        };
    };

    mapHighlightedContentToState = highlightedContent => {
        try {
            return highlightedContent.map((item, index) => {
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
            // throw an error to let parent mapper catch and display notification
            // this will prevent the page loading with half loaded/mapped data
            throw new Error(`Error mapping highlighted content to state \n ${error}`);
        }
    };

    updateHomepageDataField = (updatedField, stateFieldName) => {
        const newFieldState = this.state.homepageData[stateFieldName].map(field => {
            if (field.id === updatedField.id) {
                return updatedField;
            }
            return field;
        });
        const mappedNewFieldState = this.mapHighlightedContentToState(newFieldState, stateFieldName);
        return {
            ...this.state.homepageData,
            [stateFieldName]: mappedNewFieldState
        };
    };

    handleSimpleEditableListEditCancel = () => {
        this.props.dispatch(push(url.resolve("../../../")));
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
                    maximumNumberOfEntries={this.state.maximumNumberOfEntries}
                    handleSimpleEditableListAdd={this.handleSimpleEditableListAdd}
                    handleSimpleEditableListEdit={this.handleSimpleEditableListEdit}
                    handleSimpleEditableListDelete={this.handleSimpleEditableListDelete}
                />

                {this.props.params.homepageDataField && this.props.params.homepageDataFieldID ? this.renderModal() : null}
            </div>
        );
    }
}

EditHomepageController.propTypes = propTypes;

export default EditHomepageController;
