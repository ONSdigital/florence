import { initialState } from './initialState';

import {
    UPDATE_WORKING_ON,
    EMPTY_WORKING_ON,
    UPDATE_ACTIVE_INSTANCE,
    UPDATE_ACTIVE_VERSION,
    UPDATE_ACTIVE_JOB,
    UPDATE_ACTIVE_COLLECTION, 
    EMPTY_ACTIVE_COLLECTION, 
    UPDATE_ALL_TEAM_IDS_AND_NAMES
} from './actions'

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
        case (UPDATE_ACTIVE_COLLECTION): {
            return {
                ...state,
                collections: {
                    ...state.collections,
                    active: action.collection
                }
            }
        }
        case (EMPTY_ACTIVE_COLLECTION): {
            return {
                ...state,
                collections: {
                    ...state.collections,
                    active: null
                }
            }
        }
        case(UPDATE_WORKING_ON): {
            return {
                ...state,
                global: {
                    ...state.global,
                    workingOn: action.workingOn
                }
            }
        }
        case(EMPTY_WORKING_ON): {
            return {
            ...state,
            global: {
                ...state.global,
                workingOn: null
                }
            }
        }
        case ('UPDATE_ALL_TEAMS'): {
            return Object.assign({}, state, {
                teams: Object.assign({}, state.teams, {
                    all: action.allTeams
                })
            })
        }
        case (UPDATE_ALL_TEAM_IDS_AND_NAMES): {
            return {
                ...state,
                teams: {
                    ...state.teams,
                    allIDsAndNames: action.allTeamIDsAndNames
                }
            }
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
        case (UPDATE_ACTIVE_INSTANCE): {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    activeInstance: action.instance
                }
            });
        }
        case (UPDATE_ACTIVE_VERSION): {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    activeVersion: action.version
                }
            });
        }
        case (UPDATE_ACTIVE_JOB): {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    activeJob: action.job
                }
            });
        }
        case ('UPDATE_ACTIVE_DATASET'): {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    activeDataset: action.dataset
                }
            });
        }
        case ('UPDATE_ALL_DATASETS'): {
            return Object.assign({}, state, {
                datasets: Object.assign({}, state.datasets, {
                    all: action.allDatasets
                })
            })
        }
        case ('UPDATE_ALL_RECIPES'): {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    recipes: action.allRecipes
                }
            })
        }
        case ('UPDATE_ALL_JOBS'): {
            return Object.assign({}, state, {
                datasets: Object.assign({}, state.datasets, {
                    jobs: action.allJobs
                })
            })
        }
        case ('ADD_NEW_JOB'): {
            return Object.assign({}, state, {
                datasets: Object.assign({}, state.datasets, {
                    jobs: [
                        ...state.datasets.jobs,
                        action.job
                    ]
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
