import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import http from '../../utilities/http';
import collections from '../../utilities/api-clients/collections';
import notifications from '../../utilities/notifications';
import { updateSelectedPreviewPage, addPreviewCollection, removeSelectedPreviewPage } from '../../config/actions';
import cookies from '../../utilities/cookies'

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

        // check if there is already page URL to preview in current URL
        const previewPageURL = new URL(window.location.href).searchParams.get("url")
        if (previewPageURL) {
            this.props.dispatch(updateSelectedPreviewPage(previewPageURL));
        }
    }

    componentWillUnmount() {
        this.props.dispatch(removeSelectedPreviewPage());
    }

    fetchCollectionAndPages(collectionID) {
        this.fetchCollection(collectionID).then(collection => {
            const pages = [...collection.inProgress, ...collection.complete, ...collection.reviewed];
            const collectionPreview = {collectionID, name: collection.name, pages};
            if (!cookies.get("collection")) {
                cookies.add("collection", collectionID, null);
            }
            this.props.dispatch(addPreviewCollection(collectionPreview));
        }).catch(error => {
            const notification = {
                type: "warning",
                message: "There was an error getting data about the selected collection. Please try refreshing the page",
                isDismissable: true
            };

            if (error.status === 401) {
                notification.message = "You do not have persmission to view this data and have been redirected to collections screen";
                notifications.add(notification);
                this.props.dispatch(push(`${this.props.rootPath}/collections/`));
                return;
            }

            notifications.add(notification);
            console.error(`Error fetching ${collectionID}:\n`, error);
        });
    }

    fetchCollection(collectionID) {
        return http.get(`/zebedee/collectionDetails/${collectionID}`, true, true)
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
        selectedPageUri: state.state.preview.selectedPage,
        rootPath: state.state.rootPath
    }
}

export default connect(mapStateToProps)(PreviewController);