import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import dateFormat from 'dateformat';
import collections from '../../../utilities/api-clients/collections';
import DatasetCollectionView from './DatasetCollectionView';

const propTypes = {
    params: PropTypes.shape({
        instance: PropTypes.string.isRequired
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
                const collectionsSelectItems = [];
                allCollections.map(item => {
                    collectionsSelectItems.push({id: item.id, name: item.name})
                });
                this.setState({
                    collectionsSelectItems: collectionsSelectItems,
                    allCollections: allCollections,
                    isGettingCollections: false
                })
            })
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

        const datasetToAddToCollection = {
            id: this.state.selectedCollection.id,
            name: this.state.selectedCollection.name
        };

        this.setState({ isSubmitting: true });
        this.handleAddToCollection(datasetToAddToCollection);

    }

    handleOnBackFromSuccess() {
        collections.removeAPIDataset()
            .then(() => {
                this.setState({hasChosen: false});
            })
    }

    handleAddToCollection() {
        const instanceID = this.props.params.instance;
        const collectionID = this.state.selectedCollection.id;
        collections.addAPIDataset(collectionID, instanceID)
            .then(() => {
                // possibly post "next release date" field to an api?
                this.setState({hasChosen: true, isSubmitting: false });
            })
    }


    render() {
        return (
            <DatasetCollectionView {...this.state}
                   handleSubmit={this.handleSubmit}
                   handleCollectionChange={this.handleCollectionChange}
                   handleNextReleaseChange={this.handleNextReleaseChange}
                   handleOnBackFromSuccess={this.handleOnBackFromSuccess} />
            )
    }

}

function mapStateToProps(state) {
    return state;
}

DatasetCollectionController.propTypes = propTypes;

export default connect(mapStateToProps)(DatasetCollectionController);
