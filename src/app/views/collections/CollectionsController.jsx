import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { push } from 'react-router-redux';

import CollectionCreate from './create/CollectionCreate';
import CollectionDetails, {pagePropTypes} from './details/CollectionDetails';
import Drawer from '../../components/drawer/Drawer';
import collections from '../../utilities/api-clients/collections'
import { updateActiveCollection, emptyActiveCollection } from '../../config/actions';
import url from '../../utilities/url'
import notifications from '../../utilities/notifications'
import dateformat from 'dateformat';

import DoubleSelectableBoxController from '../../components/selectable-box/double-column/DoubleSelectableBoxController';
import log, {eventTypes} from '../../utilities/log';

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    rootPath: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    params: PropTypes.shape({
        collectionID: PropTypes.string
    }).isRequired,
    activeCollection: PropTypes.shape({
        approvalStatus: PropTypes.string,
        collectionOwner: PropTypes.string,
        isEncrypted: PropTypes.bool,
        timeseriesImportFiles: PropTypes.array,
        inProgress: PropTypes.arrayOf(PropTypes.shape(pagePropTypes)),
        complete: PropTypes.arrayOf(PropTypes.shape(pagePropTypes)),
        reviewed: PropTypes.arrayOf(PropTypes.shape(pagePropTypes)),
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
    activePageURI: PropTypes.string
};

export class CollectionsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collections: [],
            isFetchingCollections: false,
            pendingDeletedPages: [],
            isFetchingCollectionDetails: false,
            drawerIsAnimatable: false,
            drawerIsVisible: false
        };

        this.handleCollectionSelection = this.handleCollectionSelection.bind(this);
        this.handleCollectionCreateSuccess = this.handleCollectionCreateSuccess.bind(this);
        this.handleDrawerTransitionEnd = this.handleDrawerTransitionEnd.bind(this);
        this.handleDrawerCancelClick = this.handleDrawerCancelClick.bind(this);
        this.handleCollectionDeleteClick = this.handleCollectionDeleteClick.bind(this);
        this.handleCollectionApproveClick = this.handleCollectionApproveClick.bind(this);
        this.handleCollectionPageClick = this.handleCollectionPageClick.bind(this);
        this.handleCollectionPageEditClick = this.handleCollectionPageEditClick.bind(this);
        this.handleCollectionPageDeleteClick = this.handleCollectionPageDeleteClick.bind(this);
    }

    componentWillMount() {
        this.fetchCollections();

        if (this.props.params.collectionID) {
            this.fetchActiveCollection(this.props.params.collectionID);
            this.setState({drawerIsVisible: true});
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.params.collectionID && nextProps.params.collectionID) {
            const activeCollection = this.state.collections.find(collection => {
                return collection.id === nextProps.params.collectionID;
            });
            this.props.dispatch(updateActiveCollection(activeCollection));
            this.setState({
                drawerIsAnimatable: true,
                drawerIsVisible: true,
            });
            this.fetchActiveCollection(nextProps.params.collectionID);
        }

        if (this.props.params.collectionID && !nextProps.params.collectionID) {
            this.setState({
                drawerIsAnimatable: true,
                drawerIsVisible: false,
            });
        }

        if ((this.props.params.collectionID && nextProps.params.collectionID) && (this.props.params.collectionID !== nextProps.params.collectionID)) {
            const activeCollection = this.state.collections.find(collection => {
                return collection.id === nextProps.params.collectionID;
            });
            this.props.dispatch(updateActiveCollection(activeCollection));
            this.fetchActiveCollection(nextProps.params.collectionID);
        }
    }

    fetchCollections() {
        this.setState({isFetchingCollections: true});
        collections.getAll().then(collections => {
            const allCollections = collections.map(collection => {
                return this.mapAllCollectionsToState(collection)
            });
            this.setState({
                collections: allCollections,
                isFetchingCollections: false
            });
        }).catch(error => {
            switch(error.status) {
                case(401): {
                    // This is handled by the request function, so do nothing here
                    break;
                }
                case(404): {
                    const notification = {
                        type: 'warning',
                        message: `No API route available to get collections.`,
                        autoDismiss: 5000
                    };
                    notifications.add(notification);
                    this.props.dispatch(push(`${this.props.rootPath}/collections`));
                    break;
                }
                case(403): {
                    const notification = {
                        type: 'warning',
                        message: `You don't have permissions to view collections`,
                        autoDismiss: 5000
                    };
                    notifications.add(notification);
                    this.props.dispatch(push(`${this.props.rootPath}/collections`));
                    break;
                }
                case("RESPONSE_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "An error's occurred whilst trying to get collections. You may only be able to see previously loaded information but won't be able to edit any team members",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                case("UNEXPECTED_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error's occurred whilst trying to get collections. You may only be able to see previously loaded information but won't be able to edit any team members",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                case("FETCH_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "There's been a network error whilst trying to get collections. You may only be able to see previously loaded information and not be able to edit any team members",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
            }
            console.error("Error fetching all collections:\n", error);
        });
    }

    mapAllCollectionsToState(collection) {
        try {
            const publishStates = this.mapPublishState(collection);
            return {
                id: collection.id,
                name: collection.name,
                publishDate: this.readablePublishDate(collection),
                publishStatus: {
                    neutral: publishStates.inProgress,
                    warning: publishStates.thrownError,
                    success: publishStates.completed
                },
                type: collection.type,
                selectableBox: {
                    firstColumn: collection.name,
                    secondColumn: this.readablePublishDate(collection)
                }
            }
        } catch (error) {
            const notification = {
                type: "warning",
                message: "Error whilst mapping list of collections to screen",
                isDismissable: true,
                autoDismiss: 3000
            }
            notifications.add(notification);
            console.error("Error mapping collections to component state: ", error);
            log.add(eventTypes.unexpectedRuntimeError, "Error mapping collections to component state: " + error);
            return false;
        }
    }

    mapPublishState(collection) {
        const publishStates = {inProgress: false, thrownError: false, completed: false, notStarted: false}
        try {
            switch (collection.approvalStatus) {
                case (undefined): {
                    break;
                }
                case ('NOT_STARTED'): {
                    publishStates.notStarted = true;
                    break;
                }
                case ('IN_PROGRESS'): {
                    publishStates.inProgress = true;
                    break;
                }
                case ('COMPLETE'): {
                    publishStates.completed = true;
                    break;
                }
                case ('ERROR'): {
                    publishStates.thrownError = true;
                    break;
                }
            }
            return publishStates;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    fetchActiveCollection(collectionID) {
        this.setState({isFetchingCollectionDetails: true});
        collections.get(collectionID).then(collection => {
            const activeCollection = this.mapCollectionDetailsToState(collection);
            this.props.dispatch(updateActiveCollection(activeCollection));
            this.setState({isFetchingCollectionDetails: false});
        }).catch(error => {
            switch(error.status) {
                case(401): {
                    // do nothing - this is handled by the request function itself
                    break;
                }
                case(404): {
                    const notification = {
                        type: 'neutral',
                        message: `Collection '${collectionID}' couldn't be found so you've been redirected to the collections screen`,
                        autoDismiss: 5000
                    };
                    notifications.add(notification);
                    this.props.dispatch(push(`${this.props.rootPath}/collections`));
                    break;
                }
                case(403): {
                    const notification = {
                        type: 'warning',
                        message: `You don't have permissions to access collection '${collectionID}' so you've been redirect to the collections screen`,
                        autoDismiss: 5000
                    };
                    notifications.add(notification);
                    this.props.dispatch(push(`${this.props.rootPath}/collections`));
                    break;
                }
                case('FETCH_ERR'): {
                    const notification = {
                        type: 'warning',
                        message: `There was a network error whilst getting collection '${collectionID}', please check your connection and refresh the page`,
                        autoDismiss: 5000
                    };
                    notifications.add(notification);
                    break;
                }
                default: {
                    const notification = {
                        type: 'warning',
                        message: 'An unexpected error occurred',
                        autoDismiss: 5000
                    };
                    notifications.add(notification);
                    break;
                }
            }
            this.setState({isFetchingCollectionDetails: false});
            console.error(`Fetching collection ${collectionID}: `, error);
        });
    }

    handleCollectionCreateSuccess(newCollection) {
        const collections = [...this.state.collections, this.mapAllCollectionsToState(newCollection)];
        this.setState({collections: collections});
        this.props.dispatch(push(`${this.props.rootPath}/collections/${newCollection.id}`));
    }

    handleCollectionSelection(collection) {
        this.props.dispatch(push(`${this.props.rootPath}/collections/${collection.id}`));
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
            switch (error.status) {
                case(401): {
                    // do nothing - this is handled by the request function itself
                    break;
                }
                case(400): {
                    const notification = {
                        type: 'warning',
                        message: `Couldn't delete collection '${collectionID}'. There may be a file left in progress or awaiting review.`,
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                case(404): {
                    const notification = {
                        type: 'warning',
                        message: `Couldn't delete collection '${collectionID}'. It may have already been deleted.`,
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                case(403): {
                    const notification = {
                        type: 'neutral',
                        message: `You don't have permission to delete collections`,
                        autoDismiss: 5000,
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                case('FETCH_ERR'): {
                    const notification = {
                        type: 'warning',
                        message: `Couldn't delete collection '${collectionID}' due to a network error, please check your connection and try again.`,
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                default: {
                    const notification = {
                        type: 'warning',
                        message: `Couldn't delete collection '${collectionID}' due to an unexpected error`,
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
            }
            console.error(`Error deleting collection '${collectionID}'`, error);
        });
    }

    handleCollectionApproveClick() {
        const activeCollection = this.props.activeCollection;
        const collectionID = this.props.params.collectionID;
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
                        publishedStatus: {
                            ...collection.publishStatus,
                            neutral: true
                        }
                    }
                })
            }
        }
        collections.approve(collectionID).then(() => {   
            this.setState(updatePublishStatusToNeutral);
            this.props.dispatch(push(`${this.props.rootPath}/collections`));
        }).catch(error => {
            switch (error.status) {
                case(401): {
                    // Handled by request function
                    break;
                }
                case(403): {
                    const notification = {
                        type: 'neutral',
                        message: `You don't have permission to approve the collection '${activeCollection.name}'`,
                        autoDismiss: 5000,
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                case(404): {
                    const notification = {
                        type: 'warning',
                        message: `Couldn't approve the collection '${activeCollection.name}'. It may have already been approved or have been deleted.`,
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                case('FETCH_ERR'): {
                    const notification = {
                        type: 'warning',
                        message: `Couldn't approve the collection '${activeCollection.name}' due to a network error, please check your connection and try again.`,
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                default: {
                    const notification = {
                        type: 'warning',
                        message: `Couldn't approve the collection '${activeCollection.name}' due to an unexpected error`,
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
            }
            console.error("Error approving collection", error);
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
        if (uri === this.props.activePageURI) {
            return;
        }

        let newURL = location.pathname + "#" + uri;
        if (this.props.activePageURI) {
            newURL = `${this.props.rootPath}/collections/${this.props.params.collectionID}#${uri}`;
        }
    
        this.props.dispatch(push(newURL));

        return newURL; //using 'return' so that we can test the correct new URL has been generated
    }

    handleCollectionPageEditClick(uri) {
        window.location = `${this.props.rootPath}/workspace?collection=${this.props.params.collectionID}&uri=${uri}`;
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
        this.setState(state => ({
            pendingDeletedPages: [...state.pendingDeletedPages, uri]
        }));
        const collectionURL = location.pathname.replace(`#${uri}`, "");
        this.props.dispatch(push(collectionURL));

        const triggerPageDelete = () => {
            collections.deletePage(this.props.params.collectionID, uri).then(() => {
                const newCollectionsPages = this.props.activeCollection[state].filter(page => {
                    return page.uri !== uri;
                });
                const updatedActiveCollection = this.mapCollectionDetailsToState({
                    ...this.props.activeCollection,
                    [state]: newCollectionsPages
                });
                this.props.dispatch(updateActiveCollection(updatedActiveCollection));
                window.clearTimeout(deletePageTimer);
            }).catch(error => {
                switch (error.status) {
                    case(401): {
                        // do nothing - this is handled by the request function itself
                        break;
                    }
                    case(404): {
                        const notification = {
                            type: 'warning',
                            message: `Couldn't delete the page '${title}' from this collection. It may have already been deleted.`,
                            isDismissable: true
                        }
                        notifications.add(notification);
                        break;
                    }
                    case(403): {
                        const notification = {
                            type: 'neutral',
                            message: `You don't have permission to delete the page '${title}' from this collection`,
                            autoDismiss: 5000,
                            isDismissable: true
                        }
                        notifications.add(notification);
                        break;
                    }
                    case('FETCH_ERR'): {
                        const notification = {
                            type: 'warning',
                            message: `Couldn't delete the page '${title}' from this collection due to a network error, please check your connection and try again.`,
                            isDismissable: true
                        }
                        notifications.add(notification);
                        break;
                    }
                    default: {
                        const notification = {
                            type: 'warning',
                            message: `Couldn't delete the page '${title}' from this collection due to an unexpected error`,
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                }
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

    handleDrawerCancelClick() {
        this.setState({
            drawerIsAnimatable: true,
            drawerIsVisible: false
        });
    }

    readablePublishDate(collection) {
        if (collection.publishDate && collection.type === "manual") {
            return dateformat(collection.publishDate, "ddd, dd/mm/yyyy h:MMTT") + " [rolled back]";
        }

        if (collection.publishDate) {
            return dateformat(collection.publishDate, "ddd, dd/mm/yyyy h:MMTT");
        }

        if (!collection.publishDate) {
            return "[manual collection]";
        }
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

        if (collection.reviewed.length === 0 && collection.inProgress.length === 0 && collection.complete.length === 0) {
            return true;
        }

        // We shouldn't get to this return but we'll return false by default because it's safer to disallow
        // approval rather than approve something in a unexpected state
        return false;
    }

    mapPagesToCollectionsDetails(state) {
        if (!this.state.pendingDeletedPages || this.state.pendingDeletedPages.length === 0) {
            return this.props.activeCollection[state];
        }

        return this.props.activeCollection[state].filter(page => {
            return !this.state.pendingDeletedPages.includes(page.uri);
        });
    }

    mapCollectionDetailsToState(collection) {
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
                id: collection.id,
                name: collection.name,
                canBeApproved,
                canBeDeleted,
                inProgress: mapPageToState(collection.inProgress),
                complete: mapPageToState(collection.complete),
                reviewed: mapPageToState(collection.reviewed),
                type: collection.type,
                teams: collections.teams
            }
            return mappedCollection;
        } catch (error) {
            log.add(eventTypes.unexpectedRuntimeError, "Error mapping collection GET response to Redux state" + JSON.stringify(error));
            console.error("Error mapping collection GET response to Redux state" + error);
            return null;
        }
    }

    renderDetailsDrawer() {
        return (
            <Drawer
                isVisible={this.state.drawerIsVisible} 
                isAnimatable={this.state.drawerIsAnimatable} 
                handleTransitionEnd={this.handleDrawerTransitionEnd}
            >
                {(this.props.params.collectionID && this.props.activeCollection) 
                    ||
                // Drawer closing but keep collection details rendered whilst
                // animation happens. handleEndTransition will empty active collection
                (!this.props.params.collectionID && this.props.activeCollection)
                ?
                    <CollectionDetails 
                        {...this.props.activeCollection}
                        activePageURI={this.props.activePageURI}
                        inProgress={this.mapPagesToCollectionsDetails('inProgress')}
                        complete={this.mapPagesToCollectionsDetails('complete')}
                        reviewed={this.mapPagesToCollectionsDetails('reviewed')}
                        onCancel={this.handleDrawerCancelClick}
                        onPageClick={this.handleCollectionPageClick}
                        onEditPageClick={this.handleCollectionPageEditClick}
                        onDeletePageClick={this.handleCollectionPageDeleteClick}
                        onDeleteCollectionClick={this.handleCollectionDeleteClick}
                        onApproveCollectionClick={this.handleCollectionApproveClick}
                        isLoadingDetails={this.state.isFetchingCollectionDetails}
                    />
                    :
                    <div className="grid grid--align-center grid--full-height">
                        <div className="loader loader--large"></div>
                    </div>
                }
            </Drawer>
        )
    }

    render () {
        return (
            <div>
                <div className="grid grid--justify-space-around">
                    <div className="grid__col-4">
                        <h1>Select a collection</h1>
                        <DoubleSelectableBoxController
                            items={this.state.collections}
                            activeItem={this.props.activeCollection}
                            isUpdating={this.state.isFetchingCollections}
                            headings={["Name", "Collection date"]}
                            handleItemClick={this.handleCollectionSelection}
                        />
                    </div>
                    <div className="grid__col-4">
                        <h1>Create a collection</h1>
                        <CollectionCreate user={this.props.user} onSuccess={this.handleCollectionCreateSuccess}/>
                        {this.renderDetailsDrawer()}
                    </div>
                </div>
            </div>
        )
    }
}

CollectionsController.propTypes = propTypes;

export function mapStateToProps(state) {
    return {
        user: state.state.user,
        activeCollection: state.state.collections.active,
        rootPath: state.state.rootPath,
        activePageURI: state.routing.locationBeforeTransitions.hash.replace('#', '')
    }
}

export default connect(mapStateToProps)(CollectionsController);