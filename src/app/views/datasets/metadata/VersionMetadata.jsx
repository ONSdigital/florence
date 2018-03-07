import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import datasets from '../../../utilities/api-clients/datasets';
import recipes from '../../../utilities/api-clients/recipes';
import notifications from '../../../utilities/notifications';
import Select from '../../../components/Select';
import Input from '../../../components/Input';
import {updateActiveInstance, updateActiveVersion, updateAllRecipes, updateActiveDataset, emptyActiveVersion, emptyActiveInstance, updateActiveVersionReviewState} from '../../../config/actions';
import url from '../../../utilities/url'
import CardList from '../../../components/CardList';
import Modal from '../../../components/Modal';
import uuid from 'uuid/v4';
import RelatedContentForm from './related-content/RelatedContentForm';
import log, {eventTypes} from '../../../utilities/log'
import collections from '../../../utilities/api-clients/collections'

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    rootPath: PropTypes.string.isRequired,
    userEmail: PropTypes.string.isRequired,
    collectionID: PropTypes.string.isRequired,
    location: PropTypes.shape({
        query: PropTypes.shape({
            collection: PropTypes.string
        }).isRequired
    }).isRequired,
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
      release_date: PropTypes.string,
      state: PropTypes.string,
      id: PropTypes.string,
      dimensions: PropTypes.arrayOf(PropTypes.object),
      alerts: PropTypes.arrayOf(PropTypes.object),
      latest_changes: PropTypes.arrayOf(PropTypes.object)
    }),
    version: PropTypes.shape({
      edition: PropTypes.string,
      state: PropTypes.string,
      version: PropTypes.number,
      dimensions: PropTypes.arrayOf(PropTypes.object),
      release_date: PropTypes.string,
      id: PropTypes.string,
      alerts: PropTypes.arrayOf(PropTypes.object),
      latest_changes: PropTypes.arrayOf(PropTypes.object),
      lastEditedBy: PropTypes.string,
      reviewState: PropTypes.string
    }),
    isInstance: PropTypes.string
}

