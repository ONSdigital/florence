import { GET_USERS_REQUEST_SUCCESS, NEW_TEAM_ADD_USER, NEW_TEAM_REMOVE_USER_FROM, NEW_TEAM_RESET, NEW_TEAM_UNSAVED_CHANGES } from "../constants";

export const initialState = {
    usersInTeam: [],
    usersNotInTeam: [],
    allUsers: [],
    unsavedChanges: false,
};

const newTeamReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_USERS_REQUEST_SUCCESS: {
            return {
                ...state,
                allUsers: [...action.users],
                usersNotInTeam: [...action.users],
            };
        }
        case NEW_TEAM_UNSAVED_CHANGES: {
            return {
                ...state,
                unsavedChanges: action.unsavedChanges,
            };
        }
        case NEW_TEAM_REMOVE_USER_FROM: {
            return {
                ...state,
                usersInTeam: state.usersInTeam.filter(filteredUser => filteredUser.email !== action.user.email),
                usersNotInTeam: [...state.usersNotInTeam, action.user],
            };
        }
        case NEW_TEAM_ADD_USER: {
            return {
                ...state,
                usersNotInTeam: state.usersNotInTeam.filter(filteredUser => filteredUser.email !== action.user.email),
                usersInTeam: [...state.usersInTeam, action.user],
            };
        }
        case NEW_TEAM_RESET: {
            return {
                ...initialState,
            };
        }
        default: {
            break;
        }
    }
    return state;
};

export default newTeamReducer;
