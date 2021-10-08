import React, { Component } from "react";
import { push } from "react-router-redux";
import PropTypes from "prop-types";

import datasets from "../../../utilities/api-clients/datasets";
import recipes from "../../../utilities/api-clients/recipes";
import notifications from "../../../utilities/notifications";
import url from "../../../utilities/url";
import log from "../../../utilities/logging/log";

import SimpleSelectableList from "../../../components/simple-selectable-list/SimpleSelectableList";
import Input from "../../../components/Input";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired
    })
};

export class CreateDatasetController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingRecipesAndDatasets: false,
            filteredOutputs: [],
            outputs: [],
            searchTerm: ""
        };
    }

    UNSAFE_componentWillMount = () => {
        this.getAllUncreatedDatasetFromRecipeOutputs();
    };

    getRecipes = () => {
        return new Promise((resolve, reject) => {
            return recipes
                .getAll()
                .then(recipes => {
                    resolve(recipes);
                })
                .catch(error => {
                    reject({ message: "An error occured trying to retrieve all recipes", error: error });
                });
        });
    };

    getDatasets = () => {
        return new Promise((resolve, reject) => {
            return datasets
                .getAllList()
                .then(datasets => {
                    resolve(datasets);
                })
                .catch(error => {
                    reject({ message: "An error occured trying to retrieve all datasets", error: error });
                });
        });
    };

    getAllUncreatedDatasetFromRecipeOutputs = () => {
        this.setState({ isFetchingRecipesAndDatasets: true });
        return Promise.all([this.getRecipes(), this.getDatasets()])
            .then(responses => {
                const recipes = responses[0];
                const datasets = responses[1];
                const outputs = this.getAllOutputsFromRecipes(recipes);
                const outputsWithoutExistingDataset = this.getOutputsWithoutExistingDataset(outputs, datasets);
                this.setState({ outputs: this.mapOutputsToState(outputsWithoutExistingDataset), isFetchingRecipesAndDatasets: false });
            })
            .catch(error => {
                log.event("Error getting outputs with no created dataset", log.error(error));
                const notification = {
                    type: "warning",
                    message: "An error occurred when trying to get available datatsets. Try refreshing the page",
                    isDismissable: true
                };
                notifications.add(notification);
                console.error("Error getting outputs with no created dataset:\n", error);
                this.setState({ isFetchingRecipesAndDatasets: false });
            });
    };

    // A recipe can output many datasets, so loop through and get
    // all possible outputs that can be created from a single recipe
    getAllOutputsFromRecipes = recipes => {
        const allOutputs = [];
        recipes.items.forEach(recipe => {
            if (recipe.output_instances.length > 1) {
                recipe.output_instances.forEach(output => {
                    allOutputs.push({ ...output, format: recipe.format });
                });
                return;
            }

            allOutputs.push({ ...recipe.output_instances[0], format: recipe.format });
        });
        return allOutputs;
    };

    getOutputsWithoutExistingDataset = (outputs, datasets) => {
        return outputs.filter(output => {
            const doesMatchRecipe = datasets.some(datasetItem => {
                return output.dataset_id === datasetItem.id;
            });
            return !doesMatchRecipe;
        });
    };

    mapOutputsToState = outputs => {
        return outputs.map(output => {
            let outputUrl = `${this.props.location.pathname}/${output.dataset_id}`;
            if (output.format.includes("cantabular")) {
                outputUrl += `/${output.format}`;
            }

            return {
                title: output.title,
                id: output.dataset_id,
                url: outputUrl
            };
        });
    };

    handleSearchInput = event => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredOutputs = this.state.outputs.filter(recipe => {
            return recipe.title.toLowerCase().search(searchTerm) !== -1;
        });
        this.setState({
            filteredOutputs,
            searchTerm
        });
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
                    <h1 className="margin-top--1 margin-bottom--1">Create new dataset</h1>
                    <Input id="search-datasets" placeholder="Search by name" onChange={this.handleSearchInput} />
                    <SimpleSelectableList
                        rows={this.state.filteredOutputs.length ? this.state.filteredOutputs : this.state.outputs}
                        showLoadingState={this.state.isFetchingRecipesAndDatasets}
                    />
                </div>
            </div>
        );
    }
}

CreateDatasetController.propTypes = propTypes;

export default CreateDatasetController;
