import types from "./userConstants";

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

export const startRefeshAndSession = (refresh_expiry_time, session_expiry_time) => {
    let payload = {
        sessionTimer: {
            active: true,
            expire: session_expiry_time,
        },
    };

    if (refresh_expiry_time) {
        payload = {
            ...payload,
            refreshTimer: {
                active: true,
                expire: refresh_expiry_time,
            },
        };
    }
    return {
        type: types.START_REFRESH_AND_SESSION,
        payload,
    };
};

export const endSession = () => {
    return {
        type: types.END_SESSION,
    };
};
