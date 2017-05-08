export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';

export function userLoggedIn(email, userType, isAdmin) {
    return {
        type: USER_LOGGED_IN,
        email: email,
        userType: userType,
        isAdmin: isAdmin

    }
}

export function userLoggedOut() {
    return {
        type: USER_LOGGED_OUT
    }
}