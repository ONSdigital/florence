import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { push } from 'react-router-redux';

import CollectionCreate from './create/CollectionCreate';
import RestoreContent from './restore-content/RestoreContent'
import CollectionDetails, {pagePropTypes, deletedPagePropTypes} from './details/CollectionDetails';
import Drawer from '../../components/drawer/Drawer';
import collections from '../../utilities/api-clients/collections';
import { updateActiveCollection, emptyActiveCollection , addAllCollections, ADD_ALL_COLLECTIONS} from '../../config/actions';
import notifications from '../../utilities/notifications';
import dateformat from 'dateformat';
import Modal from '../../components/Modal';
import DoubleSelectableBoxController from '../../components/selectable-box/double-column/DoubleSelectableBoxController';
import log, {eventTypes} from '../../utilities/log';
import cookies from '../../utilities/cookies';
import CollectionEditController from './edit/CollectionEditController';
import CollectionDetailsController from './details/CollectionDetailsController'
import mapCollectionToState from './mapCollectionToState'

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    rootPath: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    // params: PropTypes.shape({
    //     collectionID: PropTypes.string
    // }).isRequired,
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
    // isEditingCollection: PropTypes.bool,
    routes: PropTypes.arrayOf(PropTypes.object).isRequired
};

export class CollectionsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // collections: [],
            // isFetchingCollections: false,
            // pendingDeletedPages: [],
            // isCancellingDelete: {
            //     value: false,
            //     uri: ""
            // },
            // isFetchingCollectionDetails: false,
            // isApprovingCollection: false,
            // drawerIsAnimatable: false,
            // drawerIsVisible: false,
            // isEditingCollection: false,
            showRestoreContent: false
        };

        this.handleCollectionSelection = this.handleCollectionSelection.bind(this);
        this.handleCollectionCreateSuccess = this.handleCollectionCreateSuccess.bind(this);
        this.handleRestoreDeletedContentClose = this.handleRestoreDeletedContentClose.bind(this);
        this.handleRestoreDeletedContentSuccess = this.handleRestoreDeletedContentSuccess.bind(this);
    }

    componentWillMount() {
        this.fetchCollections();
    }

    componentWillUnmount() {
        this.props.dispatch(emptyActiveCollection());
    }

    fetchCollections() {
        this.setState({isFetchingCollections: true});
        collections.getAll().then(collections => {
            const allCollections = collections.filter(collection => {
                return collection.approvalStatus !== "COMPLETE";
            }).map(collection => {
                return mapCollectionToState(collection)
            });
            this.props.dispatch(addAllCollections(allCollections));
            this.setState({isFetchingCollections: false});
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

    handleCollectionCreateSuccess(newCollection) {
        const collections = [...this.props.collections, this.mapCollectionToState(newCollection)];
        this.props.dispatch(addAllCollections(collections));
        this.props.dispatch(push(`${this.props.rootPath}/collections/${newCollection.id}`));
        this.fetchCollections();

        // scroll to newly created collection
        const element = document.getElementById(newCollection.id).getBoundingClientRect();
        document.getElementById('selectable-box').scrollTop = element.top;
    }

    handleCollectionSelection(collection) {
        this.props.dispatch(push(`${this.props.rootPath}/collections/${collection.id}`));
    }

    handleRestoreDeletedContentClose() {
        this.props.dispatch(push(location.pathname.split('/restore-content')[0]));
    }

    handleRestoreDeletedContentSuccess(restoredItem) {
        const addDeleteToInProgress = {
            uri: restoredItem.uri,
            title: restoredItem.title,
            type: restoredItem.type
        };

        const updatedActiveCollection = {
            ...this.props.activeCollection,
            inProgress: [...this.props.activeCollection.inProgress, addDeleteToInProgress]
        };

        this.props.dispatch(updateActiveCollection(updatedActiveCollection));

        this.handleRestoreDeletedContentClose();
    }

    // handleCancelPageDeleteClick(uri) {
    //     if (!uri) {
    //         notifications.add({
    //             type: "warning",
    //             message: "Couldn't delete because of an unexpected error: unable to get URI of delete to cancel",
    //             autoDismiss: 5000,
    //             isDismissable: true
    //         });
    //         return;
    //     }

    //     this.setState({isCancellingDelete: {
    //         value: true,
    //         uri
    //     }});

    //     const activeCollectionID = this.props.activeCollection.id;

    //     collections.cancelDelete(this.props.params.collectionID, uri).then(() => {
    //         // User have moved to another collection during the async update, so don't update the active collection in state
    //         if (this.props.params.collectionID !== activeCollectionID) {
    //             return;
    //         }
    //         this.setState({isCancellingDelete: {
    //             value: false,
    //             uri: ""
    //         }});

    //         const updatedActiveCollection = {
    //             ...this.props.activeCollection,
    //             deletes: this.props.activeCollection.deletes.filter(deletedPage => {
    //                 return deletedPage.root.uri !== uri;
    //             })
    //         };
    //         this.props.dispatch(updateActiveCollection(updatedActiveCollection));
    //     }).catch(error => {
    //         this.setState({isCancellingDelete: {
    //             value: false,
    //             uri: ""
    //         }});
    //         switch (error.status) {
    //             case(401): {
    //                 // do nothing - this is handled by the request function itself
    //                 break;
    //             }
    //             case(403): {
    //                 const notification = {
    //                     type: 'neutral',
    //                     message: `You don't have permission to cancel the delete '${uri}' in the collection '${this.props.activeCollection.name}'`,
    //                     autoDismiss: 5000,
    //                     isDismissable: true
    //                 }
    //                 notifications.add(notification);
    //                 break;
    //             }
    //             case(404): {
    //                 const notification = {
    //                     type: 'warning',
    //                     message: `Couldn't cancel delete of page '${uri}' because it doesn't exist in the collection '${this.props.activeCollection.name}'. It may have already been deleted.`,
    //                     isDismissable: true
    //                 }
    //                 notifications.add(notification);
    //                 break;
    //             }
    //             case('FETCH_ERR'): {
    //                 const notification = {
    //                     type: 'warning',
    //                     message: `Couldn't cancel delete of page '${uri}' from this collection due to a network error, please check your connection and try again.`,
    //                     isDismissable: true
    //                 }
    //                 notifications.add(notification);
    //                 break;
    //             }
    //             default: {
    //                 const notification = {
    //                     type: 'warning',
    //                     message: `Couldn't cancel delete of page '${uri}' from the collection '${this.props.activeCollection.name}' due to an unexpected error`,
    //                     isDismissable: true
    //                 };
    //                 notifications.add(notification);
    //                 break;
    //             }
    //         }
    //         log.add(eventTypes.unexpectedRuntimeError, {message: `Error removing pending delete of page '${uri}' from collection '${this.props.params.collectionID}'. Error: ${JSON.stringify(error)}`});
    //         console.error(`Error removing pending delete of page '${uri}' from collection '${this.props.params.collectionID}'`, error);
    //     });
    // }

    // updateActiveCollectionGlobally(collection) {
    //     this.props.dispatch(updateActiveCollection(collection));
    //     cookies.add("collection", collection.id, null);
    // }

    // readablePublishDate(collection) {
    //     if (collection.publishDate && collection.type === "manual") {
    //         return dateformat(collection.publishDate, "ddd, dd/mm/yyyy h:MMTT") + " [rolled back]";
    //     }

    //     if (collection.publishDate) {
    //         return dateformat(collection.publishDate, "ddd, dd/mm/yyyy h:MMTT");
    //     }

    //     if (!collection.publishDate) {
    //         return "[manual collection]";
    //     }
    // }

    // collectionCanBeApproved(collection) {
    //     // One of the lists doesn't have a value, so we can't verify whether it can be
    //     // deleted or not. Therefore it's safer to not allow approval
    //     if (!collection.inProgress || !collection.complete || !collection.reviewed) {
    //         return false;
    //     }

    //     if (collection.reviewed.length >= 1 && collection.inProgress.length === 0 && collection.complete.length === 0) {
    //         return true;
    //     }

    //     // We shouldn't get to this return but we'll return false by default because it's safer to disallow
    //     // approval rather than approve something in a unexpected state
    //     return false;
    // }
    
    // collectionCanBeDeleted(collection) {
    //     // One of the lists doesn't have a value, so we can't verify whether it can be
    //     // deleted or not. Therefore it's safer to not allow approval
    //     if (!collection.inProgress || !collection.complete || !collection.reviewed) {
    //         return false;
    //     }

    //     if (collection.reviewed.length === 0 && collection.inProgress.length === 0 && collection.complete.length === 0 && (!collection.deletes || collection.deletes.length === 0)) {
    //         return true;
    //     }

    //     // We shouldn't get to this return but we'll return false by default because it's safer to disallow
    //     // approval rather than approve something in a unexpected state
    //     return false;
    // }

    // mapPagesAndPendingDeletes(state) {
    //     if (!this.props.activeCollection[state]) {
    //         return;
    //     }

    //     if (!this.state.pendingDeletedPages || this.state.pendingDeletedPages.length === 0) {
    //         return this.props.activeCollection[state];
    //     }

    //     return this.props.activeCollection[state].filter(page => {
    //         return !this.state.pendingDeletedPages.includes(page.uri);
    //     });
    // }

    // mapPagesToCollection(collection) {
    //     try {
    //         const canBeApproved = this.collectionCanBeApproved(collection);
    //         const canBeDeleted = this.collectionCanBeDeleted(collection);
    //         const mapPageToState = pagesArray => {
    //             if (!pagesArray) {
    //                 log.add(eventTypes.runtimeWarning, `Collections pages array (e.g. inProgress) wasn't set, had to hardcode a default value of null`);
    //                 return null;
    //             }
    //             return pagesArray.map(page => {
    //                 return {
    //                     lastEdit: {
    //                         email: page.events ? page.events[0].email : "",
    //                         date: page.events ? page.events[0].date : ""
    //                     },
    //                     title: page.description.title,
    //                     edition: page.description.edition || "",
    //                     uri: page.uri,
    //                     type: page.type
    //                 }
    //             });
    //         }
    //         const mappedCollection = {
    //             ...collection,
    //             canBeApproved,
    //             canBeDeleted,
    //             inProgress: mapPageToState(collection.inProgress),
    //             complete: mapPageToState(collection.complete),
    //             reviewed: mapPageToState(collection.reviewed)
    //         }
    //         return mappedCollection;
    //     } catch (error) {
    //         log.add(eventTypes.unexpectedRuntimeError, "Error mapping collection GET response to Redux state" + JSON.stringify(error));
    //         console.error("Error mapping collection GET response to Redux state" + error);
    //         return null;
    //     }
    // }

    // renderDrawer() {
    //     if (this.state.isFetchingCollections) {
    //         return (
    //             <Drawer
    //                 isVisible={this.state.drawerIsVisible} 
    //                 isAnimatable={this.state.drawerIsAnimatable} 
    //                 handleTransitionEnd={this.handleDrawerTransitionEnd}
    //             >
    //                 <div className="grid grid--align-center grid--full-height">
    //                     <div className="loader loader--large"></div>
    //                 </div>
    //             </Drawer>
    //         )
    //     }


    //     return (
    //         <Drawer
    //             isVisible={this.state.drawerIsVisible} 
    //             isAnimatable={this.state.drawerIsAnimatable} 
    //             handleTransitionEnd={this.handleDrawerTransitionEnd}
    //         >
    //             {(this.props.activeCollection && !this.state.isEditingCollection) &&
    //                 this.renderCollectionDetails()
    //             }
    //             {(this.props.activeCollection && this.state.isEditingCollection) &&
    //                 this.renderEditCollection()
    //             }
    //         </Drawer>
    //     )
    // }

    // renderCollectionDetails() {
    //     return (
    //         <CollectionDetails 
    //             {...this.props.activeCollection}
    //             activePageURI={this.props.activePageURI}
    //             inProgress={this.mapPagesAndPendingDeletes('inProgress')}
    //             complete={this.mapPagesAndPendingDeletes('complete')}
    //             reviewed={this.mapPagesAndPendingDeletes('reviewed')}
    //             onClose={this.handleDrawerCloseClick}
    //             onPageClick={this.handleCollectionPageClick}
    //             onEditPageClick={this.handleCollectionPageEditClick}
    //             onDeletePageClick={this.handleCollectionPageDeleteClick}
    //             onDeleteCollectionClick={this.handleCollectionDeleteClick}
    //             onApproveCollectionClick={this.handleCollectionApproveClick}
    //             onCancelPageDeleteClick={this.handleCancelPageDeleteClick}
    //             isLoadingDetails={this.state.isFetchingCollectionDetails}
    //             isCancellingDelete={this.state.isCancellingDelete}
    //             isApprovingCollection={this.state.isApprovingCollection}
    //         />
    //     )
    // }

    // renderEditCollection() {
    //     return (
    //         <CollectionEditController
    //             name={this.props.activeCollection.name}
    //             id={this.props.activeCollection.id}
    //         />
    //     )
    // }

    render() {
        return (
            <div>
                <div className="grid grid--justify-space-around">
                    <div className="grid__col-4">
                        <h1>Select a collection</h1>
                        <DoubleSelectableBoxController
                            items={this.props.collections}
                            activeItem={this.props.activeCollection}
                            isUpdating={this.state.isFetchingCollections}
                            headings={["Name", "Publish date"]}
                            handleItemClick={this.handleCollectionSelection}
                        />
                    </div>
                    <div className="grid__col-4">
                        <h1>Create a collection</h1>
                        <CollectionCreate user={this.props.user} onSuccess={this.handleCollectionCreateSuccess}  />
                        <CollectionDetailsController collectionID={this.props.params.collectionID} routes={this.props.routes}/>
                    </div>
                </div>
                {this.state.showRestoreContent &&
                    <Modal sizeClass="grid__col-8">
                        <RestoreContent onClose={this.handleRestoreDeletedContentClose} onSuccess={this.handleRestoreDeletedContentSuccess} activeCollectionId={this.props.activeCollection.id} />
                    </Modal>
                }
            </div>
        )
    }
}

CollectionsController.propTypes = propTypes;

export function mapStateToProps(state) {
    return {
        user: state.state.user,
        collections: state.state.collections.all,
        activeCollection: state.state.collections.active,
        rootPath: state.state.rootPath,
        activePageURI: state.routing.locationBeforeTransitions.hash.replace('#', '')
    }
}

export default connect(mapStateToProps)(CollectionsController);