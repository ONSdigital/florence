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
        enableNewSignIn: false,
    },
    global: {
        workingOn: null,
    },
    rootPath: "/florence",
    teams: {
        active: {},
        all: [],
        users: [],
        isLoading: false,
    },
    users: {
        active: {},
        all: [],
        isCreating: false,
        previewUsers: [],
        isLoadingActive: false,
    },
    groups: {
        all: [],
        isLoading: false,
    },
    datasets: {
        all: [],
        jobs: [],
        activeInstance: {},
        recipes: [],
        activeJob: {},
    },
    isUserAddingToGroups: false,
    search: "",
    notifications: [],
    popouts: [],
    preview: {
        selectedPage: null,
    },
};
