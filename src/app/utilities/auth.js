/**
 * Auth State:
 *  The concept of Auth State is an object as a string stored in LocalStorage with a
 *  key of `ons_auth_state`. The value is in the format of -
 *  {
 *      "email":"<EMAIL>",
 *      "admin": true,
 *      "editor":true
 *  }
 */
import user from "../utilities/api-clients/user";
import fp from "lodash/fp";

const _AUTH_STATE_NAME = "ons_auth_state";

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

export function setAuthState(userData) {
    const userJSONData = JSON.stringify(userData);
    window.localStorage.setItem(_AUTH_STATE_NAME, userJSONData);
    /* Legacy florence */
    window.localStorage.setItem("loggedInAs", userData.email);
    // Store the user type in localStorage. Used in old Florence
    // where views can depend on user type. e.g. Browse tree
    localStorage.setItem("userType", user.getOldUserType(userData));
}

/** Assumes user is authenticated if ons_user exists in local storage */
export function getAuthState() {
    let userData = window.localStorage.getItem(_AUTH_STATE_NAME);
    try {
        userData = JSON.parse(userData);
    } catch (err) {
        console.error("Could not parse auth token from local storage: ");
        return undefined;
    }
    return userData;
}

export function removeAuthState() {
    window.localStorage.removeItem(_AUTH_STATE_NAME);
    /* ENABLE_NEW_SIGN_IN legacy */
    window.localStorage.removeItem("access_token");
    /* Florence legacy */
    window.localStorage.removeItem("loggedInAs");
    window.localStorage.removeItem("userType");
}

export function getIsAdminFromAuthState() {
    return fp.get("admin")(getAuthState());
}

/** User Schema - represents the `user` type stored in redux. */
class _UserSchema {
    isAuthenticated = false;
    email = "";
    userType = ""; // PUBLISHING_SUPPORT...
    isAdmin = false;
}

/**
 * Factory function that creates a valid user type (as in redux store) or returns
 * an empty valid new user instance.
 * @returns {_UserSchema}
 */
export function getUserTypeFromAuthState() {
    const userData = getAuthState();
    if (!userData) {
        // Return a new empty user object to respect the factory functions return type
        return new _UserSchema();
    }
    const _user = new _UserSchema();
    // We assume the user is authenticated if ons_user exists in local storage
    _user.isAuthenticated = !!userData;
    _user.email = userData.email;
    _user.userType = user.getUserRole(userData.admin, userData.editor);
    _user.isAdmin = userData.admin;
    return _user;
}
