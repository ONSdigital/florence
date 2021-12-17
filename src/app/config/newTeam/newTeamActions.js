import * as types from "../constants";

export function getUsersRequestSuccess(results) {
    return {
        type: types.GET_USERS_REQUEST_SUCCESS,
        users: results.users,
    };
}

export function teamCreatedSuccess(groupName) {
    return {
        type: types.TEAM_CREATED_SUCCESS,
        groupName,
    };
}

export function newTeamUnsavedChanges(unsavedChanges) {
    return {
        type: types.NEW_TEAM_UNSAVED_CHANGES,
        unsavedChanges,
    };
}

export function removeUserFromNewTeam(user) {
    return {
        type: types.NEW_TEAM_REMOVE_USER_FROM,
        user,
    };
}

export function addUserToNewTeam(user) {
    return {
        type: types.NEW_TEAM_ADD_USER,
        user,
    };
}

export function resetNewTeam(user) {
    return {
        type: types.NEW_TEAM_RESET,
        user,
    };
}

export function emptyTeamCreatedSuccess() {
    return {
        type: types.NEW_TEAM_EMPTY_TEAM_CREATED_SUCCESS,
    };
}

