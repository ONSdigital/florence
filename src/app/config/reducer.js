import { initialState } from "./initialState";

import {
    SET_CONFIG,
    UPDATE_ACTIVE_COLLECTION,
    EMPTY_ACTIVE_COLLECTION,
    UPDATE_ALL_TEAM_IDS_AND_NAMES,
    ADD_ALL_COLLECTIONS,
    MARK_COLLECTION_FOR_DELETE_FROM_ALL_COLLECTIONS,
    DELETE_COLLECTION_FROM_ALL_COLLECTIONS,
    UPDATE_PAGES_IN_ACTIVE_COLLECTION,
    ADD_PREVIEW_COLLECTION,
    REMOVE_PREVIEW_COLLECTION,
    UPDATE_PREVIEW_SELECTED_PAGE,
    REMOVE_PREVIEW_SELECTED_PAGE,
    UPDATE_WORKING_ON,
    EMPTY_WORKING_ON,
    UPDATE_TEAMS_IN_ACTIVE_COLLECTION,
    UPDATE_ACTIVE_USER,
    REMOVE_USER_FROM_ALL_USERS,
    ADD_ALL_USERS,
    UPDATE_ACTIVE_DATASET_REVIEW_STATE,
    UPDATE_ACTIVE_VERSION_REVIEW_STATE,
    UPDATE_ACTIVE_JOB,
    UPDATE_ACTIVE_DATASET,
    UPDATE_ACTIVE_INSTANCE,
    UPDATE_ACTIVE_VERSION,
    EMPTY_ACTIVE_DATASET,
    EMPTY_ACTIVE_VERSION,
    EMPTY_ACTIVE_INSTANCE,
    UPDATE_ACTIVE_DATASET_COLLECTION_ID,
    RESET
} from "./actions";

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case RESET: {
            return {
                ...initialState,
                notifications: state.notifications,
                config: state.config
            };
        }
        case SET_CONFIG: {
            return {
                ...state,
                config: {
                    enableDatasetImport: action.config.enableDatasetImport,
                    enableHomepagePublishing: action.config.enableHomepagePublishing,
                    enableNewSignIn: action.config.enableNewSignIn
                }
            };
        }
        case "USER_LOGGED_IN": {
            return Object.assign({}, state, {
                user: Object.assign({}, state.user, {
                    isAuthenticated: true,
                    email: action.email,
                    userType: action.userType,
                    isAdmin: action.isAdmin
                })
            });
        }
        case "USER_LOGGED_OUT": {
            return Object.assign({}, state, {
                user: Object.assign({}, state.user, {
                    isAuthenticated: false
                })
            });
        }
        case ADD_ALL_COLLECTIONS: {
            return {
                ...state,
                collections: {
                    ...state.collections,
                    all: action.collections
                }
            };
        }
        case MARK_COLLECTION_FOR_DELETE_FROM_ALL_COLLECTIONS: {
            let toDelete = { ...state.collections.toDelete };
            toDelete[action.collectionID] = null;
            return {
                ...state,
                collections: {
                    ...state.collections,
                    toDelete
                }
            };
        }
        case DELETE_COLLECTION_FROM_ALL_COLLECTIONS: {
            const toDelete = { ...state.collections.toDelete };
            delete toDelete[action.collectionID];

            const all = state.collections.all.filter(collection => collection.id !== action.collectionID);

            return {
                ...state,
                collections: {
                    ...state.collections,
                    all,
                    toDelete
                }
            };
        }
        case UPDATE_ACTIVE_COLLECTION: {
            return {
                ...state,
                collections: {
                    ...state.collections,
                    active: {
                        id: action.collection.id,
                        name: action.collection.name,
                        publishDate: action.collection.publishDate,
                        status: { ...action.collection.status },
                        type: action.collection.type,
                        isForcedManualType: action.collection.isForcedManualType,
                        canBeApproved: action.collection.canBeApproved,
                        canBeDeleted: action.collection.canBeDeleted
                    }
                }
            };
        }
        case UPDATE_PAGES_IN_ACTIVE_COLLECTION: {
            return {
                ...state,
                collections: {
                    ...state.collections,
                    active: {
                        ...state.collections.active,
                        inProgress: action.collection.inProgress,
                        complete: action.collection.complete,
                        reviewed: action.collection.reviewed,
                        deletes: action.collection.deletes,
                        canBeApproved: action.collection.canBeApproved,
                        canBeDeleted: action.collection.canBeDeleted
                    }
                }
            };
        }
        case UPDATE_TEAMS_IN_ACTIVE_COLLECTION: {
            return {
                ...state,
                collections: {
                    ...state.collections,
                    active: {
                        ...state.collections.active,
                        teams: action.teams
                    }
                }
            };
        }
        case EMPTY_ACTIVE_COLLECTION: {
            return {
                ...state,
                collections: {
                    ...state.collections,
                    active: null
                }
            };
        }
        case UPDATE_WORKING_ON: {
            return {
                ...state,
                global: {
                    ...state.global,
                    workingOn: { ...action.workingOn }
                }
            };
        }
        case EMPTY_WORKING_ON: {
            return {
                ...state,
                global: {
                    ...state.global,
                    workingOn: null
                }
            };
        }
        case UPDATE_ACTIVE_USER: {
            return {
                ...state,
                users: {
                    ...state.users,
                    active: {
                        email: action.user.email,
                        hasTemporaryPassword: action.user.hasTemporaryPassword,
                        name: action.user.name,
                        role: action.user.role
                    }
                }
            };
        }
        case ADD_ALL_USERS: {
            return {
                ...state,
                users: {
                    ...state.users,
                    all: [...action.users]
                }
            };
        }
        case REMOVE_USER_FROM_ALL_USERS: {
            return {
                ...state,
                users: {
                    ...state.users,
                    all: state.users.all.filter(user => user.email !== action.userID)
                }
            };
        }
        case "UPDATE_ALL_TEAMS": {
            return Object.assign({}, state, {
                teams: Object.assign({}, state.teams, {
                    all: action.allTeams
                })
            });
        }
        case UPDATE_ALL_TEAM_IDS_AND_NAMES: {
            return {
                ...state,
                teams: {
                    ...state.teams,
                    allIDsAndNames: action.allTeamIDsAndNames
                }
            };
        }
        case "UPDATE_ACTIVE_TEAM": {
            return Object.assign({}, state, {
                teams: Object.assign({}, state.teams, {
                    active: action.activeTeam
                })
            });
        }
        case "UPDATE_ACTIVE_TEAM_MEMBERS": {
            return Object.assign({}, state, {
                teams: Object.assign({}, state.teams, {
                    active: Object.assign({}, state.teams.active, {
                        members: action.members
                    })
                })
            });
        }
        case UPDATE_ACTIVE_INSTANCE: {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    activeInstance: action.instance
                }
            });
        }
        case EMPTY_ACTIVE_INSTANCE: {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    activeInstance: null
                }
            });
        }
        case UPDATE_ACTIVE_VERSION: {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    activeVersion: {
                        ...state.datasets.activeVersion,
                        ...action.version
                    }
                }
            });
        }
        case UPDATE_ACTIVE_VERSION_REVIEW_STATE: {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    activeVersion: {
                        ...state.datasets.activeVersion,
                        lastEditedBy: action.lastEditedBy,
                        reviewState: action.reviewState
                    }
                }
            });
        }
        case EMPTY_ACTIVE_VERSION: {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    activeVersion: null
                }
            });
        }
        case UPDATE_ACTIVE_JOB: {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    activeJob: action.job
                }
            });
        }
        case EMPTY_ACTIVE_DATASET: {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    activeDataset: null
                }
            });
        }
        case UPDATE_ACTIVE_DATASET: {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    activeDataset: {
                        ...state.datasets.activeDataset,
                        ...action.dataset
                    }
                }
            });
        }
        case UPDATE_ACTIVE_DATASET_REVIEW_STATE: {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    activeDataset: {
                        ...state.datasets.activeDataset,
                        lastEditedBy: action.lastEditedBy,
                        reviewState: action.reviewState
                    }
                }
            });
        }
        case UPDATE_ACTIVE_DATASET_COLLECTION_ID: {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    activeDataset: {
                        ...state.datasets.activeDataset,
                        collection_id: action.collectionID
                    }
                }
            });
        }
        case "UPDATE_ALL_DATASETS": {
            return Object.assign({}, state, {
                datasets: Object.assign({}, state.datasets, {
                    all: action.allDatasets
                })
            });
        }
        case "UPDATE_ALL_RECIPES": {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    recipes: action.allRecipes
                }
            });
        }
        case "UPDATE_ALL_JOBS": {
            return Object.assign({}, state, {
                datasets: Object.assign({}, state.datasets, {
                    jobs: action.allJobs
                })
            });
        }
        case "ADD_NEW_JOB": {
            return Object.assign({}, state, {
                datasets: Object.assign({}, state.datasets, {
                    jobs: [...state.datasets.jobs, action.job]
                })
            });
        }
        case "ADD_NOTIFICATION": {
            return Object.assign({}, state, {
                notifications: [...state.notifications, action.notification]
            });
        }
        case "REMOVE_NOTIFICATION": {
            return Object.assign({}, state, {
                notifications: state.notifications.filter(notification => {
                    return notification.id !== action.notificationID;
                })
            });
        }
        case "TOGGLE_NOTIFICATION_VISIBILITY": {
            return Object.assign({}, state, {
                notifications: state.notifications.map(notification => {
                    if (notification.id !== action.notificationID) {
                        return notification;
                    }
                    notification.isVisible = !notification.isVisible;
                    return notification;
                })
            });
        }
        case ADD_PREVIEW_COLLECTION: {
            return {
                ...state,
                preview: {
                    ...state.preview,
                    ...action.preview
                }
            };
        }
        case REMOVE_PREVIEW_COLLECTION: {
            return {
                ...state,
                preview: {
                    selectedPage: null
                }
            };
        }
        case UPDATE_PREVIEW_SELECTED_PAGE: {
            return {
                ...state,
                preview: {
                    ...state.preview,
                    selectedPage: action.selectedPage
                }
            };
        }
        case REMOVE_PREVIEW_SELECTED_PAGE: {
            return {
                ...state,
                preview: {
                    ...state.preview,
                    selectedPage: null
                }
            };
        }
        default: {
            break;
        }
    }
    return state;
}
