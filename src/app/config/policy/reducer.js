import * as types from "./constants";

const initialState = {
    data: null,
    loading: false,
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case types.LOAD_POLICY_PROGRESS:
            return {
                ...state,
                loading: true,
            };
        case types.LOAD_POLICY_FAILURE:
            return {
                ...state,
                loading: false,
            };
        case types.LOAD_POLICY_SUCCESS:
            return {
                ...state,
                data: false,
            };
        case types.UPDATE_POLICY_PROGRESS:
            return {
                ...state,
                loading: true,
            };
        case types.UPDATE_POLICY_FAILURE:
            return {
                ...state,
                loading: false,
            };
        case types.UPDATE_POLICY_SUCCESS:
            return {
                ...state,
                data: false,
            };
        default:
            return state;
    }
}
