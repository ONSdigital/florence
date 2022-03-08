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
        case types.DELETE_COLLECTION: {
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
                    enableNewSignIn: action.config.enableNewSignIn,
                },
            };
        }
        case types.LOAD_USERS_SUCCESS: {
            return {
                ...state,
                users: {
                    ...state.users,
                    all: action.users,
                    isLoading: false,
                    previewUsers: action.users,
                },
            };
        }
        case types.LOAD_USERS_PROGRESS: {
            return {
                ...state,
                users: {
                    ...state.users,
                    isLoading: true,
                },
            };
        }
        case types.LOAD_USERS_FAILURE: {
            return {
                ...state,
                users: {
                    ...state.users,
                    isLoading: false,
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
        case types.UPDATE_COLLECTION_PROGRESS: {
            return {
                ...state,
                collections: {
                    ...state.collections,
                    isUpdating: true,
                },
            };
        }
        case types.UPDATE_COLLECTION_FAILURE: {
            return {
                ...state,
                collections: {
                    ...state.collections,
                    isUpdating: false,
                },
            };
        }
        case types.UPDATE_COLLECTION_SUCCESS: {
            const updatedCollections = state.collections.all.map(col => (col.id === action.collection.id ? action.collection : col));
            return {
                ...state,
                collections: {
                    ...state.collections,
                    all: updatedCollections,
                    isUpdating: false,
                },
            };
        }
        case types.CREATE_USER_PROGRESS: {
            return {
                ...state,
                users: {
                    ...state.users,
                    isCreating: true,
                },
            };
        }
        case types.CREATE_USER_FAILURE: {
            return {
                ...state,
                users: {
                    ...state.users,
                    isCreating: false,
                },
            };
        }
        case types.CREATE_USER_SUCCESS: {
            //TODO: can not test the response object atm so will change this later
            const users = state.users.concat(action.user);
            return {
                ...state,
                users: {
                    ...state.users,
                    active: action.user,
                    all: users,
                    isLoadingActive: true,
                },
            };
        }
        case types.LOAD_USER_PROGRESS: {
            return {
                ...state,
                user: {
                    ...state.user,
                    isLoading: true,
                },
            };
        }
        case types.LOAD_USER_FAILURE: {
            return {
                ...state,
                user: {
                    ...state.user,
                    isLoading: false,
                },
            };
        }
        case types.LOAD_USER_SUCCESS: {
            return {
                ...state,
                user: {
                    ...state.user,
                    isLoading: false,
                    data: action.user,
                },
            };
        }
        case types.LOAD_GROUPS_PROGRESS: {
            return {
                ...state,
                groups: {
                    ...state.groups,
                    isLoading: true,
                },
            };
        }
        case types.LOAD_GROUPS_FAILURE: {
            return {
                ...state,
                groups: {
                    ...state.groups,
                    isLoading: false,
                },
            };
        }
        case types.LOAD_GROUPS_SUCCESS: {
            return {
                ...state,
                groups: {
                    ...state.groups,
                    all: action.groups,
                    isLoading: false,
                },
            };
        }
        case types.LOAD_GROUP_PROGRESS: {
            return {
                ...state,
                groups: {
                    ...state.groups,
                    active: {
                        ...state.groups.active,
                        isLoading: true,
                    },
                },
            };
        }
        case types.LOAD_GROUP_SUCCESS: {
            return {
                ...state,
                groups: {
                    ...state.groups,
                    active: {
                        ...state.groups.active,
                        details: action.group,
                        isLoading: false,
                    },
                },
            };
        }
        case types.LOAD_GROUP_MEMBERS_SUCCESS: {
            return {
                ...state,
                groups: {
                    ...state.groups,
                    active: {
                        ...state.groups.active,
                        members: action.members.users,
                        isLoading: false,
                    },
                },
            };
        }
        case types.ADD_GROUPS_TO_USER_PROGRESS: {
            return {
                ...state,
                isUserAddingToGroups: true,
            };
        }
        case types.ADD_GROUPS_TO_USER_FAILURE: {
            return {
                ...state,
                isUserAddingToGroups: false,
            };
        }
        case types.ADD_GROUPS_TO_USER_SUCCESS: {
            return {
                ...state,
                isUserAddingToGroups: false,
            };
        }
        case types.UPDATE_USER_PROGRESS: {
            return {
                ...state,
                users: {
                    ...state.users,
                    isUpdating: true,
                },
            };
        }
        case types.UPDATE_USER_FAILURE: {
            return {
                ...state,
                users: {
                    ...state.users,
                    isUpdating: false,
                },
            };
        }
        case types.UPDATE_USER_SUCCESS: {
            return {
                ...state,
                user: {
                    ...state.user,
                    data: null,
                },
            };
        }
        case types.LOAD_USER_GROUPS_SUCCESS: {
            const userGroups = action.groups || [];
            return {
                ...state,
                user: {
                    ...state.user,
                    groups: userGroups,
                    isLoading: false,
                },
            };
        }
        case types.LOAD_USER_GROUPS_PROGRESS: {
            return {
                ...state,
                user: {
                    ...state.user,
                    isLoading: true,
                },
            };
        }
        case types.LOAD_USER_GROUPS_FAILURE: {
            return {
                ...state,
                user: {
                    ...state.user,
                    isLoading: false,
                },
            };
        }
        default: {
            return state;
        }
    }
}
