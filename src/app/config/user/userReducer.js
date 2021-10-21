import { USER_LOGGED_IN, USER_LOGGED_OUT } from "./userActions";

const initialState = {
    isAuthenticated: false,
    email: "",
    userType: "",
    isAdmin: false,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGGED_IN: {
            return {
                ...state,
                isAuthenticated: true,
                email: action.email,
                userType: action.userType,
                isAdmin: action.isAdmin,
            };
        }
        case USER_LOGGED_OUT: {
            return {
                ...state,
                isAuthenticated: false,
                email: null,
                userType: null,
                isAdmin: null,
            };
        }
        default: {
            return state;
        }
    }
};

export default userReducer;
