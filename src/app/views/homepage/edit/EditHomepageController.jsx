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
                    title: "Headline One",
                    description: "Description for Headline One",
                    uri: "/",
                    image: null
                },
                {
                    title: "Headline Two",
                    description: "Description for Headline Two",
                    uri: "/",
                    image: null
                },
                {
                    title: "Headline Three",
                    description: "Description for Headline Three",
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

    handleSimpleEditableListEditSuccess = (newField, stateFieldName) => {
        let newHomepageDataState;
        if (newField.id === null) {
            newHomepageDataState = this.addHomepageDataField(newField, stateFieldName);
        } else {
            newHomepageDataState = this.updateHomepageDataField(newField, stateFieldName);
        }
        this.setState({
            homepageData: newHomepageDataState
        });
        this.props.dispatch(push(url.resolve("../../../")));
    };

    addHomepageDataField = (newField, stateFieldName) => {
        const newFieldState = [...this.state.homepageData[stateFieldName]];
        newField.id = newFieldState.length;
        newFieldState.push(newField);
        const mappedNewFieldState = this.mapHomepageDataFieldToState(newFieldState, stateFieldName);
        return {
            ...this.state.homepageData,
            [stateFieldName]: mappedNewFieldState
        };
    };

    mapHomepageDataFieldToState = (newState, stateFieldName) => {
        switch (stateFieldName) {
            case "homepageData": {
                return this.mapHighlightedContentToState(newState);
            }
            default: {
                log.event("Error mapping metadata field to state. Unknown field name.", log.data({ fieldName: stateFieldName }), log.error());
                notifications.add({
                    type: "warning",
                    message: `An error occurred when adding a homepage item item, changes or additions won't be save. Refresh the page and try again`,
                    isDismissable: true
                });
                console.error(`Error mapping homepage data field to state. Unknown field name '${stateFieldName}'`);
            }
        }
    };

    mapHighlightedContentToState = highlightedContent => {
        try {
            return highlightedContent.map((item, index) => {
                return {
                    id: index,
                    description: item.description,
                    href: item.uri,
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
                />

                {this.props.params.homepageDataField && this.props.params.homepageDataFieldID ? this.renderModal() : null}
            </div>
        );
    }
}

EditHomepageController.propTypes = propTypes;

export default EditHomepageController;
