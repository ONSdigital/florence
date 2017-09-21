import { push } from 'react-router-redux';
import log, {eventTypes} from '../utilities/log'

export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';

export const UPDATE_ALL_TEAMS = 'UPDATE_ALL_TEAMS';
export const UPDATE_USERS = 'UPDATE_USERS';
export const UPDATE_ACTIVE_TEAM = 'UPDATE_ACTIVE_TEAM';
export const UPDATE_ACTIVE_TEAM_MEMBERS = 'UPDATE_ACTIVE_TEAM_MEMBERS';

export const UPDATE_ALL_DATASETS = 'UPDATE_ALL_DATASETS';
export const UPDATE_ALL_RECIPES = 'UPDATE_ALL_RECIPES';
export const UPDATE_ALL_JOBS = 'UPDATE_ALL_JOBS';
export const ADD_NEW_JOB = 'ADD_NEW_JOB';
export const UPDATE_ACTIVE_INSTANCE = 'UPDATE_ACTIVE_INSTANCE';

export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';
export const TOGGLE_NOTIFICATION_VISIBILITY = 'TOGGLE_NOTIFICATION_VISIBILITY';

// Wraps the react-router-redux 'push' function to handle relative paths, because the library doesn't by itself
export function relativePush(path) {
    if (typeof path !== "string") {
        console.error("Unable to parse relative URL path because non-string type given");
        log.add(eventTypes.unexpectedRuntimeError, {message: "Unable to parse relative URL path because non-string type given"});
        return;
    }

    try {
        return push(new URL(path, location.href).pathname);
    } catch (error) {
        console.error("Error trying to parse relative URL:\n", error);
        log.add(eventTypes.unexpectedRuntimeError, {message: error.message});
        return "";
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