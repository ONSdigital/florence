import * as types from "./../actions/actionTypes";
import { getParameterByName } from "../utilities/utils";

const initialState = {
    interactives: [],
    interactive: {},
    filteredInteractives: [],
    errors: {
        validations: {},
        apiErrors: {},
    },
    successMessage: {
        type: null,
        success: false,
    },
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case types.FETCH_INTERACTIVES:
            const collectionId = getParameterByName("collection");
            const { interactives } = action;
            let filteredInteractives = interactives;
            if (collectionId) {
                filteredInteractives = interactives.filter(function (interactive) {
                    if (interactive.metadata.collection_id === collectionId) {
                        return true;
                    }
                    switch (interactive.state) {
                        case "ArchiveUploaded":
                        case "ArchiveDispatchedToImporter":
                        case "ImportSuccess":
                            return true;
                        default:
                            return false;
                    }
                });
            }
            return Object.assign({}, state, {
                interactives,
                filteredInteractives,
            });
        case types.GET_INTERACTIVE:
        case types.STORE_INTERACTIVE:
        case types.UPDATE_INTERACTIVE:
            return Object.assign({}, state, {
                interactive: action.interactive,
            });
        case types.INTERACTIVE_ERROR:
            const { errors: errorsResponse } = action.error.response.data;
            const { status } = action.error.response;
            let errors = {
                apiErrors: {},
                validations: {},
            };

            switch (status) {
                case 502: {
                    errors.apiErrors.message = "Error connecting with interactives API";
                    break;
                }
            }

            if (errorsResponse) {
                if (errorsResponse.indexOf("file: expecting one attachment with metadata") >= 0) {
                    errors.validations.file = "Select a file that is a ZIP file";
                }
                if (errorsResponse.indexOf("interactive.metadata.internalid: required") >= 0) {
                    errors.validations.internalId = "Enter a correct internal ID";
                }
                if (errorsResponse.indexOf("interactive.metadata.internalid: alphanum") >= 0) {
                    errors.validations.internalId = "Enter a correct internal ID, using only letters and numbers";
                }
                if (errorsResponse.indexOf("interactive.metadata.title: required") >= 0) {
                    errors.validations.title = "Enter a correct title";
                }
                if (errorsResponse[0].indexOf("archive with title") >= 0) {
                    errors.validations.title = "Archive with this title already exists";
                }
                if (errorsResponse.indexOf("interactive.metadata.label: required") >= 0) {
                    errors.validations.label = "Enter a correct label, using only letters and numbers";
                }
                if (errorsResponse.indexOf("interactive.metadata.label: alphanum") >= 0) {
                    errors.validations.label = "Enter a correct label, using only letters and numbers";
                }
                if (errorsResponse[0].indexOf("archive with label") >= 0) {
                    errors.validations.label = "Archive with this label already exists";
                }
                if (errorsResponse.length >= 0) {
                    errors.validations.errors = errorsResponse;
                }
            }
            return Object.assign({}, state, {
                errors,
            });
        case types.INTERACTIVE_SUCCESS:
            return Object.assign({}, state, {
                successMessage: action.successMessage,
            });
        case types.INTERACTIVE_RESET_SUCCESS:
            return Object.assign({}, state, {
                successMessage: initialState.successMessage,
            });
        case types.INTERACTIVE_RESET_ERROR:
            return Object.assign({}, state, {
                errors: initialState.errors,
            });
        case types.SORT_INTERACTIVES: {
            const { sort } = action;
            let filteredInteractives = state.filteredInteractives;
            if (sort === "title") {
                filteredInteractives = filteredInteractives.sort((a, b) => a.metadata.title.localeCompare(b.metadata.title));
            }
            if (sort === "date") {
                filteredInteractives = filteredInteractives.sort((a, b) => b.last_updated.localeCompare(a.last_updated));
            }
            return Object.assign({}, state, {
                filteredInteractives,
            });
        }
        default:
            return state;
    }
}
