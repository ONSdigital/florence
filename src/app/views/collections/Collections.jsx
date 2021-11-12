import React, { useEffect, useState } from "react";
import { push } from "react-router-redux";
import PropTypes from "prop-types";
import isEmptyObject from "is-empty-object";
import CollectionCreateController from "./create/CollectionCreateController";
import { pagePropTypes } from "./details/CollectionDetails";
import collections from "../../utilities/api-clients/collections";
import DoubleSelectableBox from "../../components/selectable-box/double-column/DoubleSelectableBox";
import notifications from "../../utilities/notifications";
import CollectionDetailsController from "./details/CollectionDetailsController";
import collectionMapper from "./mapper/collectionMapper";
import cookies from "../../utilities/cookies";

const Collections = props => {
    console.log("Collections props==>", props);
    const { user, collections, loadCollections, isLoading } = props;
    const isViewer = user && user.userType === "VIEWER";

    useEffect(() => {
        loadCollections();
    }, []);

    // UNSAFE_componentWillReceiveProps(nextProps) {
    //     // CollectionsController handles removing any collections from allCollections state
    //     // having an ID in the toDelete object means that this component needs to remove it from state
    //     // this stops other components having to understand and handle allCollections state.
    //     // This helps fix any issues where other components might try to update the allCollections state
    //     // without knowing that it's still being fetched.
    //     if (!objectIsEmpty(nextProps.collectionsToDelete) && !state.isLoading) {
    //         removeCollectionFromState(nextProps.collectionsToDelete);
    //     }
    // }

    // componentWillUnmount() {
    //     if (props.activeCollection) {
    //         props.dispatch(emptyActiveCollection());
    //     }
    // }

    // const fetchCollections = () => {
    //     setisLoading(true);

    //     // This Promise needs to be returned so that our tests pass, otherwise they don't detect
    //     // the catch block properly (using 'await') and the test gets executed before the catch
    //     // block has been run
    //     return collections
    //         .getAll()
    //         .then(collections => {
    //             const allCollectionsVisible = isViewer
    //                 ? collections
    //                 : collections.filter(collection => {
    //                       return collection.approvalStatus !== "COMPLETE";
    //                   });
    //             const allCollections = allCollectionsVisible.map(collection => {
    //                 return collectionMapper.collectionResponseToState(collection);
    //             });
    //             addAllCollections(allCollections);
    //             setisLoading(false);
    //         })
    //         .catch(error => {
    //             setisLoading(false);
    //             switch (error.status) {
    //                 case 401: {
    //                     // This is handled by the request function, so do nothing here
    //                     break;
    //                 }
    //                 case 404: {
    //                     const notification = {
    //                         type: "warning",
    //                         message: `No API route available to get collections.`,
    //                         autoDismiss: 5000,
    //                     };
    //                     notifications.add(notification);
    //                     push(`${props.rootPath}/collections`);
    //                     break;
    //                 }
    //                 case 403: {
    //                     const notification = {
    //                         type: "warning",
    //                         message: `You don't have permissions to view collections`,
    //                         autoDismiss: 5000,
    //                     };
    //                     notifications.add(notification);
    //                     push(`${props.rootPath}/collections`);
    //                     break;
    //                 }
    //                 case "RESPONSE_ERR": {
    //                     const notification = {
    //                         type: "warning",
    //                         message:
    //                             "An error's occurred whilst trying to get collections. You may only be able to see previously loaded information and won't be able to edit any team members",
    //                         isDismissable: true,
    //                     };
    //                     notifications.add(notification);
    //                     break;
    //                 }
    //                 case "UNEXPECTED_ERR": {
    //                     const notification = {
    //                         type: "warning",
    //                         message:
    //                             "An unexpected error's occurred whilst trying to get collections. You may only be able to see previously loaded information and won't be able to edit any team members",
    //                         isDismissable: true,
    //                     };
    //                     notifications.add(notification);
    //                     break;
    //                 }
    //                 case "FETCH_ERR": {
    //                     const notification = {
    //                         type: "warning",
    //                         message:
    //                             "There's been a network error whilst trying to get collections. You may only be able to see previously loaded information and not be able to edit any team members",
    //                         isDismissable: true,
    //                     };
    //                     notifications.add(notification);
    //                     break;
    //                 }
    //                 default: {
    //                     const notification = {
    //                         type: "warning",
    //                         message:
    //                             "An unexpected error's occurred whilst trying to get collections. You may only be able to see previously loaded information and won't be able to edit any team members",
    //                         isDismissable: true,
    //                     };
    //                     notifications.add(notification);
    //                     break;
    //                 }
    //             }
    //             console.error("Error fetching all collections:\n", error);
    //         });
    // };

    // removeCollectionFromState(collectionsToDelete) {
    //     for (const collectionID in collectionsToDelete) {
    //         if (!collectionsToDelete.hasOwnProperty(collectionID)) {
    //             return;
    //         }
    //         props.dispatch(deleteCollectionFromAllCollections(collectionID));
    //     }
    // }

    const handleCollectionCreateSuccess = newCollection => {
        const mappedCollection = collectionMapper.collectionResponseToState(newCollection);
        let collections = [...collections, mappedCollection];
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
        // addAllCollections(collections);
        push(`${props.rootPath}/collections/${mappedCollection.id}`);
        document.getElementById(mappedCollection.id).scrollIntoView();
    };

    const handleCollectionClick = id => {
        if (isViewer) {
            cookies.add("collection", id, null);
            // props.updateWorkingOn(id);
            props.dispatch.push(`${props.rootPath}/collections/${id}/preview`);
            return;
        }
        props.dispatch(push(`${props.rootPath}/collections/${id}`));
    };

    return (
        <div>
            <div className="grid grid--justify-space-around">
                <div className={isViewer ? "grid__col-8" : "grid__col-4"}>
                    <h1 className="text-center">Select a collection</h1>
                    <DoubleSelectableBox
                        items={props.collections}
                        activeItemID={props.params.collectionID}
                        isLoading={isLoading}
                        headings={["Name", "Publish date"]}
                        handleItemClick={handleCollectionClick}
                    />
                </div>
                {!isViewer && (
                    <div className="grid__col-4">
                        <h1 className="text-center">Create a collection</h1>
                        <CollectionCreateController collections={props.collections} user={props.user} onSuccess={handleCollectionCreateSuccess} />
                    </div>
                )}
            </div>
            <CollectionDetailsController routes={props.routes} />
        </div>
    );
};

Collections.propTypes = {
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

export default Collections;
