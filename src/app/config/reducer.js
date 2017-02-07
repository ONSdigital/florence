
const initialState = {
    user: {
        isAuthenticated: false,
        email: '',
        userType: '',
        isAdmin: false
    }
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case ('USER_LOGGED_IN'): {
            return Object.assign({}, state, {
                user: Object.assign({}, state.user, {
                    isAuthenticated: true,
                    email: action.email,
                    userType: action.userType,
                    isAdmin: action.isAdmin
                })
            })
        }
        case ('USER_LOGGED_OUT'): {
            return Object.assign({}, state, {
                user: Object.assign({}, state.user, {
                    authenticated: false
                })
            })
        }
        default: {
            break;
        }
    }
    return state;
}
