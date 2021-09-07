import React, { Component } from "react";
import { push } from "react-router-redux";
import PropTypes from "prop-types";

import datasets from "../../../utilities/api-clients/datasets";
import notifications from "../../../utilities/notifications";
import url from "../../../utilities/url";
import log from "../../../utilities/logging/log";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.shape({
        datasetID: PropTypes.string.isRequired,
        format: PropTypes.string.isRequired
    }),
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired
    })
};

export class CreateCantabularDatasetController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isPosting: false,
            datasetID: "",
            format: ""
        };
    }

    componentWillMount = () => {
        this.setStateFromParameters();
    };

    setStateFromParameters = () => {
        this.setState({
            datasetID: this.props.params.datasetID,
            format: this.props.params.format
        });
    };

    makeCreateDatasetPostBody = format => {
        return {
            type: format
        };
    };

    handleCreateClick = event => {
        event.preventDefault();
        const datasetID = this.state.datasetID;
        const format = this.state.format;
        const postBody = this.makeCreateDatasetPostBody(format);
        this.setState({ isPosting: true });
        return datasets
            .create(datasetID, postBody)
            .then(() => {
                notifications.add({
                    type: "positive",
                    message: "Dataset created.",
                    isDismissable: true,
                    autoDismiss: 5000
                });
                this.setState({ isPosting: false });
                const datasetsOverviewPageURL = url.resolve("../../");
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
                    autoDismiss: 10000
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
        console.log(this.state);
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
                        <span className="font-weight--600">for&nbsp;</span>
                        {this.props.params.datasetID}
                    </p>
                    <div className="grid__col-2">
                        <button type="button" className="btn btn--positive" disabled={this.state.isPosting} onClick={this.handleCreateClick}>
                            Create dataset
                        </button>
                        {this.state.isPosting ? <div className="form__loader loader loader--dark margin-left--1"></div> : ""}
                    </div>
                </div>
            </div>
        );
    }
}

CreateCantabularDatasetController.propTypes = propTypes;

export default CreateCantabularDatasetController;
