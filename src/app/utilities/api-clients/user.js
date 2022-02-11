import http from "../http";
import { store } from "../../config/store";
import { reset } from "../../config/actions";
import { userLoggedIn, userLoggedOut } from "../../config/user/userActions";
import cookies from "../cookies";
import notifications from "../notifications";
import log from "../logging/log";
import sessionManagement from "../sessionManagement";

export default class user {
    static get(email) {
        return http.get(`/zebedee/users?email=${email}`);
    }

    static getAll(params) {
        const config = window.getEnv();
        if (config.enableNewSignIn) {
            let queryString = "";
            Object.keys(params).map(key => {
                queryString = queryString ? `${queryString}&${key}=${params[key]}` : `?${key}=${params[key]}`;
            });
            return http.get(`/users${queryString}`);
        }
        return http.get(`/zebedee/users`);
    }

    static create(body) {
        return http.post(`/zebedee/users`, body);
    }

    // TODO: new auth work
    static createNewUser(body) {
        return http.post(`/users`, body);
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

    static getPermissions(email) {
        return http.get(`/zebedee/permission?email=${email}`, true, true);
    }

    static signIn(body) {
        return http.post("/tokens", body, true, true, true);
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
        const email = user.email;
        const role = this.getUserRole(user.admin, user.editor);
        const isAdmin = !!user.admin;
        store.dispatch(userLoggedIn(email, role, isAdmin));
        localStorage.setItem("loggedInAs", email);

        // Store the user type in localStorage. Used in old Florence
        // where views can depend on user type. e.g. Browse tree
        localStorage.setItem("userType", this.getOldUserType(user));
    }

    static logOut() {
        function clearCookies() {
            const accessTokenCookieRemoved = cookies.remove("access_token");
            if (!accessTokenCookieRemoved) {
                console.warn(`Error trying to remove 'access_token' cookie`);
            }
            if (cookies.get("collection")) {
                cookies.remove("collection");
            }
            localStorage.removeItem("loggedInAs");
            localStorage.removeItem("userType");
            store.dispatch(userLoggedOut());
            store.dispatch(reset());
        }

        const config = window.getEnv();
        if (config.enableNewSignIn) {
            user.expireSession()
                .catch(error => {
                    if (error.status === 400) {
                        const notification = {
                            type: "warning",
                            message: "An error occurred during sign out 'InvalidToken', please contact a system administrator",
                            isDismissable: true,
                            autoDismiss: 20000,
                        };
                        notifications.add(notification);
                        console.error("Error occurred sending DELETE to /tokens/self - InvalidToken");
                        log.event("error on sign out sending delete to /tokens/self failed with an invalid token", log.error(error));
                    } else {
                        const notification = {
                            type: "warning",
                            message: "Unexpected error occurred during sign out",
                            isDismissable: true,
                            autoDismiss: 20000,
                        };
                        notifications.add(notification);
                        console.error("Error occurred sending DELETE to /tokens/self");
                        log.event("error on sign out sending delete to /tokens/self failed with an unexpected error", log.error(error));
                    }
                    clearCookies();
                })
                .finally(() => {
                    clearCookies();
                    sessionManagement.removeTimers();
                });
        } else {
            clearCookies();
        }
    }

    static updatePassword(body) {
        return http.post("/zebedee/password", body, undefined, true);
    }
}
