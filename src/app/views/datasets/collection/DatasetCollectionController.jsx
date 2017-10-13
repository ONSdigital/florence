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

class DatasetCollectionController extends Component {

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
        this.handleNextReleaseChange = this.handleNextReleaseChange.bind(this);
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

    handleNextReleaseChange(event) {
        const value = event.target.value;
        this.setState({nextRelease: value, errorMsg: ""})
    }

    handleSubmit(event) {
        event.preventDefault();

        if (!this.state.selectedCollection.id) {
            this.setState({errorMsg: "You must select a collection"});
            return
        }

        const instanceToAddToCollection = {
            id: this.state.selectedCollection.id,
            name: this.state.selectedCollection.name
        };

        this.setState({ isSubmitting: true });
        this.handleAddToCollection(instanceToAddToCollection);

    }

    handleOnBackFromSuccess() {
        collections.removeDataset()
            .then(() => {
                this.setState({hasChosen: false});
            })
    }

    handleAddToCollection() {
        const datasetID = this.props.params.datasetID;
        const collectionID = this.state.selectedCollection.id;
        collections.addDataset(collectionID, datasetID)
            .then(() => {
                // TODO POST next release date field to API
                // We'll probably want to post "next release date" field to an api at
                // this point but not sure whether this data will be stored against
                // the version or the dataset or whether this field is required at this
                // part of the journey
                this.setState({hasChosen: true, isSubmitting: false });
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
