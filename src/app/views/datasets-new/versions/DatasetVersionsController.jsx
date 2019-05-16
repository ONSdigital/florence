import React, { Component } from 'react';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import datasets from '../../../utilities/api-clients/datasets';
import notifications from '../../../utilities/notifications';
import url from '../../../utilities/url'
import date from '../../../utilities/date'

import SimpleSelectableList from '../../../components/simple-selectable-list/SimpleSelectableList';

const propTypes = {
    params: PropTypes.shape({
        datasetID: PropTypes.string.isRequired,
        editionID: PropTypes.string.isRequired
    }).isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired
    }).isRequired,
    dispatch: PropTypes.func.isRequired
}

export class DatasetVersionsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingDataset: false,
            dataset: {},
            isFetchingEdition: false,
            edition: {},
            isFetchingVersions: false,
            versions: []
        }
    }

    async componentWillMount() {
        const datasetID = this.props.params.datasetID;
        const editionID = this.props.params.editionID;

        this.getAllVersions(datasetID, editionID);
        this.getDataset(datasetID);
        this.getEdition(datasetID, editionID);
    }

    getDataset = datasetID => {
        this.setState({isFetchingDataset: true});
        return datasets.get(datasetID).then(dataset => {
            this.setState({isFetchingDataset: false, dataset: this.mapDatasetToState(dataset)});
            return this.mapDatasetToState(dataset);
        }).catch(error => {
            switch (error.status) {
                case(404): {
                    const notification = {
                        "type": "warning",
                        "message": "No API route available for a list of datasets. You should still be able to use this page, or you can refresh.",
                        isDismissable: true
                    }
                    notifications.add(notification)
                    break;
                }
                case("RESPONSE_ERR"):{
                    const notification = {
                        "type": "warning",
                        "message": "An error's occurred whilst trying to get a list of datasets.",
                        isDismissable: true
                    }
                    notifications.add(notification)
                    break;
                }
                case("FETCH_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "There's been a network error whilst trying to get the submitted datasets. Please check you internet connection and try again in a few moments.",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error's occurred whilst trying to get a list of datasets.",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
            }
            console.error(`Error getting dataset (${datasetID}):\n`, error);
            this.setState({isFetchingDataset: false});
        })
    }

    mapDatasetToState = datasetResponse => {
        try {
            const dataset = datasetResponse.current || datasetResponse.next || datasetResponse;
            return {
                title: dataset.title
            }
        } catch (error) {
            const notification = {
                type: "warning",
                message: "An unexpected error occurred when trying to get dataset details, so some functionality in Florence may not work as expected. Try refreshing the page",
                isDismissable: true
            }
            notifications.add(notification);
            console.error("Error getting dataset details to state:\n", error);
        }
    }

    getEdition = (datasetID, editionID) => {
        this.setState({isFetchingEdition: true});
        return datasets.getEdition(datasetID, editionID).then(edition => {
            this.setState({isFetchingEdition: false, edition: this.mapDatasetEditionToState(edition)});
            return this.mapDatasetEditionToState(edition);
        }).catch(error => {
            console.error(error);
            this.setState({isFetchingEdition: false});
        })
    }

    mapDatasetEditionToState = editionResponse => {
        try {
            const edition = editionResponse.current || editionResponse.next || editionResponse;
            return {
                title: edition.edition 
            }
        } catch (error) {
            const notification = {
                type: "warning",
                message: "An unexpected error occurred when trying to get edition details, so some functionality in Florence may not work as expected. Try refreshing the page",
                isDismissable: true
            }
            notifications.add(notification);
            console.error("Error getting mapping edition to state:\n", error);
        }
    }

    getAllVersions = (datasetID, editions) => {
        this.setState({isFetchingVersions: true});
        return datasets.getVersions(datasetID, editions).then(versions => {
            const versionsList = this.buildVersionsList(versions.items);
            this.setState({isFetchingVersions: false, versions: versionsList});
            return this.mapDatasetVersionsToState(versions.items);
        }).catch(error => {
            console.error(error);
            this.setState({isFetchingVersions: false});
        })
    }

    buildVersionsList = versions => {
        const versionList =this.mapDatasetVersionsToState(versions);
        const includesUnpublishedVersion = versions.find(version => {
            return version.state === "published";
        });
        versionList.unshift({
            title: "Create new version", 
            id: "create-new-version",
            url:  this.props.location.pathname + "/instances",
            details: [
                includesUnpublishedVersion ? "A version for this edition already exists in a collection" : null,
            ],
            disabled: includesUnpublishedVersion ? true : false,
        });
        return versionList;
    }

    mapDatasetVersionsToState = versions => {
        try {
            const versionsList =  versions.map(version => {
                const published = version.state === "published" ? "(published)" : null;
                return {
                    id: version.id,
                    title: `Version: ${version.version} ${published ? published : ""}`,
                    url: this.props.location.pathname + "/versions/" + version.version,
                    version: version.version,
                    details: [
                        `Release date: ${version.release_date ? date.format(version.release_date, "dd mmmm yyyy") : "Not yet set"}`
                    ]
                }    
            });
            versionsList.sort((this.sortByVersionNumber))
            return versionsList.reverse();
        } catch (error) {
            const notification = {
                type: "warning",
                message: "An unexpected error occurred when trying to get versions, so some functionality in Florence may not work as expected. Try refreshing the page",
                isDismissable: true
            }
            notifications.add(notification);
            console.error("Error getting mapping versions to state:\n", error);
        }
    }

    sortByVersionNumber = (a ,b) => {
        return a.version - b.version;
    }
    
    handleBackButton = () => {
        const previousUrl = url.resolve("../../");
        this.props.dispatch(push(previousUrl));
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-9">
                    <div className="margin-top--2">
                        &#9664; <button type="button" className="btn btn--link" onClick={this.handleBackButton}>Back</button>
                    </div>
                    <h1 className="margin-top--1 margin-bottom--1">Select a version</h1>
                    <p className="margin-bottom--1 font-size--18"><span className="font-weight--600">Dataset</span>: {this.state.dataset.title ? this.state.dataset.title : "loading..."}</p>
                    <p className="margin-bottom--1 font-size--18"><span className="font-weight--600">Edition</span>: {this.state.edition.title ? this.state.edition.title : "loading..."}</p>
                    <SimpleSelectableList rows={this.state.versions} showLoadingState={this.state.isFetchingVersions}/>
               </div>
            </div>
        )
    }
}

DatasetVersionsController.propTypes = propTypes;

export default DatasetVersionsController;

