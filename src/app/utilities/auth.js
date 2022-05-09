import user from "../utilities/api-clients/user";

const _AUTH_TOKEN_NAME = "ons_user";

export const UserRole = Object.freeze({
    ADMIN: "ADMIN",
    EDITOR: "EDITOR",
    VIEWER: "VIEWER",
});

export default class auth {
    static isAuthenticated({ isAuthenticated }) {
        return isAuthenticated;
    }

    static isViewer({ userType }) {
        return userType === UserRole.VIEWER;
    }

    static isAdminOrEditor({ userType }) {
        return userType === UserRole.ADMIN || userType === UserRole.EDITOR;
    }

    static isAdmin({ userType }) {
        return userType === UserRole.ADMIN;
    }

    static canViewCollectionsDetails({ userType }) {
        return userType === UserRole.ADMIN || userType === UserRole.EDITOR;
    }
}

export function setAuthToken(userData) {
    const userJSONData = JSON.stringify(userData);
    window.localStorage.setItem(_AUTH_TOKEN_NAME, userJSONData);
    /* Legacy florence */
    window.localStorage.setItem("loggedInAs", userData.email);
    // Store the user type in localStorage. Used in old Florence
    // where views can depend on user type. e.g. Browse tree
    localStorage.setItem("userType", user.getOldUserType(userData));
}

export function getAuthToken() {
    const userData =  window.localStorage.getItem(_AUTH_TOKEN_NAME);
    return JSON.parse(userData);
}

export function removeAuthToken() {
    window.localStorage.removeItem(_AUTH_TOKEN_NAME);
    /* Florence legacy */
    window.localStorage.removeItem("loggedInAs");
    window.localStorage.removeItem("userType");
}
