export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';

export const UPDATE_ALL_TEAMS = 'UPDATE_ALL_TEAMS';
export const UPDATE_USERS = 'UPDATE_USERS';
export const UPDATE_ACTIVE_TEAM = 'UPDATE_ACTIVE_TEAM';
export const UPDATE_ACTIVE_TEAM_MEMBERS = 'UPDATE_ACTIVE_TEAM_MEMBERS';

export const UPDATE_ALL_DATASETS = 'UPDATE_ALL_DATASETS';
export const UPDATE_ACTIVE_DATASET = 'UPDATE_ACTIVE_DATASET';

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

export function updateActiveDataset(dataset) {
    return {
        type: UPDATE_ACTIVE_DATASET,
        dataset
    }
}

export function updateAllTeams(allTeams) {
    return {
        type: UPDATE_ALL_TEAMS,
        allTeams: allTeams
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