import * as types from './actionTypes'
import interactives from "../utilities/api-clients/interactives";

export function setInteractives(interactives)
{
    return {
        type: types.FETCH_INTERACTIVES,
        interactives
    }
}

export function setInteractive(interactive)
{
    return {
        type: types.GET_INTERACTIVE,
        interactive
    }
}

export function storeInteractive(interactive)
{
    return {
        type: types.STORE_INTERACTIVE,
        interactive
    }
}

export function updateInteractive(interactive)
{
    return {
        type: types.UPDATE_INTERACTIVE,
        interactive
    }
}

export function setInteractiveError(data)
{
    console.log('error prron', data)
    return {
        type: types.INTERACTIVE_ERROR,
        data
    }
}

export function filterInteractives(filters)
{
    return {
        type: types.FILTER_INTERACTIVES,
        filters
    }
}

// get interactives
export function getInteractives()
{
    return dispatch => {
        interactives.getAll()
            .then((res) => {
                dispatch(setInteractives(res.data.items))
            })
            .catch((error) => {
                dispatch(setInteractiveError(error))
            })
    }
}

// get interactive
export function getInteractive(interactiveId)
{
    return dispatch => {
        interactives.show(interactiveId)
            .then((data) => {
                dispatch(setInteractive(data))
            })
            .catch((error) => {
                dispatch(setInteractiveError(error))
            })
    }
}

// create interactive
export function createInteractive(data)
{
    return dispatch => {
        interactives.store(data)
            .then((res) => {
                dispatch(storeInteractive(res))
            .catch((error) => {
                dispatch(setInteractiveError(error))
            })
        })
    }
}

// edit interactive
export function editInteractive(interactiveId, data)
{
    return dispatch => {
        interactives.update(interactiveId, data)
            .then((res) => {
                dispatch(updateInteractive(res))
            .catch((error) => {
                dispatch(setInteractiveError(error))
            })
        })
    }
}

// delete interactive
export function deleteInteractive(interactiveId)
{
    return dispatch => {
        interactives.destroy(interactiveId)
            .then((res) => {
                dispatch(updateInteractive(res))
            .catch((error) => {
                dispatch(setInteractiveError(error))
            })
        })
    }
}