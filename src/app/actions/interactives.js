import * as types from "./actionTypes";
import Interactives from "../utilities/api-clients/interactives";

export function setInteractives(interactives) {
    return {
        type: types.FETCH_INTERACTIVES,
        interactives,
    };
}

export function setInteractive(interactive) {
    return {
        type: types.GET_INTERACTIVE,
        interactive,
    };
}

export function storeInteractive(interactive) {
    return {
        type: types.STORE_INTERACTIVE,
        interactive,
    };
}

export function updateInteractive(interactive) {
    return {
        type: types.UPDATE_INTERACTIVE,
        interactive,
    };
}

export function setSuccessMessage(successMessage) {
    return {
        type: types.INTERACTIVE_SUCCESS,
        successMessage,
    };
}

export function resetSuccessMessage() {
    return {
        type: types.INTERACTIVE_RESET_SUCCESS,
    };
}

export function setInteractiveError(error) {
    return {
        type: types.INTERACTIVE_ERROR,
        error,
    };
}

export function resetInteractiveError() {
    return {
        type: types.INTERACTIVE_RESET_ERROR,
    };
}

export function filterInteractives(filters) {
    const query = new URLSearchParams(filters);
    return async dispatch => {
        try {
            const res = await Interactives.get(query);
            dispatch(setInteractives(res.data.items));
        } catch (error) {
            dispatch(setInteractiveError(error));
        }
    };
}

// get interactives
export function getInteractives() {
    return async dispatch => {
        try {
            const res = await Interactives.getAll();
            dispatch(setInteractives(res.data.items));
        } catch (error) {
            dispatch(setInteractiveError(error));
        }
    };
}

// get interactive
export function getInteractive(interactiveId) {
    return async dispatch => {
        try {
            const res = await Interactives.show(interactiveId);
            dispatch(setInteractive(res.data));
        } catch (error) {
            dispatch(setInteractiveError(error));
        }
    };
}

// create interactive
export function createInteractive(data) {
    return async dispatch => {
        try {
            const res = await Interactives.store(data);
            dispatch(storeInteractive(res.data));
            dispatch(
                setSuccessMessage({
                    type: "create",
                    success: true,
                })
            );
        } catch (error) {
            dispatch(setInteractiveError(error));
        }
    };
}

// edit interactive
export function editInteractive(interactiveId, data) {
    return async dispatch => {
        try {
            const res = await Interactives.update(interactiveId, data);
            dispatch(
                setSuccessMessage({
                    type: "update",
                    success: true,
                })
            );
        } catch (error) {
            dispatch(setInteractiveError(error));
        }
    };
}

// delete interactive
export function deleteInteractive(interactiveId) {
    return async dispatch => {
        try {
            const res = await Interactives.destroy(interactiveId);
            dispatch(
                setSuccessMessage({
                    type: "delete",
                    success: true,
                })
            );
        } catch (error) {
            dispatch(setInteractiveError(error));
        }
    };
}
