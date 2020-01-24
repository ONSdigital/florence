import React, { Component } from "react";
import { push } from "react-router-redux";
import PropTypes from "prop-types";

import datasets from "../../utilities/api-clients/datasets";
import notifications from "../../utilities/notifications";
import url from "../../utilities/url";
import log, { eventTypes } from "../../utilities/log";

import SimpleSelectableList from "../../components/simple-selectable-list/SimpleSelectableList";
import Input from "../../components/Input";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired
    }).isRequired
};

export class DatasetsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingDatasets: false,
            datasets: [
                {
                    title: "Create new dataset",
                    id: "create-new-dataset",
                    url: this.props.location.pathname + "/create"
                }
            ],
            filteredDatasets: [],
            searchTerm: ""
        };
    }

    componentWillMount() {
        return this.getAllDatasets();
    }

    getAllDatasets() {
        this.setState({ isFetchingDatasets: true });
        return datasets
            .getAllList()
            .then(datasets => {
                this.setState({
                    isFetchingDatasets: false,
                    datasets: this.mapDatasetsToState(datasets)
                });
            })
            .catch(error => {
                switch (error.status) {
                    case 403: {
                        const notification = {
                            type: "neutral",
                            message: "You do not permission to view submitted datasets.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    case 404: {
                        const notification = {
                            type: "warning",
                            message: "No API route available to get all submitted datasets",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "RESPONSE_ERR": {
                        const notification = {
                            type: "warning",
                            message: "An error's occurred whilst trying to get the submitted datasets.",
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
                    default: {
                        const notification = {
                            type: "warning",
                            message: "An unexpected error's occurred whilst trying to get the submitted datasets.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                }
                console.error("Error getting datasets:\n", error);
                this.setState({ isFetchingDatasets: false });
            });
    }

    handleBackButton = () => {
        const previousUrl = url.resolve("../");
        this.props.dispatch(push(previousUrl));
    };

    handleSearchInput = event => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredDatasets = this.state.datasets.filter(dataset => {
            return dataset.title.toLowerCase().search(searchTerm) !== -1;
        });
        this.setState({
            filteredDatasets,
            searchTerm
        });
    };

    mapDatasetsToState = datasets => {
        try {
            const datasetsToMap = datasets.map(dataset => {
                return {
                    title: dataset.title || dataset.id,
                    id: dataset.id,
                    url: this.props.location.pathname + "/" + dataset.id
                };
            });
            return [...this.state.datasets, ...datasetsToMap];
        } catch (error) {
            log.add(eventTypes.unexpectedRuntimeError, {
                message: `Error mapping datasets to to state. \n ${error}`
            });
            const notification = {
                type: "warning",
                message:
                    "An unexpected error occurred when trying to get datasets, so some functionality in Florence may not work as expected. Try refreshing the page",
                isDismissable: true
            };
            notifications.add(notification);
            console.error("Error mapping datasets to state:\n", error);
        }
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
                    <h1 className="margin-top--1 margin-bottom--1">Select a dataset</h1>
                    <Input id="search-datasets" placeholder="Search by name or ID" onChange={this.handleSearchInput} />
                    <SimpleSelectableList
                        rows={this.state.filteredDatasets.length ? this.state.filteredDatasets : this.state.datasets}
                        showLoadingState={this.state.isFetchingDatasets}
                    />
                </div>
            </div>
        );
    }
}

DatasetsController.propTypes = propTypes;

export default DatasetsController;
