export const SET_CONFIG = "SET_CONFIG";

export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';

export const ADD_ALL_COLLECTIONS = 'ADD_ALL_COLLECTIONS';
export const MARK_COLLECTION_FOR_DELETE_FROM_ALL_COLLECTIONS = 'MARK_COLLECTION_FOR_DELETE_FROM_ALL_COLLECTIONS';
export const DELETE_COLLECTION_FROM_ALL_COLLECTIONS = 'DELETE_COLLECTION_FROM_ALL_COLLECTIONS';
export const UPDATE_ACTIVE_COLLECTION = 'UPDATE_ACTIVE_COLLECTION';
export const RESET = 'RESET';

export const UPDATE_PAGES_IN_ACTIVE_COLLECTION = 'UPDATE_PAGES_IN_ACTIVE_COLLECTION';
export const UPDATE_TEAMS_IN_ACTIVE_COLLECTION = 'UPDATE_TEAMS_IN_ACTIVE_COLLECTION';
export const EMPTY_ACTIVE_COLLECTION = 'EMPTY_ACTIVE_COLLECTION';

export const UPDATE_WORKING_ON = 'UPDATE_WORKING_ON';
export const EMPTY_WORKING_ON = 'EMPTY_WORKING_ON'

export const UPDATE_ACTIVE_USER = 'UPDATE_ACTIVE_USER';
export const ADD_ALL_USERS = 'ADD_ALL_USERS';
export const REMOVE_USER_FROM_ALL_USERS = 'REMOVE_USER_FROM_ALL_USERS';

export const UPDATE_ALL_TEAMS = 'UPDATE_ALL_TEAMS';
export const UPDATE_ALL_TEAM_IDS_AND_NAMES = 'UPDATE_ALL_TEAM_IDS_AND_NAMES';
export const UPDATE_ACTIVE_TEAM = 'UPDATE_ACTIVE_TEAM';
export const UPDATE_ACTIVE_TEAM_MEMBERS = 'UPDATE_ACTIVE_TEAM_MEMBERS';

export const UPDATE_ALL_DATASETS = 'UPDATE_ALL_DATASETS';
export const UPDATE_ACTIVE_DATASET = 'UPDATE_ACTIVE_DATASET';
export const EMPTY_ACTIVE_DATASET = 'EMPTY_ACTIVE_DATASET';
export const UPDATE_ACTIVE_DATASET_REVIEW_STATE = 'UPDATE_ACTIVE_DATASET_REVIEW_STATE';
export const UPDATE_ACTIVE_DATASET_COLLECTION_ID = 'UPDATE_ACTIVE_DATASET_COLLECTION_ID';
export const UPDATE_ALL_RECIPES = 'UPDATE_ALL_RECIPES';
export const UPDATE_ALL_JOBS = 'UPDATE_ALL_JOBS';
export const UPDATE_ACTIVE_JOB = 'UPDATE_ACTIVE_JOB';
export const ADD_NEW_JOB = 'ADD_NEW_JOB';
export const UPDATE_ACTIVE_INSTANCE = 'UPDATE_ACTIVE_INSTANCE';
export const UPDATE_ACTIVE_VERSION_REVIEW_STATE = 'UPDATE_ACTIVE_VERSION_REVIEW_STATE';
export const EMPTY_ACTIVE_INSTANCE = 'EMPTY_ACTIVE_INSTANCE';
export const UPDATE_ACTIVE_VERSION = 'UPDATE_ACTIVE_VERSION';
export const EMPTY_ACTIVE_VERSION = 'EMPTY_ACTIVE_VERSION';

export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';
export const TOGGLE_NOTIFICATION_VISIBILITY = 'TOGGLE_NOTIFICATION_VISIBILITY';

export const ADD_PREVIEW_COLLECTION = "ADD_PREVIEW_COLLECTION";
export const REMOVE_PREVIEW_COLLECTION = "REMOVE_PREVIEW_COLLECTION";
export const UPDATE_PREVIEW_SELECTED_PAGE = "UPDATE_PREVIEW_SELECTED_PAGE";
export const REMOVE_PREVIEW_SELECTED_PAGE = "REMOVE_PREVIEW_SELECTED_PAGE";

export function reset() {	
    return {	    
        type: RESET
    }
}

export function setConfig(config) {
    return {
        type: SET_CONFIG,
        config
    }
}

export function userLoggedIn(email, userType, isAdmin) {
    return {
        type: USER_LOGGED_IN,
        email: email,
        userType: userType,
        isAdmin: isAdmin
    }
}

export function userLoggedOut() {
    return {
        type: USER_LOGGED_OUT
    }
}


export function addAllCollections(collections) {
    return {
        type: ADD_ALL_COLLECTIONS,
        collections
    }
}

export function markCollectionForDeleteFromAllCollections(collectionID) {
    return {
        type: MARK_COLLECTION_FOR_DELETE_FROM_ALL_COLLECTIONS,
        collectionID
    }
}

export function deleteCollectionFromAllCollections(collectionID) {
    return {
        type: DELETE_COLLECTION_FROM_ALL_COLLECTIONS,
        collectionID
    }
}

