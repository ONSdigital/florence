import React, { Component } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import PropTypes from "prop-types";
import isEmptyObject from "is-empty-object";

import url from "../../../../utilities/url";
import RadioList from "../../../../components/radio-buttons/RadioList";
import recipes from "../../../../utilities/api-clients/recipes";
import notifications from "../../../../utilities/notifications";
import { updateActiveJob, updateAllRecipes } from "../../../../config/actions";
import datasetImport from "../../../../utilities/api-clients/datasetImport";
import datasets from "../../../../utilities/api-clients/datasets";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    recipes: PropTypes.array,
    job: PropTypes.object,
    params: PropTypes.shape({
        jobID: PropTypes.string.isRequired
    }).isRequired
};

class DatasetUploadMetadata extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingData: false,
            isSubmittingData: false,
            selectedEdition: null,
            recipeAlias: ""
        };
    }

    componentWillMount() {
        const promises = [Promise.resolve(), Promise.resolve()];

        if (this.props.recipes.length === 0 || isEmptyObject(this.props.job)) {
            this.setState({ isFetchingData: true });
        }

        if (this.props.recipes.length === 0) {
            promises[0] = recipes.getAll();
        }

        if (isEmptyObject(this.props.job) || this.props.job.id !== this.props.params.jobID) {
            promises[1] = datasetImport.get(this.props.params.jobID);
        }

        Promise.all(promises)
            .then(responses => {
                if (this.props.recipes.length === 0) {
                    this.props.dispatch(updateAllRecipes(responses[0].items));
                }
                if (isEmptyObject(this.props.job) || this.props.job.id !== this.props.params.jobID) {
                    this.props.dispatch(updateActiveJob(responses[1]));
                }
                this.mapRecipeAliasToState();
                this.setState({ isFetchingData: false });
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
                console.error("Error fetching all recipes", error);
            });
    }

    mapRecipeAliasToState = () => {
        const recipe = this.props.recipes.find(recipe => {
            return recipe.id === this.props.job.recipe;
        });
        this.setState({ recipeAlias: recipe.alias });
    };

    mapEditionsToRadioList() {
        const recipe = this.props.recipes.find(recipe => {
            return recipe.id === this.props.job.recipe;
        });
        const editions = recipe.output_instances[0].editions;
        return editions.map(edition => ({
            id: edition,
            value: edition,
            label: edition
        }));
    }

    handleSelectedEdiionChange = event => {
        const selectedEdition = event.value;
        this.setState({ selectedEdition: selectedEdition });
    };

    handleSubmit = event => {
        event.preventDefault();

        this.setState({ isSubmittingData: true });

        datasets
            .updateInstanceEdition(this.props.job.links.instances[0].id, this.state.selectedEdition)
            .then(() => {
                return datasetImport.updateStatus(this.props.params.jobID, "submitted").then(() => {
                    const activeDataset = {
                        ...this.state.activeDataset,
                        status: "submitted"
                    };
                    this.setState({ activeDataset });
                });
            })
            .then(() => {
                this.setState({ isSubmittingData: false });
                this.props.dispatch(push(url.resolve("../")));
            })
            .catch(error => {
                switch (error.status) {
                    case 400: {
                        const notification = {
                            type: "warning",
                            message:
                                "There was a problem with the data you tried to submit. Please check the information, fix any errors and try again.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    case 404: {
                        const notification = {
                            type: "warning",
                            message: `The job '${this.props.params.jobID}' was not recognised. Please check that it hasn't been submitted or deleted by someone else.`,
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    case 403: {
                        const notification = {
                            type: "warning",
                            message: "You do not permission to submit this dataset to the publishing team.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "RESPONSE_ERR": {
                        const notification = {
                            type: "warning",
                            message: "An error's occurred whilst trying to submit to the publishing team.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "FETCH_ERR": {
                        const notification = {
                            type: "warning",
                            message:
                                "There's been a network error whilst trying to submit to the publishing team. Please check you internet connection and try again.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "UNEXPECTED_ERR": {
                        const notification = {
                            type: "warning",
                            message: "An unexpected error has occurred whilst trying to submit to the publishing team.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    default: {
                        const notification = {
                            type: "warning",
                            message: "An unexpected error's occurred whilst trying to submit to the publishing team.",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                }
                this.setState({ isSubmittingData: false });
                console.error("Error trying to submit edition to publishing team", error);
            });
    };

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-9">
                    <div className="margin-top--2">
                        &#9664; <Link to={url.resolve("../")}>Back</Link>
                    </div>
                    <h1 className="margin-top--1 margin-bottom--1">Select an Edition</h1>
                    <p className="margin-bottom--1 font-size--18">
                        <span className="font-weight--600">Dataset</span>: {this.state.recipeAlias ? this.state.recipeAlias : "loading..."}
                    </p>
                    <form onSubmit={this.handleSubmit}>
                        <RadioList
                            groupName="upload-version-edition-select"
                            radioData={!this.state.isFetchingData ? this.mapEditionsToRadioList() : []}
                            selectedValue={this.state.selectedEdition}
                            onChange={this.handleSelectedEdiionChange}
                            legend={"Select an edition"}
                            disabled={this.state.isSubmittingData || this.state.isFetchingData}
                            showLoadingState={this.state.isFetchingData}
                        />
                        <div>
                            <button className="btn btn--positive margin-top--2" disabled={!this.state.selectedEdition || this.state.isSubmittingData}>
                                Submit to publishing
                            </button>
                            {this.state.isSubmittingData && <div className="loader loader--centre loader--dark margin-left--1"></div>}
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

DatasetUploadMetadata.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        recipes: state.state.datasets.recipes,
        job: state.state.datasets.activeJob
    };
}

export default connect(mapStateToProps)(DatasetUploadMetadata);
