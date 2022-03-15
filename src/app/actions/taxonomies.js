import * as types from "./actionTypes";
import taxonomy from "../utilities/api-clients/taxonomy";

export function setTaxonomies(taxonomies) {
    return {
        type: types.FETCH_TAXONOMIES,
        taxonomies,
    };
}

export function setTaxonomyError(error) {
    return {
        type: types.TAXONOMY_ERROR,
        error,
    };
}

export function getTaxonomies() {
    return dispatch => {
        taxonomy
            .getAllProductPages()
            .then(res => {
                dispatch(setTaxonomies(res));
            })
            .catch(error => {
                dispatch(setTaxonomyError(error));
            });
    };
}
