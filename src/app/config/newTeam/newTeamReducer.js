import { GET_USERS_REQUEST_SUCCESS, NEW_TEAM_UNSAVED_CHANGES } from "../constants";

export const initialState = {
    allPreviewUsers: [],
    unsavedChanges: false,
};

const newTeamReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_USERS_REQUEST_SUCCESS: {
            return {
                ...state,
                allPreviewUsers: [...action.users],
            };
        }
        case NEW_TEAM_UNSAVED_CHANGES: {
            return {
                ...state,
                unsavedChanges: action.unsavedChanges,
            };
        }
        default: {
            break;
        }
    }
    return state;
};

export default newTeamReducer;
