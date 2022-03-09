import * as types from './../actions/actionTypes'

const initialState = {
    interactives: {},
    interactive: {},
    errors: ''
}

export default function reducer(state = initialState, action = {})
{
    switch (action.type)
    {
        case types.FETCH_INTERACTIVES:
            return action.interactives;
        case types.GET_INTERACTIVE:
        case types.STORE_INTERACTIVE:
        case types.UPDATE_INTERACTIVE:
            return action.interactive;
        case types.INTERACTIVE_ERROR:
            return action.errors;
        default:
            return state;
    }
}