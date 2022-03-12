import * as types from './../actions/actionTypes'

const initialState = {
    taxonomies: [],
    errors: {}
}

export default function reducer(state = initialState, action = {})
{
    switch (action.type)
    {
        case types.FETCH_TAXONOMIES:
            return Object.assign({}, state, {
                taxonomies: action.taxonomies,
            })
        case types.INTERACTIVE_ERROR:
            return Object.assign({}, state, {
                errors: {
                    msg: action.error.response
                },
            })
        default:
            return state;
    }
}