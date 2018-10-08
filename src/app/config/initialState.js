export const initialState = {
    config: {
        enableDatasetImport: false
    },
    user: {
        isAuthenticated: false,
        email: '',
        userType: '',
        isAdmin: false
    },
    global: {
        workingOn: null
    },
    rootPath: "/florence",
    teams: {
        active: {},
        all: [],
        allIDsAndNames: [],
        users: []
    },
    datasets: {
        all: [],
        jobs: [],
        activeInstance: {},
        recipes: [],
        activeJob: {}
    },
    collections: {
        all: [],
        active: null,
        toDelete: {}
    },
    notifications: [],
    preview: {
        selectedPage: null
    }
};