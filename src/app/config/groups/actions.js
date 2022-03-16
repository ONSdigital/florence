import * as types from "./constants";

export function loadGroupFailure() {
    return {
        type: types.LOAD_GROUP_FAILURE,
    };
}

export function loadGroupProgress() {
    return {
        type: types.LOAD_GROUP_PROGRESS,
    };
}

export function loadGroupSuccess(group) {
    return {
        type: types.LOAD_GROUP_SUCCESS,
        group,
    };
}

export function updateGroupFailure() {
    return {
        type: types.UPDATE_GROUP_FAILURE,
    };
}

export function updateGroupProgress() {
    return {
        type: types.UPDATE_GROUP_PROGRESS,
    };
}

export function updateGroupSuccess() {
    return {
        type: types.UPDATE_GROUP_SUCCESS,
    };
}

export function deleteGroupFailure() {
    return {
        type: types.DELETE_GROUP_FAILURE,
    };
}

export function deleteGroupProgress() {
    return {
        type: types.DELETE_GROUP_PROGRESS,
    };
}

export function deleteGroupSuccess() {
    return {
        type: types.DELETE_GROUP_SUCCESS,
    };
}

export function loadGroupsFailure() {
    return {
        type: types.LOAD_GROUPS_FAILURE,
    };
}

export function loadGroupsProgress() {
    return {
        type: types.LOAD_GROUPS_PROGRESS,
    };
}

export function loadGroupsSuccess(groups) {
    return {
        type: types.LOAD_GROUPS_SUCCESS,
        groups,
    };
}
