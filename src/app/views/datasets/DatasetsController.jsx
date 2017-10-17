import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import SelectableTableController from './selectable-table/SelectableTableController';
import datasets from '../../utilities/api-clients/datasets';
import notifications from '../../utilities/notifications';
import recipes from '../../utilities/api-clients/recipes';
import {updateAllRecipes, updateAllDatasets} from '../../config/actions'
import url from '../../utilities/url'

const propTypes = {
    dispatch: PropTypes.func.isRequired
}

class DatasetsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tableValues: [],
            isFetchingDatasets: false
        };

        this.mapResponseToTableData = this.mapResponseToTableData.bind(this);
        this.getVersionFromURL = this.getVersionFromURL.bind(this);
    }

    componentWillMount() {
        this.setState({isFetchingDatasets: true});
        const fetches = [
            datasets.getAllInstances(),
            datasets.getAll()
        ]
        Promise.all(fetches).then(responses => {
            this.setState({
                isFetchingDatasets: false,
                tableValues: this.mapResponseToTableData(responses[1].items, responses[0].items)
            });
            this.props.dispatch(updateAllDatasets(responses[1].items));
        }).catch(error => {
            switch (error.status) {
                case(403):{
                    const notification = {
                        "type": "neutral",
                        "message": "You do not permission to view submitted datasets.",
                        isDismissable: true
                    }
                    notifications.add(notification)
                    break;
                }
                case(404):{
                    const notification = {
                        "type": "warning",
                        "message": "No API route available to get all submitted datasets",
                        isDismissable: true
                    }
                    notifications.add(notification)
                    break;
                }
                case("RESPONSE_ERR"):{
                    const notification = {
                        "type": "warning",
                        "message": "An error's occurred whilst trying to get the submitted datasets.",
                        isDismissable: true
                    }
                    notifications.add(notification)
                    break;
                }
                case("FETCH_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "There's been a network error whilst trying to get the submitted datasets. Please check you internet connection and try again in a few moments.",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                case("UNEXPECTED_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error has occurred whilst trying to get the submitted datasets.",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error's occurred whilst trying to get the submitted datasets.",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
            }
            this.setState({isFetchingData: false});
        });

        recipes.getAll().then(allRecipes => {
            this.props.dispatch(updateAllRecipes(allRecipes.items));
        }).catch(error => {
            const notification = {
                type: "warning",
                message: "An unexpected error occurred when trying to get dataset recipes, so some functionality in Florence may not work as expected.",
                isDismissable: true
            }
            notifications.add(notification);
            console.error("Error getting dataset recipes:\n", error);
        });
    }

    getVersionFromURL(url) {
        var reg = /^.+\/datasets\/.+\/editions\/.+\/versions\/(.+)$/g;
        var match = reg.exec(url);
        if (match.length > 1) {
            return match[1];
        }
        return "-";
    }

    mapResponseToTableData(datasets, instances) {

        const values = datasets.map(dataset => {
            const datasetInstances = instances.map(instance => {
                const datasetID = instance.links.dataset.id;
                if (datasetID === dataset.id && instance.state !== "published") {
                    var version = "-";
                    if (instance.links.version.href !== "") {
                        version = this.getVersionFromURL(instance.links.version.href);
                    }
                    return {
                        date: instance.last_updated,
                        isInstance: !(instance.edition && instance.version),
                        edition: instance.edition || "-",
                        version: version,
                        url: version === "-" ? url.resolve(`datasets/${datasetID}/instances/${instance.id}/metadata`) : url.resolve(`datasets/${datasetID}/editions/${instance.edition}/version/${version}`)
                    }
                }
            });
            return {
                title: dataset.title,
                id: dataset.id,
                instances: datasetInstances
            }
        });

        return values;
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-7">
                    <ul className="list list--neutral">
                        <li className="list__item grid grid--justify-space-between">
                            <h1>Select a dataset</h1>
                            <div className="margin-top--3">
                                <Link className="btn btn--primary" to={url.resolve("uploads/data")}>Upload a dataset</Link>
                            </div>
                        </li>
                    </ul>
                    <SelectableTableController
                        values={this.state.tableValues}
                    />
               </div>
            </div>
        )
    }
}

DatasetsController.propTypes = propTypes;

export default connect()(DatasetsController);