export class VersionMetadata extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingData: false,
            isSavingData: false,
            isReadOnly: false,
            isFetchingCollectionData: false,
            isInstance: null,
            hasChanges: false,
            edition: null,
            title: null,
            release_frequency: null,
            releaseDate: "",
            releaseDateError: "",
            dimensions: [],
            versionID: "",
            showModal: false,
            alerts: [],
            changes: [],
            editKey: "",
            titleInput: "",
            descInput: ""
        }

        this.originalState = null;

        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleRelatedContentSubmit = this.handleRelatedContentSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleReleaseDateChange = this.handleReleaseDateChange.bind(this);
        this.handleAddRelatedClick = this.handleAddRelatedClick.bind(this);
        this.handleDeleteRelatedClick = this.handleDeleteRelatedClick.bind(this);
        this.handleEditRelatedClick = this.handleEditRelatedClick.bind(this);
        this.editRelatedLink = this.editRelatedLink.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleSaveAndSubmitForReview = this.handleSaveAndSubmitForReview.bind(this);
        this.handleSaveAndMarkAsReviewed = this.handleSaveAndMarkAsReviewed.bind(this);
        this.handleRelatedContentCancel = this.handleRelatedContentCancel.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);
    }

    componentWillMount() {
      this.setState({isFetchingData: true});

      const getMetadata = [
          Promise.resolve(),
          Promise.resolve(),
          Promise.resolve()
      ];

      if (this.props.params.instanceID) {
        getMetadata[1] = datasets.getInstance(this.props.params.instanceID);
        this.setState({isInstance: true});
      } else {
        getMetadata[1] = datasets.getVersion(this.props.params.datasetID, this.props.params.edition, this.props.params.version);
        this.setState({isInstance: false});
      }

      if (!this.props.version || !this.props.version.reviewState || !this.props.version.lastEditedBy) {
        this.updateReviewStateData();
      }

      getMetadata[0] = recipes.getAll();
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
          if (this.props.version.alerts) {
            this.props.version.alerts.map((alert) => {
                alert.key = uuid();

                alerts.push(alert);
            })
          }

          var changes = [];
          if (this.props.version.latest_changes) {
            this.props.version.latest_changes.map((change) => {
                change.key = uuid();

                changes.push(change);
            })
          }

          this.setState({
            dimensions: this.props.version.dimensions,
            edition: this.props.version.edition,
            state: this.props.version.state,
            versionID: this.props.version.id,
            alerts: alerts,
            changes: changes,
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

    shouldComponentUpdate(nextProps, nextState) {
        // No need to re-render, this state update does not impact the view.
        if (nextState.isFetchingData) {
          return false;
        }
        return true;
    }

    componentDidUpdate(_, nextState) {
        /*
        We want to detect whether any changes have been made so we can show a warning if the
        user is leaving without saving
        */

        // We've already set the state to hasChanges, so do nothing
        if (nextState.hasChanges) {
            return;
        }

        // Set our initial state, so that we can detect whether there have been any unsaved changes
        if (!nextState.isFetchingDataset && !this.originalState && !nextState.hasChanges) {
            this.originalState = nextState;
            this.setState({hasChanges: false});
        }
    }

    componentWillUnmount() {
        if (this.state.isInstance) {
            this.props.dispatch(emptyActiveInstance());
        } else {
            this.props.dispatch(emptyActiveVersion());
        }
    }

    async updateReviewStateData() {
        this.setState({isFetchingCollectionData: true});
        const collectionID = this.props.collectionID;
        const params = this.props.params;
        
        try {
            const collection = await collections.get(collectionID);
            const version = collection.datasetVersions.find(datasetVersion => {
                return (
                    datasetVersion.id === params.datasetID && 
                    datasetVersion.edition === params.edition &&
                    datasetVersion.version === params.version
                )
            });
            if (!version) {
                notifications.add({
                    type: 'neutral',
                    message: `Unable to allow saving or reviewing because dataset version was not found in collection '${collection.name}'`,
                    isDismissable: true
                });
                this.setState({
                    isFetchingCollectionData: false,
                    isReadOnly: true
                });
                log.add(eventTypes.runtimeWarning, {message: `Unable to allow saving or reviewing because dataset '${params.datasetID}: ${params.edition} (version ${params.version})' was not found in collection '${collectionID}'`});
                return;
            }
            const lastEditedBy = version.lastEditedBy;
            const reviewState = version.state.charAt(0).toLowerCase() + version.state.slice(1); //lowercase it so it's consistent with the properties in our state (i.e. "InProgress" = "inProgress" )
            this.props.dispatch(updateActiveVersionReviewState(lastEditedBy, reviewState));
            this.setState({isFetchingCollectionData: false});
        } catch (error) {
            this.setState({
                isFetchingCollectionData: false,
                isReadOnly: true
            });
            switch (error.status) {
                case (401): {
                    // handled by request utility function
                    break;
                }
                case (403): {
                    const notification = {
                        "type": "neutral",
                        "message": `You do not permission to get details for collection '${collectionID}'`,
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                case (404): {
                    const notification = {
                        "type": "warning",
                        "message": `Could not find collection '${collectionID}'`,
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: `An unexpected error's occurred whilst trying to get the collection '${collectionID}'`,
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
            }
            log.add(eventTypes.unexpectedRuntimeError, {message: "Unable to update metadata screen with version's review/edit status in collection " + collectionID + ". Error: " + JSON.stringify(error)});
            console.error("Unable to update metadata screen with version's review/edit status in collection " + collectionID, error);
        }
    }

    postData(body) {
        if(this.state.isInstance) {
            return datasets.confirmEditionAndCreateVersion(this.props.params.instanceID, this.state.selectedEdition, body);
        }

        return datasets.updateVersionMetadata(this.props.params.datasetID, this.props.params.edition, this.props.params.version, body)
            .then(() => {
                var instanceID = "";
                if (this.state.instanceID) {
                    instanceID = this.state.instanceID;
                } else {
                    instanceID = this.state.versionID;
                }
                this.state.dimensions.map((dimension) => {
                    if (dimension.hasChanged === true) {
                        datasets.updateDimensionLabelAndDescription(instanceID, dimension.name, dimension.label, dimension.description);
                    }
                })
            })
            .catch(err => {
                if (err) {
                    return err
                }
            });
    }

    updateVersionReviewState(dataset, edition, version, isSubmittingForReview, isMarkingAsReviewed) {
        let request = Promise.resolve();

        this.setState({isSavingData: true});

        if (isSubmittingForReview) {
            request = collections.setDatasetVersionStatusToComplete;
        }
        
        if (isMarkingAsReviewed) {
            request = collections.setDatasetVersionStatusToReviewed;
        }

        request(this.props.collectionID, dataset, edition, version).then(() => {
            this.setState({isSavingData: false});
            this.props.dispatch(push(url.resolve(`/collections/${this.props.collectionID}`)));
        }).catch(error => {
            this.setState({isSavingData: false});

            switch (error.status) {
                case(401): {
                    // Handled by request utility function
                    break;
                }
                case(403): {
                    const notification = {
                        type: 'neutral',
                        message: `You do not have permission to set this version to 'Awaiting review' in the collection '${this.props.collectionID}'`,
                        isDismissable: true,
                        autoDismiss: 6000
                    };
                    notifications.add(notification);
                    break;
                }
                case(404): {
                    const notification = {
                        type: 'warning',
                        message: `Could not find collection '${this.props.collectionID}'`,
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                default: {
                    const notification = {
                        type: 'warning',
                        message: `An unexpected error's occurred whilst trying to set this version to 'Awaiting review' in the collection '${this.props.collectionID}'`,
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
            }

            log.add(eventTypes.unexpectedRuntimeError, {message: `Error updating review state for version ${dataset}/editions/${edition}/versions/${version} to '${isSubmittingForReview && "Complete"}${isMarkingAsReviewed && "Reviewed"}' in collection '${this.props.collectionID}'. Error: ${JSON.stringify(error)}`});

            console.error(`Error updating review state for version ${dataset}/editions/${edition}/versions/${version} to '${isSubmittingForReview && "Complete"}${isMarkingAsReviewed && "Reviewed"}' in collection '${this.props.collectionID}'`, error);
        })
    }

    updateInstanceVersion(body, isSubmittingForReview, isMarkingAsReviewed) {
        if ((isSubmittingForReview || isMarkingAsReviewed) && !this.state.isInstance) {
            this.updateVersionReviewState(this.props.params.datasetID, this.props.params.edition, this.props.params.version, isSubmittingForReview, isMarkingAsReviewed);
        }

        if (this.state.hasChanges || this.state.isInstance) {
            this.setState({isSavingData: true});
            return this.postData(body).then(() => {
                if (this.state.isInstance) {
                    datasets.getInstance(this.props.params.instanceID).then(response => {
                        this.setState({isSavingData: false});
                        this.props.dispatch(push(`${this.props.rootPath}/datasets/${this.props.params.datasetID}/editions/${response.edition}/versions/${response.version}/metadata?collection=${this.props.collectionID}`));
                        if (isSubmittingForReview || isMarkingAsReviewed) {
                            this.updateVersionReviewState(this.props.params.datasetID, response.edition, response.version, isSubmittingForReview, isMarkingAsReviewed);
                        }
                    });
                    return;
                }
                this.setState({isSavingData: false});
            }).catch(error => {
                this.setState({isSavingData: false});
                switch (error.status) {
                    case (401): {
                        // handled by request utility function
                        break;
                    }
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
    }

    mapTypeContentsToCard(items, type){
        return items.map(item => {
            return {
                title: type === "alerts" ? item.date : item.name,
                id: item.key,
            }
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
              <div key={dimension.id}>
                <Input
                    value={dimension.label ? dimension.label : dimension.name.charAt(0).toUpperCase() + dimension.name.slice(1)}                  
                    id={dimension.name}
                    name="dimension-name"
                    label="Dimension title"
                    onChange={this.handleInputChange}
                    disabled={this.state.isSavingData}
                />
                <Input
                    value={dimension.description}                  
                    type="textarea"
                    id={dimension.name} 
                    name="dimension-description"
                    label="Learn more (optional)"
                    onChange={this.handleInputChange}
                    disabled={this.state.isSavingData}
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
    
    handleEditRelatedClick(type, key) {
        let relatedItem;
        
        if (type === "alerts") {
            relatedItem = this.state.alerts.find(alert => {
                return alert.key === key;
            });
        }

        if (type === "changes") {
            relatedItem = this.state.changes.find(change => {
                return change.key === key;
            });
        }

        this.setState({
            showModal: true,
            modalType: type,
            editKey: key,
            titleInput: type === "alerts" ? relatedItem.date : relatedItem.name,
            descInput: relatedItem.description
        });
    }

    handleDeleteRelatedClick(type, key) {
        function remove(items, key) {
            return items.filter(item => {
                return item.key !== key
            });
        }

        if (type === "alerts") {
            this.setState({
                alerts: remove(this.state.alerts, key),
                hasChanges: true
            });
            return;
        }

        if (type === "changes") {
            this.setState({
                changes: remove(this.state.changes, key),
                hasChanges: true
            });
            return;
        }

        console.warn("Attempt to remove a related content type that is not recognised", type);
        log.add(eventTypes.unexpectedRuntimeError, `Attempt to remove a related content type that is not recognised: '${type}'`);
     }


     editRelatedLink(type, key) {
        const edit = items => {
            return items.map(item => {
                if (item.key !== key) {
                    return item;
                }
                if (type === "alerts") {
                    return {
                        ...item,
                        date: this.state.titleInput,
                        description: this.state.descInput,
                        type: "correction",
                        hasChanged: true
                    }
                }
                if (type === "changes") {
                    return {
                        ...item,
                        name: this.state.titleInput,
                        description: this.state.descInput,
                        type: "summary of changes",
                        hasChanged: true
                    }
                }
            });
        }
        if (type === "alerts") {
            this.setState({
                alerts: edit(this.state.alerts, key)
            });
            return;
        }

        if (type === "changes") {
            this.setState({
                changes: edit(this.state.changes, key)
            });
        }

        console.warn("Attempt to edit a related content type that is not recognised", type);
        log.add(eventTypes.unexpectedRuntimeError, `Attempt to edit a related content type that is not recognised: '${type}'`);
     }

     handleBackButton() {
        if (this.state.hasChanges) {
            this.setState({showModal: true});
            return;
        }

        this.props.dispatch(push(url.resolve("/datasets")));
    }
    
    handleRelatedContentCancel() {
        this.setState({
            showModal: false,
            modalType: "",
            editKey: "",
            descInput: "",
            titleInput: ""
        });
    }

    handleAddRelatedClick(type) {
        this.setState({
            showModal: true,
            modalType: type
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const id = target.id;
        if (name === "add-related-content-title") {
            this.setState({titleInput: value});
            if(this.state.titleError != null) {
                this.setState({titleError: null})
            }
        } else if (name === "add-related-content-desc") {
            this.setState({descInput: value});
            if(this.state.descError != null) {
                this.setState({descError: null})
            }
        } else if (name === "dimension-name") {
            let dimensionLabel;
            dimensionLabel = this.state.dimensions.map(dimension => {
                if (dimension.name === id){
                    return {
                        ...dimension,
                        label: value,
                        hasChanged: true
                    }
                }

                return dimension
            });
            this.setState({
                dimensions: dimensionLabel
            });
        } else if (name === "dimension-description") {
            let dimensionDesc;
            dimensionDesc = this.state.dimensions.map(dimension => {
                if (dimension.name === id){
                    return {
                        ...dimension,
                        description: value,
                        hasChanged: true
                    }
                }

                return dimension
            });
            this.setState({
                dimensions: dimensionDesc
            });
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

    handleRelatedContentSubmit(event) {
        event.preventDefault();

        if(this.state.titleInput == "" || this.state.descInput == ""){
            if(this.state.titleInput == ""){
                this.setState({
                    titleError: "You must provide a value"
                });
            }
            if (this.state.descInput == ""){
                this.setState({
                    descError: "You must provide a description"
                });
            }
        } else {
            if (this.state.modalType === "alerts") {
                if (this.state.editKey != "") {
                    this.editRelatedLink("alerts", this.state.editKey);
                } else {
                    const alerts = this.state.alerts.concat({date: this.state.titleInput, description: this.state.descInput, key: uuid(), hasChanged:true, type: "correction"});
                    this.setState({alerts: alerts});
                }
            } else if (this.state.modalType === "changes") {
                if (this.state.editKey != "") {
                    this.editRelatedLink("changes", this.state.editKey);
                } else {
                    const changes = this.state.changes.concat({name: this.state.titleInput, description: this.state.descInput, key: uuid(), hasChanged:true, type: "summary of changes"});
                    this.setState({changes: changes});
                }
            } 

            this.setState({
                showModal: false,
                modalType: "",
                editKey: "",
                titleInput: "",
                descInput: ""
            });
        }
     }

    handleSave(event, isSubmittingForReview, isMarkingAsReviewed) {
        event.preventDefault();
        
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

        const alerts = this.state.alerts.filter(alert => {
            return alert.hasChanged;
        });

        const changes = this.state.changes.filter(change => {
            return change.hasChanged;
        });

        if (this.state.edition && this.state.isInstance && !haveError) {
            const instanceMetadata = {
                edition: this.state.edition,
                alerts: alerts,
                latest_changes: changes
            }
            if (this.state.releaseDate) {
                instanceMetadata.release_date = this.state.releaseDate.toISOString();
            }
            this.updateInstanceVersion(instanceMetadata, isSubmittingForReview, isMarkingAsReviewed);
            return;
        }

        if (!this.state.isInstance && !haveError) {
            this.updateInstanceVersion({
                release_date: this.state.releaseDate.toISOString(),
                alerts: alerts,
                latest_changes: changes
            }, isSubmittingForReview, isMarkingAsReviewed);
        }
    }

    handleSaveAndSubmitForReview(event) {
        this.handleSave(event, true, false);
    }

    handleSaveAndMarkAsReviewed(event) {
        this.handleSave(event, false, true);
    }

    renderReviewActions() {
        if (this.state.isReadOnly || this.state.isFetchingCollectionData) {
            return;
        }

        if (this.props.version.reviewState === "reviewed") {
            return;
        }

        if (this.props.version.reviewState === "inProgress") {
            return (
                <button className="btn btn--positive margin-left--1" type="button" disabled={this.state.isSavingData} onClick={this.handleSaveAndSubmitForReview}>Save and submit for review</button>
            )
        }
        
        if (this.props.userEmail !== this.props.version.lastEditedBy && this.props.version.reviewState === "complete") {
            return (
                <button className="btn btn--positive margin-left--1" type="button" disabled={this.state.isSavingData} onClick={this.handleSaveAndMarkAsReviewed}>Save and submit for approval</button>
            )
        }

        return;
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-4">
                    <div className="margin-top--2">
                        &#9664; <button type="button" className="btn btn--link" onClick={this.handleBackButton}>Back</button>
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

                        <form onSubmit={this.handleSave}>
                          <div className="margin-bottom--2">
                            <div className="grid__col-6">
                              <Select
                                  id="edition"
                                  label="Edition"
                                  contents={this.mapEditionsToSelectOptions()}
                                  onChange={this.handleSelectChange}
                                  error={this.state.editionError}
                                  selectedOption={this.state.edition}
                                  disabled={this.state.isSavingData}
                              />
                              <Input
                                    id="release_date"
                                    label="Release date"
                                    type="date"
                                    value={this.state.releaseDate && this.state.releaseDate.toISOString().substring(0, 10)}
                                    onChange={this.handleReleaseDateChange}
                                    error={this.state.releaseDateError}
                                    selectedOption={this.state.edition}
                                    disabled={this.state.isSavingData}
                              />
                            </div>
                            <h2> In this dataset </h2>
                            {this.mapDimensionsToInputs(this.state.dimensions)}
                            <div className="margin-bottom--1">
                                <h2 className="margin-top--2 margin-bottom--1">What's changed</h2>
                                <p>The information below can change with each edition/version.</p>
                                <div className="margin-bottom--1">
                                    <h3 className="margin-top--1 margin-bottom--1">Alerts and corrections</h3>
                                    <CardList
                                        contents={this.mapTypeContentsToCard(this.state.alerts, "alerts")}
                                        type="alerts"
                                        onEdit={this.handleEditRelatedClick}
                                        onDelete={this.handleDeleteRelatedClick}
                                    />
                                    <button disabled={this.state.isSavingData || this.state.isReadOnly} type="button" className="btn btn--link" onClick={() => {this.handleAddRelatedClick("alerts")}}> Add an alert</button>
                                </div>
                                <div className="margin-bottom--1">
                                    <h3 className="margin-top--1 margin-bottom--1">Summary of changes</h3>
                                    <CardList
                                        contents={this.mapTypeContentsToCard(this.state.changes, "changes")}
                                        type="changes"
                                        onEdit={this.handleEditRelatedClick}
                                        onDelete={this.handleDeleteRelatedClick}

                                    />
                                    <button disabled={this.state.isSavingData || this.state.isReadOnly} type="button" className="btn btn--link" onClick={() => {this.handleAddRelatedClick("changes")}}> Add change</button>
                                </div>
                            </div>
                          </div>
                          <button type="submit" className="btn btn--positive margin-bottom--1" disabled={this.state.isReadOnly || this.state.isFetchingCollectionData || this.state.isSavingData}>Save</button>
                          {this.renderReviewActions()}
                          {/* TODO render a 'preview' call to action */}
                          {this.state.isSavingData &&
                            <div className="loader loader--dark loader--inline margin-left--1"></div>
                          }
                        </form>
                      </div>
                    }
                </div>
                {this.state.showModal &&

                <Modal sizeClass="grid__col-3">
                        {this.state.modalType ?

                          <RelatedContentForm
                              name="related-content-modal"
                              formTitle={this.state.modalType === "alerts" ? "Add an alert" : "Add latest change"}
                              titleInput={this.state.titleInput}
                              descInput={this.state.descInput}
                              titleLabel={this.state.modalType === "alerts" ? "Date (e.g 01 September 2017)" : "Name"}
                              descLabel={"Description"}
                              onCancel={this.handleRelatedContentCancel}
                              onFormInput={this.handleInputChange}
                              onFormSubmit={this.handleRelatedContentSubmit}
                              titleError={this.state.titleErzror}
                              descError={this.state.descError}
                              requiresDescription={true}
                              requiresURL={false}
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
                          <button type="button" className="btn" onClick={this.handleRelatedContentCancel}>Cancel</button>
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
      userEmail: state.state.user.email,
      collectionID: state.routing.locationBeforeTransitions.query.collection,
      instance: state.state.datasets.activeInstance,
      version: state.state.datasets.activeVersion,
      recipes: state.state.datasets.recipes,
      dataset: state.state.datasets.activeDataset
    }
}

export default connect(mapStateToProps)(VersionMetadata);
