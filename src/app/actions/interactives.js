import * as types from './actionTypes'
import axios from 'axios'

const instance = axios.create({
    baseURL: '/interactives/v1/',
});

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

export function setInteractiveError(error)
{
    return {
        type: types.INTERACTIVE_ERROR,
        error
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
        instance.get(`/interactives`)
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
        instance.get(`/interactives/${interactiveId}`)
            .then((data) => {
                dispatch(setInteractive(data.data))
            })
            .catch((error) => {
                dispatch(setInteractiveError(error))
            })
    }
}

// create interactive
export function createInteractive(data)
{
    return async dispatch => {
        try {
            const res = await instance.post(`/interactives`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            dispatch(storeInteractive(res.data))
        } catch (error) {
            dispatch(setInteractiveError(error))
        }
    }
}

// edit interactive
export function editInteractive(interactiveId, data)
{
    return dispatch => {
        instance.put(`/interactives/${interactiveId}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
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
        instance.delete(`/interactives/${interactiveId}`)
            .then((res) => {
                dispatch(updateInteractive(res))
            .catch((error) => {
                dispatch(setInteractiveError(error))
            })
        })
    }
}