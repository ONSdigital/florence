import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import collections from '../../utilities/api-clients/collections';
import notifications from '../../utilities/notifications';
import { updateSelectedPreviewPage, addPreviewCollection, removeSelectedPreviewPage } from '../../config/actions';

import Iframe from '../../components/iframe/Iframe';

const propTypes = {
    selectedPageUri: PropTypes.string,
    routeParams: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

export class PreviewController extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.fetchCollectionAndPages(this.props.routeParams.collectionID)

        // check if there is a previewable page in the route and update selected preview page state in redux
        const previewPageURL = new URL(window.location.href).searchParams.get("url")
        if (previewPageURL) {
            this.props.dispatch(updateSelectedPreviewPage(previewPageURL));
        }
    }

    componentWillUnmount() {
        this.props.dispatch(removeSelectedPreviewPage());
    }

    fetchCollectionAndPages(collectionID) {
        collections.get(collectionID).then(collection => {
            const pages = [...collection.inProgress, ...collection.complete, ...collection.reviewed];
            const collectionPreview = {collectionID, name: collection.name, pages};
            this.props.dispatch(addPreviewCollection(collectionPreview));
        }).catch(error => {
            const notification = {
                type: "warning",
                message: "There was an error getting data about the selected collection. Please try refreshing the page",
                isDismissable: true
            };
            notifications.add(notification);
            console.error(`Error fetching ${collectionID}:\n`, error);
        });
    }
    
    render () {
        return (
            <div className="preview">
                <Iframe path={this.props.selectedPageUri || "/"}/>
            </div>
        )
    }
}

PreviewController.propTypes = propTypes;

export function mapStateToProps(state) {
    return {
        selectedPageUri: state.state.preview.selectedPage
    }
}

export default connect(mapStateToProps)(PreviewController);