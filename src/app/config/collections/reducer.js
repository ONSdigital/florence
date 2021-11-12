import {
    UPDATE_ACTIVE_COLLECTION,
    EMPTY_ACTIVE_COLLECTION,
    MARK_COLLECTION_FOR_DELETE,
    DELETE_COLLECTION,
    UPDATE_PAGES_IN_ACTIVE_COLLECTION,
    UPDATE_TEAMS_IN_ACTIVE_COLLECTION,
    LOAD_COLLECTIONS_PROGRESS,
    LOAD_COLLECTIONS_SUCCESS,
    LOAD_COLLECTIONS_FAILURE,
} from "./constants";

export const initialState = {
    all: [],
    active: null,
    toDelete: {},
    isLoading: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_ACTIVE_COLLECTION: {
            const { id, name, status, type, isForcedManualType, canBeApproved, canBeDeleted } = action.collection;
            return {
                ...state,
                active: {
                    id,
                    name,
                    publishDate,
                    status,
                    type,
                    isForcedManualType,
                    canBeApproved,
                    canBeDeleted,
                },
            };
        }
        case UPDATE_PAGES_IN_ACTIVE_COLLECTION: {
            return {
                ...state,
                active: {
                    ...state.active,
                    inProgress: action.collection.inProgress,
                    complete: action.collection.complete,
                    reviewed: action.collection.reviewed,
                    deletes: action.collection.deletes,
                    canBeApproved: action.collection.canBeApproved,
                    canBeDeleted: action.collection.canBeDeleted,
                },
            };
        }
        case EMPTY_ACTIVE_COLLECTION: {
            return {
                ...state,
                active: null,
            };
        }

        case MARK_COLLECTION_FOR_DELETE: {
            let toDelete = { ...state.toDelete };
            toDelete[action.collectionID] = null;
            return {
                ...state,
                toDelete,
            };
        }
        case DELETE_COLLECTION: {
            const toDelete = { ...state.toDelete };
            delete toDelete[action.collectionID];
            const all = state.all.filter(collection => collection.id !== action.collectionID);
            return {
                ...state,
                all,
                toDelete,
            };
        }
        case UPDATE_TEAMS_IN_ACTIVE_COLLECTION: {
            return {
                ...state,
                active: {
                    ...state.active,
                    teams: action.teams,
                },
            };
        }

        case LOAD_COLLECTIONS_SUCCESS: {
            const { collections } = action;
            return {
                ...state,
                isLoading: false,
                all: collections,
            };
        }

        case LOAD_COLLECTIONS_PROGRESS: {
            return {
                ...state,
                isLoading: true,
            };
        }

        case LOAD_COLLECTIONS_FAILURE: {
            return {
                ...state,
                isLoading: false,
            };
        }

        default: {
            return state;
        }
    }
};

export default reducer;
