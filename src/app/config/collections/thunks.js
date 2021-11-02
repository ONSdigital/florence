import { loadCollectionsProgress, loadCollectionsSuccess, loadCollectionsFailure } from "./actions";

export const loadCollectionsRequest = () => async (dispatch, getState) => {
    try {
        dispatch(loadCollectionsProgress);

        const response = await fetch("/zebedee/collections");
        const collections = await response.json();

        dispatch(loadCollectionsSuccess(collections));
    } catch (error) {
        dispatch(loadCollectionsFailure());
        dispatch(displayAlert(error));
    }
};


export const displayAlert = text => {
    console.log(text);
};
