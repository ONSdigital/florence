import * as types from "./constants";

export function loadPolicyProgress() {
    return {
        type: types.LOAD_POLICY_PROGRESS,
    };
}

export function loadPolicyFailure() {
    return {
        type: types.LOAD_POLICY_FAILURE,
    };
}

export function loadPolicySuccess(policy) {
    return {
        type: types.LOAD_POLICY_SUCCESS,
        policy,
    };
}

export function updatePolicyProgress() {
    return {
        type: types.UPDATE_POLICY_PROGRESS,
    };
}

export function updatePolicyFailure() {
    return {
        type: types.UPDATE_POLICY_FAILURE,
    };
}

export function updatePolicySuccess(data) {
    return {
        type: types.UPDATE_POLICY_SUCCESS,
        data,
    };
}
