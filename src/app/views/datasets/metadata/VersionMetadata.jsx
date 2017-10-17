import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import datasets from '../../../utilities/api-clients/datasets';
import recipes from '../../../utilities/api-clients/recipes';
import notifications from '../../../utilities/notifications';
import Select from '../../../components/Select';
import {updateActiveInstance, updateActiveDataset, updateAllRecipes} from '../../../config/actions';
import url from '../../../utilities/url'

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.shape({
        datasetID: PropTypes.string.isRequired,
        instanceID: PropTypes.string,
        edition: PropTypes.string,
        version: PropTypes.string
    }).isRequired,
    recipes: PropTypes.arrayOf(PropTypes.shape({
      output_instances: PropTypes.arrayOf(PropTypes.shape({
        editions: PropTypes.arrayOf(PropTypes.string).isRequired,
        id: PropTypes.string
      })),
    })),
    instance: PropTypes.shape({
      edition: PropTypes.string,
    })
}

class VersionMetadata extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingData: false,
            isVersion: null,
            edition: null,
            datasetTitle: null
        }

        this.handleEditionChange = this.handleEditionChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    componentWillMount() {

      datasets.get(this.props.params.datasetID).then(dataset => {
          this.setState({datasetTitle: dataset.current.title});
      });

      const promises = [
          Promise.resolve(),
          Promise.resolve()
      ];
      if (this.props.params.instanceID) {
        if (this.props.recipes.length === 0 || this.props.instance === 0) {
            this.setState({isFetchingData: true});
        }

        if (this.props.recipes.length === 0) {
            promises[0] = recipes.getAll();
        }

        if (this.props.instance === 0 || this.props.instance.id !== this.props.params.instanceID) {
            promises[1] = datasets.getInstance(this.props.params.instanceID);
        }

        Promise.all(promises).then(responses => {
          if (this.props.recipes.length === 0) {
              this.props.dispatch(updateAllRecipes(responses[0].items));
          }
          if (this.props.instance === 0 || this.props.instance.id !== this.props.params.instanceID) {
              this.props.dispatch(updateActiveInstance(responses[1]));
          }
          this.setState({isFetchingData: false});

            }).catch(error => {
                switch (error.status) {
                    case(403):{
                        const notification = {
                            "type": "neutral",
                            "message": "You do not permission to view the edition metadata for this dataset",
                            isDismissable: true
                        }
                        notifications.add(notification);
                        break;
                    }
                    case (404): {
                        const notification = {
                            "type": "neutral",
                            "message": `Dataset ID '${this.props.params.datasetID}' was not recognised. You've been redirected to the datasets home screen`,
                            isDismissable: true
                        };
                        notifications.add(notification);
                        this.props.dispatch(push(url.parent(url.parent())));
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
                this.setState({
                  isVersion: false,
                  isFetchingData: false
                });
            });
            return;
        }

        this.setState({
          isVersion : true,
          isFetchingData: false,
        });
    }

    shouldComponentUpdate(_, nextState) {
        // No need to re-render, this state does not impact the view.
        // Just used to confirm whether we're on a version or instance
        if (!this.props.isVersion && nextState.isVersion) {
            return false;
        }
        return true;
    }

    mapEditionsToSelectOptions() {
      const recipe = this.props.recipes.find(recipe => {
          return recipe.output_instances[0].dataset_id === this.props.params.datasetID;
      })
      const editions = recipe.output_instances[0].editions;
      return editions.map(edition => edition);
    }

    handleEditionChange(event) {
        event.preventDefault();
        this.setState({
            selectedEdition: event.target.value,
            editionError: null
        });
    }

    handleFormSubmit(event) {
        event.preventDefault();

        if (this.state.isVersion) {
            this.props.dispatch(push(url.resolve("collection")));
            return;
        }

        console.log('Not yet a version, will need to do post -> confirm edition and version -> redirect to the collection endpoint on that route');
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-6">
                    <div className="margin-top--2">
                        &#9664; <Link to={url.parent(url.parent())}>Back</Link>
                    </div>
                    <h1 className="margin-top--1 margin-bottom--1">New data</h1>
                    <p>This information is specific to this new data and can be updated each time new data is added.</p>
                      {this.state.isFetchingData ?
                          <div className="loader loader--dark"></div>
                      :
                      <div>
                        <h2 className="margin-top--1">{this.state.datasetTitle}</h2>

                        <form onSubmit={this.handleFormSubmit}>
                          <div className="margin-bottom--2">
                            <div className="grid__col-6">
                              <Select
                                  label="Edition"
                                  contents={this.mapEditionsToSelectOptions()}
                                  onChange={this.handleEditionChange}
                                  error={this.state.error}
                              />
                            </div>
                            <h2 className="margin-top--1">What's changed?</h2>
                            <p>The information below can change with each edition/version</p>
                            </div>
                            <button className="btn btn--positive">Save and return</button>
                        </form>
                      </div>
                    }
                </div>
            </div>
        )
    }
}

VersionMetadata.propTypes = propTypes;

function mapStateToProps(state) {
    return {
      instance: state.state.datasets.activeInstance,
      recipes: state.state.datasets.recipes
    }
}

export default connect(mapStateToProps)(VersionMetadata);
