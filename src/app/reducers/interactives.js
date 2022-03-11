import * as types from './../actions/actionTypes'
import {isInArray} from "../utilities/utils";
import interactives from "../utilities/api-clients/interactives";

const initialState = {
    interactives: [],
    interactive: {},
    filteredInteractives: [],
    errors: {}
}

export default function reducer(state = initialState, action = {})
{
    switch (action.type)
    {
        case types.FETCH_INTERACTIVES:
            state.interactives = action.interactives
            state.filteredInteractives = action.interactives
            return state;
        case types.GET_INTERACTIVE:
            state.interactives = action.interactives
            return state;
        case types.STORE_INTERACTIVE:
        case types.UPDATE_INTERACTIVE:
            return action.interactive;
        case types.INTERACTIVE_ERROR:
            return action.errors;
        case types.FILTER_INTERACTIVES:
            const { topics, query } = action.filters
            let filteredInteractives = state.interactives
            if(topics.length > 0){
                filteredInteractives = state.interactives.filter(interactive => isInArray(topics, interactive.metadata.primary_topic))
            }
            if(query.length > 2){
                filteredInteractives = state.interactives.filter(interactive => isInArray(interactive.title, query))
            }
            state.filteredInteractives = filteredInteractives
            return state;
        default:
            return state;
    }
}