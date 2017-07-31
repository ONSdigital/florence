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
        case ('UPDATE_ALL_DATASETS'): {
            return Object.assign({}, state, {
                datasets: Object.assign({}, state.datasets, {
                    all: action.allDatasets
                })
            })
        }
        case ('UPDATE_ACTIVE_DATASET'): {
            return Object.assign({}, state, {
                datasets: Object.assign({}, state.datasets, {
                    active: action.dataset
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
        case ('TOGGLE_NOTIFICATION_VISIBILITY'): {
            return Object.assign({}, state, {
                notifications: state.notifications.map(notification => {
                    if (notification.id !== action.notificationID) {
                        return notification;
                    }
                    notification.isVisible = !notification.isVisible;
                    return notification;
                })
            })
        }
        default: {
            break;
        }
    }
    return state;
}
