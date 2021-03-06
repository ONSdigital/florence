import http from "../http";
import { store } from "../../config/store";
import { userLoggedIn, userLoggedOut, reset } from "../../config/actions";
import cookies from "../cookies";

export default class user {
    static get(email) {
        return http.get(`/zebedee/users?email=${email}`);
    }

    static getAll() {
        return http.get(`/zebedee/users`);
    }

    static create(body) {
        return http.post(`/zebedee/users`, body);
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
        const accessTokenCookieRemoved = cookies.remove("access_token");
        if (!accessTokenCookieRemoved) {
            console.warn(`Error trying to remove 'access_token' cookie`);
            return;
        }
        if (cookies.get("collection")) {
            cookies.remove("collection");
        }
        localStorage.removeItem("loggedInAs");
        localStorage.removeItem("userType");
        store.dispatch(userLoggedOut());
        store.dispatch(reset());
    }

    static updatePassword(body) {
        return http.post("/zebedee/password", body, undefined, true);
    }
}
