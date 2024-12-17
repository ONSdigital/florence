import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { replace } from "react-router-redux";

import http from "../../utilities/http";
import notifications from "../../utilities/notifications";
import { updateSelectedPreviewPage, addPreviewCollection, removeSelectedPreviewPage, updateWorkingOn, emptyWorkingOn } from "../../config/actions";
import cookies from "../../utilities/cookies";
import log from "../../utilities/logging/log";

import Iframe from "../../components/iframe/Iframe";
import content from "../../utilities/api-clients/content";
import { getPreviewLanguage } from "../../config/selectors";

const propTypes = {
    selectedPageUri: PropTypes.string,
    workingOn: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string,
    }),
    rootPath: PropTypes.string.isRequired,
    routeParams: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    previewLanguage: PropTypes.oneOf(["en", "cy"]).isRequired,
};

export class PreviewController extends Component {
    constructor(props) {
        super(props);
    }

    UNSAFE_componentWillMount() {
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
            .then(async collection => {
                let pages = [];
                const nonDatasetPages = await this.mapPages([...collection.inProgress, ...collection.complete, ...collection.reviewed]);
                const datasetPages = [...collection.datasetVersions, ...collection.datasets];
                pages = nonDatasetPages.concat(this.mapDatasetPages(datasetPages));
                this.props.dispatch(
                    addPreviewCollection({
                        collectionID,
                        name: collection.name,
                        pages,
                    })
                );
                if (!this.props.workingOn || !this.props.workingOn.name) {
                    this.props.dispatch(updateWorkingOn(collectionID, collection.name));
                }
            })
            .catch(error => {
                const notification = {
                    type: "warning",
                    message: "There was an error getting data for this collection. Please try refreshing the page",
                    isDismissable: true,
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

    mapPages = async pages => {
        const mappedPages = [];

        for (let i = 0; i < pages.length; i++) {
            if (pages[i].type === "visualisation") {
                const visPage = await this.getVisualisationFiles(pages[i]);
                mappedPages.push(visPage);
            } else {
                mappedPages.push(pages[i]);
            }
        }
        return mappedPages;
    };

    getVisualisationFiles = visualisation => {
        return content
            .get(visualisation.uri, this.props.routeParams.collectionID)
            .then(response => {
                visualisation.files = response.filenames;
                return visualisation;
            })
            .catch(error => {
                log.event("preview: error getting visualisation files", log.error(error));
                notifications.add({
                    type: "warning",
                    message:
                        "There was a problem getting visualisations in this collection so they will not appear in the list. Refresh the page to try again.",
                    isDismissable: true,
                });
                return {};
            });
    };

    mapDatasetPages(datasetPages) {
        try {
            return datasetPages.map(page => {
                return {
                    uri: new URL(page.uri).pathname,
                    description: {
                        title: page.title || {},
                        edition: page.version ? "version " + page.version : null,
                    },
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
                <Iframe previewLanguage={this.props.previewLanguage} path={this.props.selectedPageUri || "/"} />
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
        previewLanguage: getPreviewLanguage(state.state),
    };
}

export default connect(mapStateToProps)(PreviewController);
