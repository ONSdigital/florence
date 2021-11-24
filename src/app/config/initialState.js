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
        allViewers: [],
        inTeam: [],
        notInTeam: [],
    },
    datasets: {
        all: [],
        jobs: [],
        activeInstance: {},
        recipes: [],
        activeJob: {},
    },
    collections: {
        all: [],
        active: null,
        toDelete: {},
    },
    notifications: [],
    popouts: [],
    preview: {
        selectedPage: null,
    },
};
