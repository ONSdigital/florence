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
        case ('UPDATE_USERS'): {
            return Object.assign({}, state, {
                teams: Object.assign({}, state.teams, {
                    users: action.users
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
        case ('UPDATE_ACTIVE_TEAM_MEMBERS'): {
            return Object.assign({}, state, {
                teams: Object.assign({}, state.teams, {
                    active: Object.assign({}, state.teams.active, {
                        members: action.members
                    })
                })
            })
        }
        case ('ADD_NOTIFICATION'): {
            return Object.assign({}, state, {
                notifications: [...state.notifications, action.notification]
            })
        }
        case ('REMOVE_NOTIFICATION'): {
            return Object.assign({}, state, {
                notifications: state.notifications.filter(notification => {
                    return notification.id !== action.notificationID
                })
            })
        }
        default: {
            break;
        }
    }
    return state;
}
