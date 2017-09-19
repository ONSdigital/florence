import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import dataset from '../../../utilities/api-clients/datasets';
import notifications from '../../../utilities/notifications';
import Select from '../../../components/Select'
import recipes from '../../../utilities/api-clients/recipes'
import {updateAllRecipes, updateActiveInstance} from '../../../config/actions'
import datasetImport from '../../../utilities/api-clients/datasetImport'

const propTypes = {
    instance_id: PropTypes.string,
    params: PropTypes.shape({
        instance: PropTypes.string
    }),
    dispatch: PropTypes.func.isRequired,
    rootPath: PropTypes.string.isRequired,
    recipes: PropTypes.array,
    instance: PropTypes.shape({
        editions: PropTypes.arrayOf(PropTypes.string)
    })
}

class DatasetEdition extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingData: false,
            edition: null,
            error: null
        };

        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    componentWillMount() {
        this.setState({isFetchingData: true});

        const APIRequests = [dataset.getInstance(this.props.params.instance)];
        if (this.props.recipes.length === 0) {
            APIRequests.push(recipes.getAll());
        }

        /*
            We currently have to talk to lots of APIs to get the 'editions' array from the recipe
            which is why there's so many chained promises here. The instance model is going to be
            updated to contain the 'editions' array itself, so we should be able to simplify this
            massively at that point.
        */
        
        Promise.all(APIRequests).then(responses => {
            if (this.props.recipes.length === 0) {
                this.props.dispatch(updateAllRecipes(responses[1].items));
            }
            this.props.dispatch(updateActiveInstance(responses[0]));
            return responses[0].links.job.id;
        }).then(jobID => {
            return datasetImport.get(jobID);
        }).then(job => {
            try {
                const instanceRecipe = this.props.recipes.find(recipe => {
                    return recipe.id === job.recipe
                });
                const instanceWithSuggestedEditions = {
                    ...this.props.instance,
                    editions: instanceRecipe.output_instances[0].editions
                }
                this.props.dispatch(updateActiveInstance(instanceWithSuggestedEditions));
                this.setState({isFetchingData: false});
            } catch (error) {
                throw "Error mapping instance to a recipe and getting editions"
            }
        }).catch(error => {
            switch (error.status) {
                case(403):{
                    const notification = {
                        "type": "info",
                        "message": "You do not permission to view the edition metadata for this dataset",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                case (404): {
                    const notification = {
                        "type": "info",
                        "message": `Dataset ID '${this.props.params.instance}' was not recognised. You've been redirected to the datasets home screen`,
                        isDismissable: true
                    };
                    notifications.add(notification);
                    this.props.dispatch(push(`${this.props.rootPath}/datasets`));
                    break;
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error's occurred whilst trying to get this dataset",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
            }
            console.error("Error has occurred:\n", error);
            this.setState({isFetchingData: false});
        });
    }

    mapRecipesToSelectOptions() {
        return (this.props.instance.editions).map((edition, index) => {
            return {
                id: `recipe-${index}`,
                name: edition
            }
        });
    }

    handleFormSubmit(event) {
        event.preventDefault();
        
        if (!this.state.edition) {
            this.setState({
                error: "You must select an edition"
            });
        }
    }

    handleSelectChange(event) {
        this.setState({
            error: "",
            edition: event.target.value
        });
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-4">
                    <h1>Create a new dataset edition</h1>
                    {this.state.isFetchingData ?
                        <div className="loader loader--dark"></div>
                    :
                        <div>
                            <h2>Dataset</h2>
                            <p className="margin-bottom--1">Unable to get dataset title</p>
                            <form onSubmit={this.handleFormSubmit}>
                                <h2>Edition</h2>
                                <div className="grid__col-6 margin-bottom--2">
                                    <Select 
                                        contents={this.mapRecipesToSelectOptions()}
                                        onChange={this.handleSelectChange}
                                        error={this.state.error}
                                    />
                                </div>
                                <button className="btn btn--positive">Create</button>
                            </form>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

DatasetEdition.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        rootPath: state.state.rootPath,
        recipes: state.state.datasets.recipes,
        instance: state.state.datasets.activeInstance
    }
}

export default connect(mapStateToProps)(DatasetEdition);