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
