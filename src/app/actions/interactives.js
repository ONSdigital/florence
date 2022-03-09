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
    return {
        type: types.INTERACTIVE_ERROR,
        data
    }
}

// get interactives
export function getInteractives()
{
    return dispatch => {
        interactives.getAll()
            .then((res) => {
                dispatch(setInteractives(res))
            })
            .catch((error) => {
                dispatch(setInteractiveError({
                    id: '',
                    errors: error.response.data.error
                }))
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
                dispatch(setInteractiveError({
                    id: '',
                    errors: error.response.data.error
                }))
            })
    }
}

// create interactive
export function createInteractive(data)
{
    console.log('data', data)
    return dispatch => {
        interactives.store({
            file: data.file,
            metadata1: data.metadata1,
            metadata2: data.metadata2,
            metadata3: data.metadata3,
        })
            .then((res) => {
                dispatch(storeInteractive({
                    id: res.data.id,
                    file: res.data.file,
                    metadata1: res.data.metadata1,
                    metadata2: res.data.metadata2,
                    metadata3: res.data.metadata3,
                    errors: ''
                }))
            .catch((error) => {
                dispatch(setInteractiveError({
                    id: '',
                    errors: error.response.data.error
                }))
            })
        })
    }
}

// edit interactive
export function editInteractive(interactiveId, data)
{
    return dispatch => {
        interactives.update(interactiveId, {
            file: data.file,
            metadata1: data.metadata1,
            metadata2: data.metadata2,
            metadata3: data.metadata3,
        })
            .then((res) => {
                dispatch(updateInteractive({
                    id: res.data.id,
                    file: res.data.file,
                    metadata1: res.data.metadata1,
                    metadata2: res.data.metadata2,
                    metadata3: res.data.metadata3,
                    errors: ''
                }))
            .catch((error) => {
                dispatch(setInteractiveError({
                    id: '',
                    errors: error.response.data.error
                }))
            })
        })
    }
}