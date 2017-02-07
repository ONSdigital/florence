
const initialState = {
    user: {
        authenticated: false
    }
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case ('USER_LOGGED_IN'): {
            return Object.assign({}, state, {
                user: Object.assign({}, state.user, {
                    authenticated: true
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
