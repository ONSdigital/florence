import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import Drawer from '../../../components/drawer/Drawer';
import CollectionDetails, {pagePropTypes, deletedPagePropTypes} from './CollectionDetails';
import CollectionEditController from '../edit/CollectionEditController';
import collections from '../../../utilities/api-clients/collections';
import notifications from '../../../utilities/notifications';
import log, {eventTypes} from '../../../utilities/log'
import mapCollectionToState from '../mapCollectionToState'
import {updateActiveCollection, emptyActiveCollection} from '../../../config/actions'
import cookies from '../../../utilities/cookies'
import collectionDetailsErrorNotifications from './collectionDetailsErrorNotifications'

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    rootPath: PropTypes.string.isRequired,
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
        deletes: PropTypes.arrayOf(PropTypes.shape({
            user: PropTypes.string.isRequired,
            root: deletedPagePropTypes,
            totalDeletes: PropTypes.number.isRequired
        })),
        datasets: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            uri: PropTypes.string.isRequired,
            state: PropTypes.string.isRequired
        })),
        datasetVersion: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            edition: PropTypes.string.isRequired,
            version: PropTypes.string.isRequired,
            uri: PropTypes.string.isRequired,
            state: PropTypes.string.isRequired
        })),
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        teams: PropTypes.array
    }),
    activePageURI: PropTypes.string,
    routes: PropTypes.arrayOf(PropTypes.object).isRequired
};

