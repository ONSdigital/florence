import React, { Component } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import PropTypes from "prop-types";

import datasets from "../../../utilities/api-clients/datasets";
import notifications from "../../../utilities/notifications";
import Select from "../../../components/Select";
import { updateActiveInstance, updateAllDatasets, updateActiveDataset } from "../../../config/actions";
import url from "../../../utilities/url";

const propTypes = {
    params: PropTypes.shape({
        instance: PropTypes.string
    }),
    dispatch: PropTypes.func.isRequired,
    instance: PropTypes.shape({
        editions: PropTypes.arrayOf(PropTypes.string)
    }),
    datasets: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired
        })
    )
};

class DatasetEdition extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingInstance: false,
            edition: null,
            error: null,
            datasetTitle: null
        };
    }

    UNSAFE_componentWillMount() {
        this.setState({ isFetchingInstance: true });

        const APIRequests = [datasets.getInstance(this.props.params.instance)];
        if (this.props.datasets.length === 0) {
            APIRequests.push(datasets.getAll());
        }

        Promise.all(APIRequests)
            .then(responses => {
                this.props.dispatch(updateActiveInstance(responses[0]));
                if (this.props.datasets.length === 0) {
                    this.props.dispatch(updateAllDatasets(responses[1].items));
                }
                const activeDataset = this.props.datasets.find(dataset => {
                    return dataset.id === responses[0].dataset_id;
                });
                this.setState({
                    isFetchingInstance: false,
                    datasetTitle: activeDataset.title
                });
            })
            .catch(error => {
                switch (error.status) {
                    case 403: {
                        const notification = {
                            type: "neutral",
                            message: "You do not permission to view the edition metadata for this dataset",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    case 404: {
                        const notification = {
                            type: "neutral",
                            message: `Dataset ID '${this.props.params.instance}' was not recognised. You've been redirected to the datasets home screen`,
                            isDismissable: true
                        };
                        notifications.add(notification);
                        this.props.dispatch(push(url.resolve("../../")));
                        break;
                    }
                    default: {
                        const notification = {
                            type: "warning",
                            message: "An unexpected error's occurred whilst trying to get this dataset",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                }
                console.error("Error has occurred:\n", error);
                this.setState({ isFetchingInstance: false });
            });
    }

    mapRecipesToSelectOptions() {
        return this.props.instance.editions.map((edition, index) => {
            return {
                id: `recipe-${index}`,
                name: edition
            };
        });
    }

    handleFormSubmit = event => {
        event.preventDefault();

        if (!this.state.edition) {
            this.setState({
                error: "You must select an edition"
            });
        }

        this.props.dispatch(push(url.resolve("whats-changed")));
    };

    handleSelectChange = event => {
        this.setState({
            error: "",
            edition: event.target.value
        });
    };

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-4">
                    <div className="margin-top--2">
                        &#9664; <Link to={url.resolve("../../")}>Back</Link>
                    </div>
                    <h1 className="margin-top--1">Create a new dataset edition</h1>
                    {this.state.isFetchingInstance ? (
                        <div className="loader loader--dark"></div>
                    ) : (
                        <div>
                            <p className="font-weight--600">Dataset</p>
                            <p className="margin-bottom--1">{this.state.datasetTitle || "Fetching dataset title..."}</p>
                            <form onSubmit={this.handleFormSubmit}>
                                <div className="grid__col-6 margin-bottom--2">
                                    <Select
                                        label="Edition"
                                        contents={this.mapRecipesToSelectOptions()}
                                        onChange={this.handleSelectChange}
                                        error={this.state.error}
                                    />
                                </div>
                                <button className="btn btn--positive">Create</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

DatasetEdition.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        instance: state.state.datasets.activeInstance,
        datasets: state.state.datasets.all
    };
}

export default connect(mapStateToProps)(DatasetEdition);
