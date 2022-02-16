import React, { Component } from "react";
import { push } from "react-router-redux";
import PropTypes from "prop-types";

import datasets from "../../../utilities/api-clients/datasets";
import recipes from "../../../utilities/api-clients/recipes";
import notifications from "../../../utilities/notifications";
import url from "../../../utilities/url";
import log from "../../../utilities/logging/log";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.shape({
        datasetID: PropTypes.string.isRequired,
        recipeID: PropTypes.string.isRequired,
    }),
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }),
};

export class CreateCantabularDatasetController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isPosting: false,
            isGettingRecipe: false,
            datasetID: "",
            format: "",
            isBasedOn: "",
        };
    }

    UNSAFE_componentWillMount = () => {
        this.setStateFromParameters();
        this.getRecipe();
    };

    setStateFromParameters = () => {
        this.setState({
            datasetID: this.props.params.datasetID,
        });
    };

    handleGETSuccess = recipe => {
        this.setState({
            format: recipe.format,
            isBasedOn: recipe.cantabular_blob,
        });
    };

    getRecipe = () => {
        const recipeId = this.props.params.recipeID;
        this.setState({ isGettingRecipe: true });
        return recipes
            .get(recipeId)
            .then(recipe => {
                this.setState({ isGettingRecipe: false });
                this.handleGETSuccess(recipe);
            })
            .catch(error => {
                log.event("get recipe: error GETting recipe", log.data({ recipeId }), log.error());
                notifications.add({
                    type: "warning",
                    message: "An error occurred when getting recipe information. Please try again",
                    isDismissable: true,
                });
                console.error("get metadata: error GETting metadata from controller", error);
            });
    };

    makeCreateDatasetPostBody = () => {
        return {
            is_based_on: {
                id: this.state.isBasedOn,
                type: this.state.format,
            },
            type: this.state.format,
        };
    };

    handleCreateClick = event => {
        event.preventDefault();
        const datasetID = this.state.datasetID;
        const postBody = this.makeCreateDatasetPostBody();
        this.setState({ isPosting: true });
        return datasets
            .create(datasetID, postBody)
            .then(() => {
                notifications.add({
                    type: "positive",
                    message: "Dataset created.",
                    isDismissable: true,
                    autoDismiss: 5000,
                });
                this.setState({ isPosting: false });
                const datasetsOverviewPageURL = url.resolve("../../../");
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
                    autoDismiss: 10000,
                });
                this.setState({ isPosting: false });
                log.event("Error creating dataset", log.error(error));
                console.error("Error creating dataset\n", error);
            });
    };

    handleBackButton = () => {
        const previousUrl = url.resolve("../../");
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
                    <h1 className="margin-top--1 margin-bottom--1">Create dataset</h1>
                    <p className="font-size--18  margin-bottom--1">
                        {this.state.isGettingRecipe ? (
                            <div className="loader loader--dark"></div>
                        ) : (
                            <div>
                                <span className="font-weight--600">for&nbsp;</span>
                                {this.state.datasetID}
                            </div>
                        )}
                    </p>
                    <div className="grid__col-2">
                        <button
                            type="button"
                            className="btn btn--positive"
                            disabled={this.state.isPosting || this.state.isGettingRecipe}
                            onClick={this.handleCreateClick}
                        >
                            {this.state.isPosting ? <div className="form__loader loader loader--dark margin-left--1"></div> : "Create"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

CreateCantabularDatasetController.propTypes = propTypes;

export default CreateCantabularDatasetController;
