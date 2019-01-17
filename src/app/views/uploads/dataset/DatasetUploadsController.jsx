import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import { updateAllJobs, addNewJob , updateAllRecipes} from '../../../config/actions';
import recipes from '../../../utilities/api-clients/recipes';
import datasetImport from '../../../utilities/api-clients/datasetImport';
import notifications from '../../../utilities/notifications';
import Definition from '../../../components/Definition';

import DatasetUploadRecipe from './uploads-components/DatasetUploadRecipe';
import DatasetUploadJobs from './uploads-components/DatasetUploadJobs';

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    recipes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        alias: PropTypes.string
    })),
    jobs: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        recipe: PropTypes.string.isRequired
    }))
}

export class DatasetUploadsController extends Component {
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
            this.props.dispatch(updateAllRecipes(response[0].items));
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
        if (nextProps.recipes.length > 0 && !nextProps.jobs && !nextState.isFetchingData) {
            return false;
        }

        return true;
    }

    handleNewVersionClick(event) {
        const recipeID = event.target.getAttribute('data-recipe-id');
        this.setState({disabledDataset: recipeID});
        datasetImport.create(recipeID).then(newJob => {
            this.props.dispatch(addNewJob(newJob));
            this.props.dispatch(push(`${location.pathname}/${newJob.id}`));
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
            <div className="grid grid--justify-space-around">
                <div className="grid__col-5">
                  <h1>Upload a dataset</h1>
                  {this.state.isFetchingData &&
                      <div className="grid--align-self-start">
                          <div className="loader loader--dark"></div>
                      </div>
                  }
                  {this.props.recipes.length > 0 &&
                      <ul className="list list--neutral">
                          {this.props.recipes.map(dataset => {
                              return (
                                  <DatasetUploadRecipe
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
                  <div className="grid__col-5 margin-top--5">
                    <h2 className="margin-bottom--1">In progress</h2>
                    <div className="margin-bottom--2">
                        {this.state.isFetchingData &&
                            <div className="grid--align-self-start">
                                <div className="loader loader--dark"></div>
                            </div>
                        }
                        {!this.state.isFetchingData &&
                            <DatasetUploadJobs jobs={this.props.jobs} datasets={this.props.recipes} />
                        }
                    </div>
                  </div>
            </div>
        )
    }
}

DatasetUploadsController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        recipes: state.state.datasets.recipes,
        jobs: state.state.datasets.jobs
    }
}

export default connect(mapStateToProps)(DatasetUploadsController);
