import * as types from './../actions/actionTypes'
import {isInArray} from "../utilities/utils";

const initialState = {
    interactives: [],
    interactive: {},
    filteredInteractives: [],
    errors: ''
}

export default function reducer(state = initialState, action = {})
{
    switch (action.type)
    {
        case types.FETCH_INTERACTIVES:
            return {
                interactives: action.interactives,
                filteredInteractives: action.interactives
            };
        case types.GET_INTERACTIVE:
        case types.STORE_INTERACTIVE:
        case types.UPDATE_INTERACTIVE:
            return action.interactive;
        case types.INTERACTIVE_ERROR:
            return action.errors;
        case types.FILTER_INTERACTIVES:
            let filteredInteractives = state.interactives
            if(action.filters.topics.length > 0){
                filteredInteractives = state.interactives.filter(interactive => isInArray(action.filters.topics, interactive.primary_topic))
            }
            if(action.filters.query.length > 2){
                filteredInteractives = state.interactives.filter(interactive => isInArray(action.filters.query, interactive.primary_topic))
            }
            return {
                interactives: state.interactives,
                filteredInteractives
            };
        default:
            return state;
    }
}