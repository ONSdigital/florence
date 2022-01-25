import * as types from "../constants";

export function getUsersRequestSuccess(results) {
    return {
        type: types.GET_USERS_REQUEST_SUCCESS,
        users: results.users,
    };
}

export function teamsUnsavedChanges(unsavedChanges) {
    return {
        type: types.NEW_TEAM_UNSAVED_CHANGES,
        unsavedChanges,
    };
}