export function updateActiveCollection(collection) {
    return {
        type: UPDATE_ACTIVE_COLLECTION,
        collection
    }
}

export function updatePagesInActiveCollection(collection) {
    return {
        type: UPDATE_PAGES_IN_ACTIVE_COLLECTION,
        collection
    }
}

export function updateTeamsInActiveCollection(teams) {
    return {
        type: UPDATE_TEAMS_IN_ACTIVE_COLLECTION,
        teams
    }
}

export function emptyActiveCollection() {
    return {
        type: EMPTY_ACTIVE_COLLECTION,
        collection: null
    }
}

export function updateWorkingOn(id, name, url, collection) {
    return {
        type: UPDATE_WORKING_ON,
        workingOn: {id, name, url, collection}
    }
}

export function emptyWorkingOn() {
    return {
        type: EMPTY_WORKING_ON
    }
}

export function updateActiveUser(user) {
    return {
        type: UPDATE_ACTIVE_USER,
        user
    }
}

export function addAllUsers(users) {
    return {
        type: ADD_ALL_USERS,
        users
    }
}

export function removeUserFromAllUsers(userID) {
    return {
        type: REMOVE_USER_FROM_ALL_USERS,
        userID
    }
}

export function updateAllDatasets(allDatasets) {
    return {
        type: UPDATE_ALL_DATASETS,
        allDatasets
    }
}

export function updateActiveDataset(dataset) {
    return {
        type: UPDATE_ACTIVE_DATASET,
        dataset
    }
}

export function emptyActiveDataset() {
    return {
        type: EMPTY_ACTIVE_DATASET
    }
}

export function updateActiveDatasetCollectionID(collectionID) {
    return {
        type: UPDATE_ACTIVE_DATASET_COLLECTION_ID,
        collectionID
    }
}

export function updateActiveDatasetReviewState(lastEditedBy, reviewState) {
    return {
        type: UPDATE_ACTIVE_DATASET_REVIEW_STATE,
        lastEditedBy,
        reviewState
    }
}

export function updateAllRecipes(allRecipes) {
    return {
        type: UPDATE_ALL_RECIPES,
        allRecipes
    }
}

export function updateAllJobs(allJobs) {
    return {
        type: UPDATE_ALL_JOBS,
        allJobs
    }
}

export function updateActiveJob(job) {
    return {
        type: UPDATE_ACTIVE_JOB,
        job
    }
}

export function addNewJob(job) {
    return {
        type: ADD_NEW_JOB,
        job
    }
}

export function updateActiveInstance(instance) {
    return {
        type: UPDATE_ACTIVE_INSTANCE,
        instance
    }
}

export function emptyActiveInstance() {
    return {
        type: EMPTY_ACTIVE_INSTANCE
    }
}


export function updateActiveVersion(version) {
    return {
        type: UPDATE_ACTIVE_VERSION,
        version
    }
}

export function updateActiveVersionReviewState(lastEditedBy, reviewState) {
    return {
        type: UPDATE_ACTIVE_VERSION_REVIEW_STATE,
        lastEditedBy,
        reviewState
    }
}

export function emptyActiveVersion() {
    return {
        type: EMPTY_ACTIVE_VERSION
    }
}

export function updateAllTeams(allTeams) {
    return {
        type: UPDATE_ALL_TEAMS,
        allTeams: allTeams
    }
}

export function updateAllTeamIDsAndNames(allTeamIDsAndNames) {
    return {
        type: UPDATE_ALL_TEAM_IDS_AND_NAMES,
        allTeamIDsAndNames
    }
}

export function updateActiveTeam(activeTeam) {
    return {
        type: UPDATE_ACTIVE_TEAM,
        activeTeam: activeTeam
    }
}

export function updateActiveTeamMembers(members) {
    return {
        type: UPDATE_ACTIVE_TEAM_MEMBERS,
        members: members
    }
}

export function emptyActiveTeam() {
    return {
        type: UPDATE_ACTIVE_TEAM,
        activeTeam: {}
    }
}

export function addNotification(notification) {
    return {
        type: ADD_NOTIFICATION,
        notification
    }
}


export function removeNotification(notificationID) {
    return {
        type: REMOVE_NOTIFICATION,
        notificationID
    }
}

export function toggleNotificationVisibility(notificationID) {
    return {
        type: TOGGLE_NOTIFICATION_VISIBILITY,
        notificationID
    }
}

export function addPreviewCollection(previewCollection) {
    return {
        type: ADD_PREVIEW_COLLECTION,
        preview: previewCollection
    }
}

export function removePreviewCollection() {
    return {
        type: REMOVE_PREVIEW_COLLECTION,
        preview: {}
    }
}

export function updateSelectedPreviewPage(selectedPage) {
    return {
        type: UPDATE_PREVIEW_SELECTED_PAGE,
        selectedPage
    }
}

export function removeSelectedPreviewPage() {
    return {
        type: REMOVE_PREVIEW_SELECTED_PAGE,
        selectedPage: {}
    }
}
