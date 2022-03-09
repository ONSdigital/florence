import * as types from './../actions/actionTypes'

const initialState = {
    taxonomies: [],
    errors: ''
}

export default function reducer(state = initialState, action = {})
{
    switch (action.type)
    {
        case types.FETCH_TAXONOMIES:
            return action;
        case types.INTERACTIVE_ERROR:
            return action.errors;
        default:
            return state;
    }
}