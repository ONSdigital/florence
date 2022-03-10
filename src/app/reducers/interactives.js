import * as types from './../actions/actionTypes'
import {isInArray} from "../utilities/utils";

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
            return {
                interactives: action.interactives,
                filteredInteractives: action.interactives,
                errors: {}
            };
        case types.GET_INTERACTIVE:
            console.log('interactive', action.interactive)
            return {
                interactive: action.interactive,
                errors: {}
            }
        case types.STORE_INTERACTIVE:
        case types.UPDATE_INTERACTIVE:
            return action.interactive;
        case types.INTERACTIVE_ERROR:
            return action.errors;
        case types.FILTER_INTERACTIVES:
            const { topics, query } = action.filters
            let filteredInteractives = state.interactives
            if(topics.length > 0){
                filteredInteractives = state.interactives.filter(interactive => isInArray(topics, interactive.primary_topic))
            }
            if(query.length > 2){
                filteredInteractives = state.interactives.filter(interactive => isInArray(interactive.title, query))
            }
            return {
                interactives: state.interactives,
                filteredInteractives
            };
        default:
            return state;
    }
}