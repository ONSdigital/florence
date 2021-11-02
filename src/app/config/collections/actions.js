import {
    UPDATE_ACTIVE_COLLECTION,
    EMPTY_ACTIVE_COLLECTION,
    MARK_COLLECTION_FOR_DELETE,
    DELETE_COLLECTION,
    UPDATE_PAGES_IN_ACTIVE_COLLECTION,
    UPDATE_TEAMS_IN_ACTIVE_COLLECTION,
    LOAD_COLLECTIONS_PROGRESS,
    LOAD_COLLECTIONS_SUCCESS,
    LOAD_COLLECTIONS_FAILURE,
} from "./constants";

export function updateActiveCollection(collection) {
    return {
        type: UPDATE_ACTIVE_COLLECTION,
        collection,
    };
}

export function markCollectionForDelete(collectionID) {
    return {
        type: MARK_COLLECTION_FOR_DELETE,
        collectionID,
    };
}

export function deleteCollectionFromAllCollections(collectionID) {
    return {
        type: DELETE_COLLECTION,
        collectionID,
    };
}

export function updatePagesInActiveCollection(collection) {
    return {
        type: UPDATE_PAGES_IN_ACTIVE_COLLECTION,
        collection,
    };
}

export function updateTeamsInActiveCollection(teams) {
    return {
        type: UPDATE_TEAMS_IN_ACTIVE_COLLECTION,
        teams,
    };
}

export function emptyActiveCollection() {
    return {
        type: EMPTY_ACTIVE_COLLECTION,
        collection: null,
    };
}

export const loadCollectionsProgress = () => ({
    type: LOAD_COLLECTIONS_PROGRESS,
});

export const loadCollectionsSuccess = collections => ({
    type: LOAD_COLLECTIONS_SUCCESS,
    collections,
});

export const loadCollectionsFailure = () => ({
    type: LOAD_COLLECTIONS_FAILURE,
});
