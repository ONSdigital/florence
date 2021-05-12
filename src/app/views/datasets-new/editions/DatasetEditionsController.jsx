import React, { Component } from "react";
import { push } from "react-router-redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import datasets from "../../../utilities/api-clients/datasets";
import notifications from "../../../utilities/notifications";
import url from "../../../utilities/url";
import date from "../../../utilities/date";

import SimpleSelectableList from "../../../components/simple-selectable-list/SimpleSelectableList";

const propTypes = {
    params: PropTypes.shape({
        datasetID: PropTypes.string.isRequired
    }).isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired
    }).isRequired,
    dispatch: PropTypes.func.isRequired
};

export class DatasetEditionsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingData: false,
            datasetTitle: "",
            editions: [
                {
                    title: "Create new edition",
                    id: "create-new-edition",
                    url: this.props.location.pathname + "/editions"
                }
            ]
        };
    }

    componentWillMount = () => {
        const datasetID = this.props.params.datasetID;
        this.getAllEditions(datasetID);
    };

    getAllEditions = datasetID => {
        this.setState({ isFetchingData: true });
        return datasets
            .getEditionsList(datasetID)
            .then(response => {
                const editionsList = this.buildEditionsList(response.editions);
                this.setState({
                    isFetchingData: false,
                    editions: editionsList,
                    datasetTitle: response.dataset_name
                });
            })
            .catch(error => {
                switch (error.status) {
                    case 404: {
                        const notification = {
                            type: "warning",
                            message: "No API route available for a list of editions. Try refresh the page.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "RESPONSE_ERR": {
                        const notification = {
                            type: "warning",
                            message: "An error's occurred whilst trying to get a list of editions.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "FETCH_ERR": {
                        const notification = {
                            type: "warning",
                            message:
                                "There's been a network error whilst trying to get the editions. Please check you internet connection and try again in a few moments.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    default: {
                        const notification = {
                            type: "warning",
                            message: "An unexpected error's occurred whilst trying to get a list of editions.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                }
                console.error(`Error getting editions list for ${datasetID}:\n`, error);
                this.setState({ isFetchingData: false });
            });
    };

    mapEditionsToState = editions => {
        try {
            const editionsList = editions.map(edition => {
                return {
                    id: edition.id,
                    title: edition.title,
                    url: this.props.location.pathname + "/editions/" + edition.id,
                    details: [`Release date: ${edition.release_date || "Not yet set"}`]
                };
            });
            return editionsList;
        } catch (error) {
            const notification = {
                type: "warning",
                message:
                    "An unexpected error occurred when trying to get versions, so some functionality in Florence may not work as expected. Try refreshing the page",
                isDismissable: true
            };
            notifications.add(notification);
            console.error("Error getting mapping versions to state:\n", error);
        }
    };

    buildEditionsList = editions => {
        const editionsList = this.mapEditionsToState(editions);
        editionsList.unshift({
            title: "Create new edition",
            id: "create-new-edition",
            url: this.props.location.pathname + "/editions"
        });
        return editionsList;
    };

    handleBackButton = () => {
        const previousUrl = url.resolve("../");
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
                    <h1 className="margin-top--1 margin-bottom--1">Select an Edition</h1>
                    <p className="margin-bottom--1 font-size--18">
                        <span className="font-weight--600">Dataset</span>: {this.state.datasetTitle ? this.state.datasetTitle : "loading..."}
                    </p>
                    <SimpleSelectableList rows={this.state.editions} showLoadingState={this.state.isFetchingEditionsAndVersions} />
                </div>
            </div>
        );
    }
}

DatasetEditionsController.propTypes = propTypes;

export default connect()(DatasetEditionsController);
