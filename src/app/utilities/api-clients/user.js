import http from "../http";
import { store } from "../../config/store";
import { reset } from "../../config/actions";
import { userLoggedIn, userLoggedOut } from "../../config/user/userActions";
import cookies from "../cookies";
import notifications from "../notifications";
import log from "../logging/log";
import sessionManagement from "../sessionManagement";
import SessionManagement from "dis-authorisation-client-js";
import { removePopouts } from "../../config/actions";
import { errCodes as errorCodes, errCodes } from "../errorCodes";
import { removeAuthState, setAuthState } from "../auth";

export default class user {
    static get(email) {
        return http.get(`/zebedee/users?email=${email}`);
    }

    static getAll = async params => {
        let config = {};
        if (window.getEnv != null) {
            config = window.getEnv();
        }
        if (config.enableNewSignIn) {
            let queryString = "";
            Object.keys(params).map(key => {
                queryString = queryString ? `${queryString}&${key}=${params[key]}` : `?${key}=${params[key]}`;
            });
            try {
                return await http.get(`/users${queryString}`);
            } catch (error) {
                if (error.status) {
                    if (error.status >= 400 && error.status < 500) {
                        switch (error.status) {
                            case 400: {
                                const notification = {
                                    type: "warning",
                                    message: errCodes.GET_USERS_UNEXPECTED_FILTER_ERROR,
                                    autoDismiss: 5000,
                                };
                                notifications.add(notification);
                                break;
                            }
                            case 404: {
                                const notification = {
                                    type: "warning",
                                    message: errCodes.GET_USERS_NOT_FOUND,
                                    autoDismiss: 5000,
                                };
                                notifications.add(notification);
                                break;
                            }
                            default: {
                                const notification = {
                                    type: "warning",
                                    message: errorCodes.GET_USERS_UNEXPECTED_ERROR_SHORT,
                                    isDismissable: true,
                                };
                                notifications.add(notification);
                                break;
                            }
                        }
                    } else {
                        const notification = {
                            type: "warning",
                            message: errCodes.GET_USERS_UNEXPECTED_ERROR_SHORT,
                            isDismissable: true,
                        };
                        notifications.add(notification);
                    }
                } else {
                    const notification = {
                        type: "warning",
                        message: errCodes.GET_USERS_UNEXPECTED_ERROR_SHORT,
                        isDismissable: true,
                    };
                    notifications.add(notification);
                }
                return error;
            }
        } else {
            return http.get(`/zebedee/users`);
        }
    };

    static create(body) {
        return http.post(`/zebedee/users`, body);
    }

    // TODO: new auth work
    static getUsers() {
        return http.get(`/users?sort=forename:asc`);
    }

    // TODO: new auth work
    static createNewUser(body) {
        return http.post(`/users`, body);
    }

    static getUser(id) {
        return http.get(`/users/${id}`);
    }

    // TODO: new auth work
    static updateUser(id, body) {
        return http.put(`/users/${id}`, body);
    }

    static getUserGroups(id) {
        return http.get(`/users/${id}/groups`);
    }

    static remove(email) {
        return http.delete(`/zebedee/users?email=" + ${email}`);
    }

    static setPassword(body) {
        return http.post(`/zebedee/password`, body);
    }

    static setPermissions(body) {
        return http.post(`/zebedee/permission`, body);
    }

    /**
     * Gets the permissions of the user specified by the email provided.
     *
     * @returns the user permissions response
     * @deprecated as part of migration to JWT sessions and will be removed soon. Use getPermissions() instead.
     */
    static getPermissionsForUser(email) {
        console.warn(
            "WARNING! Deprecated function called. Function 'getPermissionsForUser(email)' is deprecated, please use the new 'getPermissions()' instead"
        );
        return http.get(`/zebedee/permission?email=${email}`, true, true);
    }

    /**
     * Gets the permissions of the current authenticated user (based on their access token)
     *
     * @returns the user permissions response
     */
    static getPermissions() {
        return http.get(`/zebedee/permission`, true, true);
    }

    static signIn(body) {
        return http.post("/tokens", body, true, true, true);
    }

    // TODO: new auth work
    static deleteTokens() {
        return http.delete("/tokens");
    }

    static setForgottenPassword(body) {
        return http.put("/users/self/password", body, true, true);
    }

    static renewSession(body) {
        return http.put("/tokens/self", body, true, false);
    }

    static expireSession() {
        return http.delete("/tokens/self", true, true);
    }

    // This is a temporary fix for 925: Login fails after going from new login to old login
    static deleteCookies() {
        return http.delete("/cookies");
    }

    static getOldUserType(user) {
        // TAKEN FROM OLD FLORENCE
        if (user.admin) {
            return "PUBLISHING_SUPPORT";
        } else if (user.editor && !user.dataVisPublisher) {
            return "PUBLISHING_SUPPORT";
        } else if (user.editor && user.dataVisPublisher) {
            return "DATA_VISUALISATION";
        } else if (!user.admin && !user.editor && !user.dataVisPublisher) {
            return "VIEWER";
        }
    }

    static getUserRole(isAdmin, isEditor) {
        let role = "";
        if (isEditor) {
            role = "EDITOR";
        }
        if (isAdmin) {
            role = "ADMIN";
        }
        if (!isEditor && !isAdmin) {
            role = "VIEWER";
        }
        return role;
    }

    static setUserState(user) {
        setAuthState(user);
        const email = user.email;
        const role = this.getUserRole(user.admin, user.editor);
        const isAdmin = !!user.admin;
        store.dispatch(userLoggedIn(email, role, isAdmin));
    }

    static logOut() {
        function clearCookies() {
            if (!config.enableNewSignIn) {
                const accessTokenCookieRemoved = cookies.remove("access_token");
                if (!accessTokenCookieRemoved) {
                    console.warn(`Error trying to remove 'access_token' cookie`);
                    user.deleteCookies()
                        .then(function () {
                            console.debug("[FLORENCE] Deleted HTTP Cookies");
                        })
                        .catch(err => console.error(err));
                }
            }
            if (cookies.get("collection")) {
                cookies.remove("collection");
            }
            if (cookies.get("id_token")) {
                cookies.remove("id_token");
            }
            removeAuthState();
            store.dispatch(userLoggedOut());
            store.dispatch(reset());
        }

        const config = window.getEnv();
        if (config.enableNewSignIn) {
            user.expireSession()
                .catch(error => {
                    if (error.status === 400) {
                        console.warn("Error occurred sending DELETE to /tokens/self - InvalidToken");
                        log.event("error on sign out sending delete to /tokens/self failed with an invalid token", log.error(error));
                    } else {
                        console.warn("Error occurred sending DELETE to /tokens/self");
                        log.event("error on sign out sending delete to /tokens/self failed with an unexpected error", log.error(error));
                    }
                    clearCookies();
                })
                .finally(() => {
                    clearCookies();
                    SessionManagement.removeTimers();
                    store.dispatch(removePopouts(["session-expire-soon", "refresh-expire-soon"]));
                });
        } else {
            clearCookies();
        }
    }

    static updatePassword(body) {
        return http.post("/zebedee/password", body, undefined, true);
    }
}
