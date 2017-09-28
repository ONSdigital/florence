import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import http from '../../../utilities/http';
import { errCodes } from '../../../utilities/errorCodes'
import datasets from '../../../utilities/api-clients/datasets';
import notifications from '../../../utilities/notifications';
import Modal from '../../../components/Modal';
import Select from '../../../components/Select';
import Checkbox from '../../../components/Checkbox';
import Input from '../../../components/Input';
import {updateAllDatasets, updateActiveDataset} from '../../../config/actions';

const propTypes = {
    params: PropTypes.shape({
        dataset: PropTypes.string
    }),
    dispatch: PropTypes.func.isRequired,
    rootPath: PropTypes.string.isRequired,
    datasets: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    })),
    dataset: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      keywords: PropTypes.string.isRequired,
      national_statistic: PropTypes.bool.isRequired,
      periodicity: PropTypes.array.isRequired,
      contact: PropTypes.arrayOf(PropTypes.shape({
          name: PropTypes.string.isRequired,
          email: PropTypes.string.isRequired,
          telephone: PropTypes.string.isRequired
      }))
    })
}

class DatasetDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetchingDataset: false,
            error: null,
            showModal: false,
        };

        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleToggleChange = this.handleToggleChange.bind(this);
        this.handleModalSubmit = this.handleModalSubmit.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentWillMount() {
        this.setState({isFetchingDataset: true});

        const APIRequests = [
            datasets.get(this.props.params.dataset)
        ]

        if (this.props.datasets.length === 0) {
            APIRequests.push(datasets.getAll());
        }

        Promise.all(APIRequests).then(responses => {
            this.props.dispatch(updateActiveDataset(responses[0]));
            if (this.props.datasets.length === 0) {
                this.props.dispatch(updateAllDatasets(responses[1].items));
            }
            const contact = this.props.dataset.contact.find(details => {
                return {
                    name: details.name,
                    email: details.email,
                    telephone: details.telephone,
                }
            });
            this.setState({
                isFetchingDataset: false,
                description: this.props.dataset.description,
                title: this.props.dataset.title,
                keywords: this.props.dataset.keywords,
                isChecked:this.props.dataset.national_statistic,
                contactName: contact.name,
                contactEmail: contact.email,
                contactPhone: contact.telephone,
            });
          }).catch(error => {
              switch (error.status) {
                  case(403):{
                      const notification = {
                          "type": "info",
                          "message": "You do not permission to view this dataset",
                          isDismissable: true
                      }
                      notifications.add(notification);
                      break;
                  }
                  case (404): {
                      const notification = {
                          "type": "info",
                          "message": `Dataset ID '${this.props.params.dataset}' was not recognised. You've been redirected to the datasets home screen`,
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
            });
    }

    postDatasetDetails(body) {
       // Update to put to dataset api
        return http.put(`/`, body, true);
    }

    updateDatasetDetails(datasetDetailsData) {
      this.postDatasetDetails(datasetDetailsData).then(() => {
        // TO DO - Add correct path
        console.log(datasetDetailsData);
        this.props.dispatch(push(`${this.props.rootPath}/datasets`));
      }).catch(error => {
          if (error) {
              const notification = {
                  type: 'warning',
                  isDismissable: true,
                  autoDismiss: 15000
              };
              switch (error.status) {
                  case ('UNEXPECTED_ERR'): {
                      console.error(errCodes.UNEXPECTED_ERR);
                      notification.message = errCodes.UNEXPECTED_ERR;
                      notifications.add(notification);
                      break;
                  }
                  case ('RESPONSE_ERR'): {
                      console.error(errCodes.RESPONSE_ERR);
                      notification.message = errCodes.RESPONSE_ERR;
                      notifications.add(notification);
                      break;
                  }
                  case ('FETCH_ERR'): {
                      console.error(errCodes.FETCH_ERR);
                      notification.message = errCodes.FETCH_ERR;
                      notifications.add(notification);
                      break;
                  }
              }
          }
      });

    }

    mapReleaseFreqToSelectOptions() {
        return (this.props.dataset.periodicity).map((periodicity, index) => {
            return {
                id: `periodicity-${index}`,
                name: periodicity
            }
        });
    }

    handleSelectChange(event) {
        this.setState({
            periodicity: event.target.value
        });
    }

    handleToggleChange(event){
      this.setState({
        isChecked: event.target.checked,
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

     handleBackButton() {
         this.setState({showModal: true});
     }

     handleCancel() {
         this.setState({showModal: false});
     }

     handleModalSubmit(event){
       event.preventDefault();
       this.setState({showModal: false});
       this.props.dispatch(push(`${this.props.rootPath}/datasets`));
     }

     handleFormSubmit(event) {
         event.preventDefault();

         const datasetDetailsData = {
           contact: {
             email: this.state.contactEmail,
             name: this.state.contactName,
             telephone: this.state.contactPhone,
           },
           description: this.state.description,
           periodicity: this.state.periodicity,
           title: this.state.title,
           national_statistic: this.state.isChecked,
           keywords: this.state.keywords
         }
         if (!this.state.periodicity) {
             this.setState({
                 error: "You must select the periodicity"
             });
         } else {
           this.updateDatasetDetails(datasetDetailsData);
         }
     }

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-4">
                    <h1>Dataset details</h1>
                    <div className="margin-bottom--1">
                        &#9664; <a href="#" onClick={this.handleBackButton}>Back</a>
                    </div>
                    <p className="margin-bottom--1">This information is common across all editions of the dataset.<br/>
                        Changing it will affect all previous edition</p>
                    {this.state.isFetchingDataset ?
                        <div className="loader loader--dark"></div>
                    :
                        <div>
                            <h2 className="margin-bottom--1">Dataset</h2>
                            <div className="margin-bottom--1"><strong>ID</strong><span className="inline-block margin-left--1">{this.props.dataset.id || "Fetching dataset ID..."}
</span></div>
                          <form className="margin-bottom--4" onSubmit={this.handleFormSubmit}>

                              <Input
                                  defaultValue={this.props.dataset.title}
                                  id="title"
                                  label="Title"
                                  onChange={this.handleInputChange}
                              />
                              <Input
                                  defaultValue={this.props.dataset.description}
                                  type="textarea"
                                  id="description"
                                  label="About this dataset"
                                  onChange={this.handleInputChange}
                              />
                              <Input
                                  defaultValue={this.props.dataset.keywords}
                                  id="keywords"
                                  label="Keywords"
                                  onChange={this.handleInputChange}
                              />
                              <div className="grid__col-6 margin-top--1">
                                <Checkbox
                                    isChecked={this.state.isChecked}
                                    onChange={this.handleToggleChange}
                                    label="National Statistic"
                                    id="national-statistic"
                                />
                              </div>
                              <div className="grid__col-6 margin-bottom--1">
                                  <Select
                                      contents={this.mapReleaseFreqToSelectOptions()}
                                      onChange={this.handleSelectChange}
                                      error={this.state.error}
                                      label="Release frequency"
                                  />
                              </div>
                              <h3 className="margin-bottom--1">Contact</h3>
                              <Input
                                  defaultValue={this.state.contactName}
                                  id="contactName"
                                  label="Contact name"
                                  onChange={this.handleInputChange}
                              />
                              <Input
                                  defaultValue={this.state.contactEmail}
                                  id="contactEmail"
                                  label="Contact email"
                                  onChange={this.handleInputChange}
                              />
                              <Input
                                  defaultValue={this.state.contactPhone}
                                  id="contactPhone"
                                  label="Contact telephone"
                                  onChange={this.handleInputChange}
                              />
                              <button className="btn btn--positive">Save and continue</button>
                            </form>
                        </div>
                    }
                </div>
                {
                    this.state.showModal ?
                    <Modal sizeClass="grid__col-3">
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
                    </Modal>
                    :
                    ""
                }
          </div>
        )
    }
}

DatasetDetails.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        rootPath: state.state.rootPath,
        datasets: state.state.datasets.all,
        dataset: state.state.datasets.activeDataset
    }
}

export default connect(mapStateToProps)(DatasetDetails);
