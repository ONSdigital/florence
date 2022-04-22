import * as types from "./../actions/actionTypes";

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
        case types.INTERACTIVE_RESET_ERROR:
            return Object.assign({}, state, {
                errors: initialState.errors,
            });
        case types.SORT_INTERACTIVES: {
            const { sort } = action;
            let filteredInteractives = state.interactives;
            if (sort === "title") {
                filteredInteractives = filteredInteractives.sort((a, b) => a.metadata.label.localeCompare(b.metadata.label));
            }
            if (sort === "date") {
                filteredInteractives = filteredInteractives.sort((a, b) => b.last_updated.localeCompare(a.last_updated));
            }
            return Object.assign({}, state, {
                filteredInteractives,
            });
        }
        default:
            return state;
    }
}
