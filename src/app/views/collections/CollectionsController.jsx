import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { push } from "react-router-redux";
import CollectionCreateController from "./create/CollectionCreateController";
import { pagePropTypes } from "./details/CollectionDetails";
// import collections from "../../utilities/api-clients/collections";
import DoubleSelectableBoxController from "../../components/selectable-box/double-column/DoubleSelectableBoxController";
import notifications from "../../utilities/notifications";
import CollectionDetailsController from "./details/CollectionDetailsController";
import collectionMapper from "./mapper/collectionMapper";
import cookies from "../../utilities/cookies";

const CollectionsController = props => {
    const [isFetchingCollections, setIsFetchingCollections] = useState(false);
    console.log("props", props);
    const { collectionID, routes, user, rootPath, collections } = props.params;
    const isViewer = false || (user && user.userType === "VIEWER");

    useEffect(() => {
        fetchCollections();
    }, []);

    // useEffect(() => {
    //     return function cleanup() {
    //         props.emptyActiveCollection()
    //     };
    // },[props.activeCollection, props.collectionsToDelete]);

    function fetchCollections() {
        setIsFetchingCollections(true);

        // This Promise needs to be returned so that our tests pass, otherwise they don't detect
        // the catch block properly (using 'await') and the test gets executed before the catch
        // block has been run
        return collections
            .getAll()
            .then(collections => {
                const allCollectionsVisible = isViewer
                    ? collections
                    : collections.filter(collection => {
                          return collection.approvalStatus !== "COMPLETE";
                      });
                const allCollections = allCollectionsVisible.map(collection => {
                    return collectionMapper.collectionResponseToState(collection);
                });
                props.addAllCollections(allCollections);
                setIsFetchingCollections(false);
            })
            .catch(error => {
                setIsFetchingCollections(false);
                switch (error.status) {
                    case 401: {
                        // This is handled by the request function, so do nothing here
                        break;
                    }
                    case 404: {
                        const notification = {
                            type: "warning",
                            message: `No API route available to get collections.`,
                            autoDismiss: 5000
                        };
                        notifications.add(notification);
                        push(`${rootPath}/collections`);
                        break;
                    }
                    case 403: {
                        const notification = {
                            type: "warning",
                            message: `You don't have permissions to view collections`,
                            autoDismiss: 5000
                        };
                        notifications.add(notification);
                        push(`${isFetchingCollectionsrootPath}/collections`);
                        break;
                    }
                    case "RESPONSE_ERR": {
                        const notification = {
                            type: "warning",
                            message:
                                "An error's occurred whilst trying to get collections. You may only be able to see previously loaded information and won't be able to edit any team members",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "UNEXPECTED_ERR": {
                        const notification = {
                            type: "warning",
                            message:
                                "An unexpected error's occurred whilst trying to get collections. You may only be able to see previously loaded information and won't be able to edit any team members",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "FETCH_ERR": {
                        const notification = {
                            type: "warning",
                            message:
                                "There's been a network error whilst trying to get collections. You may only be able to see previously loaded information and not be able to edit any team members",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                    default: {
                        const notification = {
                            type: "warning",
                            message:
                                "An unexpected error's occurred whilst trying to get collections. You may only be able to see previously loaded information and won't be able to edit any team members",
                            isDismissable: true
                        };
                        notifications.add(notification);
                        break;
                    }
                }
                console.error("Error fetching all collections:\n", error);
            });
    }

    const removeCollectionFromState = collectionsToDelete => {
        for (const collectionID in collectionsToDelete) {
            if (!collectionsToDelete.hasOwnProperty(collectionID)) {
                return;
            }
            props.deleteCollectionFromAllCollections(collectionID);
        }
    };

    const handleCollectionCreateSuccess = newCollection => {
        const mappedCollection = collectionMapper.collectionResponseToState(newCollection);
        let collectionsSet = [...collections, mappedCollection];
        collectionsSet.sort((collection1, collection2) => {
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
        props.addAllCollections(collections);
        push(`${rootPath}/collections/${mappedCollection.id}`);
        fetchCollections();
        document.getElementById(mappedCollection.id).scrollIntoView();
    };

    const handleCollectionSelection = collection => {
        if (isViewer) {
            cookies.add("collection", collection.id, null);
            props.updateWorkingOn(collection.id, collection.name);
            push(`${rootPath}/collections/${collection.id}/preview`);
            return;
        }
        push(`${rootPath}/collections/${collection.id}`);
    };

    return (
        <div>
            <div className="grid grid--justify-space-around">
                <div className={isViewer ? "grid__col-8" : "grid__col-4"}>
                    <h1 className="text-center">Select a collection</h1>
                    <DoubleSelectableBoxController
                        items={props.collections}
                        activeItemID={collectionID}
                        isUpdating={isFetchingCollections}
                        headings={["Name", "Publish date"]}
                        handleItemClick={handleCollectionSelection}
                    />
                </div>
                {!isViewer && (
                    <div className="grid__col-4">
                        <h1 className="text-center">Create a collection</h1>
                        <CollectionCreateController user={user} onSuccess={handleCollectionCreateSuccess} />
                    </div>
                )}
            </div>
            <CollectionDetailsController collectionID={collectionID} routes={routes} />
        </div>
    );
};

export default CollectionsController;
