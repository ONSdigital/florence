import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';

import { errCodes } from '../../../utilities/errorCodes'
import datasets from '../../../utilities/api-clients/datasets';
import notifications from '../../../utilities/notifications';
import Modal from '../../../components/Modal';
import Select from '../../../components/Select';
import Checkbox from '../../../components/Checkbox';
import Input from '../../../components/Input';
import Card from '../../../components/Card';
import CardList from '../../../components/CardList';
import RelatedContentForm from './related-content/RelatedContentForm'
import {updateAllDatasets, updateActiveDataset} from '../../../config/actions';
import url from '../../../utilities/url';
import log, {eventTypes} from '../../../utilities/log'

const propTypes = {
    params: PropTypes.shape({
        datasetID: PropTypes.string.isRequired
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
    rootPath: PropTypes.string.isRequired,
    routes: PropTypes.arrayOf(PropTypes.object).isRequired,
    datasets: PropTypes.arrayOf(PropTypes.shape({
        next: PropTypes.shape({
            title: PropTypes.string
        }),
        current: PropTypes.shape({
            title: PropTypes.string
        })
    })),
    dataset: PropTypes.shape({
        title: PropTypes.string,
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
        })),
        release_frequency: PropTypes.string
    })
}

export class DatasetMetadata extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetchingDataset: false,
            isSubmittingData: false,
            hasChanges: false,
            error: null,
            showModal: false,
            modalType: "",
            title: "",
            description: "",
            relatedBulletins: [],
            relatedQMI: "",
            relatedLinks: [],
            keywords: "",
            titleInput: "",
            urlInput: "",
            editKey: "",
            contactName: "",
            contactEmail: "",
            contactPhone: "",
            releaseFrequency: "",
            isNationalStat: false,
            titleError: "",
            urlError: ""
        };

        this.originalState = null;

        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePageSubmit = this.handlePageSubmit.bind(this);
        this.handleToggleChange = this.handleToggleChange.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);
        this.handleModalSubmit = this.handleModalSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleAddRelatedClick = this.handleAddRelatedClick.bind(this);
        this.handleDeleteRelatedClick = this.handleDeleteRelatedClick.bind(this);
        this.handleEditRelatedClick = this.handleEditRelatedClick.bind(this);
        this.editRelatedLink = this.editRelatedLink.bind(this);
    }

    componentWillMount() {
        this.setState({isFetchingDataset: true});

        datasets.get(this.props.params.datasetID).then(response => {
            this.props.dispatch(updateActiveDataset(response.next || response.current));

            if (this.props.dataset && this.props.dataset.title) {
                this.setState({
                    title: this.props.dataset.title
                });
            }
            
            if (this.props.dataset && this.props.dataset.description) {
                this.setState({
                    description: this.props.dataset.description,
                });
            }

            if (this.props.dataset && this.props.dataset.release_frequency) {
                this.setState({
                    releaseFrequency: this.props.dataset.release_frequency
                });
            }
            
            if (this.props.dataset && this.props.dataset.national_statistic) {
                this.setState({
                    isNationalStat: this.props.dataset.national_statistic
                });
            }

            if (this.props.dataset.keywords && this.props.dataset.keywords.length > 0) {
                this.setState({
                    keywords: this.props.dataset.keywords.join(", ")
                });
            }

            if (this.props.dataset.contacts && this.props.dataset.contacts.length > 0) {
                const contact = this.props.dataset.contacts[0];
                this.setState({
                    contactName: contact.name,
                    contactEmail: contact.email,
                    contactPhone: contact.telephone
                })
            }

            if (this.props.dataset.publications && this.props.dataset.publications.length > 0) {
                const bulletins = this.props.dataset.publications.map(item => {
                    return {
                        title: item.title,
                        url: item.href,
                        key: uuid()
                    };
                });
                this.setState({relatedBulletins: bulletins});
            }

            if (this.props.dataset.related_datasets && this.props.dataset.related_datasets.length > 0) {
                const links = this.props.dataset.related_datasets.map(item => {
                    return {
                        title: item.title,
                        url: item.href,
                        key: uuid()
                    };
                });
                this.setState({relatedLinks: links});
            }

            if (this.props.dataset.qmi && this.props.dataset.qmi.title !== "") {
                const item = this.props.dataset.qmi
                const qmi = {title: item.title, url: item.href, key: uuid()}
                this.setState({relatedQMI: qmi})
            }

            this.setState({
                isFetchingDataset: false
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

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.isFetchingDataset) {
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
            this.setState({hasChanges: true});
        }
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

    handleSelectChange(event) {
        this.setState({
            error: "",
            releaseFrequency: event.target.value
        });
    }

    handleModalSubmit(event){
        event.preventDefault();
        this.setState({showModal: false});
        this.props.dispatch(push(url.resolve("/datasets")));
    }

    handleToggleChange(isChecked) {
      this.setState({isNationalStat: isChecked});
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
        if (this.state.hasChanges) {
            this.setState({showModal: true});
            return;
        }

        this.props.dispatch(push(url.resolve("/datasets")));
    }

    handleCancel() {
        this.setState({
            showModal: false,
            modalType: "",
            editKey: "",
            urlInput: "",
            titleInput: ""
        });
    }

    handleAddRelatedClick(type) {
        this.setState({
            showModal: true,
            modalType: type
        });
    }


     handleEditRelatedClick(type, key) {
        let relatedItem;

        if (type === "bulletin") {
            relatedItem = this.state.relatedBulletins.find(bulletin => {
                return bulletin.key === key;
            });
        }

        if (type === "qmi") {
            relatedItem = this.state.relatedQMI;
        }

        if (type === "link") {
            relatedItem = this.state.relatedLinks.find(link => {
                return link.key === key;
            });
        }

        this.setState({
            showModal: true,
            modalType: type,
            editKey: key,
            urlInput: relatedItem.url,
            titleInput: relatedItem.title
        });
     }

     handleDeleteRelatedClick(type, key) {
        function remove(items, key) {
            return items.filter(item => {
                return item.key !== key
            });
        }

        if (type === "bulletin") {
            this.setState({relatedBulletins: remove(this.state.relatedBulletins, key)});
            return;
        }

        if (type === "qmi") {
            this.setState({relatedQMI: ""});
            return;
        }

        if (type === "link") {
            this.setState({relatedLinks: remove(this.state.relatedLinks, key)});
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
                return {
                    ...item,
                    title: this.state.titleInput,
                    url: this.state.urlInput
                }
            });
        }

        if (type === "bulletin") {
            this.setState({relatedBulletins: edit(this.state.relatedBulletins, key)});
            return;
        }

        if (type === "qmi") {
            const editedQMI = {
                ...this.state.relatedQMI,
                title: this.state.titleInput,
                url: this.state.urlInput
            }
            this.setState({relatedQMI: editedQMI});
            return;
        }

        if (type === "link") {
            this.setState({relatedLinks: edit(this.state.relatedLinks, key)});
            return;
        }

        console.warn("Attempt to edit a related content type that is not recognised", type);
        log.add(eventTypes.unexpectedRuntimeError, `Attempt to edit a related content type that is not recognised: '${type}'`);
     }

     mapTypeContentsToCard(items){
        return items.map(item => {
            return {
                title: item.title,
                id: item.key,
            }
        });
     }

    splitKeywordsString(keywords) {
        return keywords.split(",").map(keyword => {
            return keyword.trim()
        });
    }
    
    mapStateToAPIRequest() {
        return {
            contacts: [{
                email: this.state.contactEmail,
                name: this.state.contactName,
                telephone: this.state.contactPhone,
            }],
            description: this.state.description,
            release_frequency: this.state.releaseFrequency,
            title: this.state.title,
            national_statistic: this.state.isNationalStat,
            keywords: this.splitKeywordsString(this.state.keywords),
            qmi: {
                title: this.state.relatedQMI.title,
                href: this.state.relatedQMI.url,
            },
            publications: [...this.state.relatedBulletins],
            related_datasets: [...this.state.relatedLinks],
        }
    }

    handleFormSubmit(event) {
        event.preventDefault();

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
                    this.editRelatedLink("bulletin", this.state.editKey);
                } else {
                    const bulletins = this.state.relatedBulletins.concat({title: this.state.titleInput, url: this.state.urlInput, key: uuid()});
                    this.setState({relatedBulletins: bulletins});
                }
            } else if (this.state.modalType === "qmi") {
                if (this.state.editKey != "") {
                    this.editRelatedLink("qmi", this.state.editKey);
                } else {
                    const qmi = {title: this.state.titleInput, url: this.state.urlInput, key: uuid()};
                    this.setState({relatedQMI: qmi});
                }
            } else if (this.state.modalType === "link") {
                if (this.state.editKey != "") {
                    this.editRelatedLink("link", this.state.editKey);
                } else {
                    const links = this.state.relatedLinks.concat({title: this.state.titleInput, url: this.state.urlInput, key: uuid()});
                    this.setState({relatedLinks: links});
                }
            }

            this.setState({
                showModal: false,
                modalType: "",
                editKey: "",
                titleInput: "",
                urlInput: ""
            });
        }
     }

    handlePageSubmit(event) {
        event.preventDefault();
        this.setState({ isSubmittingData: true });
        datasets.updateDatasetMetadata(this.props.params.datasetID, this.mapStateToAPIRequest()).then(() => {
            this.setState({ isSubmittingData: false });
            this.props.dispatch(push(`${location.pathname}/collection`));
        }).catch(error => {
            this.setState({ isSubmittingData: false });
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

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-4">
                    <div className="margin-top--2">
                        &#9664; <button type="button" className="btn btn--link" onClick={this.handleBackButton}>Back</button>
                    </div>
                    <h1 className="margin-top--1">Dataset details</h1>
                    <p className="margin-bottom--1">This information is common across all editions of the dataset.<br/>
                        Changing it will affect all previous editions.</p>
                    {this.state.isFetchingDataset ?
                        <div className="loader loader--dark"></div>
                    :
                        <div>
                            <h2 className="margin-top--1 margin-bottom--1">Dataset</h2>
                            <div className="margin-bottom--1"><strong>ID</strong><span className="inline-block margin-left--1">{this.props.params.datasetID || "Fetching dataset ID..."}
</span></div>
                          <form className="margin-bottom--4" onSubmit={this.handlePageSubmit}>

                              <Input
                                  value={this.state.title}
                                  id="title"
                                  label="Title"
                                  onChange={this.handleInputChange}
                                  disabled={this.state.isSubmittingData}
                              />
                              <Input
                                  value={this.state.description}
                                  type="textarea"
                                  id="description"
                                  label="About this dataset"
                                  onChange={this.handleInputChange}
                                  disabled={this.state.isSubmittingData}
                              />
                              <Input
                                  value={ this.state.keywords}
                                  id="keywords"
                                  label="Keywords"
                                  placeholder={`e.g. housing, inflation`}
                                  onChange={this.handleInputChange}
                                  disabled={this.state.isSubmittingData}
                              />
                              <div className="grid__col-6 margin-top--2">
                                <Checkbox
                                    isChecked={this.state.isNationalStat}
                                    onChange={this.handleToggleChange}
                                    disabled={this.state.isSubmittingData}
                                    label="National statistic"
                                    id="national-statistic"
                                />
                              </div>
                              <div className="grid__col-6 margin-bottom--1">
                                  <Select
                                      contents={this.mapReleaseFreqToSelectOptions()}
                                      selectedOption={this.state.releaseFrequency}
                                      onChange={this.handleSelectChange}
                                      error={this.state.error}
                                      label="Release frequency"
                                      id="release-frequency"
                                      disabled={this.state.isSubmittingData}
                                  />
                              </div>
                              <h3 className="margin-bottom--1">Contact</h3>
                              <Input
                                  value={this.state.contactName}
                                  id="contactName"
                                  label="Contact name"
                                  onChange={this.handleInputChange}
                                  disabled={this.state.isSubmittingData}
                              />
                              <Input
                                  value={this.state.contactEmail}
                                  id="contactEmail"
                                  label="Contact email"
                                  onChange={this.handleInputChange}
                                  disabled={this.state.isSubmittingData}
                              />
                              <Input
                                  value={this.state.contactPhone}
                                  id="contactPhone"
                                  label="Contact telephone"
                                  onChange={this.handleInputChange}
                                  disabled={this.state.isSubmittingData}
                              />
                        <h2 className="margin-top--2 margin-bottom--1">Related content</h2>
                        <div className="margin-bottom--1">
                            <p> These are common across all editions of the dataset. Changing them will affect all previous editions.</p>
                        </div>
                        <div className="margin-bottom--2">
                            <h3> Bulletins, articles and compendia </h3>
                            <CardList
                              contents={this.mapTypeContentsToCard(this.state.relatedBulletins)}
                              type="bulletin"
                              onEdit={this.handleEditRelatedClick}
                              onDelete={this.handleDeleteRelatedClick}
                              />
                            <button disabled={this.state.isSubmittingData} type="button" className="btn btn--link" onClick={() => {this.handleAddRelatedClick("bulletin")}}> Add document</button>
                        </div>
                        <div className="margin-bottom--2">
                            <h3> QMI </h3>
                                { this.state.relatedQMI.title != undefined ?
                                  <ul className="list--neutral">
                                    <Card
                                        title={this.state.relatedQMI.title}
                                        keyID={this.state.relatedQMI.key}
                                        type="qmi"
                                        onEdit={this.handleEditRelatedClick}
                                        onDelete={this.handleDeleteRelatedClick}
                                      />
                                  </ul>
                                :
                                  <button disabled={this.state.isSubmittingData} type="button" className="btn btn--link" onClick={() => {this.handleAddRelatedClick("qmi")}}> Add QMI </button>
                                }
                        </div>
                        <div className="margin-bottom--2">
                            <h3> Related links </h3>
                                <CardList
                                    contents={this.mapTypeContentsToCard(this.state.relatedLinks)}
                                    type="link"
                                    onEdit={this.handleEditRelatedClick}
                                    onDelete={this.handleDeleteRelatedClick}
                                />
                              <button disabled={this.state.isSubmittingData} type="button" className="btn btn--link" onClick={() => {this.handleAddRelatedClick("link")}}> Add related link</button>
                        </div>
                        <button type="submit" disabled={this.state.isSubmittingData} className="btn btn--positive" onClick={this.handlePageSubmit}>Save and continue</button>
                        {this.state.isSubmittingData &&
                            <div className="loader loader--centre loader--dark margin-left--1"></div>
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
