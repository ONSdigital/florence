import * as types from "./constants";

export function reset() {
    return {
        type: types.RESET,
    };
}

export function setConfig(config) {
    return {
        type: types.SET_CONFIG,
        config,
    };
}

export function addAllCollections(collections) {
    return {
        type: types.ADD_ALL_COLLECTIONS,
        collections,
    };
}

export function createCollectionSuccess(collection) {
    return {
        type: types.CREATE_COLLECTION_SUCCESS,
        collection,
    };
}

export function saveSearch(value) {
    return {
        type: types.SEARCH,
        value,
    };
}

export function markCollectionForDeleteFromAllCollections(collectionID) {
    return {
        type: types.MARK_COLLECTION_FOR_DELETE_FROM_ALL_COLLECTIONS,
        collectionID,
    };
}

export function deleteCollectionFromAllCollections(collectionID) {
    return {
        type: types.DELETE_COLLECTION_FROM_ALL_COLLECTIONS,
        collectionID,
    };
}

export function updateActiveCollection(collection) {
    return {
        type: types.UPDATE_ACTIVE_COLLECTION,
        collection,
    };
}

export function updatePagesInActiveCollection(collection) {
    return {
        type: types.UPDATE_PAGES_IN_ACTIVE_COLLECTION,
        collection,
    };
}

export function updateTeamsInActiveCollection(teams) {
    return {
        type: types.UPDATE_TEAMS_IN_ACTIVE_COLLECTION,
        teams,
    };
}

export function emptyActiveCollection() {
    return {
        type: types.EMPTY_ACTIVE_COLLECTION,
        collection: null,
    };
}

export function updateWorkingOn(id, name, url, collection, error) {
    return {
        type: types.UPDATE_WORKING_ON,
        workingOn: { id, name, url, collection, error },
    };
}

export function emptyWorkingOn() {
    return {
        type: types.EMPTY_WORKING_ON,
    };
}

export function updateActiveUser(user) {
    return {
        type: types.UPDATE_ACTIVE_USER,
        user,
    };
}

export function addAllUsers(users) {
    return {
        type: types.ADD_ALL_USERS,
        users,
    };
}

export function removeUserFromAllUsers(userID) {
    return {
        type: types.REMOVE_USER_FROM_ALL_USERS,
        userID,
    };
}

export function updateAllDatasets(allDatasets) {
    return {
        type: types.UPDATE_ALL_DATASETS,
        allDatasets,
    };
}

export function updateActiveDataset(dataset) {
    return {
        type: types.UPDATE_ACTIVE_DATASET,
        dataset,
    };
}

export function emptyActiveDataset() {
    return {
        type: types.EMPTY_ACTIVE_DATASET,
    };
}

export function updateActiveDatasetCollectionID(collectionID) {
    return {
        type: types.UPDATE_ACTIVE_DATASET_COLLECTION_ID,
        collectionID,
    };
}

export function updateActiveDatasetReviewState(lastEditedBy, reviewState) {
    return {
        type: types.UPDATE_ACTIVE_DATASET_REVIEW_STATE,
        lastEditedBy,
        reviewState,
    };
}

export function updateAllRecipes(allRecipes) {
    return {
        type: types.UPDATE_ALL_RECIPES,
        allRecipes,
    };
}

export function updateAllJobs(allJobs) {
    return {
        type: types.UPDATE_ALL_JOBS,
        allJobs,
    };
}

export function updateActiveJob(job) {
    return {
        type: types.UPDATE_ACTIVE_JOB,
        job,
    };
}

export function addNewJob(job) {
    return {
        type: types.ADD_NEW_JOB,
        job,
    };
}

export function updateActiveInstance(instance) {
    return {
        type: types.UPDATE_ACTIVE_INSTANCE,
        instance,
    };
}

export function emptyActiveInstance() {
    return {
        type: types.EMPTY_ACTIVE_INSTANCE,
    };
}

export function updateActiveVersion(version) {
    return {
        type: types.UPDATE_ACTIVE_VERSION,
        version,
    };
}

export function updateActiveVersionReviewState(lastEditedBy, reviewState) {
    return {
        type: types.UPDATE_ACTIVE_VERSION_REVIEW_STATE,
        lastEditedBy,
        reviewState,
    };
}

export function emptyActiveVersion() {
    return {
        type: types.EMPTY_ACTIVE_VERSION,
    };
}

export function updateAllTeams(allTeams) {
    return {
        type: types.UPDATE_ALL_TEAMS,
        allTeams: allTeams,
    };
}

export function updateAllTeamIDsAndNames(allTeamIDsAndNames) {
    return {
        type: types.UPDATE_ALL_TEAM_IDS_AND_NAMES,
        allTeamIDsAndNames,
    };
}

export function updateActiveTeam(activeTeam) {
    return {
        type: types.UPDATE_ACTIVE_TEAM,
        activeTeam: activeTeam,
    };
}

export function updateActiveTeamMembers(members) {
    return {
        type: types.UPDATE_ACTIVE_TEAM_MEMBERS,
        members: members,
    };
}

export function emptyActiveTeam() {
    return {
        type: types.UPDATE_ACTIVE_TEAM,
        activeTeam: {},
    };
}

export function addNotification(notification) {
    return {
        type: types.ADD_NOTIFICATION,
        notification,
    };
}

export function removeNotification(notificationID) {
    return {
        type: types.REMOVE_NOTIFICATION,
        notificationID,
    };
}

export function addPopout(popout) {
    return {
        type: types.ADD_POPOUT,
        popout,
    };
}

export function removePopouts(popoutIDs) {
    return {
        type: types.REMOVE_POPOUTS,
        popoutIDs,
    };
}

export function toggleNotificationVisibility(notificationID) {
    return {
        type: types.TOGGLE_NOTIFICATION_VISIBILITY,
        notificationID,
    };
}

export function addPreviewCollection(previewCollection) {
    return {
        type: types.ADD_PREVIEW_COLLECTION,
        preview: previewCollection,
    };
}

export function removePreviewCollection() {
    return {
        type: types.REMOVE_PREVIEW_COLLECTION,
        preview: {},
    };
}

export function updateSelectedPreviewPage(selectedPage) {
    return {
        type: types.UPDATE_PREVIEW_SELECTED_PAGE,
        selectedPage,
    };
}

export function removeSelectedPreviewPage() {
    return {
        type: types.REMOVE_PREVIEW_SELECTED_PAGE,
        selectedPage: {},
    };
}

export function loadCollectionsSuccess(collections) {
    return {
        type: types.LOAD_COLLECTIONS_SUCCESS,
        collections,
    };
}

export const loadCollectionsFailure = () => ({
    type: types.LOAD_COLLECTIONS_FAILURE,
});

export const loadCollectionsProgress = () => ({
    type: types.LOAD_COLLECTIONS_PROGRESS,
});
