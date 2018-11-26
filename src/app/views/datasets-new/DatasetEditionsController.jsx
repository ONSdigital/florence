import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import datasets from '../../utilities/api-clients/datasets';
import notifications from '../../utilities/notifications';
import url from '../../utilities/url'
import date from '../../utilities/date'

import SimpleSelectableList from '../../components/simple-selectable-list/SimpleSelectableList';

const propTypes = {

}

class DatasetEditionsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fetchingDataset: false,
            dataset: {},
            fetchingEditions: false,
            editions: [],
        }

    }

    async componentWillMount() {
        this.setState({isFetchingDatasets: true, isFetchingEditions: true, isFetchingLatestVersion: true});
        const datasetID = this.props.routeParams.datasetID;

        const dataset = await this.getDataset(datasetID);
        this.setState({dataset: this.mapDatasetToState(dataset), isFetchingDatasets: false});

        this.createListOfEditions(datasetID);
       
        // this.setState({isFetchingEditions: true});
        // datasets.getEditions(datasetID).then(async (editions) => {

        //     await this.getDataset(datasetID);
            
        //     this.setState({
        //         isFetchingEditions: false, 
        //         editions: this.mapDatasetEditionsToView(editions.items)
        //     });
 
        // }).catch(error => {
        //     switch (error.status) {
        //         case(404): {
        //             const notification = {
        //                 "type": "warning",
        //                 "message": "No API route available for a list of editions.",
        //                 isDismissable: true
        //             }
        //             notifications.add(notification)
        //             break;
        //         }
        //         case("RESPONSE_ERR"):{
        //             const notification = {
        //                 "type": "warning",
        //                 "message": "An error's occurred whilst trying to get a list of editions.",
        //                 isDismissable: true
        //             }
        //             notifications.add(notification)
        //             break;
        //         }
        //         case("FETCH_ERR"): {
        //             const notification = {
        //                 type: "warning",
        //                 message: "There's been a network error whilst trying to get the submitted datasets. Please check you internet connection and try again in a few moments.",
        //                 isDismissable: true
        //             }
        //             notifications.add(notification);
        //             break;
        //         }
        //         case("UNEXPECTED_ERR"): {
        //             const notification = {
        //                 type: "warning",
        //                 message: "An unexpected error has occurred whilst trying to get a list of editions.",
        //                 isDismissable: true
        //             }
        //             notifications.add(notification);
        //             break;
        //         }
        //         default: {
        //             const notification = {
        //                 type: "warning",
        //                 message: "An unexpected error's occurred whilst trying to get a list of editions.",
        //                 isDismissable: true
        //             }
        //             notifications.add(notification);
        //             break;
        //         }
        //     }
        //     this.setState({isFetchingEditions: false});
        // });
    }

    createListOfEditions = async(datasetID) => {    
        const editions = await this.getEditions(datasetID) || [];
        if (!editions.length) {
            const createEditionEntry = {
                title: "Create new edition", 
                id: "create-new-edition",
                url:  this.props.location.pathname + "/instances",
            }
            editions.push(createEditionEntry);
            this.setState({editions: editions});
            return;
        }
        const editionsWithReleaseDates = await this.mapVersionReleaseDatesToEditions(datasetID, editions)
        this.setState({editions: editionsWithReleaseDates});
    }

    getDataset = (datasetID) => {
        this.setState({isFetchingDatasets: true});
        return datasets.get(datasetID).then(dataset => {
            return this.mapDatasetToState(dataset);
        }).catch(error => {
            console.error(`Error getting dataset (${datasetID}):\n`, error);
            this.setState({isFetchingDatasets: false});
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

    getEditions = async(datasetID) => {
        return datasets.getEditions(datasetID).then(editions => {
            return this.mapDatasetEditionsToView(editions.items);
        })
    }

    mapDatasetEditionsToView = editions => {
        try {
            return editions.map(edition => {
                return {
                    title: this.state.dataset.title, 
                    id: edition.current.edition,
                    url:  this.props.location.pathname + "/editions/" + edition.current.edition,
                    details: [
                        "Edition: " + edition.current.edition,
                        "Release date: loading..."
                    ],
                    latestVersion: edition.current.links.latest_version.id
                }
            })
        } catch (error) {
            const notification = {
                type: "warning",
                message: "An unexpected error occurred when trying to get edition details, so some functionality in Florence may not work as expected. Try refreshing the page",
                isDismissable: true
            }
            notifications.add(notification);
            console.error("Error getting mapping editions to state:\n", error);
        }
    }

    mapVersionReleaseDatesToEditions = async(datasetID, editions) => {
        const allVersions = await this.getAllVersions(datasetID, editions).then(versions => {
            return versions;
        });
        const mappedEditions = editions.map(edition => {
            allVersions.find(version => {
                if (version.edition !== edition.id) {
                    return
                }
                edition.details[1] = `Release date: ${date.format(version.release_date, "dd mmmm yyyy")}`
            });
            return edition;
        });
        return mappedEditions;
    }

    getAllVersions = async(datasetID, editions) => {
        const versionPromises = editions.map(async(edition) => {
            return await this.getVersion(datasetID, edition.id, edition.latestVersion);
        })
        const allVersions = await Promise.all(versionPromises).then(version => {
            return version;
        })
        return allVersions;
    }

    getVersion = async(datasetID, edition, version) => {
        return await datasets.getVersion(datasetID, edition, "3").then(versionResp => {
            return versionResp;
        })
    }

    handleBackButton = () => {
        const previousUrl = url.resolve("../");
        this.props.dispatch(push(previousUrl));
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-9">
                    <div className="margin-top--2">
                        &#9664; <button type="button" className="btn btn--link" onClick={this.handleBackButton}>Back</button>
                    </div>
                    <h1 className="margin-top--1 margin-bottom--1">Select an Edition</h1>
                    <p className="margin-bottom--1 font-size--18"><span className="font-weight--600">Dataset</span>: {this.state.dataset.title ? this.state.dataset.title : "loading..."}</p>
                    <SimpleSelectableList rows={this.state.editions} isFetchingData={this.state.fetchingEditions}/>
               </div>
            </div>
        )
    }
}

DatasetEditionsController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        
    }
}
export default connect(mapStateToProps)(DatasetEditionsController);

