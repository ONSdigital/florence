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
        enableNewUpload: false,
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
};
