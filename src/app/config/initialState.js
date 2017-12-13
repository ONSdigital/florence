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
        users: []
    },
    datasets: {
        all: [],
        jobs: []
    },
    collections: {
        active: null
    },
    notifications: []
};