export class CollectionDetailsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingCollectionDetails: false,
            isEditingCollection: false,
            isApprovingCollection: false,
            isCancellingDelete: {
                value: false,
                uri: ""
            },
            pendingDeletedPages: [],
            drawerIsAnimatable: false,
            drawerIsVisible: false,
        };

        this.handleDrawerTransitionEnd = this.handleDrawerTransitionEnd.bind(this);
        this.handleDrawerCloseClick = this.handleDrawerCloseClick.bind(this);
        this.handleCollectionDeleteClick = this.handleCollectionDeleteClick.bind(this);
        this.handleCollectionApproveClick = this.handleCollectionApproveClick.bind(this);
        this.handleCollectionPageClick = this.handleCollectionPageClick.bind(this);
        this.handleCollectionPageEditClick = this.handleCollectionPageEditClick.bind(this);
        this.handleCollectionPageDeleteClick = this.handleCollectionPageDeleteClick.bind(this);
        this.handleCancelPageDeleteClick = this.handleCancelPageDeleteClick.bind(this);
    }

    componentWillMount() {
        if (this.props.collectionID) {
            this.fetchActiveCollection(this.props.collectionID);
            this.setState({drawerIsVisible: true});
        }
    }

    componentWillReceiveProps(nextProps) {
        // Open and close edit collection modal
         if (nextProps.routes[nextProps.routes.length-1].path === "edit") {
            this.setState({isEditingCollection: true});
        }
        if (this.props.routes[this.props.routes.length-1].path === "edit" && nextProps.routes[nextProps.routes.length-1].path !== "edit") {
            this.setState({isEditingCollection: false});
        }
        // Display restore content modal
        if (nextProps.routes[nextProps.routes.length-1].path === "restore-content") {
            this.setState({showRestoreContent: true});
        }

        if (this.props.routes[this.props.routes.length-1].path === "restore-content" && nextProps.routes[nextProps.routes.length-1].path !== "restore-content") {
            this.setState({showRestoreContent: false});
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

        if ((this.props.collectionID && nextProps.collectionID) && (this.props.collectionID !== nextProps.collectionID)) {
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

    fetchActiveCollection(collectionID) {
        this.setState({isFetchingCollectionDetails: true});
        collections.get(collectionID).then(collection => {
            if (collection.approvalStatus === "COMPLETE") {
                // This collection is now in the publishing queue, redirect user
                location.pathname = this.props.rootPath + "/publishing-queue";
                return;
            }
            if (!this.props.collectionID || this.props.collectionID !== collection.id) {
                // User has closed collection details or moved to another one, so do not update state
                return;
            }

            const mappedCollection = mapCollectionToState(collection);
            const activeCollection = this.mapPagesToCollection(mappedCollection);
            this.updateActiveCollectionGlobally(activeCollection);
            this.setState({isFetchingCollectionDetails: false});
        }).catch(error => {
            console.error(`Fetching collection ${collectionID}: `, error);
            collectionDetailsErrorNotifications.getActiveCollection(error);
            if (error.status === 404 || error.status === 403) {
                this.props.dispatch(push(`${this.props.rootPath}/collections`));
                return;
            }
            this.setState({isFetchingCollectionDetails: false});
        });
    }

    updateActiveCollectionGlobally(collection) {
        this.props.dispatch(updateActiveCollection(collection));
        cookies.add("collection", collection.id, null);
    }

    collectionCanBeApproved(collection) {
        // One of the lists doesn't have a value, so we can't verify whether it can be
        // deleted or not. Therefore it's safer to not allow approval
        if (!collection.inProgress || !collection.complete || !collection.reviewed) {
            return false;
        }

        if (collection.reviewed.length >= 1 && collection.inProgress.length === 0 && collection.complete.length === 0) {
            return true;
        }

        // We shouldn't get to this return but we'll return false by default because it's safer to disallow
        // approval rather than approve something in a unexpected state
        return false;
    }
    
    collectionCanBeDeleted(collection) {
        // One of the lists doesn't have a value, so we can't verify whether it can be
        // deleted or not. Therefore it's safer to not allow approval
        if (!collection.inProgress || !collection.complete || !collection.reviewed) {
            return false;
        }

        if (collection.reviewed.length === 0 && collection.inProgress.length === 0 && collection.complete.length === 0 && (!collection.deletes || collection.deletes.length === 0)) {
            return true;
        }

        // We shouldn't get to this return but we'll return false by default because it's safer to disallow
        // approval rather than approve something in a unexpected state
        return false;
    }

    mapPagesAndPendingDeletes(state) {
        if (!this.props.activeCollection[state]) {
            return;
        }

        if (!this.state.pendingDeletedPages || this.state.pendingDeletedPages.length === 0) {
            return this.props.activeCollection[state];
        }

        return this.props.activeCollection[state].filter(page => {
            return !this.state.pendingDeletedPages.includes(page.uri);
        });
    }

    mapPagesToCollection(collection) {
        try {
            const canBeApproved = this.collectionCanBeApproved(collection);
            const canBeDeleted = this.collectionCanBeDeleted(collection);
            const mapPageToState = pagesArray => {
                if (!pagesArray) {
                    log.add(eventTypes.runtimeWarning, `Collections pages array (e.g. inProgress) wasn't set, had to hardcode a default value of null`);
                    return null;
                }
                return pagesArray.map(page => {
                    return {
                        lastEdit: {
                            email: page.events ? page.events[0].email : "",
                            date: page.events ? page.events[0].date : ""
                        },
                        title: page.description.title,
                        edition: page.description.edition || "",
                        uri: page.uri,
                        type: page.type
                    }
                });
            }
            const mappedCollection = {
                ...collection,
                canBeApproved,
                canBeDeleted,
                inProgress: mapPageToState(collection.inProgress),
                complete: mapPageToState(collection.complete),
                reviewed: mapPageToState(collection.reviewed)
            }
            return mappedCollection;
        } catch (error) {
            log.add(eventTypes.unexpectedRuntimeError, "Error mapping collection GET response to Redux state" + JSON.stringify(error));
            console.error("Error mapping collection GET response to Redux state" + error);
            return null;
        }
    }

    handleCollectionDeleteClick(collectionID) {
        this.props.dispatch(push(`${this.props.rootPath}/collections`));
        collections.delete(collectionID).then(() => {
            const notification = {
                type: 'positive',
                message: `Successfully deleted collection '${collectionID}'`,
                autoDismiss: 4000,
                isDismissable: true
            }
            notifications.add(notification);
            this.setState(state => ({
                collections: state.collections.filter(collection => {
                    return collection.id !== collectionID
                })
            }));
        }).catch(error => {
            console.error(`Error deleting collection '${collectionID}'`, error);
            collectionDetailsErrorNotifications.deleteCollection(error);
        });
    }

    handleCollectionApproveClick() {
        const activeCollection = this.props.activeCollection;
        const collectionID = this.props.collectionID;
        if (!this.collectionCanBeApproved(activeCollection)) {
            const notification = {
                type: 'neutral',
                message: `Unable to approve collection '${activeCollection.name}', please check that there are no pages in progress or awaiting review`,
                isDismissable: true,
                autoDismiss: 4000
            };
            notifications.add(notification);
            return false;
        }

        const updatePublishStatusToNeutral = state => {
            return {
                collections: state.collections.map(collection => {
                    if (collection.id !== collectionID) {
                        return collection;
                    }
                    return {
                        ...collection,
                        status: {
                            ...collection.status,
                            neutral: true
                        }
                    }
                })
            }
        }

        this.setState({
            isApprovingCollection: true,
            ...updatePublishStatusToNeutral(this.state),
        });
        collections.approve(collectionID).then(() => {
            this.setState({isApprovingCollection: false});
            this.props.dispatch(push(`${this.props.rootPath}/collections`));
        }).catch(error => {
            this.setState({isApprovingCollection: false});
            console.error("Error approving collection", error);
            collectionDetailsErrorNotifications.approveCollection(error);
        });
    }

    handleCancelPageDeleteClick(uri) {
        if (!uri) {
            notifications.add({
                type: "warning",
                message: "Couldn't delete because of an unexpected error: unable to get URI of delete to cancel",
                autoDismiss: 5000,
                isDismissable: true
            });
            return;
        }

        this.setState({isCancellingDelete: {
            value: true,
            uri
        }});

        const activeCollectionID = this.props.activeCollection.id;

        collections.cancelDelete(this.props.collectionID, uri).then(() => {
            // User have moved to another collection during the async update, so don't update the active collection in state
            if (this.props.collectionID !== activeCollectionID) {
                return;
            }
            this.setState({isCancellingDelete: {
                value: false,
                uri: ""
            }});

            const updatedActiveCollection = {
                ...this.props.activeCollection,
                deletes: this.props.activeCollection.deletes.filter(deletedPage => {
                    return deletedPage.root.uri !== uri;
                })
            };
            this.props.dispatch(updateActiveCollection(updatedActiveCollection));
        }).catch(error => {
            this.setState({isCancellingDelete: {
                value: false,
                uri: ""
            }});
            collectionDetailsErrorNotifications.cancelPageDelete(error, uri, this.props.collectionID);
            console.error(`Error removing pending delete of page '${uri}' from collection '${this.props.collectionID}'`, error);
        });
    }

    handleDrawerTransitionEnd() {
        this.setState({
            drawerIsAnimatable: false
        });

        // Active collection is now hidden, so can now clear the details from the panel.
        // This stops the collection details from disappearing before the animation to 
        // close the drawer is finished (which looks ugly).
        if (!this.state.drawerIsVisible) {
            this.props.dispatch(emptyActiveCollection());
            this.props.dispatch(push(`${this.props.rootPath}/collections`));
        }
    }

    handleCollectionPageClick(uri) {
        console.log(this.props.collectionID);
        
        if (uri === this.props.activePageURI) {
            return;
        }

        let newURL = location.pathname + "#" + uri;
        if (this.props.activePageURI) {
            newURL = `${this.props.rootPath}/collections/${this.props.collectionID}#${uri}`;
        }
    
        this.props.dispatch(push(newURL));

        return newURL; //using 'return' so that we can test the correct new URL has been generated
    }

    handleCollectionPageEditClick(uri) {
        window.location = `${this.props.rootPath}/workspace?collection=${this.props.collectionID}&uri=${uri}`;
    }

    handleCollectionPageDeleteUndo(deleteTimer, uri, notificationID) {
        this.setState(state => ({
            pendingDeletedPages: [...state.pendingDeletedPages].filter(pageURI => {
                return pageURI !== uri;
            })
        }));
        const pageRoute = `${this.props.rootPath}/collections/${this.props.activeCollection.id}#${uri}`;
        this.props.dispatch(push(pageRoute));
        window.clearTimeout(deleteTimer);
        notifications.remove(notificationID);

        return pageRoute //using 'return' so that we can test the correct new URL has been generated
    }

    handleCollectionPageDeleteClick(uri, title, state) {
        const collectionID = this.props.collectionID;
        this.setState(state => ({
            pendingDeletedPages: [...state.pendingDeletedPages, uri]
        }));
        const collectionURL = location.pathname.replace(`#${uri}`, "");
        this.props.dispatch(push(collectionURL));

        const triggerPageDelete = () => {
            collections.deletePage(collectionID, uri).then(() => {
                const pages = this.props.activeCollection[state].filter(page => {
                    return page.uri !== uri;
                });
                const updatedCollection = {
                    ...this.props.activeCollection,
                    [state]: pages
                };
                updatedCollection.canBeApproved = this.collectionCanBeApproved(updatedCollection);
                updatedCollection.canBeDeleted = this.collectionCanBeDeleted(updatedCollection);
                this.props.dispatch(updateActiveCollection(updatedCollection));
                window.clearTimeout(deletePageTimer);
            }).catch(error => {
                collectionDetailsErrorNotifications.deletePage(error, title, this.props.collectionID);
                console.error("Error deleting page from a collection: ", error);
            });
        }

        const deletePageTimer = setTimeout(triggerPageDelete, 6000);

        const undoPageDelete = () => {
            this.handleCollectionPageDeleteUndo(deletePageTimer, uri, notificationID);
        };

        const handleNotificationClose = () => {
            triggerPageDelete();
            notifications.remove(notificationID);
        }

        const notification = {
            buttons: [
                {
                    text: "Undo",
                    onClick: undoPageDelete
                },
                {
                    text: "Close",
                    onClick: handleNotificationClose
                }
            ],
            type: 'neutral',
            isDismissable: false,
            autoDismiss: 6000,
            message: `Deleted page '${title}' from collection '${this.props.activeCollection.name}'`
        }
        const notificationID = notifications.add(notification);

        return collectionURL //using 'return' so that we can test the correct new URL has been generated
    }

    handleDrawerCloseClick() {
        this.setState({
            drawerIsAnimatable: true,
            drawerIsVisible: false
        });
    }

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
        )
    }

    renderCollectionDetails() {
        return (
            <CollectionDetails 
                {...this.props.activeCollection}
                activePageURI={this.props.activePageURI}
                inProgress={this.mapPagesAndPendingDeletes('inProgress')}
                complete={this.mapPagesAndPendingDeletes('complete')}
                reviewed={this.mapPagesAndPendingDeletes('reviewed')}
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
                isApprovingCollection={this.state.isApprovingCollection}
            />
        )
    }

    renderEditCollection() {
        return (
            <CollectionEditController
                name={this.props.activeCollection.name}
                id={this.props.activeCollection.id}
            />
        )
    }

    render() {
        return (
            <Drawer
                isVisible={this.state.drawerIsVisible} 
                isAnimatable={this.state.drawerIsAnimatable} 
                handleTransitionEnd={this.handleDrawerTransitionEnd}
            >
                {(this.props.collectionID && !this.props.activeCollection) &&
                    this.renderLoadingCollectionDetails()
                }
                {(this.props.activeCollection && !this.state.isEditingCollection) &&
                    this.renderCollectionDetails()
                }
                {(this.props.activeCollection && this.state.isEditingCollection) &&
                    this.renderEditCollection()
                }
            </Drawer>
        )
    }
}

CollectionDetailsController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        collections: state.state.collections.all,
        activeCollection: state.state.collections.active,
        rootPath: state.state.rootPath,
        activePageURI: state.routing.locationBeforeTransitions.hash.replace('#', '')
    }
}

export default connect(mapStateToProps)(CollectionDetailsController);