export const USER_LOGGED_IN = "USER_LOGGED_IN";

export const userLoggedIn = (email, userType, isAdmin) => {
    return {
        type: USER_LOGGED_IN,
        email,
        userType,
        isAdmin,
    };
};

export const USER_LOGGED_OUT = "USER_LOGGED_OUT";

export const userLoggedOut = () => {
    return {
        type: USER_LOGGED_OUT,
    };
};
