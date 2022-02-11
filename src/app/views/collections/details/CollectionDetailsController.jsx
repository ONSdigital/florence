import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import PropTypes from "prop-types";
import objectIsEmpty from "is-empty-object";
import { getCollections, getIsUpdatingCollection } from "../../../config/selectors";
import { approveCollectionRequest } from "../../../config/thunks";
import {
    loadCollectionsSuccess,
    deleteCollection,
    emptyActiveCollection,
    emptyWorkingOn,
    updateActiveCollection,
    updateActiveDatasetReviewState,
    updateActiveVersionReviewState,
    updatePagesInActiveCollection,
    updateTeamsInActiveCollection,
    updateWorkingOn,
} from "../../../config/actions";
import Drawer from "../../../components/drawer/Drawer";
import collections from "../../../utilities/api-clients/collections";
import datasets from "../../../utilities/api-clients/datasets";
import notifications from "../../../utilities/notifications";
import cookies from "../../../utilities/cookies";
import collectionDetailsErrorNotifications from "./collectionDetailsErrorNotifications";
import collectionMapper from "../mapper/collectionMapper";
import Modal from "../../../components/Modal";
import RestoreContent from "../restore-content/RestoreContent";
import url from "../../../utilities/url";
import auth from "../../../utilities/auth";
import log from "../../../utilities/logging/log";
import CollectionDetails, { pagePropTypes, deletedPagePropTypes } from "./CollectionDetails";
import CollectionEditController from "../edit/CollectionEditController";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    rootPath: PropTypes.string.isRequired,
    enableDatasetImport: PropTypes.bool,
    enableHomepagePublishing: PropTypes.bool,
    user: PropTypes.object.isRequired,
    collectionID: PropTypes.string,
    collections: PropTypes.array,
    activeCollection: PropTypes.shape({
        approvalStatus: PropTypes.string,
        collectionOwner: PropTypes.string,
        isEncrypted: PropTypes.bool,
        timeseriesImportFiles: PropTypes.array,
        inProgress: PropTypes.arrayOf(PropTypes.shape(pagePropTypes)),
        complete: PropTypes.arrayOf(PropTypes.shape(pagePropTypes)),
        reviewed: PropTypes.arrayOf(PropTypes.shape(pagePropTypes)),
        deletes: PropTypes.arrayOf(
            PropTypes.shape({
                user: PropTypes.string.isRequired,
                root: deletedPagePropTypes,
                totalDeletes: PropTypes.number.isRequired,
            })
        ),
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        teams: PropTypes.array,
    }),
    activePageURI: PropTypes.string,
    routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export class CollectionDetailsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingCollectionDetails: false,
            isEditingCollection: false,
            isRestoringContent: false,
            isCancellingDelete: {
                value: false,
                uri: "",
            },
            pendingDeletedPages: [],
            drawerIsAnimatable: false,
            drawerIsVisible: false,
        };
    }

    UNSAFE_componentWillMount() {
        if (!auth.canViewCollectionsDetails(this.props.user)) {
            this.props.dispatch(push(`${this.props.rootPath}/collections`));
            return;
        }
        if (this.props.collectionID) {
            this.fetchActiveCollection(this.props.collectionID);
            this.setState({ drawerIsVisible: true });
        }

        if (!this.props.collectionID) {
            this.removeActiveCollectionGlobally();
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        // Open and close edit collection modal
        if (nextProps.routes[nextProps.routes.length - 1].path === "edit") {
            this.setState({ isEditingCollection: true });
        }
        if (this.props.routes[this.props.routes.length - 1].path === "edit" && nextProps.routes[nextProps.routes.length - 1].path !== "edit") {
            this.setState({ isEditingCollection: false });
        }
        // Display restore content modal
        if (nextProps.routes[nextProps.routes.length - 1].path === "restore-content") {
            this.setState({ isRestoringContent: true });
        }

        if (
            this.props.routes[this.props.routes.length - 1].path === "restore-content" &&
            nextProps.routes[nextProps.routes.length - 1].path !== "restore-content"
        ) {
            this.setState({ isRestoringContent: false });
        }

        if (!this.props.collectionID && nextProps.collectionID) {
            const activeCollection = this.props.collections.find(collection => {
                return collection.id === nextProps.collectionID;
            });
            this.updateActiveCollectionGlobally(activeCollection);
            this.setState({
                drawerIsAnimatable: true,
                drawerIsVisible: true,
            });
            this.fetchActiveCollection(nextProps.collectionID);
        }

        if (this.props.collectionID && !nextProps.collectionID) {
            this.setState({
                drawerIsAnimatable: true,
                drawerIsVisible: false,
            });
        }

        if (this.props.collectionID && nextProps.collectionID && this.props.collectionID !== nextProps.collectionID) {
            const activeCollection = this.props.collections.find(collection => {
                return collection.id === nextProps.collectionID;
            });
            this.updateActiveCollectionGlobally(activeCollection);
            this.fetchActiveCollection(nextProps.collectionID);
        }
    }

    shouldComponentUpdate() {
        if (!this.props.collectionID) {
            return false;
        }
        return true;
    }

    componentDidMount() {
        cookies.add("collection", this.props.activeCollection?.id || this.props.collectionID, null);
    }

    componentWillUnmount = () => {
        this.props.dispatch(emptyActiveCollection());
    };

    fetchActiveCollection(collectionID) {
        this.setState({ isFetchingCollectionDetails: true });
        collections
            .get(collectionID)
            .then(collection => {
                if (collection.approvalStatus === "COMPLETE") {
                    // This collection is now in the publishing queue, redirect user
                    location.pathname = this.props.rootPath + "/publishing-queue";
                    return;
                }
                if (!this.props.collectionID || this.props.collectionID !== collection.id) {
                    // User has closed collection details or moved to another one, so do not update state
                    return;
                }

                const mappedCollection = collectionMapper.collectionResponseToState(collection);
                const collectionWithPages = collectionMapper.pagesToCollectionState(mappedCollection);

                // If we have no data in state yet for the collection then use this opportunity to add it.
                // We are most likely to see this on page load if it's directly to a collection details screen
                // otherwise we should have the some basic data which has come from the array of all collections
                if (!this.props.activeCollection || objectIsEmpty(this.props.activeCollection)) {
                    this.props.dispatch(updateActiveCollection(mappedCollection));
                }

                this.props.dispatch(updatePagesInActiveCollection(collectionWithPages));
                this.props.dispatch(updateTeamsInActiveCollection(mappedCollection.teams));
                this.setState({ isFetchingCollectionDetails: false });
            })
            .catch(error => {
                console.error(`Fetching collection ${collectionID}: `, error);
                collectionDetailsErrorNotifications.getActiveCollection(error);
                if (error.status === 404 || error.status === 403) {
                    this.props.dispatch(push(`${this.props.rootPath}/collections`));
                    return;
                }
                this.setState({ isFetchingCollectionDetails: false });
            });
    }

    updateActiveCollectionGlobally(collection) {
        this.props.dispatch(updateActiveCollection(collection));
        this.props.dispatch(updateWorkingOn(collection.id, collection.name));
        cookies.add("collection", collection.id, null);
    }

    removeActiveCollectionGlobally() {
        this.props.dispatch(emptyActiveCollection());
        this.props.dispatch(emptyWorkingOn());
    }

    handleCollectionDeleteClick = collectionID => {
        collections
            .delete(collectionID)
            .then(async () => {
                this.props.dispatch(deleteCollection(collectionID));
                this.props.dispatch(push(`${this.props.rootPath}/collections`));
                const notification = {
                    type: "positive",
                    message: `Collection deleted`,
                    autoDismiss: 4000,
                    isDismissable: true,
                };
                notifications.add(notification);
            })
            .catch(error => {
                console.error(`Error deleting collection '${collectionID}'`, error);
                collectionDetailsErrorNotifications.deleteCollection(error);
            });
    };

    handleCollectionApproveClick = e => {
        this.props.dispatch(approveCollectionRequest(this.props.collectionID, `${this.props.rootPath}/collections`));
    };

    handleCancelPageDeleteClick = uri => {
        if (!uri) {
            notifications.add({
                type: "warning",
                message: "Couldn't delete because of an unexpected error: unable to get URI of delete to cancel",
                autoDismiss: 5000,
                isDismissable: true,
            });
            return;
        }

        this.setState({
            isCancellingDelete: {
                value: true,
                uri,
            },
        });

        const activeCollectionID = this.props.activeCollection.id;

        collections
            .cancelDelete(this.props.collectionID, uri)
            .then(() => {
                // User have moved to another collection during the async update, so don't update the active collection in state
                if (this.props.collectionID !== activeCollectionID) {
                    return;
                }
                this.setState({
                    isCancellingDelete: {
                        value: false,
                        uri: "",
                    },
                });

                const updatedActiveCollection = {
                    ...this.props.activeCollection,
                    deletes: this.props.activeCollection.deletes.filter(deletedPage => {
                        return deletedPage.root.uri !== uri;
                    }),
                };
                updatedActiveCollection.canBeApproved = collectionMapper.collectionCanBeApproved(updatedActiveCollection);
                updatedActiveCollection.canBeDeleted = collectionMapper.collectionCanBeDeleted(updatedActiveCollection);
                this.props.dispatch(updatePagesInActiveCollection(updatedActiveCollection));
            })
            .catch(error => {
                this.setState({
                    isCancellingDelete: {
                        value: false,
                        uri: "",
                    },
                });
                collectionDetailsErrorNotifications.cancelPageDelete(error, uri, this.props.collectionID);
                console.error(`Error removing pending delete of page '${uri}' from collection '${this.props.collectionID}'`, error);
            });
    };

    handleDrawerTransitionEnd = () => {
        this.setState({
            drawerIsAnimatable: false,
        });

        // Active collection is now hidden, so can now clear the details from the panel.
        // This stops the collection details from disappearing before the animation to
        // close the drawer is finished (which looks ugly).
        if (!this.state.drawerIsVisible) {
            this.props.dispatch(emptyActiveCollection());
            this.props.dispatch(push(`${this.props.rootPath}/collections`));
        }
    };

    handleCollectionPageClick = uri => {
        if (uri === this.props.activePageURI) {
            return;
        }

        let newURL = location.pathname + "#" + uri;
        if (this.props.activePageURI) {
            newURL = `${this.props.rootPath}/collections/${this.props.collectionID}#${uri}`;
        }

        this.props.dispatch(push(newURL));

        return newURL; //using 'return' so that we can test the correct new URL has been generated
    };

    handleCollectionPageEditClick = async (page, state) => {
        if (page.type === "dataset_details") {
            // This is a horrible hack to get the latest version url.
            // This could possibly be given to us from Zebedee.
            // It's here to minimise requests on loading the apge, so we only make a request
            // if the button is clicked, but it's not the ideal lace for it.
            const datasetURL = await datasets.getLatestVersionURL(page.id);
            let newURL = url.resolve(`/collections/${this.props.activeCollection.id}${datasetURL}`);

            const dataset = this.props.activeCollection[state].find(collectionPage => {
                if (collectionPage.type !== "dataset_details") {
                    return false;
                }
                if (collectionPage.uri !== page.uri) {
                    return false;
                }
                return true;
            });
            const lastEditedBy = dataset.lastEditedBy;
            // const reviewState = dataset.state.charAt(0).toLowerCase() + dataset.state.slice(1); //lowercase it so it's consistent with the properties in our state (i.e. "InProgress" = "inProgress" )
            this.props.dispatch(updateActiveDatasetReviewState(lastEditedBy, state));
            this.props.dispatch(push(newURL));
            return newURL;
        }
        if (page.type === "dataset_version") {
            const newURL = url.resolve(
                `/collections/${this.props.activeCollection.id}/datasets/${page.datasetID}/editions/${page.edition}/versions/${page.version}`
            );
            const version = this.props.activeCollection[state].find(collectionPage => {
                if (collectionPage.type !== "dataset_version") {
                    return false;
                }
                if (collectionPage.uri !== page.uri) {
                    return false;
                }
                return true;
            });
            const lastEditedBy = version.lastEditedBy;
            // const reviewState = version.state.charAt(0).toLowerCase() + version.state.slice(1); //lowercase it so it's consistent with the properties in our state (i.e. "InProgress" = "inProgress" )
            this.props.dispatch(updateActiveVersionReviewState(lastEditedBy, state));
            this.props.dispatch(push(newURL));
            return newURL;
        }

        // Override the homepage url so that it no longer takes users to the workspace, but instead to the Edit Homepage form
        if (page.type === "home_page") {
            const newURL = url.resolve(`/collections/${this.props.activeCollection.id}/homepage`);
            this.props.dispatch(push(newURL));
            return newURL;
        }

        const newURL = `${this.props.rootPath}/workspace?collection=${this.props.collectionID}&uri=${page.uri}`;
        window.location = newURL;

        return newURL; //return the URL so that we can test that the correct route is being used
    };

    handleCollectionPageDeleteUndo(deleteTimer, uri, notificationID, pageType) {
        log.event("undo delete page from collection", log.data({ url: uri, type: pageType }));
        let pendingDeletedPages = this.state.pendingDeletedPages.filter(pageURI => {
            return pageURI !== uri;
        });
        if (pageType === "dataset_details") {
            const datasetID = uri.split("/")[2];
            const pendingVersionDeleteURL = collections.getURLForVersionInCollection(datasetID, [
                ...this.props.activeCollection.inProgress,
                ...this.props.activeCollection.reviewed,
                ...this.props.activeCollection.complete,
            ]);
            if (pendingVersionDeleteURL) {
                pendingDeletedPages = pendingDeletedPages.filter(pageURI => {
                    return pageURI !== pendingVersionDeleteURL;
                });
            }
        }
        this.setState(() => ({
            pendingDeletedPages: pendingDeletedPages,
        }));
        const pageRoute = `${this.props.rootPath}/collections/${this.props.activeCollection.id}#${uri}`;
        this.props.dispatch(push(pageRoute));
        window.clearTimeout(deleteTimer);
        notifications.remove(notificationID);

        return pageRoute; //using 'return' so that we can test the correct new URL has been generated
    }

    handleCollectionPageDeleteClick = (deletedPage, state) => {
        log.event(
            "deleting page from collection",
            log.data({
                url: deletedPage.uri,
                title: deletedPage.title,
                type: deletedPage.type,
            })
        );
        const collectionID = this.props.collectionID;
        const collectionContent = [
            ...this.props.activeCollection.inProgress,
            ...this.props.activeCollection.reviewed,
            ...this.props.activeCollection.complete,
        ];
        const pendingDeletes = [...this.state.pendingDeletedPages, deletedPage.uri];
        let pendingVersionDeleteURL;
        if (deletedPage.type === "dataset_details") {
            pendingVersionDeleteURL = collections.getURLForVersionInCollection(deletedPage.id, collectionContent);
            if (pendingVersionDeleteURL) {
                pendingDeletes.push(pendingVersionDeleteURL);
                log.event("deleting related dataset version from collection", log.data({ versionURL: pendingVersionDeleteURL }));
            }
        }
        this.setState(() => ({
            pendingDeletedPages: pendingDeletes,
        }));
        const collectionURL = location.pathname.replace(`#${deletedPage.uri}`, "");
        this.props.dispatch(push(collectionURL));

        const deletePageRequest = () => {
            if (deletedPage.type === "dataset_details") {
                return collections.removeDataset(collectionID, deletedPage.id, collectionContent);
            }
            if (deletedPage.type === "dataset_version") {
                return collections.removeDatasetVersion(collectionID, deletedPage.datasetID, deletedPage.edition, deletedPage.version);
            }
            if (this.props.enableDatasetImport) {
                return collections.deletePageIncludingDatasetImport(collectionID, deletedPage.uri);
            }
            return collections.deletePage(collectionID, deletedPage.uri);
        };

        const triggerPageDelete = () => {
            deletePageRequest()
                .then(() => {
                    const pages = this.props.activeCollection[state].filter(page => {
                        return page.uri !== deletedPage.uri;
                    });
                    const updatedCollection = {
                        ...this.props.activeCollection,
                        [state]: pages,
                    };

                    const updatedPendingDeletes = this.state.pendingDeletedPages
                        .filter(pendingDelete => pendingDelete !== deletedPage.uri)
                        .filter(pendingVersionDelete => pendingVersionDelete !== pendingVersionDeleteURL);
                    this.setState({
                        pendingDeletedPages: updatedPendingDeletes,
                    });

                    updatedCollection.canBeApproved = collectionMapper.collectionCanBeApproved(updatedCollection);
                    updatedCollection.canBeDeleted = collectionMapper.collectionCanBeDeleted(updatedCollection);
                    this.props.dispatch(updatePagesInActiveCollection(updatedCollection));
                    window.clearTimeout(deletePageTimer);
                    log.event(
                        "deleted page from collection",
                        log.data({
                            url: deletedPage.uri,
                            title: deletedPage.title,
                            type: deletedPage.type,
                        })
                    );
                })
                .catch(error => {
                    const updatedPendingDeletes = this.state.pendingDeletedPages
                        .filter(pendingDelete => pendingDelete !== deletedPage.uri)
                        .filter(pendingVersionDelete => pendingVersionDelete !== pendingVersionDeleteURL);
                    this.setState({
                        pendingDeletedPages: updatedPendingDeletes,
                    });
                    window.clearTimeout(deletePageTimer);
                    collectionDetailsErrorNotifications.deletePage(error, deletedPage.title, this.props.collectionID);
                    log.event(
                        "error deleting page from collection",
                        log.data({
                            url: deletedPage.uri,
                            title: deletedPage.title,
                            type: deletedPage.type,
                        }),
                        log.error(error)
                    );
                    console.error("Error deleting page from a collection: ", error);
                });
        };

        const deletePageTimer = setTimeout(triggerPageDelete, 6000);

        const undoPageDelete = () => {
            this.handleCollectionPageDeleteUndo(deletePageTimer, deletedPage.uri, notificationID, deletedPage.type);
        };

        const handleNotificationClose = () => {
            triggerPageDelete();
            notifications.remove(notificationID);
        };

        const notification = {
            buttons: [
                {
                    text: "Undo",
                    onClick: undoPageDelete,
                },
                {
                    text: "OK",
                    onClick: handleNotificationClose,
                },
            ],
            type: "neutral",
            isDismissable: false,
            autoDismiss: 6000,
            message: `Deleted page '${deletedPage.title}' from collection '${this.props.activeCollection.name}'`,
        };
        const notificationID = notifications.add(notification);

        return collectionURL; //using 'return' so that we can test the correct new URL has been generated
    };

    handleDrawerCloseClick = () => {
        this.setState({
            drawerIsAnimatable: true,
            drawerIsVisible: false,
        });
        this.removeActiveCollectionGlobally();
    };

    handleRestoreDeletedContentClose = () => {
        this.props.dispatch(push(url.resolve("../")));
    };

    handleRestoreMultiDeletedContentSuccess = updatedInProgressList => {
        const mappedUpdatedInprogressList = updatedInProgressList.map(item => {
            return {
                uri: item.uri,
                title: item.description.title,
                type: item.type,
            };
        });

        const updatedActiveCollection = {
            ...this.props.activeCollection,
            inProgress: [...mappedUpdatedInprogressList],
        };

        this.props.dispatch(updatePagesInActiveCollection(updatedActiveCollection));
        this.handleRestoreDeletedContentClose();
    };

    handleRestoreSingleDeletedContentSuccess = restoredItem => {
        const addDeleteToInProgress = {
            uri: restoredItem.uri,
            title: restoredItem.title,
            type: restoredItem.type,
        };

        const updatedActiveCollection = {
            ...this.props.activeCollection,
            inProgress: [...this.props.activeCollection.inProgress, addDeleteToInProgress],
        };

        this.props.dispatch(updatePagesInActiveCollection(updatedActiveCollection));
        this.handleRestoreDeletedContentClose();
    };

    renderLoadingCollectionDetails() {
        return (
            <CollectionDetails
                id={this.props.collectionID}
                isLoadingNameAndDate={true}
                isLoadingDetails={true}
                onClose={this.handleDrawerCloseClick}
                onPageClick={this.handleCollectionPageClick}
                onEditPageClick={this.handleCollectionPageEditClick}
                onDeletePageClick={this.handleCollectionPageDeleteClick}
                onDeleteCollectionClick={this.handleCollectionDeleteClick}
                onApproveCollectionClick={this.handleCollectionApproveClick}
                onCancelPageDeleteClick={this.handleCancelPageDeleteClick}
            />
        );
    }

    renderCollectionDetails() {
        return (
            <CollectionDetails
                {...this.props.activeCollection}
                enableDatasetImport={this.props.enableDatasetImport}
                enableHomepagePublishing={this.props.enableHomepagePublishing}
                activePageURI={this.props.activePageURI}
                inProgress={collectionMapper.pagesExcludingPendingDeletedPages(
                    this.props.activeCollection["inProgress"],
                    this.state.pendingDeletedPages
                )}
                complete={collectionMapper.pagesExcludingPendingDeletedPages(this.props.activeCollection["complete"], this.state.pendingDeletedPages)}
                reviewed={collectionMapper.pagesExcludingPendingDeletedPages(this.props.activeCollection["reviewed"], this.state.pendingDeletedPages)}
                onClose={this.handleDrawerCloseClick}
                onPageClick={this.handleCollectionPageClick}
                onEditPageClick={this.handleCollectionPageEditClick}
                onDeletePageClick={this.handleCollectionPageDeleteClick}
                onDeleteCollectionClick={this.handleCollectionDeleteClick}
                onApproveCollectionClick={this.handleCollectionApproveClick}
                onCancelPageDeleteClick={this.handleCancelPageDeleteClick}
                isLoadingNameAndDate={false}
                isLoadingDetails={this.state.isFetchingCollectionDetails}
                isCancellingDelete={this.state.isCancellingDelete}
                isApprovingCollection={this.props.isUpdating}
            />
        );
    }

    renderEditCollection() {
        return <CollectionEditController name={this.props.activeCollection.name} id={this.props.activeCollection.id} />;
    }

    render() {
        return (
            <div>
                <Drawer
                    isVisible={this.state.drawerIsVisible}
                    isAnimatable={this.state.drawerIsAnimatable}
                    handleTransitionEnd={this.handleDrawerTransitionEnd}
                >
                    {this.props.collectionID && !this.props.activeCollection && this.renderLoadingCollectionDetails()}
                    {this.props.activeCollection && !this.state.isEditingCollection && this.renderCollectionDetails()}
                    {this.props.activeCollection && this.state.isEditingCollection && this.renderEditCollection()}
                </Drawer>
                {this.state.isRestoringContent && this.props.activeCollection && (
                    <Modal sizeClass="grid__col-8">
                        <RestoreContent
                            onClose={this.handleRestoreDeletedContentClose}
                            onMultiFileSuccess={this.handleRestoreMultiDeletedContentSuccess}
                            onSingleFileSuccess={this.handleRestoreSingleDeletedContentSuccess}
                            activeCollectionId={this.props.activeCollection.id}
                        />
                    </Modal>
                )}
            </div>
        );
    }
}

CollectionDetailsController.propTypes = propTypes;

export function mapStateToProps(state) {
    return {
        user: state.user,
        collections: getCollections(state.state),
        activeCollection: state.state.collections.active,
        rootPath: state.state.rootPath,
        activePageURI: state.routing.locationBeforeTransitions.hash.replace("#", ""),
        enableDatasetImport: state.state.config.enableDatasetImport,
        enableHomepagePublishing: state.state.config.enableHomepagePublishing,
        isUpdating: getIsUpdatingCollection(state.state),
    };
}

export default connect(mapStateToProps)(CollectionDetailsController);
