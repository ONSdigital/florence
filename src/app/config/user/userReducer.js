import types from "./userConstants";

const initialState = {
    isAuthenticated: false,
    email: "",
    userType: "",
    isAdmin: false,
    sessionTimer: {
        active: false,
        expire: "",
    },
    refreshTimer: {
        active: false,
        expire: "",
    },
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.USER_LOGGED_IN: {
            return {
                ...state,
                isAuthenticated: true,
                email: action.email,
                userType: action.userType,
                isAdmin: action.isAdmin,
            };
        }
        case types.USER_LOGGED_OUT: {
            return {
                ...state,
                isAuthenticated: false,
                email: null,
                userType: null,
                isAdmin: null,
            };
        }
        case types.START_REFRESH_AND_SESSION: {
            return {
                ...state,
                ...action.payload,
            };
        }
        case types.START_REFRESH_AND_SESSION: {
            return {
                ...state,
                ...action.payload,
            };
        }
        default: {
            return state;
        }
    }
};

export default userReducer;
