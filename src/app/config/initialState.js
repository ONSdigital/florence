export const initialState = {
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
    notifications: [],
    popouts: [],
    preview: {
        selectedPage: null,
    },
};
