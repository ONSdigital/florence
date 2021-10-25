import React, { Component } from "react";
import { push } from "react-router-redux";
import PropTypes from "prop-types";

import datasets from "../../../utilities/api-clients/datasets";
import notifications from "../../../utilities/notifications";
import url from "../../../utilities/url";

import SimpleSelectableList from "../../../components/simple-selectable-list/SimpleSelectableList";

const propTypes = {
    params: PropTypes.shape({
        datasetID: PropTypes.string.isRequired,
        editionID: PropTypes.string.isRequired,
    }).isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
};

export class DatasetVersionsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingData: false,
            datasetTitle: "",
            editionTitle: "",
            versions: [],
        };
    }

    async UNSAFE_componentWillMount() {
        const datasetID = this.props.params.datasetID;
        const editionID = this.props.params.editionID;

        this.getAllVersions(datasetID, editionID);
    }

    getAllVersions = (datasetID, editions) => {
        this.setState({ isFetchingData: true });
        return datasets
            .getVersionsList(datasetID, editions)
            .then(response => {
                const versionsList = this.buildVersionsList(response.versions);
                this.setState({
                    isFetchingData: false,
                    versions: versionsList,
                    datasetTitle: response.dataset_name,
                    editionTitle: response.edition_name,
                });
            })
            .catch(error => {
                switch (error.status) {
                    case 404: {
                        const notification = {
                            type: "warning",
                            message: "No API route available for a list of versions. You should still be able to use this page, or you can refresh.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "RESPONSE_ERR": {
                        const notification = {
                            type: "warning",
                            message: "An error's occurred whilst trying to get a list of versions.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "FETCH_ERR": {
                        const notification = {
                            type: "warning",
                            message:
                                "There's been a network error whilst trying to get the versions. Please check you internet connection and try again in a few moments.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    default: {
                        const notification = {
                            type: "warning",
                            message: "An unexpected error's occurred whilst trying to get a list of versions.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                }
                console.error(`Error getting dataset (${datasetID}):\n`, error);
                this.setState({ isFetchingData: false });
            });
    };

    buildVersionsList = versions => {
        const versionsList = this.mapDatasetVersionsToState(versions);
        const includesUnpublishedVersion = versions.find(version => {
            return version.state === "edition-confirmed";
        });
        versionsList.unshift({
            title: "Create new version",
            id: "create-new-version",
            url: this.props.location.pathname + "/instances",
            details: [includesUnpublishedVersion ? "A version for this edition already exists in a collection" : null],
            disabled: includesUnpublishedVersion ? true : false,
        });
        return versionsList;
    };

    mapDatasetVersionsToState = versions => {
        try {
            const versionsList = versions.map(version => {
                return {
                    id: version.id,
                    title: version.title,
                    url: this.props.location.pathname + "/versions/" + version.version,
                    version: version.version,
                    details: [`Release date: ${version.release_date || "Not yet set"}`],
                };
            });
            return versionsList;
        } catch (error) {
            const notification = {
                type: "warning",
                message:
                    "An unexpected error occurred when trying to get versions, so some functionality in Florence may not work as expected. Try refreshing the page",
                isDismissable: true,
            };
            notifications.add(notification);
            console.error("Error getting mapping versions to state:\n", error);
        }
    };

    handleBackButton = () => {
        const previousUrl = url.resolve("../../");
        this.props.dispatch(push(previousUrl));
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
                    <h1 className="margin-top--1 margin-bottom--1">Select a version</h1>
                    <p className="margin-bottom--1 font-size--18">
                        <span className="font-weight--600">Dataset</span>: {this.state.datasetTitle ? this.state.datasetTitle : "loading..."}
                    </p>
                    <p className="margin-bottom--1 font-size--18">
                        <span className="font-weight--600">Edition</span>: {this.state.editionTitle ? this.state.editionTitle : "loading..."}
                    </p>
                    <SimpleSelectableList rows={this.state.versions} showLoadingState={this.state.isFetchingData} />
                </div>
            </div>
        );
    }
}

DatasetVersionsController.propTypes = propTypes;

export default DatasetVersionsController;
