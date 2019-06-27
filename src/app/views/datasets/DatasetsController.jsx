import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import SelectableTableController from "./selectable-table/SelectableTableController";
import datasets from "../../utilities/api-clients/datasets";
import collections from "../../utilities/api-clients/collections";
import notifications from "../../utilities/notifications";
import recipes from "../../utilities/api-clients/recipes";
import { updateAllRecipes, updateAllDatasets } from "../../config/actions";

import url from "../../utilities/url";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    rootPath: PropTypes.string.isRequired,
    collectionID: PropTypes.string.isRequired
};

class DatasetsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tableValues: [],
            collections: [],
            isFetchingDatasets: false
        };
        this.mapResponseToTableData = this.mapResponseToTableData.bind(this);
        this.handleInstanceURL = this.handleInstanceURL.bind(this);
    }

    componentWillMount() {
        this.setState({ isFetchingDatasets: true });

        const fetches = [datasets.getNewVersionsAndCompletedInstances(), datasets.getAll(), collections.getAll()];
        Promise.all(fetches)
            .then(responses => {
                this.setState({
                    isFetchingDatasets: false,
                    collections: responses[2],
                    tableValues: this.mapResponseToTableData(responses[1].items, responses[0].items, responses[2], this.props.collectionID)
                });
                this.props.dispatch(updateAllDatasets(responses[1].items));
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
                    case "UNEXPECTED_ERR": {
                        const notification = {
                            type: "warning",
                            message: "An unexpected error has occurred whilst trying to get the submitted datasets.",
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
                this.setState({ isFetchingData: false });
            });

        recipes
            .getAll()
            .then(allRecipes => {
                this.props.dispatch(updateAllRecipes(allRecipes.items));
            })
            .catch(error => {
                const notification = {
                    type: "warning",
                    message: "An unexpected error occurred when trying to get dataset recipes, so some functionality in Florence may not work as expected.",
                    isDismissable: true
                };
                notifications.add(notification);
                console.error("Error getting dataset recipes:\n", error);
            });
    }

    handleInstanceStatusMessage(state, collectionID, collections) {
        if (state === "completed" || state === "edition-confirmed") {
            return "New";
        }

        if (state === "associated") {
            const collection = collections.find(collection => {
                return collection.id === collectionID;
            });
            return collection ? "In collection: " + collection.name : "In an unrecognised collection";
        }
    }

    mapResponseToTableData(datasets, instances, collections, activeCollectionID) {
        try {
            const values = datasets.map(dataset => {
                dataset = dataset.current || dataset.next || dataset;
                const datasetInstances = [];
                instances.forEach(instance => {
                    const datasetID = instance.links.dataset.id;

                    if (datasetID === dataset.id) {
                        datasetInstances.push({
                            date: instance.last_updated,
                            isInstance: !(instance.edition && instance.version),
                            edition: instance.edition || "-",
                            version: instance.version || "-",
                            url: this.handleInstanceURL(instance.state, activeCollectionID, datasetID, instance.id, instance.edition, instance.version),
                            status: this.handleInstanceStatusMessage(instance.state, instance.collection_id, collections)
                        });
                    }
                });
                const collectionParameter = activeCollectionID ? `?collection=${activeCollectionID}` : "";
                return {
                    title: dataset.title || dataset.id,
                    id: dataset.id,
                    instances: datasetInstances,
                    datasetURL: url.resolve(`datasets/${dataset.id}/metadata`) + collectionParameter
                };
            });
            return values;
        } catch (error) {
            const notification = {
                type: "warning",
                message: "Error trying to map the datasets data to the table structure. Please refresh the page."
            };
            notifications.add(notification);
            console.error("Error mapping dataset API responses to view", error);
            return [];
        }
    }

    handleInstanceURL(state, collection, dataset, instance, edition, version) {
        let urlPath = "";
        if (state === "completed") {
            urlPath = url.resolve(`datasets/${dataset}/instances/${instance}/metadata`);
        } else {
            urlPath = url.resolve(`datasets/${dataset}/editions/${edition}/versions/${version}/metadata`);
        }
        if (collection) {
            urlPath = urlPath + "?collection=" + collection;
        }
        return urlPath;
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-9">
                    <ul className="list list--neutral">
                        <li className="list__item grid grid--justify-space-between">
                            <h1>Select a dataset</h1>
                        </li>
                    </ul>
                    <SelectableTableController values={this.state.tableValues} />
                </div>
            </div>
        );
    }
}

DatasetsController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        rootPath: state.state.rootPath,
        collectionID: state.routing.locationBeforeTransitions.query.collection
    };
}
export default connect(mapStateToProps)(DatasetsController);
