import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { push } from 'react-router-redux';

import CollectionCreate from './create/CollectionCreate';
import CollectionDetails from './details/CollectionDetails';
import Drawer from '../../components/drawer/Drawer';
import collections from '../../utilities/api-clients/collections'
import { updateActiveCollection, emptyActiveCollection } from '../../config/actions';
import url from '../../utilities/url'
import notifications from '../../utilities/notifications'
import dateformat from 'dateformat';

import DoubleSelectableBoxController from '../../components/selectable-box/double-column/DoubleSelectableBoxController';

// TODO move shared prop types to a separate file and import them when needed?
const collectionPagePropTypes = {
    uri: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    description: PropTypes.shape({
        title: PropTypes.string.isRequired,
        edition: PropTypes.string
    }).isRequired,
    events: PropTypes.arrayOf(PropTypes.shape({
        email: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired
    }))
}

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    rootPath: PropTypes.string.isRequired,
    params: PropTypes.shape({
        collectionID: PropTypes.string,
        pageID: PropTypes.string
    }).isRequired,
    activeCollection: PropTypes.shape({
        approvalStatus: PropTypes.string,
        collectionOwner: PropTypes.string,
        isEncrypted: PropTypes.bool,
        timeseriesImportFiles: PropTypes.array,
        inProgress: PropTypes.arrayOf(PropTypes.shape(collectionPagePropTypes)),
        complete: PropTypes.arrayOf(PropTypes.shape(collectionPagePropTypes)),
        reviewed: PropTypes.arrayOf(PropTypes.shape(collectionPagePropTypes)),
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
        teams: PropTypes.array.isRequired
    })
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
            this.setState({
                collections: collections,
                isFetchingCollections: false
            });
        }).catch(error => {
            switch(error.status) {
                case(401): {
                    // This is handled by the request function, so do nothing here
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

    fetchActiveCollection(collectionID) {
        this.setState({isFetchingCollectionDetails: true});
        collections.get(collectionID).then(collection => {
            this.props.dispatch(updateActiveCollection(collection));
            this.setState({isFetchingCollectionDetails: false});
        }).catch(error => {
            switch(error.status) {
                case(404): {
                    const notification = {
                        type: 'warning',
                        message: `Collection '${collectionID}' couldn't be found so you've been redirect to the collections screen`,
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
                        message: `There's been a network error getting collection '${collectionID}', please check your connection and refresh the page`,
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
        // TODO handle error scenarios
    }

    handleCollectionCreateSuccess(newCollection) {
        const collections = [...this.state.collections, newCollection];
        this.setState({collections: collections});
        this.props.dispatch(push(`${this.props.rootPath}/collections/${newCollection.id}`));
    }

    handleCollectionSelection(collection) {
        this.props.dispatch(push(`${this.props.rootPath}/collections/${collection.id}`));
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

    handleCollectionPageClick(id) {
        if (id === this.props.params.pageID) {
            return;
        }

        let newURL = location.pathname + "/" + id;
        if (this.props.params.pageID) {
            newURL = url.resolve(id);
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
        const pageRoute = `${this.props.rootPath}/collections/${this.props.activeCollection.id}/${url.slug(uri)}`;
        this.props.dispatch(push(pageRoute));
        window.clearTimeout(deleteTimer);
        notifications.remove(notificationID);

        return pageRoute //using 'return' so that we can test the correct new URL has been generated
    }

    handleCollectionPageDeleteClick(uri, title, state) {
        this.setState(state => ({
            pendingDeletedPages: [...state.pendingDeletedPages, uri]
        }));
        const collectionURL = url.resolve('../');
        this.props.dispatch(push(collectionURL));

        const deletePageTimer = setTimeout(() => {
            collections.deletePage(this.props.params.collectionID, uri).then(() => {
                const newCollectionsPages = this.props.activeCollection[state].filter(page => {
                    return page.uri !== uri;
                });
                const updatedActiveCollection = {
                    ...this.props.activeCollection,
                    [state]: newCollectionsPages
                };
                this.props.dispatch(updateActiveCollection(updatedActiveCollection));
                window.clearTimeout(deletePageTimer);
            }).catch(error => {
                // TODO handle error gracefully
                console.error("Error deleting page from a collection: ", error);
            });
        }, 6000);

        const undoPageDelete = () => {
            this.handleCollectionPageDeleteUndo(deletePageTimer, uri, notificationID);
        };

        const notification = {
            buttons: [{
                text: "Undo",
                onClick: undoPageDelete
            }],
            type: 'positive',
            isDismissable: false,
            autoDismiss: 5000,
            message: <span>Deleted page <strong>'{title}'</strong> from collection '{this.props.activeCollection.name}'</span>
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

    mapCollectionsToDoubleSelectableBox() {
    return this.state.collections.map(collection => {
        return {
            id: collection.id,
            firstColumn: collection.name,
            secondColumn: this.readablePublishDate(collection),
            selectableItem: collection
        }
        })
    }

    mapPagesToCollectionsDetails(state) {
        if (!this.state.pendingDeletedPages || this.state.pendingDeletedPages.length === 0) {
            return this.props.activeCollection[state];
        }

        return this.props.activeCollection[state].filter(page => {
            return !this.state.pendingDeletedPages.includes(page.uri);
        });
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
                        collectionID = {this.props.activeCollection.id}
                        activePageID={this.props.params.pageID}
                        {...this.props.activeCollection}
                        inProgress={this.mapPagesToCollectionsDetails('inProgress')}
                        complete={this.mapPagesToCollectionsDetails('complete')}
                        reviewed={this.mapPagesToCollectionsDetails('reviewed')}
                        onCancel={this.handleDrawerCancelClick}
                        onPageClick={this.handleCollectionPageClick}
                        onEditPageClick={this.handleCollectionPageEditClick}
                        onDeletePageClick={this.handleCollectionPageDeleteClick}
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
                            items={this.mapCollectionsToDoubleSelectableBox()}
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
        rootPath: state.state.rootPath
    }
}

export default connect(mapStateToProps)(CollectionsController);