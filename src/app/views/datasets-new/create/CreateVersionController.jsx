import React, { Component } from "react";
import { push, goBack } from "react-router-redux";
import PropTypes from "prop-types";

import datasets from "../../../utilities/api-clients/datasets";
import notifications from "../../../utilities/notifications";
import date from "../../../utilities/date";
import url from "../../../utilities/url";

import RadioGroup from "../../../components/radio-buttons/RadioGroup";

const propTypes = {
    params: PropTypes.shape({
        datasetID: PropTypes.string.isRequired,
        editionID: PropTypes.string.isRequired
    }),
    dispatch: PropTypes.func.isRequired
};

export class CreateVersionController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingDataset: false,
            dataset: {},
            isFetchingEdition: false,
            edition: {},
            isFetchingInstances: false,
            instances: [],
            selectedInstance: null,
            isSaving: false
        };
    }

    componentWillMount() {
        const datasetID = this.props.params.datasetID;
        const editionID = this.props.params.editionID;

        this.getDataset(datasetID);
        this.getEdition(datasetID, editionID);
        this.getInstances(datasetID);
    }

    getDataset = datasetID => {
        this.setState({ isFetchingDataset: true });
        return datasets
            .get(datasetID)
            .then(dataset => {
                this.setState({
                    isFetchingDataset: false,
                    dataset: this.mapDatasetToState(dataset)
                });
                return this.mapDatasetToState(dataset);
            })
            .catch(error => {
                switch (error.status) {
                    case 404: {
                        const notification = {
                            type: "warning",
                            message: "No API route available for a list of datasets. You should still be able to use this page, or you can refresh.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "RESPONSE_ERR": {
                        const notification = {
                            type: "warning",
                            message: "An error's occurred whilst trying to get a list of datasets.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "FETCH_ERR": {
                        const notification = {
                            type: "warning",
                            message:
                                "There's been a network error whilst trying to get the submitted datasets. Please check you internet connection and try again in a few moments.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "UNEXPECTED_ERR": {
                        const notification = {
                            type: "warning",
                            message: "An unexpected error has occurred whilst trying to get a list of datasets.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    default: {
                        const notification = {
                            type: "warning",
                            message: "An unexpected error's occurred whilst trying to get a list of datasets.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                }
                console.error(`Error getting dataset (${datasetID}):\n`, error);
                this.setState({ isFetchingDataset: false });
            });
    };

    mapDatasetToState = datasetResponse => {
        try {
            const dataset = datasetResponse.current || datasetResponse.next || datasetResponse;
            return {
                title: dataset.title
            };
        } catch (error) {
            const notification = {
                type: "warning",
                message:
                    "An unexpected error occurred when trying to get dataset details, so some functionality in Florence may not work as expected. Try refreshing the page",
                isDismissable: true
            };
            notifications.add(notification);
            console.error("Error getting dataset details to state:\n", error);
        }
    };

    getEdition = (datasetID, editionID) => {
        this.setState({ isFetchingEdition: true });
        return datasets
            .getEdition(datasetID, editionID)
            .then(edition => {
                this.setState({
                    isFetchingEdition: false,
                    edition: this.mapDatasetEditionToState(edition)
                });
                return this.mapDatasetEditionToState(edition);
            })
            .catch(error => {
                console.error(error);
                this.setState({ isFetchingEdition: false });
            });
    };

    mapDatasetEditionToState = editionResponse => {
        try {
            const edition = editionResponse.current || editionResponse.next || editionResponse;
            return {
                title: edition.edition
            };
        } catch (error) {
            const notification = {
                type: "warning",
                message:
                    "An unexpected error occurred when trying to get edition details, so some functionality in Florence may not work as expected. Try refreshing the page",
                isDismissable: true
            };
            notifications.add(notification);
            console.error("Error getting mapping edition to state:\n", error);
        }
    };

    getInstances = datasetID => {
        this.setState({ isFetchingInstances: true });
        return datasets
            .getCompletedInstancesForDataset(datasetID)
            .then(instances => {
                this.setState({
                    isFetchingInstances: false,
                    instances: this.mapInstancesToState(instances.items)
                });
            })
            .catch(error => {
                console.error(error);
                this.setState({ isFetchingEdition: false });
            });
    };

    mapInstancesToState = instances => {
        try {
            const instancesList = instances.map((instance, index) => {
                const latest = index + 1 === instances.length ? "(latest)" : null;
                return {
                    id: instance.id,
                    value: instance.id,
                    label: `New data ${latest ? latest : ""}`,
                    subLabel: `Upload date: ${date.format(instance.last_updated, "h:MMtt dd mmmm yyyy")}`
                };
            });
            return instancesList.reverse();
        } catch (error) {
            const notification = {
                type: "warning",
                message: "An unexpected error occurred when trying to get instances. Try refreshing the page",
                isDismissable: true
            };
            notifications.add(notification);
            console.error("Error getting mapping instances to state:\n", error);
        }
    };

    handleSelectedInstanceChange = event => {
        const selectedInstance = event.value;
        this.setState({ selectedInstance: selectedInstance });
    };

    handleCreateClick = () => {
        this.setState({ isSaving: true });
        datasets
            .confirmEditionAndCreateVersion(this.state.selectedInstance, this.props.params.editionID)
            .then(response => {
                this.setState({ isSaving: false });
                const versionID = response.version;
                const versionURL = `${url.resolve("../")}/versions/${versionID}`;
                this.props.dispatch(push(versionURL));
            })
            .catch(error => {
                console.error(`Error create version:\n`, error);
                this.setState({ isSaving: false });
                switch (error.status) {
                    case 401: {
                        // handled by request utility function
                        break;
                    }
                    case 400: {
                        const notification = {
                            type: "warning",
                            message:
                                "Unable to create version due to invalid values being submitted. Please check your updates for any issues and try again",
                            isDismissable: true,
                            autoDismiss: 10000
                        };
                        notifications.add(notification);
                        break;
                    }
                    case 403: {
                        const notification = {
                            type: "neutral",
                            message: "Unable to create version because you do not have the correct permissions",
                            isDismissable: true,
                            autoDismiss: 10000
                        };
                        notifications.add(notification);
                        break;
                    }
                    case 404: {
                        const notification = {
                            type: "warning",
                            message: "Unable to create version because this version couldn't be found",
                            isDismissable: true,
                            autoDismiss: 10000
                        };
                        notifications.add(notification);
                        break;
                    }
                    case 409: {
                        const notification = {
                            type: "warning",
                            message: "Unable to create version because a version already exists in this collection",
                            isDismissable: true,
                            autoDismiss: 10000
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "FETCH_ERR": {
                        const notification = {
                            type: "warning",
                            message: "Unable to create version due to a network issue. Please check your internet connection and try again",
                            isDismissable: true,
                            autoDismiss: 10000
                        };
                        notifications.add(notification);
                        break;
                    }
                    default: {
                        const notification = {
                            type: "warning",
                            message: "Unable to create version due to an unexpected error",
                            isDismissable: true,
                            autoDismiss: 10000
                        };
                        notifications.add(notification);
                        break;
                    }
                }
            });
    };

    handleBackButton = () => {
        this.props.dispatch(goBack());
    };

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-9">
                    <div className="margin-top--2">
                        &#9664;{" "}
                        <button type="button" className="btn btn--link" onClick={this.handleBackButton}>
                            Back
                        </button>
                    </div>
                    <h1 className="margin-top--1 margin-bottom--1">Attach new data</h1>
                    <p className="margin-bottom--1 font-size--18">
                        <span className="font-weight--600">Dataset</span>: {this.state.dataset.title ? this.state.dataset.title : "loading..."}
                    </p>
                    <p className="margin-bottom--1 font-size--18">
                        <span className="font-weight--600">Edition</span>: {this.state.edition.title ? this.state.edition.title : "loading..."}
                    </p>

                    {this.state.instances.length ? (
                        <RadioGroup
                            groupName="create-versions-instances"
                            radioData={this.state.instances}
                            selectedValue={this.state.selectedInstance}
                            onChange={this.handleSelectedInstanceChange}
                            legend={"New data"}
                            disabled={this.state.isSaving || this.state.isFetchingInstances}
                        />
                    ) : (
                        <p className="margin-bottom--1">No instances avialable for this edition</p>
                    )}

                    <div className="grid__col-2">
                        <button type="button" className="btn btn--positive" disabled={!this.state.selectedInstance} onClick={this.handleCreateClick}>
                            Create version
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

CreateVersionController.propTypes = propTypes;

export default CreateVersionController;
