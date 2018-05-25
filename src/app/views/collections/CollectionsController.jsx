import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { push } from 'react-router-redux';

import CollectionCreate from './create/CollectionCreate';
import RestoreContent from './restore-content/RestoreContent'
import {pagePropTypes} from './details/CollectionDetails';
import collections from '../../utilities/api-clients/collections';
import { updateActiveCollection, emptyActiveCollection , addAllCollections} from '../../config/actions';
import notifications from '../../utilities/notifications';
import Modal from '../../components/Modal';
import DoubleSelectableBoxController from '../../components/selectable-box/double-column/DoubleSelectableBoxController';
import CollectionDetailsController from './details/CollectionDetailsController'
import mapCollectionToState from './mapCollectionToState'

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    rootPath: PropTypes.string.isRequired,
    params: PropTypes.shape({
        collectionID: PropTypes.string
    }).isRequired,
    user: PropTypes.object.isRequired,
    collections: PropTypes.array,
    activeCollection: PropTypes.shape({
        inProgress: PropTypes.arrayOf(PropTypes.shape(pagePropTypes)),
        id: PropTypes.string.isRequired,
    }),
    activePageURI: PropTypes.string,
    routes: PropTypes.arrayOf(PropTypes.object).isRequired
};

export class CollectionsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
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