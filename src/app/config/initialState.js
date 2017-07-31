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
        active: {},
        all: []
    },
    notifications: []
};