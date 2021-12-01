export const GET_USERS_REQUEST_SUCCESS = "GET_USERS_REQUEST_SUCCESS";
export const TEAM_CREATED_SUCCESS = "TEAM_CREATED_SUCCESS";
export const NEW_TEAM_UNSAVED_CHANGES = "NEW_TEAM_UNSAVED_CHANGES";
export const NEW_TEAM_REMOVE_USER_FROM = "NEW_TEAM_REMOVE_USER_FROM";
export const NEW_TEAM_ADD_USER = "NEW_TEAM_ADD_USER";
export const NEW_TEAM_RESET = "NEW_TEAM_RESET";

export function getUsersRequestSuccess(results) {
    return {
        type: GET_USERS_REQUEST_SUCCESS,
        users: results.users,
    };
}

export function teamCreatedSuccess(groupName) {
    return {
        type: TEAM_CREATED_SUCCESS,
        groupName,
    };
}

export function newTeamUnsavedChanges(unsavedChanges) {
    return {
        type: NEW_TEAM_UNSAVED_CHANGES,
        unsavedChanges,
    };
}

export function removeUserFromNewTeam(user) {
    return {
        type: NEW_TEAM_REMOVE_USER_FROM,
        user,
    };
}

export function addUserToNewTeam(user) {
    return {
        type: NEW_TEAM_ADD_USER,
        user,
    };
}

export function resetNewTeam(user) {
    return {
        type: NEW_TEAM_RESET,
        user,
    };
}