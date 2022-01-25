import { initialState as teamsReducerInitialState } from "./teams/teamsReducer";

export const initialState = {
    collections: {
        all: [],
        active: null,
        toDelete: {},
        isLoading: false,
        isUpdating: false,
    },
    config: {
        enableDatasetImport: false,
        enableHomepagePublishing: false,
        enableNewSignIn: false,
    },
    global: {
        workingOn: null,
    },
    rootPath: "/florence",
    teams: {
        active: {},
        all: [],
        allIDsAndNames: [],
        users: [],
    },
    users: {
        active: {},
        all: [],
    },
    datasets: {
        all: [],
        jobs: [],
        activeInstance: {},
        recipes: [],
        activeJob: {},
    },
    search: "",
    notifications: [],
    popouts: [],
    preview: {
        selectedPage: null,
    },
    Teams: teamsReducerInitialState,
};
