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
            filteredRecipes: [],
            recipes: [],
            searchTerm: ""
        };
    }

    componentWillMount = () => {
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
                .getAll()
                .then(datasets => {
                    resolve(datasets);
                })
                .catch(error => {
                    reject({ message: "An error occured trying to retrieve all datasets", error: error });
                });
        });
    };

    getAllUncreatedDatasetFromRecipeOutputs = () => {
        Promise.all([this.getRecipes(), this.getDatasets()])
            .then(responses => {
                const recipes = responses[0];
                const datasets = responses[1];
                const outputs = this.getAllOutputsFromRecipes(recipes);
                const outputsWithoutExistingDataset = this.getOutputsWithoutExistingDataset(outputs, datasets);
                this.setState({ recipes: this.mapOutputsToState(outputsWithoutExistingDataset) });
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
            });
    };

    // A recipe can output many datasets, so loop through
    // and get all possible outputs that can be created
    getAllOutputsFromRecipes = recipes => {
        const allOutputs = [];
        recipes.items.forEach(recipe => {
            if (recipe.output_instances.length > 1) {
                recipe.output_instances.forEach(output => {
                    allOutputs.push(output);
                });
                return;
            }
            allOutputs.push(recipe.output_instances[0]);
        });
        return allOutputs;
    };

    getOutputsWithoutExistingDataset = (outputs, datasets) => {
        return outputs.filter(output => {
            const doesMatchRecipe = datasets.items.some(datasetItem => {
                return output.dataset_id === datasetItem.id;
            });
            return !doesMatchRecipe;
        });
    };

    mapOutputsToState = outputs => {
        return outputs.map(output => {
            return {
                title: output.title,
                id: output.dataset_id,
                url: this.props.location.pathname + "/" + output.dataset_id
            };
        });
    };

    handleSearchInput = event => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredRecipes = this.state.recipes.filter(recipe => {
            return recipe.title.toLowerCase().search(searchTerm) !== -1;
        });
        this.setState({
            filteredRecipes,
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
                    <Input id="search-datasets" placeholder="Search by name or ID" onChange={this.handleSearchInput} />
                    <SimpleSelectableList
                        rows={this.state.filteredRecipes.length ? this.state.filteredRecipes : this.state.recipes}
                        showLoadingState={this.state.isFetchingRecipesAndDatasets}
                    />
                </div>
            </div>
        );
    }
}

CreateDatasetController.propTypes = propTypes;

export default CreateDatasetController;
