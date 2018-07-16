export const initialState = {
    user: {
        isAuthenticated: false,
        email: '',
        userType: '',
        isAdmin: false
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
        jobs: []
    },
    collections: {
        all: [],
        active: null,
        toDelete: {}
    },
    notifications: []
};