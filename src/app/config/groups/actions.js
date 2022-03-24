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

export function loadGroupMembersFailure() {
    return {
        type: types.LOAD_GROUP_MEMBERS_FAILURE,
    };
}

export function loadGroupMembersProgress() {
    return {
        type: types.LOAD_GROUP_MEMBERS_PROGRESS,
    };
}

export function loadGroupMembersSuccess(members) {
    return {
        type: types.LOAD_GROUP_MEMBERS_SUCCESS,
        members,
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

export function updateGroupMembersSuccess(members) {
    return {
        type: types.UPDATE_GROUP_MEMBERS_SUCCESS,
        members,
    };
}
