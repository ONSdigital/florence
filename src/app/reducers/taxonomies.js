import * as types from "./../actions/actionTypes";

const initialState = {
    taxonomies: [],
    errors: {},
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case types.FETCH_TAXONOMIES:
            return Object.assign({}, state, {
                taxonomies: action.taxonomies,
            });
        default:
            return state;
    }
}
