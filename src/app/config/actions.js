import * as types from "./constants";
import collections from "../utilities/api-clients/collections";
import notifications from "../utilities/notifications";

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

export function deleteCollection(collectionID) {
    return {
        type: types.DELETE_COLLECTION,
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

export function loadUsersSuccess(users) {
    return {
        type: types.LOAD_USERS_SUCCESS,
        users,
    };
}

export function loadUsersFailure() {
    return {
        type: types.LOAD_USERS_FAILURE,
    };
}

export function loadUsersProgress() {
    return {
        type: types.LOAD_USERS_PROGRESS,
    };
}

export function loadUserGroupsSuccess(groups) {
    return {
        type: types.LOAD_USER_GROUPS_SUCCESS,
        groups,
    };
}

export function loadUserGroupsFailure() {
    return {
        type: types.LOAD_USER_GROUPS_FAILURE,
    };
}

export function loadUserGroupsProgress() {
    return {
        type: types.LOAD_USER_GROUPS_PROGRESS,
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

export const updateCollectionFailure = () => ({
    type: types.UPDATE_COLLECTION_FAILURE,
});

export const updateCollectionProgress = () => ({
    type: types.UPDATE_COLLECTION_PROGRESS,
});

export const updateCollectionSuccess = collection => ({
    type: types.UPDATE_COLLECTION_SUCCESS,
    collection,
});

export function createUserSuccess(user) {
    return {
        type: types.CREATE_USER_SUCCESS,
        user,
    };
}

export function createUserFailure() {
    return {
        type: types.CREATE_USER_FAILURE,
    };
}

export function createUserProgress() {
    return {
        type: types.CREATE_USER_PROGRESS,
    };
}

export function loadUserSuccess(user) {
    return {
        type: types.LOAD_USER_SUCCESS,
        user,
    };
}

export function loadUserFailure() {
    return {
        type: types.LOAD_USER_FAILURE,
    };
}

export function loadUserProgress() {
    return {
        type: types.LOAD_USER_PROGRESS,
    };
}

export function addGroupsToUserSuccess(userId, groups) {
    return {
        type: types.ADD_GROUPS_TO_USER_SUCCESS,
        userId,
        groups,
    };
}

export function addGroupsToUserFailure() {
    return {
        type: types.ADD_GROUPS_TO_USER_FAILURE,
    };
}

export function addGroupsToUserProgress() {
    return {
        type: types.ADD_GROUPS_TO_USER_PROGRESS,
    };
}

export const updateUserFailure = () => ({
    type: types.UPDATE_USER_FAILURE,
});

export const updateUserProgress = () => ({
    type: types.UPDATE_USER_PROGRESS,
});

export const updateUserSuccess = user => ({
    type: types.UPDATE_USER_SUCCESS,
    user,
});

export const singOutAllUsersProgress = () => ({
    type: types.SIGN_OUT_ALL_USERS_PROGRESS,
});

export const singOutAllUsersFailure = () => ({
    type: types.SIGN_OUT_ALL_USERS_FAILURE,
});

export const singOutAllUsersSuccess = user => ({
    type: types.SIGN_OUT_ALL_USERS_SUCCESS,
    user,
});

export const setPreviewLanguage = language => {
    return {
        type: types.SET_PREVIEW_LANGUAGE,
        language,
    };
};
export function updatePolicySuccess(data) {
    return {
        type: types.UPDATE_POLICY_SUCCESS,
        data,
    };
}

export function updatePolicyProgress() {
    return {
        type: types.UPDATE_POLICY_PROGRESS,
    };
}

export function updatePolicyFailure() {
    return {
        type: types.UPDATE_POLICY_FAILURE,
    };
}

export function loadPolicySuccess(data) {
    return {
        type: types.LOAD_POLICY_SUCCESS,
        data,
    };
}

export function loadPolicyProgress() {
    return {
        type: types.LOAD_POLICY_PROGRESS,
    };
}

export function loadPolicyFailure() {
    return {
        type: types.LOAD_POLICY_FAILURE,
    };
}

export function updatePolicy(collectionId, policies) {
    return async () => {
        try {
            await collections.updatePolicy(collectionId, policies);
        } catch (error) {
            let message = "";
            if (error.body) {
                message = error.body;
            }
            const notification = {
                type: "warning",
                message: `Error updating policies ${message}.`,
                isDismissable: true,
                autoDismiss: 4000,
            };
            notifications.add(notification);
        }
    };
}
