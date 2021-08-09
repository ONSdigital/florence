import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import PropTypes from "prop-types";

import { addNewJob, updateAllRecipes } from "../../../config/actions";
import recipes from "../../../utilities/api-clients/recipes";
import datasetImport from "../../../utilities/api-clients/datasetImport";
import notifications from "../../../utilities/notifications";
import log from "../../../utilities/logging/log";

import DatasetUploadRecipe from "./uploads-components/DatasetUploadRecipe";
import Input from "../../../components/Input";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    recipes: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            alias: PropTypes.string
        })
    )
};

export class DatasetUploadsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingData: false,
            disabledDataset: "",
            datasets: [],
            filteredDatasets: [],
            searchTerm: ""
        };

        this.handleNewVersionClick = this.handleNewVersionClick.bind(this);
    }

    UNSAFE_componentWillMount() {
        this.setState({ isFetchingData: true });

        const getRecipes = recipes.getAll();

        getRecipes
            .then(response => {
                this.props.dispatch(updateAllRecipes(response.items));
                this.setState({
                    isFetchingData: false,
                    datasets: this.mapDatasetsToState(response.items)
                });
            })
            .catch(error => {
                switch (error.status) {
                    case 403: {
                        const notification = {
                            type: "warning",
                            message: "You do not permission to view all datasets.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "RESPONSE_ERR": {
                        const notification = {
                            type: "warning",
                            message: "An error's occurred whilst trying to get all datasets.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "FETCH_ERR": {
                        const notification = {
                            type: "warning",
                            message:
                                "There's been a network error whilst trying to get all datasets. Please check you internet connection and try again in a few moments.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "UNEXPECTED_ERR": {
                        const notification = {
                            type: "warning",
                            message: "An unexpected error has occurred whilst trying to get all datasets.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    default: {
                        const notification = {
                            type: "warning",
                            message: "An unexpected error's occurred whilst trying to get all datasets.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                }
                this.setState({ isFetchingData: false });
            });
    }

    handleNewVersionClick(event) {
        const recipeID = event.target.getAttribute("data-recipe-id");
        this.setState({ disabledDataset: recipeID });
        datasetImport
            .create(recipeID)
            .then(newJob => {
                this.props.dispatch(addNewJob(newJob));
                this.props.dispatch(push(`${location.pathname}/${newJob.id}`));
            })
            .catch(error => {
                this.setState({ disabledDataset: "" });
                switch (error.status) {
                    case 403: {
                        const notification = {
                            type: "warning",
                            message: "You do not have permission to upload a new version of this dataset.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    case 404: {
                        const notification = {
                            type: "warning",
                            message: "This dataset was not recognised.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "RESPONSE_ERR": {
                        const notification = {
                            type: "warning",
                            message: "An error's occurred whilst trying to create a new version of this dataset.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "FETCH_ERR": {
                        const notification = {
                            type: "warning",
                            message:
                                "There's been a network error whilst trying to create a new version of this dataset. Please check you internet connection and try again in a few moments.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "UNEXPECTED_ERR": {
                        const notification = {
                            type: "warning",
                            message: "An unexpected error has occurred whilst trying to create a new version of this dataset.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    default: {
                        const notification = {
                            type: "warning",
                            message: "An unexpected error's occurred whilst trying to create a new version of this dataset.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                }
                console.error("Error creating new import job: ", error);
            });
    }

    mapDatasetsToState = datasets => {
        try {
            const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });
            datasets.sort((a, b) => collator.compare(a.alias, b.alias));
            return datasets.map(dataset => {
                return {
                    alias: dataset.alias || dataset.id,
                    id: dataset.id
                };
            });
        } catch (error) {
            log.event("Error mapping datasets to to state.", log.error(error));
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

    handleSearchInput = event => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredDatasets = this.state.datasets.filter(dataset => {
            return dataset.alias.toLowerCase().search(searchTerm) !== -1;
        });
        this.setState({
            filteredDatasets,
            searchTerm
        });
    };

    render() {
        const rows = this.state.filteredDatasets.length > 0 ? this.state.filteredDatasets : this.state.datasets;
        return (
            <div className="grid grid--justify-space-around">
                <div className="grid__col-9">
                    <h1>Upload a dataset</h1>
                    <Input id="search-datasets" placeholder="Search by name" onChange={this.handleSearchInput} />
                    {this.state.isFetchingData && (
                        <div className="grid--align-self-start">
                            <div className="loader loader--dark"></div>
                        </div>
                    )}
                    {rows.length > 0 && (
                        <ul className="list list--neutral simple-select-list">
                            {rows.map(dataset => {
                                return (
                                    <DatasetUploadRecipe
                                        key={dataset.id}
                                        dataset={dataset}
                                        onNewVersionClick={this.handleNewVersionClick}
                                        isLoading={dataset.id === this.state.disabledDataset}
                                    />
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        );
    }
}

DatasetUploadsController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        recipes: state.state.datasets.recipes
    };
}

export default connect(mapStateToProps)(DatasetUploadsController);
