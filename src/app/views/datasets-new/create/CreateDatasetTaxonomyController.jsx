import React, { Component } from "react";
import { push } from "react-router-redux";
import PropTypes from "prop-types";

import datasets from "../../../utilities/api-clients/datasets";
import taxonomy from "../../../utilities/api-clients/taxonomy";
import notifications from "../../../utilities/notifications";
import url from "../../../utilities/url";
import log from "../../../utilities/logging/log";

import RadioList from "../../../components/radio-buttons/RadioList";
import Input from "../../../components/Input";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.shape({
        datasetID: PropTypes.string.isRequired
    }),
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired
    })
};

export class CreateDatasetTaxonomyController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingTopics: false,
            topics: [],
            filteredTopics: [],
            searchTerm: "",
            selectedTopicURL: "",
            isPosting: false
        };
    }

    UNSAFE_componentWillMount = () => {
        this.getTaxonomyNodes();
    };

    mapTaxonomyTopicsToState = topics => {
        try {
            return topics.map(topic => {
                return {
                    id: topic.uri,
                    value: topic.uri,
                    label: topic.description.title
                };
            });
        } catch (error) {
            log.event("Error mapping taxonomy topics to state", log.error(error));
            const notification = {
                type: "warning",
                message: "An error occurred when trying to get available taxonomy nodes. Try refreshing the page",
                isDismissable: true
            };
            notifications.add(notification);
            console.error("Error mapping taxonomy topics to state:\n", error);
            return error;
        }
    };

    getTaxonomyNodes = () => {
        this.setState({ isFetchingTopics: true });
        return taxonomy
            .getAllProductPages()
            .then(topics => {
                this.setState({ topics: this.mapTaxonomyTopicsToState(topics), isFetchingTopics: false });
            })
            .catch(error => {
                this.setState({ isFetchingTopics: false });
                log.event("Error getting taxonomy nodes", log.error(error));
                const notification = {
                    type: "warning",
                    message: "An error occurred when trying to get available taxonomy nodes. Try refreshing the page",
                    isDismissable: true
                };
                notifications.add(notification);
                console.error("Error getting taxonomy nodes:\n", error);
            });
    };

    handleSelectedTopicChange = event => {
        const selectedTopicURL = event.value;
        this.setState({ selectedTopicURL: selectedTopicURL });
    };

    handleSearchInput = event => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredTopics = this.state.topics.filter(topic => {
            return topic.label.toLowerCase().search(searchTerm) !== -1;
        });
        this.setState({
            filteredTopics,
            searchTerm
        });
    };

    makeCreateDatasetPostBody = () => {
        return {
            links: {
                taxonomy: {
                    href: this.state.selectedTopicURL
                }
            }
        };
    };

    handleCreateClick = event => {
        event.preventDefault();
        const datasetID = this.props.params.datasetID;
        const postBody = this.makeCreateDatasetPostBody();
        this.setState({ isPosting: true });
        return datasets
            .create(datasetID, postBody)
            .then(() => {
                notifications.add({
                    type: "positive",
                    message: "Dataset created.",
                    isDismissable: true,
                    autoDismiss: 5000
                });
                this.setState({ isPosting: false });
                const datasetsOverviewPageURL = url.resolve("../../");
                this.props.dispatch(push(datasetsOverviewPageURL));
            })
            .catch(error => {
                let notificationMessage;
                switch (error.status) {
                    case 400: {
                        notificationMessage =
                            "Unable to create dataset due to invalid values being submitted. Please check your updates for any issues and try again";
                        break;
                    }
                    case 403: {
                        notificationMessage = "Unable to create dataset. It may already exist.";
                        break;
                    }
                    case "FETCH_ERR": {
                        notificationMessage = "Unable to create dataset due to a network issue. Please check your internet connection and try again";
                        break;
                    }
                    default: {
                        notificationMessage = "Unable to create dataset due to an unexpected error";
                        break;
                    }
                }
                notifications.add({
                    type: "warning",
                    message: notificationMessage,
                    isDismissable: true,
                    autoDismiss: 10000
                });
                this.setState({ isPosting: false });
                log.event("Error creating dataset", log.error(error));
                console.error("Error creating dataset\n", error);
            });
    };

    handleBackButton = () => {
        const previousUrl = url.resolve("../");
        this.props.dispatch(push(previousUrl));
    };

    render() {
        return (
            <div className="grid grid--justify-center margin-bottom--2">
                <div className="grid__col-9">
                    <div className="margin-top--2">
                        &#9664;{" "}
                        <button type="button" className="btn btn--link" onClick={this.handleBackButton}>
                            Back
                        </button>
                    </div>
                    <h1 className="margin-top--1 margin-bottom--1">Select a taxonomy node</h1>
                    <Input id="search-datasets" placeholder="Search by name or ID" onChange={this.handleSearchInput} />

                    <RadioList
                        groupName="create-dataset-taxonomy"
                        radioData={this.state.filteredTopics.length ? this.state.filteredTopics : this.state.topics}
                        selectedValue={this.state.selectedTopicURL}
                        onChange={this.handleSelectedTopicChange}
                        legend={"Select a taxonomy node"}
                        disabled={this.state.isPosting || this.state.isFetchingTopics}
                        showLoadingState={this.state.isFetchingTopics}
                    />

                    <div className="grid__col-2">
                        <button
                            type="button"
                            className="btn btn--positive"
                            disabled={!this.state.selectedTopicURL || this.state.isPosting || this.state.isFetchingTopics}
                            onClick={this.handleCreateClick}
                        >
                            Create dataset
                        </button>
                        {this.state.isPosting ? <div className="form__loader loader loader--dark margin-left--1"></div> : ""}
                    </div>
                </div>
            </div>
        );
    }
}

CreateDatasetTaxonomyController.propTypes = propTypes;

export default CreateDatasetTaxonomyController;
