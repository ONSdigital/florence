import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { updateAllDatasets, updateAllJobs } from '../../config/actions';
import recipes from '../../utilities/api-clients/recipes';
import datasetImport from '../../utilities/api-clients/datasetImport';
import notifications from '../../utilities/notifications';

import Datasets from './Datasets';
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

class DatasetsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingData: false
        }

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
        
        // Don't render all the jobs yet because they haven't been added to the state yet
        if (nextProps.datasets.length > 0 && !nextProps.jobs && !nextState.isFetchingData) {
            return false;
        }
        
        return true;
    }

    handleNewVersionClick(event) {
        const recipeID = event.target.getAttribute('data-recipe-id');
        console.log(recipeID);
        // datasetImport.create(recipeID).then(response => {

        // }).catch(error => {
        //     console.error("Error creating new import job: ", error);
        // });
    }

    renderJobs() {
        return this.props.jobs.map(job => {
            const recipe = this.props.datasets.find(dataset => {
                return dataset.id === job.recipe
            });
            return (
                <Link to={`${this.props.rootPath}/datasets/${job.recipe}/jobs/${job.job_id}`} key={job.job_id}>
                    {recipe.alias}
                </Link>
            )
        });
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-4">
                    <h1>All datasets</h1>
                    <h2>In progress</h2>
                    {this.state.isFetchingData &&
                        <div className="grid--align-self-start"> 
                            <div className="loader loader--dark"></div>
                        </div> 
                    }
                    {!this.state.isFetchingData &&
                        <Jobs jobs={this.props.jobs} datasets={this.props.datasets} rootPath={this.props.rootPath} />
                    }
                    <h2>Datasets available to you</h2>
                    {this.state.isFetchingData &&
                        <div className="grid--align-self-start"> 
                            <div className="loader loader--dark"></div>
                        </div>
                    }
                    {this.props.datasets.length > 0 &&
                        <Datasets datasets={this.props.datasets} onNewVersionClick={this.handleNewVersionClick} />
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