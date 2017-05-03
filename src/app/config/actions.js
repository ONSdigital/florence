export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';

export const UPDATE_ALL_TEAMS = 'UPDATE_ALL_TEAMS';
export const UPDATE_ACTIVE_TEAM = 'UPDATE_ACTIVE_TEAM';

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

export function updateAllTeams(allTeams) {
    return {
        type: UPDATE_ALL_TEAMS,
        allTeams: allTeams
    }
}

export function updateActiveTeam(activeTeam) {
    return {
        type: UPDATE_ALL_TEAMS,
        activeTeam: activeTeam
    }
}