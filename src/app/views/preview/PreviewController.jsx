import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { replace } from "react-router-redux";

import http from "../../utilities/http";
import notifications from "../../utilities/notifications";
import { updateSelectedPreviewPage, addPreviewCollection, removeSelectedPreviewPage, updateWorkingOn, emptyWorkingOn } from "../../config/actions";
import cookies from "../../utilities/cookies";

import Iframe from "../../components/iframe/Iframe";

const propTypes = {
    selectedPageUri: PropTypes.string,
    workingOn: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string
    }),
    enableDatasetImport: PropTypes.bool.isRequired,
    rootPath: PropTypes.string.isRequired,
    routeParams: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

export class PreviewController extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const collectionID = this.props.routeParams.collectionID;
        this.fetchCollectionAndPages(collectionID);

        if (!this.props.workingOn || !this.props.workingOn.id) {
            this.props.dispatch(updateWorkingOn(collectionID, ""));
        }

        // check if there is already page URL to preview in current URL
        const previewPageURL = new URL(window.location.href).searchParams.get("url");
        if (previewPageURL) {
            this.props.dispatch(updateSelectedPreviewPage(previewPageURL));
        }

        if (!cookies.get("collection")) {
            cookies.add("collection", collectionID, null);
        }
    }

    componentWillUnmount() {
        this.props.dispatch(emptyWorkingOn());
        this.props.dispatch(removeSelectedPreviewPage());
    }

    fetchCollectionAndPages(collectionID) {
        this.fetchCollection(collectionID)
            .then(collection => {
                const nonDatasetPages = [...collection.inProgress, ...collection.complete, ...collection.reviewed];
                if (this.props.enableDatasetImport) {
                    const datasetPages = [...collection.datasetVersions, ...collection.datasets];
                    const pages = nonDatasetPages.concat(this.mapDatasetPages(datasetPages));
                    this.props.dispatch(
                        addPreviewCollection({
                            collectionID,
                            name: collection.name,
                            pages
                        })
                    );
                } else {
                    const pages = nonDatasetPages;
                    this.props.dispatch(
                        addPreviewCollection({
                            collectionID,
                            name: collection.name,
                            pages
                        })
                    );
                }
                if (!this.props.workingOn || !this.props.workingOn.name) {
                    this.props.dispatch(updateWorkingOn(collectionID, collection.name));
                }
            })
            .catch(error => {
                const notification = {
                    type: "warning",
                    message: "There was an error getting data for this collection. Please try refreshing the page",
                    isDismissable: true
                };

                switch (error.status) {
                    case 401: {
                        notification.message = "You do not have permission to view this data, so you have been redirected to the collections screen";
                        notification.type = "neutral";
                        notifications.add(notification);
                        this.props.dispatch(replace(`${this.props.rootPath}/collections/`));
                        cookies.remove("collection");
                        return;
                    }
                    case 404: {
                        notification.message = "That collection doesn't appear to exist, so you have been redirected to the collections screen";
                        notifications.add(notification);
                        this.props.dispatch(replace(`${this.props.rootPath}/collections/`));
                        return;
                    }
                }

                notifications.add(notification);
                console.error(`Error fetching ${collectionID}:\n`, error);
            });
    }

    mapDatasetPages(datasetPages) {
        try {
            return datasetPages.map(page => {
                return {
                    uri: new URL(page.uri).pathname,
                    description: {
                        title: page.title || {},
                        edition: page.version ? "version " + page.version : null
                    }
                };
            });
        } catch (error) {
            console.error(`Error maping dataset pages :\n`, error);
        }
    }

    fetchCollection(collectionID) {
        return http.get(`/zebedee/collectionDetails/${collectionID}`, true, true);
    }

    render() {
        return (
            <div className="preview">
                <Iframe path={this.props.selectedPageUri || "/"} />
            </div>
        );
    }
}

PreviewController.propTypes = propTypes;

export function mapStateToProps(state) {
    return {
        selectedPageUri: state.state.preview.selectedPage,
        workingOn: state.state.global.workingOn,
        rootPath: state.state.rootPath,
        enableDatasetImport: state.state.config.enableDatasetImport
    };
}

export default connect(mapStateToProps)(PreviewController);
