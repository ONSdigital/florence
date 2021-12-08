import { initialState } from "./initialState";
import * as types from "./constants";

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case types.CREATE_COLLECTION_SUCCESS: {
            return {
                ...state,
                collections: {
                    ...state.collections,
                    isCreating: false,
                    active: action.collection,
                    all: [...state.collections.all, action.collection],
                },
            };
        }
        case types.LOAD_COLLECTIONS_SUCCESS: {
            return {
                ...state,
                collections: {
                    ...state.collections,
                    isLoading: false,
                    all: action.collections,
                },
            };
        }
        case types.LOAD_COLLECTIONS_PROGRESS: {
            return {
                ...state,
                collections: {
                    ...state.collections,
                    isLoading: true,
                },
            };
        }
        case types.LOAD_COLLECTIONS_FAILURE: {
            return {
                ...state,
                collections: {
                    ...state.collections,
                    isLoading: false,
                },
            };
        }
        case types.CREATE_COLLECTION_PROGRESS: {
            return {
                ...state,
                collections: {
                    ...state.collections,
                    isCreating: true,
                },
            };
        }
        case types.CREATE_COLLECTION_FAILURE: {
            return {
                ...state,
                collections: {
                    ...state.collections,
                    isCreating: false,
                },
            };
        }
        case types.RESET: {
            return {
                ...initialState,
                notifications: state.notifications,
                popouts: state.popouts,
                config: state.config,
            };
        }
        case types.SET_CONFIG: {
            return {
                ...state,
                config: {
                    enableDatasetImport: action.config.enableDatasetImport,
                    enableHomepagePublishing: action.config.enableHomepagePublishing,
                    enableNewSignIn: action.config.enableNewSignIn,
                },
            };
        }
        case types.ADD_ALL_COLLECTIONS: {
            return {
                ...state,
                collections: {
                    ...state.collections,
                    all: action.collections,
                },
            };
        }

        case types.MARK_COLLECTION_FOR_DELETE_FROM_ALL_COLLECTIONS: {
            let toDelete = { ...state.collections.toDelete };
            toDelete[action.collectionID] = null;
            return {
                ...state,
                collections: {
                    ...state.collections,
                    toDelete,
                },
            };
        }
        case types.DELETE_COLLECTION_FROM_ALL_COLLECTIONS: {
            return {
                ...state,
                collections: {
                    ...state.collections,
                    all: state.collections.all.filter(collection => collection.id !== action.collectionID),
                    active: null,
                },
            };
        }
        case types.UPDATE_ACTIVE_COLLECTION: {
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
                        canBeDeleted: action.collection.canBeDeleted,
                    },
                },
            };
        }
        case types.UPDATE_PAGES_IN_ACTIVE_COLLECTION: {
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
                        canBeDeleted: action.collection.canBeDeleted,
                    },
                },
            };
        }
        case types.UPDATE_TEAMS_IN_ACTIVE_COLLECTION: {
            return {
                ...state,
                collections: {
                    ...state.collections,
                    active: {
                        ...state.collections.active,
                        teams: action.teams,
                    },
                },
            };
        }
        case types.EMPTY_ACTIVE_COLLECTION: {
            return {
                ...state,
                collections: {
                    ...state.collections,
                    active: null,
                },
            };
        }
        case types.UPDATE_WORKING_ON: {
            return {
                ...state,
                global: {
                    ...state.global,
                    workingOn: { ...action.workingOn },
                },
            };
        }
        case types.EMPTY_WORKING_ON: {
            return {
                ...state,
                global: {
                    ...state.global,
                    workingOn: null,
                },
            };
        }
        case types.UPDATE_ACTIVE_USER: {
            return {
                ...state,
                users: {
                    ...state.users,
                    active: {
                        email: action.user.email,
                        hasTemporaryPassword: action.user.hasTemporaryPassword,
                        name: action.user.name,
                        role: action.user.role,
                    },
                },
            };
        }
        case types.ADD_ALL_USERS: {
            return {
                ...state,
                users: {
                    ...state.users,
                    all: [...action.users],
                },
            };
        }
        case types.REMOVE_USER_FROM_ALL_USERS: {
            return {
                ...state,
                users: {
                    ...state.users,
                    all: state.users.all.filter(user => user.email !== action.userID),
                },
            };
        }
        case types.UPDATE_ALL_TEAMS: {
            return Object.assign({}, state, {
                teams: Object.assign({}, state.teams, {
                    all: action.allTeams,
                }),
            });
        }
        case types.UPDATE_ALL_TEAM_IDS_AND_NAMES: {
            return {
                ...state,
                teams: {
                    ...state.teams,
                    allIDsAndNames: action.allTeamIDsAndNames,
                },
            };
        }
        case types.UPDATE_ACTIVE_TEAM: {
            return Object.assign({}, state, {
                teams: Object.assign({}, state.teams, {
                    active: action.activeTeam,
                }),
            });
        }
        case types.UPDATE_ACTIVE_TEAM_MEMBERS: {
            return Object.assign({}, state, {
                teams: Object.assign({}, state.teams, {
                    active: Object.assign({}, state.teams.active, {
                        members: action.members,
                    }),
                }),
            });
        }
        case types.UPDATE_ACTIVE_INSTANCE: {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    activeInstance: action.instance,
                },
            });
        }
        case types.EMPTY_ACTIVE_INSTANCE: {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    activeInstance: null,
                },
            });
        }
        case types.UPDATE_ACTIVE_VERSION: {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    activeVersion: {
                        ...state.datasets.activeVersion,
                        ...action.version,
                    },
                },
            });
        }
        case types.UPDATE_ACTIVE_VERSION_REVIEW_STATE: {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    activeVersion: {
                        ...state.datasets.activeVersion,
                        lastEditedBy: action.lastEditedBy,
                        reviewState: action.reviewState,
                    },
                },
            });
        }
        case types.EMPTY_ACTIVE_VERSION: {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    activeVersion: null,
                },
            });
        }
        case types.UPDATE_ACTIVE_JOB: {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    activeJob: action.job,
                },
            });
        }
        case types.EMPTY_ACTIVE_DATASET: {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    activeDataset: null,
                },
            });
        }
        case types.UPDATE_ACTIVE_DATASET: {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    activeDataset: {
                        ...state.datasets.activeDataset,
                        ...action.dataset,
                    },
                },
            });
        }
        case types.UPDATE_ACTIVE_DATASET_REVIEW_STATE: {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    activeDataset: {
                        ...state.datasets.activeDataset,
                        lastEditedBy: action.lastEditedBy,
                        reviewState: action.reviewState,
                    },
                },
            });
        }
        case types.UPDATE_ACTIVE_DATASET_COLLECTION_ID: {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    activeDataset: {
                        ...state.datasets.activeDataset,
                        collection_id: action.collectionID,
                    },
                },
            });
        }
        case types.UPDATE_ALL_DATASETS: {
            return Object.assign({}, state, {
                datasets: Object.assign({}, state.datasets, {
                    all: action.allDatasets,
                }),
            });
        }
        case types.UPDATE_ALL_RECIPES: {
            return Object.assign({}, state, {
                datasets: {
                    ...state.datasets,
                    recipes: action.allRecipes,
                },
            });
        }
        case types.UPDATE_ALL_JOBS: {
            return Object.assign({}, state, {
                datasets: Object.assign({}, state.datasets, {
                    jobs: action.allJobs,
                }),
            });
        }
        case types.ADD_NEW_JOB: {
            return Object.assign({}, state, {
                datasets: Object.assign({}, state.datasets, {
                    jobs: [...state.datasets.jobs, action.job],
                }),
            });
        }
        case types.ADD_NOTIFICATION: {
            return Object.assign({}, state, {
                notifications: [...state.notifications, action.notification],
            });
        }
        case types.REMOVE_NOTIFICATION: {
            return Object.assign({}, state, {
                notifications: state.notifications.filter(notification => {
                    return notification.id !== action.notificationID;
                }),
            });
        }
        case types.TOGGLE_NOTIFICATION_VISIBILITY: {
            return Object.assign({}, state, {
                notifications: state.notifications.map(notification => {
                    if (notification.id !== action.notificationID) {
                        return notification;
                    }
                    notification.isVisible = !notification.isVisible;
                    return notification;
                }),
            });
        }
        case types.ADD_POPOUT: {
            return Object.assign({}, state, {
                popouts: [...state.popouts, action.popout],
            });
        }
        case types.REMOVE_POPOUTS: {
            return Object.assign({}, state, {
                popouts: state.popouts.filter(popout => {
                    return !new Set(action.popoutIDs).has(popout.id);
                }),
            });
        }
        case types.ADD_PREVIEW_COLLECTION: {
            return {
                ...state,
                preview: {
                    ...state.preview,
                    ...action.preview,
                },
            };
        }
        case types.REMOVE_PREVIEW_COLLECTION: {
            return {
                ...state,
                preview: {
                    selectedPage: null,
                },
            };
        }
        case types.UPDATE_PREVIEW_SELECTED_PAGE: {
            return {
                ...state,
                preview: {
                    ...state.preview,
                    selectedPage: action.selectedPage,
                },
            };
        }
        case types.REMOVE_PREVIEW_SELECTED_PAGE: {
            return {
                ...state,
                preview: {
                    ...state.preview,
                    selectedPage: null,
                },
            };
        }
        case types.SEARCH: {
            return { ...state, search: action.value.toLowerCase() };
        }
        default: {
            return state;
        }
    }
}
