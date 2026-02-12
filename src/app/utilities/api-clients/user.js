import http from "../http";
import { store } from "../../config/store";
import { reset } from "../../config/actions";
import { userLoggedIn, userLoggedOut } from "../../config/user/userActions";
import cookies from "../cookies";
import notifications from "../notifications";
import log from "../logging/log";
import SessionManagement from "dis-authorisation-client-js";
import { errCodes as errorCodes, errCodes } from "../errorCodes";
import { removeAuthState, setAuthState } from "../auth";
import { API_PROXY } from "./constants";

export default class user {
    static getAll = async params => {
        let queryString = "";
        Object.keys(params).map(key => {
            queryString = queryString ? `${queryString}&${key}=${params[key]}` : `?${key}=${params[key]}`;
        });
        try {
            return await http.get(`${API_PROXY.VERSIONED_PATH}/users${queryString}`);
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
    };

    static create(body) {
        return http.post(`${API_PROXY.VERSIONED_PATH}/users`, body);
    }

    static getUsers() {
        return http.get(`${API_PROXY.VERSIONED_PATH}/users?sort=forename:asc`);
    }

    static createNewUser(body) {
        return http.post(`${API_PROXY.VERSIONED_PATH}/users`, body);
    }

    static getUser(id) {
        return http.get(`${API_PROXY.VERSIONED_PATH}/users/${id}`);
    }

    static updateUser(id, body) {
        return http.put(`${API_PROXY.VERSIONED_PATH}/users/${id}`, body);
    }

    static setUserPassword(id) {
        return http.post(`${API_PROXY.VERSIONED_PATH}/users/${id}/password`);
    }

    static getUserGroups(id) {
        return http.get(`${API_PROXY.VERSIONED_PATH}/users/${id}/groups`);
    }

    static remove(email) {
        return http.delete(`${API_PROXY.VERSIONED_PATH}/users?email=" + ${email}`);
    }

    /**
     * Gets the permissions of the current authenticated user (based on their access token)
     *
     * @deprecated - this method should not be used in favour of the UserIDToken class.
     * @returns the user permissions response
     */
    static getPermissions() {
        return http.get(`${API_PROXY.VERSIONED_PATH}/permission`, true, true);
    }

    static signIn(body) {
        return http.post(`${API_PROXY.VERSIONED_PATH}/tokens`, body, true, true, true);
    }

    static deleteTokens() {
        return http.delete(`${API_PROXY.VERSIONED_PATH}/tokens`);
    }

    static setForgottenPassword(body) {
        return http.put(`${API_PROXY.VERSIONED_PATH}/users/self/password`, body, true, true);
    }

    static renewSession(body) {
        return http.put(`${API_PROXY.VERSIONED_PATH}/tokens/self`, body, true, false);
    }

    static expireSession() {
        return http.delete(`${API_PROXY.VERSIONED_PATH}/tokens/self`, true, true);
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
            });
    }

    static translateStatus(status) {
        switch (status) {
            case "FORCE_CHANGE_PASSWORD":
                return "Unconfirmed";
            case "CONFIRMED":
                return "Confirmed";
            default:
                return "";
        }
    }
}
