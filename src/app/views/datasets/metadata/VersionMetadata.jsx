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
import CardList from '../../../components/CardList';
import Modal from '../../../components/Modal';
import uuid from 'uuid/v4';
import AlertsForm from './alerts/AlertsForm';

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
      title: PropTypes.string,
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
      release_date: PropTypes.string,
      id: PropTypes.string,
      alerts: PropTypes.arrayOf(PropTypes.object)
    }),
    isInstance: PropTypes.string,
    btn: PropTypes.string
}

class VersionMetadata extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingData: false,
            isInstance: null,
            hasChanges: false,
            edition: null,
            title: null,
            release_frequency: null,
            releaseDate: "",
            releaseDateError: "",
            dimensions: [],
            btn: "",
            versionID: "",
            showModal: false,
            alerts: [],
            editKey: ""
        }

        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleAlertSubmit = this.handleAlertSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleReleaseDateChange = this.handleReleaseDateChange.bind(this);
        this.mapAlertsToCard = this.mapAlertsToCard.bind(this);
        this.handleEditAlertsClick = this.handleEditAlertsClick.bind(this);
        this.handleDeleteAlertsClick = this.handleDeleteAlertsClick.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
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

          var alerts = [];
          this.props.version.alerts.map((alert) => {
              alert.key = uuid();

              alerts.push(alert);
          })
        
          this.setState({
            dimensions: this.props.version.dimensions,
            edition: this.props.version.edition,
            state: this.props.version.state,
            versionID: this.props.version.id,
            alerts: alerts,
            releaseDate: this.props.version.release_date ? new Date(this.props.version.release_date) : ""
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

    handleEditAlertsClick(type, key) {
        let alert;

        alert = this.state.alerts.find(alrt => {
            return alrt.key === key
        })

        this.setState({
            showModal: true,
            modalType: type,
            editKey: key,
            dateInput: alert.date,
            descriptionInput: alert.description
        });
    }

    handleDeleteAlertsClick(type, key) {
        function remove(items, key) {
            return items.filter(item => {
                return item.key !== key
            });
        }

        this.setState({
            alerts: remove(this.state.alerts, key),
            hasChanges: true
        })
    }

    handleAddAlertsClick(type) {
        this.setState({
            showModal: true,
            modalType: type
        })
    }

    handleAlertSubmit(event) {
        event.preventDefault();

        if (this.state.dateInput == "" || this.state.descriptionInput == "") {
            if(this.state.dateInput == ""){
                this.setState({
                    dateError: "You must provide a date"
                });
            }
            if (this.state.descriptionInput == ""){
                this.setState({
                    descriptionError: "You must provide an alert description"
                });
            }
        } else {
            if (this.state.editKey !== "") {
                const edit = items => {
                    return items.map(item => {
                        if (item.key !== this.state.editKey) {
                            return item;
                        }
                        return {
                            ...item,
                            date: this.state.dateInput,
                            description: this.state.descriptionInput
                        }
                    });
                }

                this.setState({alerts: edit(this.state.alerts, this.state.editKey)})
            } else {
                const alerts = this.state.alerts.concat({date: this.state.dateInput, description: this.state.descriptionInput, key: uuid()})
                this.setState({alerts: alerts});
            }

            this.setState({
                showModal: false,
                modalType: "",
                editKey: "",
                dateInput: "",
                descriptionInputhandleFormSubmit: ""
            });
        }
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
        return datasets.updateVersionMetadata(this.props.params.datasetID, this.props.params.edition, this.props.params.version, body)
            .then(() => {
                this.state.dimensions.map((dimension) => {
                    if (this.state[dimension.name]) {
                        var instanceID = "";
                        if (this.state.instanceID) {
                            instanceID = this.state.instanceID;
                        } else {
                            instanceID = this.state.versionID;
                        }

                        datasets.updateDimensionDescription(instanceID, dimension.name, this.state[dimension.name]);
                    }
                })
            })
            .catch(err => {
                if (err) {
                    return err
                }
            });
    }

    updateInstanceVersion(body) {

        if (this.state.hasChanges || this.state.isInstance) {
            return this.postData(body).then(() => {
                if (this.state.btn === "return") {
                    this.props.dispatch(push("/florence/datasets"));
                } else {
                    if (this.state.btn === "add") {
                        if (this.state.isInstance) {
                            datasets.getInstance(this.props.params.instanceID).then(response => {
                                this.props.dispatch(push(`${this.props.rootPath}/datasets/${this.props.params.datasetID}/editions/${response.edition}/versions/${response.version}/collection`));
                            });
                        } else {
                            this.props.dispatch(push(url.resolve("collection")));
                        }
                    } else {
                        console.log("previewing")
                        this.props.dispatch(push(url.resolve("collection/preview")));
                    }
                }
            }).catch(error => {
                switch (error.status) {
                    case (403): {
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

        if (this.state.btn === "return") {
            this.props.dispatch(push("/florence/datasets"));
        } else {
            if (!this.state.isInstance && !this.state.hasChanges) {
                if (this.state.btn === "add") {
                    this.props.dispatch(push(url.resolve("collection")));
                } else {
                    this.props.dispatch(push(url.resolve("collection/preview")));
                }
            }
        }
    }

    mapAlertsToCard(items) {
        if (items !== undefined) {
            return items.map(item => {
                return {
                    title: item.date,
                    id: item.key
                }
            })
        }
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
                  value={dimension.description}                  
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
        if (name === "add-alert-date") {
            this.setState({dateInput: value});
            if(this.state.dateError != null) {
                this.setState({dateError: null})
            }
        } else if (name === "add-alert-description") {
            this.setState({descriptionInput: value});
            if(this.state.descriptionError != null) {
                this.setState({descriptionError: null})
            }
        } else {
            this.setState({
                [name]: value
            });
        }

        this.setState({hasChanges: true});
     }

     handleSelectChange(event) {
        const target = event.target;
        const value = target.value;
        const id = target.id;
        this.setState({
          [id]: value,
          hasChanges: true
        });
      }

    handleReleaseDateChange(event) {
        const value = event.target.value;
        const releaseDate = value ? new Date(value) : "";
        this.setState({
            releaseDateError: "",
            releaseDate,
            hasChanges: true
        });
    }

    handleFormSubmit(event, btn) {
        event.preventDefault();

        this.setState({btn: btn}, function () {

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
                const instanceMetadata = {
                    edition: this.state.edition,
                    alerts: this.state.alerts
                }
                if (this.state.releaseDate) {
                    instanceMetadata.release_date = this.state.releaseDate.toISOString();
                }
                this.updateInstanceVersion(instanceMetadata);
                return;
            }

            if (!this.state.isInstance && !haveError) {
                this.updateInstanceVersion({
                    release_date: this.state.releaseDate.toISOString(),
                    alerts: this.state.alerts
                });
            }
        });

    }

    handleCancel() {
        this.setState({
            showModal: false,
            modalType: "",
            editKey: "",
            dateInput: "",
            descriptionInput: ""
        });
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-6">
                    <div className="margin-top--2">
                      &#9664; <Link to={url.resolve("/datasets")}>Back</Link>
                    </div>
                    <h1 className="margin-top--1 margin-bottom--1">Metadata</h1>
                    <p>This information is specific to this new data and can be updated each time new data is added.</p>
                      {this.state.isFetchingData ?
                        <div className="margin-top--2">
                            <div className="loader loader--dark"></div>
                        </div>
                      :
                      <div className="padding-bottom--2">
                        <h2 className="margin-top--1">{this.state.title || this.props.params.datasetID + " (title not available)"}</h2>

                        <form>
                          <div className="margin-bottom--2">
                            <div className="grid__col-6">
                              <Select
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
                                    value={this.state.releaseDate && this.state.releaseDate.toISOString().substring(0, 10)}
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
                            {this.mapDimensionsToInputs(this.state.dimensions)}
                            <div className="margin-bottom--1">
                                <h1 className="margin-top--2 margin-bottom--1">What's changed</h1>
                                <p>The information below can change with each edition/version.</p>
                                <div className="margin-bottom--1">
                                    <h2 className="margin-top--1 margin-bottom--1">Alerts and corrections</h2>
                                    <CardList
                                        contents={this.mapAlertsToCard(this.state.alerts)}
                                        type="alerts"
                                        onEdit={this.handleEditAlertsClick}
                                        onDelete={this.handleDeleteAlertsClick}
                                    />
                                    <button disabled={this.state.isSubmittingData} type="button" className="btn btn--link" onClick={() => {this.handleAddAlertsClick("alert")}}> Add an alert</button>
                                </div>
                            </div>
                          </div>
                          <button className="btn btn--positive" id="save-and-return" onClick={(e) => this.handleFormSubmit(e, "return")}>Save and return</button>
                          { this.state.edition && this.state.releaseDate ?
                            <button className="margin-left--1 btn btn--positive" id="save-and-add" onClick={(e) => this.handleFormSubmit(e, "add")}>Save and add to collection</button>
                            :
                            ""
                          }
                          {
                              this.state.state === "associated" ?
                              <button className="margin-left--1 btn btn--positive" id="save-and-preview" onClick={(e) => this.handleFormSubmit(e, "preview")}>Save and preview</button>
                              :
                              ""
                          }
                        </form>
                      </div>
                    }
                </div>
                {this.state.showModal &&

                    <Modal sizeClass="grid__col-3">
                    {this.state.modalType ?

                        <AlertsForm
                            dateInput={this.state.dateInput}
                            descriptionInput={this.state.descriptionInput}
                            onCancel={this.handleCancel}
                            onFormInput={this.handleInputChange}
                            onFormSubmit={this.handleAlertSubmit}
                            dateError={this.state.dateError}
                            descriptionError={this.state.descriptionError}
                        />
                    :
                        <div>
                        <div className="modal__header">
                            <h2>Warning!</h2>
                        </div>
                        <div className="modal__body">
                            <p>You will lose any changes by going back without saving. </p><br/>
                            <p>Click "Continue" to lose changes and go back to the previous page or
                                click "Cancel" to stay on the current page.</p>
                        </div>
                        <div className="modal__footer">
                        <button type="button" className="btn btn--primary btn--margin-right" onClick={this.handleModalSubmit}>Continue</button>
                        <button type="button" className="btn" onClick={this.handleCancel}>Cancel</button>
                        </div>
                    </div>
                    }
                    </Modal>

                }
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
      dataset: state.state.datasets.activeDataset,
      btn: state.state.btn
    }
}

export default connect(mapStateToProps)(VersionMetadata);
