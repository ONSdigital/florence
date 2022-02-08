import * as types from "./userConstants";

export const userLoggedIn = (email, userType, isAdmin) => {
    return {
        type: types.USER_LOGGED_IN,
        email,
        userType,
        isAdmin,
    };
};

export const userLoggedOut = () => {
    return {
        type: types.USER_LOGGED_OUT,
    };
};
