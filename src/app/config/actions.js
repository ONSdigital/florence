export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';

export const ADD_ALL_COLLECTIONS = 'ADD_ALL_COLLECTIONS';
export const MARK_COLLECTION_FOR_DELETE_FROM_ALL_COLLECTIONS = 'MARK_COLLECTION_FOR_DELETE_FROM_ALL_COLLECTIONS';
export const DELETE_COLLECTION_FROM_ALL_COLLECTIONS = 'DELETE_COLLECTION_FROM_ALL_COLLECTIONS';
export const UPDATE_ACTIVE_COLLECTION = 'UPDATE_ACTIVE_COLLECTION';
export const UPDATE_PAGES_IN_ACTIVE_COLLECTION = 'UPDATE_PAGES_IN_ACTIVE_COLLECTION';
export const UPDATE_TEAMS_IN_ACTIVE_COLLECTION = 'UPDATE_TEAMS_IN_ACTIVE_COLLECTION';
export const EMPTY_ACTIVE_COLLECTION = 'EMPTY_ACTIVE_COLLECTION';

export const UPDATE_ALL_TEAMS = 'UPDATE_ALL_TEAMS';
export const UPDATE_ALL_TEAM_IDS_AND_NAMES = 'UPDATE_ALL_TEAM_IDS_AND_NAMES';
export const UPDATE_USERS = 'UPDATE_USERS';
export const UPDATE_ACTIVE_TEAM = 'UPDATE_ACTIVE_TEAM';
export const UPDATE_ACTIVE_TEAM_MEMBERS = 'UPDATE_ACTIVE_TEAM_MEMBERS';

export const UPDATE_ALL_DATASETS = 'UPDATE_ALL_DATASETS';
export const UPDATE_ALL_JOBS = 'UPDATE_ALL_JOBS';
export const ADD_NEW_JOB = 'ADD_NEW_JOB';

export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';
export const TOGGLE_NOTIFICATION_VISIBILITY = 'TOGGLE_NOTIFICATION_VISIBILITY';

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

export function updateUsers(users) {
    return {
        type: UPDATE_USERS,
        users: users
    }
}

export function updateAllDatasets(allDatasets) {
    return {
        type: UPDATE_ALL_DATASETS,
        allDatasets
    }
}

export function updateAllJobs(allJobs) {
    return {
        type: UPDATE_ALL_JOBS,
        allJobs
    }
}

export function addNewJob(job) {
    return {
        type: ADD_NEW_JOB,
        job
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