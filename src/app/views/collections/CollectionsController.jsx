import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { push } from "react-router-redux";
import objectIsEmpty from "is-empty-object";
import CollectionCreateController from "./create/CollectionCreateController";
import { pagePropTypes } from "./details/CollectionDetails";
import collections from "../../utilities/api-clients/collections";
import DoubleSelectableBoxController from "../../components/selectable-box/double-column/DoubleSelectableBoxController";
import { emptyActiveCollection, addAllCollections, deleteCollectionFromAllCollections, updateWorkingOn } from "../../config/actions";
import notifications from "../../utilities/notifications";
import CollectionDetailsController from "./details/CollectionDetailsController";
import collectionMapper from "./mapper/collectionMapper";
import cookies from "../../utilities/cookies";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    rootPath: PropTypes.string.isRequired,
    params: PropTypes.shape({
        collectionID: PropTypes.string,
    }).isRequired,
    user: PropTypes.shape({
        userType: PropTypes.string.isRequired,
    }).isRequired,
    collections: PropTypes.array,
    activeCollection: PropTypes.shape({
        inProgress: PropTypes.arrayOf(PropTypes.shape(pagePropTypes)),
        id: PropTypes.string.isRequired,
    }),
    collectionsToDelete: PropTypes.object.isRequired,
    routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export class CollectionsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingCollections: false,
        };

        this.isViewer = this.props.user.userType === "VIEWER";
    }

    UNSAFE_componentWillMount() {
        return this.fetchCollections();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        // CollectionsController handles removing any collections from allCollections state
        // having an ID in the toDelete object means that this component needs to remove it from state
        // this stops other components having to understand and handle allCollections state.
        // This helps fix any issues where other components might try to update the allCollections state
        // without knowing that it's still being fetched.
        if (!objectIsEmpty(nextProps.collectionsToDelete) && !this.state.isFetchingCollections) {
            this.removeCollectionFromState(nextProps.collectionsToDelete);
        }
    }

    componentWillUnmount() {
        if (this.props.activeCollection) {
            this.props.dispatch(emptyActiveCollection());
        }
    }

    fetchCollections() {
        this.setState({ isFetchingCollections: true });

        // This Promise needs to be returned so that our tests pass, otherwise they don't detect
        // the catch block properly (using 'await') and the test gets executed before the catch
        // block has been run
        return collections
            .getAll()
            .then(collections => {
                const allCollectionsVisible = this.isViewer
                    ? collections
                    : collections.filter(collection => {
                          return collection.approvalStatus !== "COMPLETE";
                      });
                const allCollections = allCollectionsVisible.map(collection => {
                    return collectionMapper.collectionResponseToState(collection);
                });
                this.props.dispatch(addAllCollections(allCollections));
                this.setState({ isFetchingCollections: false });
            })
            .catch(error => {
                this.setState({ isFetchingCollections: false });
                switch (error.status) {
                    case 401: {
                        // This is handled by the request function, so do nothing here
                        break;
                    }
                    case 404: {
                        const notification = {
                            type: "warning",
                            message: `No API route available to get collections.`,
                            autoDismiss: 5000,
                        };
                        notifications.add(notification);
                        this.props.dispatch(push(`${this.props.rootPath}/collections`));
                        break;
                    }
                    case 403: {
                        const notification = {
                            type: "warning",
                            message: `You don't have permissions to view collections`,
                            autoDismiss: 5000,
                        };
                        notifications.add(notification);
                        this.props.dispatch(push(`${this.props.rootPath}/collections`));
                        break;
                    }
                    case "RESPONSE_ERR": {
                        const notification = {
                            type: "warning",
                            message:
                                "An error's occurred whilst trying to get collections. You may only be able to see previously loaded information and won't be able to edit any team members",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "UNEXPECTED_ERR": {
                        const notification = {
                            type: "warning",
                            message:
                                "An unexpected error's occurred whilst trying to get collections. You may only be able to see previously loaded information and won't be able to edit any team members",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "FETCH_ERR": {
                        const notification = {
                            type: "warning",
                            message:
                                "There's been a network error whilst trying to get collections. You may only be able to see previously loaded information and not be able to edit any team members",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    default: {
                        const notification = {
                            type: "warning",
                            message:
                                "An unexpected error's occurred whilst trying to get collections. You may only be able to see previously loaded information and won't be able to edit any team members",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                }
                console.error("Error fetching all collections:\n", error);
            });
    }

    removeCollectionFromState(collectionsToDelete) {
        for (const collectionID in collectionsToDelete) {
            if (!collectionsToDelete.hasOwnProperty(collectionID)) {
                return;
            }
            this.props.dispatch(deleteCollectionFromAllCollections(collectionID));
        }
    }

    handleCollectionCreateSuccess = newCollection => {
        const mappedCollection = collectionMapper.collectionResponseToState(newCollection);
        let collections = [...this.props.collections, mappedCollection];
        collections.sort((collection1, collection2) => {
            const firstID = collection1.id.toLowerCase();
            const secondID = collection2.id.toLowerCase();
            if (firstID < secondID) {
                return -1;
            }
            if (firstID > secondID) {
                return 1;
            }
            return 0;
        });
        this.props.dispatch(addAllCollections(collections));
        this.props.dispatch(push(`${this.props.rootPath}/collections/${mappedCollection.id}`));
        this.fetchCollections();
        document.getElementById(mappedCollection.id).scrollIntoView();
    };

    handleCollectionSelection = collection => {
        if (this.isViewer) {
            cookies.add("collection", collection.id, null);
            this.props.dispatch(updateWorkingOn(collection.id, collection.name));
            this.props.dispatch(push(`${this.props.rootPath}/collections/${collection.id}/preview`));
            return;
        }
        this.props.dispatch(push(`${this.props.rootPath}/collections/${collection.id}`));
    };

    render() {
        return (
            <div>
                <div className="grid grid--justify-space-around">
                    <div className={this.isViewer ? "grid__col-8" : "grid__col-4"}>
                        <h1 className="text-center">Select a collection</h1>
                        <DoubleSelectableBoxController
                            items={this.props.collections}
                            activeItemID={this.props.params.collectionID}
                            isUpdating={this.state.isFetchingCollections}
                            headings={["Name", "Publish date"]}
                            handleItemClick={this.handleCollectionSelection}
                        />
                    </div>
                    {!this.isViewer && (
                        <div className="grid__col-4">
                            <h1 className="text-center">Create a collection</h1>
                            <CollectionCreateController
                                collections={this.props.collections}
                                user={this.props.user}
                                onSuccess={this.handleCollectionCreateSuccess}
                            />
                        </div>
                    )}
                </div>
                <CollectionDetailsController collectionID={this.props.params.collectionID} routes={this.props.routes} />
            </div>
        );
    }
}

CollectionsController.propTypes = propTypes;

export function mapStateToProps(state) {
    return {
        user: state.user,
        collections: state.state.collections.all,
        activeCollection: state.state.collections.active,
        collectionsToDelete: state.state.collections.toDelete,
        rootPath: state.state.rootPath,
    };
}

export default connect(mapStateToProps)(CollectionsController);
