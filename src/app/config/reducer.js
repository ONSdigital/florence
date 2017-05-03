import { initialState } from './initialState';

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case ('USER_LOGGED_IN'): {
            return Object.assign({}, state, {
                user: Object.assign({}, state.user, {
                    isAuthenticated: true,
                    email: action.email,
                    userType: action.userType,
                    isAdmin: action.isAdmin
                })
            })
        }
        case ('USER_LOGGED_OUT'): {
            return Object.assign({}, state, {
                user: Object.assign({}, state.user, {
                    isAuthenticated: false
                })
            })
        }
        case ('UPDATE_ALL_TEAMS'): {
            return Object.assign({}, state, {
                teams: Object.assign({}, state.teams, {
                    all: action.allTeams
                })
            })
        }
        case ('UPDATE_ACTIVE_TEAM'): {
            return Object.assign({}, state, {
                teams: Object.assign({}, state.teams, {
                    active: action.activeTeam
                })
            })
        }
        default: {
            break;
        }
    }
    return state;
}
