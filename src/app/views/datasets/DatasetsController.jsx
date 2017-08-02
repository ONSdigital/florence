import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import { updateAllDatasets, updateAllJobs, addNewJob } from '../../config/actions';
import recipes from '../../utilities/api-clients/recipes';
import datasetImport from '../../utilities/api-clients/datasetImport';
import notifications from '../../utilities/notifications';

import DatasetItem from './DatasetItem';
import Jobs from './Jobs';

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    datasets: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        alias: PropTypes.string
    })),
    jobs: PropTypes.arrayOf(PropTypes.shape({
        job_id: PropTypes.string.isRequired,
        recipe: PropTypes.string.isRequired
    })),
    rootPath: PropTypes.string.isRequired
}

export class DatasetsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingData: false,
            disabledDataset: ""
        };

        this.handleNewVersionClick = this.handleNewVersionClick.bind(this);
    }
    
    componentWillMount() {
        this.setState({isFetchingData: true});

        const getRecipes = recipes.getAll();
        const getJobs = datasetImport.getAll();

        Promise.all([getRecipes, getJobs]).then(response => {
            this.props.dispatch(updateAllDatasets(response[0].items));
            this.props.dispatch(updateAllJobs(response[1]));
            this.setState({isFetchingData: false});
        }).catch(error => {
            switch (error.status) {
                case(403):{
                    const notification = {
                        "type": "warning",
                        "message": "You do not permission to view all datasets.",
                        isDismissable: true
                    }
                    notifications.add(notification)
                    break;
                }
                case("RESPONSE_ERR"):{
                    const notification = {
                        "type": "warning",
                        "message": "An error's occurred whilst trying to get all datasets.",
                        isDismissable: true
                    }
                    notifications.add(notification)
                    break;
                }
                case("FETCH_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "There's been a network error whilst trying to get all datasets. Please check you internet connection and try again in a few moments.",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                case("UNEXPECTED_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error has occurred whilst trying to get all datasets.",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error's occurred whilst trying to get all datasets.",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
            }
            this.setState({isFetchingData: false});
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        
        // Don't render all the jobs and datasets yet because the jobs haven't been added to the state yet
        if (nextProps.datasets.length > 0 && !nextProps.jobs && !nextState.isFetchingData) {
            return false;
        }
        
        return true;
    }

    handleNewVersionClick(event) {
        const recipeID = event.target.getAttribute('data-recipe-id');
        this.setState({disabledDataset: recipeID});
        datasetImport.create(recipeID).then(response => {
            this.props.dispatch(addNewJob(response));
            this.props.dispatch(push(`${this.props.rootPath}/datasets/${recipeID}/jobs/${response.job_id}`));
        }).catch(error => {
            this.setState({disabledDataset: ""});
            switch (error.status) {
                case(403):{
                    const notification = {
                        "type": "warning",
                        "message": "You do not have permission to upload a new version of this dataset.",
                        isDismissable: true
                    }
                    notifications.add(notification)
                    break;
                }
                case(404):{
                    const notification = {
                        "type": "warning",
                        "message": "This dataset was not recognised.",
                        isDismissable: true
                    }
                    notifications.add(notification)
                    break;
                }
                case("RESPONSE_ERR"):{
                    const notification = {
                        "type": "warning",
                        "message": "An error's occurred whilst trying to create a new version of this dataset.",
                        isDismissable: true
                    }
                    notifications.add(notification)
                    break;
                }
                case("FETCH_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "There's been a network error whilst trying to create a new version of this dataset. Please check you internet connection and try again in a few moments.",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                case("UNEXPECTED_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error has occurred whilst trying to create a new version of this dataset.",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error's occurred whilst trying to create a new version of this dataset.",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
            }
            console.error("Error creating new import job: ", error);
        });
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-4">
                    <h1>All datasets</h1>
                    <h2 className="margin-bottom--1">In progress</h2>
                    <div className="margin-bottom--2">
                        {this.state.isFetchingData &&
                            <div className="grid--align-self-start"> 
                                <div className="loader loader--dark"></div>
                            </div> 
                        }
                        {!this.state.isFetchingData &&
                            <Jobs jobs={this.props.jobs} datasets={this.props.datasets} rootPath={this.props.rootPath} />
                        }
                    </div>
                    <h2 className="margin-bottom--1">Datasets available to you</h2>
                    {this.state.isFetchingData &&
                        <div className="grid--align-self-start"> 
                            <div className="loader loader--dark"></div>
                        </div>
                    }
                    {this.props.datasets.length > 0 &&
                        <ul className="list">
                            {this.props.datasets.map(dataset => {
                                return (
                                    <DatasetItem 
                                        key={dataset.id} 
                                        dataset={dataset} 
                                        onNewVersionClick={this.handleNewVersionClick} 
                                        isLoading={dataset.id === this.state.disabledDataset}
                                    />
                                )
                            })}
                        </ul>
                    }
                </div>
            </div>
        )
    }
}

DatasetsController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        datasets: state.state.datasets.all,
        jobs: state.state.datasets.jobs,
        rootPath: state.state.rootPath
    }
}

export default connect(mapStateToProps)(DatasetsController);