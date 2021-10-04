import React, { Component } from "react";
import { push } from "react-router-redux";
import PropTypes from "prop-types";

import datasets from "../../../utilities/api-clients/datasets";
import recipes from "../../../utilities/api-clients/recipes";
import notifications from "../../../utilities/notifications";
import url from "../../../utilities/url";

import Select from "../../../components/Select";

const propTypes = {
    params: PropTypes.shape({
        datasetID: PropTypes.string.isRequired
    }),
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired
    })
};

export class CreateEditionController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingDataset: false,
            dataset: {},
            isFetchingEditions: false,
            editions: [],
            selectedEdition: null
        };
    }

    UNSAFE_componentWillMount = () => {
        const datasetID = this.props.params.datasetID;
        this.getListOfEditions();
        this.getDataset(datasetID);
    };

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
            console.error("Error mapping dataset details to state:\n", error);
        }
    };

    getListOfEditions = () => {
        this.setState({ isFetchingEditions: true });
        return recipes
            .getAll()
            .then(recipes => {
                this.setState({
                    isFetchingEditions: false,
                    editions: this.mapEditionsToState(recipes.items)
                });
                return this.mapEditionsToState(recipes.items);
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
                console.error(`Error getting editions from recipe API:\n`, error);
                this.setState({ isFetchingEditions: false });
            });
    };

    mapEditionsToState = recipeOutputs => {
        try {
            const recipe = recipeOutputs.find(recipeOutput => {
                return recipeOutput.output_instances[0].dataset_id === this.props.params.datasetID;
            });
            return this.filterEditionsListFromRecipe(recipe);
        } catch (error) {
            const notification = {
                type: "warning",
                message: "An unexpected error occurred when trying to get editions. Try refreshing the page",
                isDismissable: true
            };
            notifications.add(notification);
            console.error("Error getting dataset details to state:\n", error);
        }
    };

    filterEditionsListFromRecipe = recipe => {
        try {
            const editionsList = recipe.output_instances[0].editions.map(edition => {
                return {
                    id: edition,
                    name: edition
                };
            });
            return editionsList;
        } catch (error) {
            const notification = {
                type: "warning",
                message: "An unexpected error occurred when trying to get editions. Try refreshing the page",
                isDismissable: true
            };
            notifications.add(notification);
            console.error("Error getting dataset details to state:\n", error);
        }
    };

    handleEditionSelection = event => {
        const editionID = event.target.value;
        this.setState({ selectedEdition: editionID });
    };

    handleCreateClick = () => {
        this.props.dispatch(push(`${this.props.location.pathname}/${this.state.selectedEdition}/instances`));
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
                    <h1 className="margin-top--1 margin-bottom--1">Create new edition</h1>
                    <p className="margin-bottom--1 font-size--18">
                        <span className="font-weight--600">Dataset</span>: {this.state.dataset.title ? this.state.dataset.title : "loading..."}
                    </p>
                    <div className="grid__col-3">
                        <Select
                            id="editions"
                            label="Select an edition"
                            contents={this.state.editions ? this.state.editions : []}
                            defaultOption={this.state.editions ? "Select an option" : "Loading editions..."}
                            selectedOption={this.state.selectedOption}
                            onChange={this.handleEditionSelection}
                        />
                        <button type="button" className="btn btn--positive" disabled={!this.state.selectedEdition} onClick={this.handleCreateClick}>
                            Create edition
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

CreateEditionController.propTypes = propTypes;

export default CreateEditionController;
