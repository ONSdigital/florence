import * as types from "./../actions/actionTypes";
import { isInArray } from "../utilities/utils";
// import moment from "moment";

const initialState = {
    interactives: [],
    interactive: {},
    filteredInteractives: [],
    errors: {},
    successMessage: {
        type: null,
        success: false,
    },
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case types.FETCH_INTERACTIVES:
            return Object.assign({}, state, {
                interactives: action.interactives,
                filteredInteractives: action.interactives,
            });
        case types.GET_INTERACTIVE:
        case types.STORE_INTERACTIVE:
        case types.UPDATE_INTERACTIVE:
            return Object.assign({}, state, {
                interactive: action.interactive,
            });
        case types.INTERACTIVE_ERROR:
            return Object.assign({}, state, {
                errors: {
                    msg: action.error.response,
                },
            });
        case types.INTERACTIVE_SUCCESS:
            return Object.assign({}, state, {
                successMessage: action.successMessage,
            });
        case types.INTERACTIVE_RESET_SUCCESS:
            return Object.assign({}, state, {
                successMessage: initialState.successMessage,
            });
        case types.FILTER_INTERACTIVES:
            const { topics, query, sortBy } = action.filters;
            let filteredInteractives = state.interactives;
            if (topics.length > 0) {
                filteredInteractives = state.interactives.filter(interactive => isInArray(topics, interactive.metadata.primary_topic));
            }
            if (query.length > 1) {
                filteredInteractives = state.interactives.filter(interactive => isInArray(interactive.metadata.title, query));
            }
            // if(sortBy === 'desc'){
            //     filteredInteractives = state.interactives.sort((a, b) => new Date(a.metadata.release_at) - new Date(b.metadata.release_at));
            // } else {
            //     filteredInteractives = state.interactives.sort((a, b) => new Date(b.metadata.release_at) - new Date(a.metadata.release_at));
            // }
            return Object.assign({}, state, {
                filteredInteractives,
            });
        default:
            return state;
    }
}
