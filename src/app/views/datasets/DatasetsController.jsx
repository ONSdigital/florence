import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import SelectableTableController from './selectable-table/SelectableTableController';
import datasets from '../../utilities/api-clients/datasets';
import notifications from '../../utilities/notifications';
import recipes from '../../utilities/api-clients/recipes';
import {updateAllRecipes, updateAllDatasets} from '../../config/actions'

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    headers: PropTypes.arrayOf(PropTypes.object)
}

class DatasetsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            datasets: [],
            allDatasets: [],
            isFetchingDatasets: false
        };

        this.goToDatasetMetadata = this.goToDatasetMetadata.bind(this);
        this.goToDatasetDetails = this.goToDatasetDetails.bind(this);
    }

    componentWillMount() {
        this.setState({isFetchingDatasets: true});
        const fetches = [
            datasets.getCompletedInstances(),
            datasets.getAll()
        ]
        Promise.all(fetches).then(responses => {
            this.setState({
                isFetchingDatasets: false,
                datasets: this.mapAPIResponsesToViewProps(responses[0].items, responses[1].items),
                allDatasets: this.mapDatasetsToViewProps(responses[1].items),
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

    mapAPIResponsesToViewProps(completedInstances, datasets) {
        // TODO once import API stores uploader info we want to map it to the completed dataset for the view to display
        return completedInstances.map(instance => {
            const instanceDataset = datasets.find(dataset => {
                return dataset.id === instance.dataset_id
            });
            return {
                id: instance.id,
                name: instanceDataset.title || `No name available (${instance.id})`
            }
        });
    }

    mapDatasetsToViewProps(allDatasets) {
        return allDatasets.map(dataset => {
            return {
                id: dataset.id,
                name: dataset.title || `No name available (${dataset.id})`
            }
        });
    }

    goToDatasetMetadata(props) {
        this.props.dispatch(push(`${location.pathname}/metadata/${props.id}`));
    }

    goToDatasetDetails(props) {
        this.props.dispatch(push(`${location.pathname}/dataset/${props.id}`));
    }

    render() {
        console.log(this.state.datasets);
        console.log(this.state.allDatasets);
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-7">
                    <h1 className="text-center">Select a dataset</h1>
                    <div className="margin-bottom--1">
                        <Link to={`${location.pathname}/uploads`}>Upload a dataset</Link>
                    </div>
                    <div className="margin-top--1 margin-bottom-3">
                      <SelectableTableController
                        headers={[{label:"Title",width:"90px"}, {label:"Submission Date", width:"10px"}]}
                        values={[{title: "CPI", date: "09-10-2017", instances:[{date:"09-10-2017", edition:"2017", version:"1"}]},{title: "Baby names", date: "10-10-2017", instances:[{date:"09-10-2017", edition:"2017", version:"1"},{date:"09-10-2017", edition:"2017", version:"1"},{date:"09-10-2017", edition:"2017", version:"1"}]}]}
                      />
                    </div>
               </div>
            </div>
        )
    }
}

DatasetsController.propTypes = propTypes;

export default connect()(DatasetsController);
