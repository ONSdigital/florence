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
import Card from '../../../components/Card';
import CardList from '../../../components/CardList';
import RelatedDataController from './related-content/RelatedDataController';
import {updateAllDatasets, updateActiveDataset} from '../../../config/actions';

const propTypes = {
    params: PropTypes.shape({
        datasetID: PropTypes.string
    }),
    dispatch: PropTypes.func.isRequired,
    rootPath: PropTypes.string.isRequired,
    routes: PropTypes.arrayOf(PropTypes.object).isRequired,
    datasets: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
    })),
    dataset: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      keywords: PropTypes.array,
      national_statistic: PropTypes.bool,
      contacts: PropTypes.arrayOf(PropTypes.shape({
          name: PropTypes.string,
          email: PropTypes.string,
          telephone: PropTypes.string,
      })),
      qmi: PropTypes.shape({
          href: PropTypes.string,
          title: PropTypes.string,
      }),
      related_datasets: PropTypes.arrayOf(PropTypes.shape({
          href: PropTypes.string,
          title: PropTypes.string,
      })),
      publications: PropTypes.arrayOf(PropTypes.shape({
          href: PropTypes.string,
          title: PropTypes.string,
      }))
    })
}

class DatasetMetadata extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetchingDataset: false,
            error: null,
            showModal: false,
            modalType: "",
            relatedBulletins: [],
            relatedQMI: "",
            relatedLinks: [],
            keywords: [],
            titleInput: "",
            urlInput: "",
            editKey: "",
        };

        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePageSubmit = this.handlePageSubmit.bind(this);
        this.handleToggleChange = this.handleToggleChange.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);
        this.handleModalSubmit = this.handleModalSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleAddRelatedClick = this.handleAddRelatedClick.bind(this);
        this.removeRelated = this.removeRelated.bind(this);
        this.handleEditRelatedClick = this.handleEditRelatedClick.bind(this);
        this.handleActions = this.handleActions.bind(this);
    }

    componentWillMount() {
        this.setState({isFetchingDataset: true});

        function guid() {
            function S4() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            }
            return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
        }

        const APIRequests = [
            datasets.get(this.props.params.datasetID)
        ]

        if (this.props.datasets.length === 0) {
            APIRequests.push(datasets.getAll());
        }

        Promise.all(APIRequests).then(responses => {
            this.props.dispatch(updateActiveDataset(responses[0].current));
            if (this.props.datasets.length === 0) {
                this.props.dispatch(updateAllDatasets(responses[1].items));
            }

            const contact = this.props.dataset.contacts.find(details => {
                return {
                    name: details.name,
                    email: details.email,
                    telephone: details.telephone,
                }
            });

            { this.props.dataset.publications &&
              this.props.dataset.publications.map(item => {
                  const bulletin = {title: item.title, url: item.href, key: guid()}
                  const bulletins = this.state.relatedBulletins.concat(bulletin);
                  this.setState({relatedBulletins: bulletins})
              })
            }

            { this.props.dataset.related_datasets &&
              this.props.dataset.related_datasets.map(item => {
                  const link = {title: item.title, url: item.href, key: guid()}
                  const links = this.state.relatedLinks.concat(link);
                  this.setState({relatedLinks: links})
              })
            }

            if (this.props.dataset.qmi.title != "") {
                const item = this.props.dataset.qmi
                const qmi = {title: item.title, url: item.href, key: guid()}
                this.setState({relatedQMI: qmi})
            }

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
                          "message": `Dataset ID '${this.props.params.datasetID}' was not recognised. You've been redirected to the datasets home screen`,
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
      return http.put(`${datasets}`, body, true);
    }

    updateDatasetDetails(datasetDetailsData) {
      this.postDatasetDetails(datasetDetailsData).then(() => {
        // TO DO - Add correct path
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
        const values = [
          'Weekly', 'Monthly', 'Annually'
        ];

        return values.map(value => {
            return {
              id: value.toLowerCase(),
              name: value
            }
        });
    }

    convertKeywordsToString() {
        const keywords = this.props.dataset.keywords.map(keyword => {
            return keyword
        });
        const keywordString = keywords.join(", ");
        return keywordString;
    }

    handleSelectChange(event) {
        this.setState({
            periodicity: event.target.value
        });
    }

     handleModalSubmit(event){
       event.preventDefault();
       this.setState({showModal: false});
       this.props.dispatch(push(`${this.props.rootPath}/datasets`));
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
       if (name === "add-related-content-title") {
           this.setState({titleInput: value});
           if(this.state.titleError != null) {
             this.setState({titleError: null})
           }
       } else if (name === "add-related-content-url") {
           this.setState({urlInput: value});
           if(this.state.urlError != null) {
             this.setState({urlError: null})
           }
       } else {
         this.setState({
           [name]: value
         });

       }

     }

     handleBackButton() {
         this.setState({showModal: true});
     }

     handleCancel() {
         this.setState({showModal: false});
         this.setState({modalType: ""});
         this.setState({editKey: ""});
     }

     handleAddRelatedClick(type) {
         this.setState({showModal: true});
         this.setState({modalType: type});
     }


     handleEditRelatedClick(type, key) {
         this.setState({showModal: true});
         this.setState({modalType: type});
         this.setState({editKey: key});
     }

     removeRelated(type, key) {
         function remove(arr, key) {
             arr.map((item, index) => {
                 if (item.key === key) {
                     arr.splice(index, 1);
                 }
             })
             return arr
         }

         if (type === "bulletin") {
             var bulletins = remove(this.state.relatedBulletins, key)
             this.setState({relatedBulletins: bulletins});
         } else if (type === "qmi") {
             this.setState({relatedQMI: ""});
         } else if (type === "link") {
             var links = remove(this.state.relatedLinks, key)
             this.setState({relatedLinks: links});
         }
     }

     handleActions(type, key, action){

       if(action === "edit"){
         this.setState({showModal: true});
         this.setState({modalType: type});
         this.setState({editKey: key});
       }

       if(action === "remove"){
         this.removeRelated(type, key);
       }

     }

     mapTypeContentsToCard(items){
         return (items).map(item => {
           return {
             title: item.title,
             key: item.key,
           }
         });
     }

     handleFormSubmit(event) {
         event.preventDefault();
         function guid() {
               function S4() {
                   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
               }
               return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
           }

         if(this.state.titleInput == "" || this.state.urlInput == ""){
           if(this.state.titleInput == ""){
             this.setState({
                 titleError: "You must provide a title"
             });
           }
           if (this.state.urlInput == ""){
             this.setState({
                 urlError: "You must provide a url"
             });
           }
         } else {
         if (this.state.modalType === "bulletin") {
             if (this.state.editKey != "") {
                 this.removeRelated("bulletin", this.state.editKey)
             }
             const bulletins = this.state.relatedBulletins.concat({title: this.state.titleInput, url: this.state.urlInput, key: guid()});
             this.setState({relatedBulletins: bulletins});
         } else if (this.state.modalType === "qmi") {
             if (this.state.editKey != "") {
                 this.removeRelated("qmi", this.state.editKey)
             }
             const qmi = {title: this.state.titleInput, url: this.state.urlInput, key: guid()};
             this.setState({relatedQMI: qmi});
         } else if (this.state.modalType === "link") {
             if (this.state.editKey != "") {
                 this.removeRelated("link", this.state.editKey)
             }
             const links = this.state.relatedLinks.concat({title: this.state.titleInput, url: this.state.urlInput, key: guid()});
             this.setState({relatedLinks: links});
         }

         this.setState({showModal: false});
         this.setState({modalType: ""});
         this.setState({editKey: ""})
       }
     }

     handlePageSubmit(event) {

         event.preventDefault();

         const datasetDetailsData = {
           contact: {
             email: this.state.contactEmail,
             name: this.state.contactName,
             telephone: this.state.contactPhone,
           },
           description: this.state.description,
           release_frequency: this.state.periodicity,
           title: this.state.title,
           national_statistic: this.state.isChecked,
           keywords: this.state.keywords,
           qmi: {
             title: this.state.relatedQMI.title,
             href: this.state.relatedQMI.url,
           },
           publications: [...this.state.relatedBulletins],
           related_datasets: [...this.state.relatedLinks],
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
                            <div className="margin-bottom--1"><strong>ID</strong><span className="inline-block margin-left--1">{this.props.params.datasetID || "Fetching dataset ID..."}
</span></div>
                          <form className="margin-bottom--4" onSubmit={this.handlePageSubmit}>

                              <Input
                                  value={this.props.dataset.title}
                                  id="title"
                                  label="Title"
                                  onChange={this.handleInputChange}
                              />
                              <Input
                                  value={this.props.dataset.description}
                                  type="textarea"
                                  id="description"
                                  label="About this dataset"
                                  onChange={this.handleInputChange}
                              />
                              <Input
                                  value={ this.props.dataset.keywords ? this.convertKeywordsToString() : ""}
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
                                  value={this.state.contactName}
                                  id="contactName"
                                  label="Contact name"
                                  onChange={this.handleInputChange}
                              />
                              <Input
                                  value={this.state.contactEmail}
                                  id="contactEmail"
                                  label="Contact email"
                                  onChange={this.handleInputChange}
                              />
                              <Input
                                  value={this.state.contactPhone}
                                  id="contactPhone"
                                  label="Contact telephone"
                                  onChange={this.handleInputChange}
                              />
                        <h2 className="margin-bottom--1">Related content</h2>
                        <div className="margin-bottom--1">
                            <p> These are common across all editions of the dataset. Changing them will affect all previous editions.</p>
                        </div>
                        <div className="margin-bottom--2">
                            <h3> Bulletins, articles and compendia </h3>
                            <CardList
                              contents={this.mapTypeContentsToCard(this.state.relatedBulletins)}
                              type="bulletin"
                              listActions={this.handleActions}
                              />
                            <a href="#" onClick={() => {this.handleAddRelatedClick("bulletin")}}> Add document</a>
                        </div>
                        <div className="margin-bottom--2">
                            <h3> QMI </h3>
                                { this.state.relatedQMI.title != undefined ?
                                  <ul className="list--neutral">
                                    <Card
                                      title={this.state.relatedQMI.title}
                                      keyID={this.state.relatedQMI.key}
                                      type="qmi"
                                      onEdit={this.handleActions}
                                      />
                                  </ul>
                                :
                                  <a href="#" onClick={() => {this.handleAddRelatedClick("qmi")}}> Add QMI </a>
                                }
                        </div>
                        <div className="margin-bottom--2">
                            <h3> Related links </h3>
                                <CardList
                                  contents={this.mapTypeContentsToCard(this.state.relatedLinks)}
                                  type="link"
                                  listActions={this.handleActions}
                                  />
                              <a href="#" onClick={() => {this.handleAddRelatedClick("link")}}> Add related link</a>
                        </div>
                        <button className="btn btn--positive" onClick={this.handlePageSubmit}>Save and Continue</button>
                        </form>
                    </div>
                }
                  </div>
                  {
                      this.state.showModal &&

                      <Modal sizeClass="grid__col-3">
                        {
                            this.state.modalType ?

                          <RelatedDataController
                              name="related-content-modal"
                              titleInput={this.state.titleInput}
                              urlInput={this.state.urlInput}
                              onCancel={this.handleCancel}
                              onFormInput={this.handleInputChange}
                              onFormSubmit={this.handleFormSubmit}
                              titleError={this.state.titleError}
                              urlError={this.state.urlError}
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

DatasetMetadata.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        rootPath: state.state.rootPath,
        datasets: state.state.datasets.all,
        dataset: state.state.datasets.activeDataset
    }
}

export default connect(mapStateToProps)(DatasetMetadata);
