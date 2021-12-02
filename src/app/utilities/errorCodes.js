export const errCodes = {
    FETCH_ERR: "Florence is unavailable",
    RESPONSE_ERR: "Florence is experiencing difficulties",
    UNEXPECTED_ERR: "Something has gone seriously wrong. Please restart Florence",
    LOGIN_UNEXPECTED_ERR: "An unexpected error has occurred, please try again",
    RESET_PASSWORD_REQUEST_UNEXPECTED_ERR: "An unexpected error has occurred, please try again",
    RESET_PASSWORD_REQUEST_RATE_LIMIT: "There is a problem, the number of requests made has exceeded the limit, please try again later",
    SET_PASSWORD_VALIDATION_ERR: "There is a problem, the new password was invalid",
    SESSION_EXPIRED: "Your session has ended, you’ll need to sign in again.",
    REFRESH_SESSION_ERROR: "An unexpected error has occurred whilst extending your session. Please sign out and sign back in.",
    GET_USERS_NOT_FOUND: "No API route available to get users.",
    GET_USERS_UNEXPECTED_ERROR:
        "An unexpected error's occurred whilst trying to get users. You may only be able to see previously loaded information.",
    GET_USERS_NETWORK_ERROR: "There's been a network error whilst trying to get users. You may only be able to see previously loaded information.",
    GET_USERS_RESPONSE_ERROR: "An error's occurred whilst trying to get users. You may only be able to see previously loaded information.",
};
