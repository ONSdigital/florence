import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import datasets from '../../../utilities/api-clients/datasets';
import recipes from '../../../utilities/api-clients/recipes';
import notifications from '../../../utilities/notifications';
import Select from '../../../components/Select';
import Input from '../../../components/Input';
import {updateActiveInstance, updateActiveVersion, updateAllRecipes, updateActiveDataset} from '../../../config/actions';
import url from '../../../utilities/url'

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    rootPath: PropTypes.string.isRequired,
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
    dataset: PropTypes.shape({
      title: PropTypes.string.isRequired,
      release_frequency: PropTypes.string,
    }),
    instance: PropTypes.shape({
      edition: PropTypes.string,
      version: PropTypes.number,
      id: PropTypes.string,
      dimensions: PropTypes.arrayOf(PropTypes.object),
    }),
    version: PropTypes.shape({
      edition: PropTypes.string,
      state: PropTypes.string,
      version: PropTypes.number,
      dimensions: PropTypes.arrayOf(PropTypes.object),
    }),
    isInstance: PropTypes.string
}

class VersionMetadata extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingData: false,
            isInstance: null,
            edition: null,
            title: null,
            release_frequency: null,
            releaseDate: null,
            releaseDateError: null,
            dimensions: []
        }

        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleReleaseDateChange = this.handleReleaseDateChange.bind(this);
    }

    componentWillMount() {
      this.setState({isFetchingData: true});

      const getMetadata = [
          Promise.resolve(),
          Promise.resolve(),
          Promise.resolve()
      ];

      if (this.props.recipes.length === 0) {
          getMetadata[0] = recipes.getAll();
      }

      if (this.props.params.instanceID) {
        getMetadata[1] = datasets.getInstance(this.props.params.instanceID);
        this.setState({isInstance: true});
      } else {
        getMetadata[1] = datasets.getVersion(this.props.params.datasetID, this.props.params.edition, this.props.params.version);
        this.setState({isInstance: false});
      }

      getMetadata[2] = datasets.get(this.props.params.datasetID);

      Promise.all(getMetadata).then(responses => {

        if (this.props.recipes.length === 0) {
            this.props.dispatch(updateAllRecipes(responses[0].items));
        }

        if (this.props.params.instanceID) {
          this.props.dispatch(updateActiveInstance(responses[1]));
          this.setState({
            dimensions: this.props.instance.dimensions,
            edition: this.props.instance.edition,
          });
        }

        if (this.props.params.version) {
          this.props.dispatch(updateActiveVersion(responses[1]));
          this.setState({
            dimensions: this.props.version.dimensions,
            edition: this.props.version.edition,
            state: this.props.version.state,
          });
        }

        this.props.dispatch(updateActiveDataset(responses[2].current || responses[2].next));

        this.setState({
          title: this.props.dataset.title,
          release_frequency: this.props.dataset.release_frequency,
          isFetchingData: false
        });

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
                    this.props.dispatch(push(url.resolve("/datasets")));
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
        });
    }

    shouldComponentUpdate(_, nextState) {
        // No need to re-render, this state update does not impact the view.
        if (nextState.isFetchingData) {
          return false;
        }
        return true;
    }

    postData(body) {
        if(this.state.isInstance) {
            return datasets.confirmEditionAndCreateVersion(this.props.params.instanceID, this.state.selectedEdition, body);
        }
        // Throwing a 400 error - The dataset API has a bug at the version endpoint
        // The API validates certain fields - license & release date
        // It shouldn't at the state of "edition-confirmed".
        return datasets.updateVersion(this.props.params.datasetID, this.props.params.edition, this.props.params.version);
    }

    updateInstanceVersion(edition) {
      return this.postData({edition}).then(() => {
        if(this.state.isInstance) {
          datasets.getInstance(this.props.params.instanceID).then(response => {
            this.props.dispatch(push(`${this.props.rootPath}/datasets/${this.props.params.datasetID}/editions/${response.edition}/versions/${response.version}/collection`));
          });
        } else {
          this.props.dispatch(push(url.resolve("collection")));
        }

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
      });
    }

    mapEditionsToSelectOptions() {
      const recipe = this.props.recipes.find(recipe => {
          return recipe.output_instances[0].dataset_id === this.props.params.datasetID;
      })
      const editions = recipe.output_instances[0].editions;
      return editions.map(edition => edition);
    }

    mapDimensionsToInputs(dimensions){
      return (
        dimensions.map(dimension => {
          return (
            <div key={dimension.name}>
              <h2>{dimension.name.charAt(0).toUpperCase() + dimension.name.slice(1)}</h2>
              <Input
                  value=""
                  type="textarea"
                  id={dimension.name}
                  label="Learn more (optional)"
                  onChange={this.handleInputChange}
              />
            </div>
          )
        })
      )
    }

    mapReleaseFreqToSelectOptions() {
        const values = [
          'Weekly', 'Monthly', 'Yearly'
        ];
        return values.map(value => {
            return {
              id: value.toLowerCase(),
              name: value
            }
        });
    }

    handleInputChange(event) {
       const target = event.target;
       const value = target.value;
       const name = target.name;
       this.setState({
         [name]: value
       });
     }

     handleSelectChange(event) {
        const target = event.target;
        const value = target.value;
        const id = target.id;
        this.setState({
          [id]: value
        });
      }

    handleReleaseDateChange(event) {
        this.setState({
            releaseDateError: "",
            releaseDate: event.target.value
        });
    }

    handleFormSubmit(event) {
        event.preventDefault();

        /* 
            It's currently up in the air whether we need this or not on the version screen 
            so we shouldn't be validating on it
        */
        // if (!this.state.edition || !this.state.release_frequency) {
        //     if (!this.state.edition) {
        //         this.setState({
        //             editionError: "You must select an edition"
        //         });
        //     }
        //     if (!this.state.release_frequency) {
        //         this.setState({
        //             releaseError: "You must select a release frequency"
        //         });
        //     }
        //   return
        // }
        // const metaData = {
        //   release_frequency: this.state.release_frequency,
        //   edition: this.state.edition
        // }
        // if (this.state.edition && this.state.release_frequency) {
        //     this.updateInstanceVersion(metaData);
        // }

        let haveError = false;

        if (!this.state.edition) {
            this.setState({
                editionError: "You must select an edition"
            });
            haveError = true;
        }

        if (!this.state.isInstance && !this.state.releaseDate) {
            this.setState({
                releaseDateError: "You must add a release date"
            });
            haveError = true;
        }

        if (this.state.edition && this.state.isInstance && !haveError) {
            this.updateInstanceVersion(this.state.edition);
        }
    }


    render() {

        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-6">
                    <div className="margin-top--2">
                      &#9664; <Link to={url.resolve("/datasets")}>Back</Link>
                    </div>
                    <h1 className="margin-top--1 margin-bottom--1">New data</h1>
                    <p>This information is specific to this new data and can be updated each time new data is added.</p>
                      {this.state.isFetchingData ?
                          <div className="loader loader--dark"></div>
                      :
                      <div>
                        <h2 className="margin-top--1">{this.state.title}</h2>

                        <form onSubmit={this.handleFormSubmit}>
                          <div className="margin-bottom--2">
                            <div className="grid__col-6">
                              <Select
                                  disabled={this.state.state == "edition-confirmed" ? true : false}
                                  id="edition"
                                  label="Edition"
                                  contents={this.mapEditionsToSelectOptions()}
                                  onChange={this.handleSelectChange}
                                  error={this.state.editionError}
                                  selectedOption={this.state.edition}
                              />
                              <Input
                                    id="release_date"
                                    label="Release date"
                                    type="date"
                                    onChange={this.handleReleaseDateChange}
                                    error={this.state.releaseDateError}
                                    selectedOption={this.state.edition}
                              />
                            </div>
                            <div className="grid__col-6 margin-bottom--1">
                              <h2 className="margin-top--1">Notes and information</h2>
                              <Select
                                  id="release_frequency"
                                  contents={this.mapReleaseFreqToSelectOptions()}
                                  onChange={this.handleSelectChange}
                                  error={this.state.releaseError}
                                  label="Release frequency"
                                  selectedOption={this.state.release_frequency}
                              />
                            </div>
                            {this.state.isInstance &&
                             this.mapDimensionsToInputs(this.state.dimensions)
                           }
                          </div>
                          <button className="btn btn--positive">Save and add to collection</button>
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
      rootPath: state.state.rootPath,
      instance: state.state.datasets.activeInstance,
      version: state.state.datasets.activeVersion,
      recipes: state.state.datasets.recipes,
      dataset: state.state.datasets.activeDataset
    }
}

export default connect(mapStateToProps)(VersionMetadata);
