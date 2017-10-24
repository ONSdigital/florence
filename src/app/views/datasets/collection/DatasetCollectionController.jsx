import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import dateFormat from 'dateformat';
import notifications from '../../../utilities/notifications';
import collections from '../../../utilities/api-clients/collections';
import CollectionView from './CollectionView';
import url from '../../../utilities/url';


const propTypes = {
    params: PropTypes.shape({
        datasetID: PropTypes.string.isRequired
    }).isRequired
};

export class DatasetCollectionController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hasChosen: false,
            isGettingCollections: false,
            isSubmitting: false,
            errorMsg: "",
            collectionsSelectItems: [],
            allCollections: [],
            selectedCollection: {},
            nextRelease: "",
        };

        this.handleCollectionChange = this.handleCollectionChange.bind(this);
        this.handleOnBackFromSuccess = this.handleOnBackFromSuccess.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        this.getCollections();
    }

    getCollections() {
        this.setState({isGettingCollections: true});
        collections.getAll()
            .then(allCollections => {
                if (allCollections.length === 0) {
                    const notification = {
                        "type": "warning",
                        "message": "No collections were found. Try refreshing",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    return
                }
                const collectionsSelectItems = [];
                allCollections.map(item => {
                    collectionsSelectItems.push({id: item.id, name: item.name})
                });
                this.setState({
                    collectionsSelectItems: collectionsSelectItems,
                    allCollections: allCollections,
                    isGettingCollections: false
                })
            }).catch(error => {
            switch (error.status) {
                case(403):{
                    const notification = {
                        "type": "neutral",
                        "message": "You do not have permission to view collections.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                case(404):{
                    const notification = {
                        "type": "warning",
                        "message": "No API route available to get collections.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                case("RESPONSE_ERR"):{
                    const notification = {
                        "type": "warning",
                        "message": "An error's occurred whilst trying to get the collections.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                case("FETCH_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "There's been a network error whilst trying to get collections. Please check you internet connection and try again in a few moments.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                case("UNEXPECTED_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error has occurred whilst trying to get collections.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error's occurred whilst trying to get the submitted datasets.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
            }
            this.setState({isFetchingData: false});
        });
    }

    handleCollectionChange(event) {
        if (!event.target.value) {
            this.setState({selectedCollection: {}});
            return
        }

        const collectionID = event.target.value;
        const selectedCollection = this.state.allCollections.find(collection => {
            return collection.id === collectionID;
        });

        this.setState({
            selectedCollection: {
                id: collectionID,
                name: selectedCollection.name,
                releaseDate: selectedCollection.publishDate ? dateFormat(selectedCollection.publishDate, "dddd, mmmm dS, yyyy") : "",
                releaseTime: selectedCollection.publishDate ? dateFormat(selectedCollection.publishDate, "hh:MM:ss") : "",
                type: selectedCollection.type
            },
            errorMsg: ""
        })
    }

    handleSubmit(event) {
        event.preventDefault();

        if (!this.state.selectedCollection.id) {
            this.setState({errorMsg: "You must select a collection"});
            return
        }

        this.setState({ isSubmitting: true });
        this.handleAddToCollection();

    }

    handleOnBackFromSuccess() {
        this.setState({ hasChosen: false });
    }

    handleAddToCollection() {
        const datasetID = this.props.params.datasetID;
        const collectionID = this.state.selectedCollection.id;
        collections.addDataset(collectionID, datasetID)
            .then(() => {
                this.setState({hasChosen: true, isSubmitting: false });
            }).catch(error => {
            switch (error.status) {
                case(409): { // zebedee will return a 409 if the dataset is in another collection
                    const notification = {
                        "type": "neutral",
                        "message": "This dataset is in another collection.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                case(403): {
                    const notification = {
                        "type": "neutral",
                        "message": "You do not have permission to add dataset to a collection.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                case(404): {
                    const notification = {
                        "type": "warning",
                        "message": "No API route available to add dataset to a collection.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                case("RESPONSE_ERR"): {
                    const notification = {
                        "type": "warning",
                        "message": "An error's occurred whilst trying to add this dataset to a collection.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                case("FETCH_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "There's been a network error whilst trying add this dataset to a collection. Please check you internet connection and try again in a few moments.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                case("UNEXPECTED_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error has occurred whilst trying to add this dataset to a collection.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error's occurred whilst trying to get the submitted datasets.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
            }
            this.setState({isSubmitting: false});
        })
    }


    render() {
        return (
            <CollectionView {...this.state}
                handleSubmit={this.handleSubmit}
                handleCollectionChange={this.handleCollectionChange}
                handleNextReleaseChange={this.handleNextReleaseChange}
                handleOnBackFromSuccess={this.handleOnBackFromSuccess}
                backLink={url.resolve("../metadata")}
            />
        )
    }

}

DatasetCollectionController.propTypes = propTypes;

export default connect()(DatasetCollectionController);
