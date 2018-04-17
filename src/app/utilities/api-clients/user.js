import http from '../http';
import { store } from '../../config/store';
import { userLoggedIn, userLoggedOut } from '../../config/actions';

export default class user {

    static get(email) {
        return http.get(`/zebedee/users?email=${email}`)
            .then(response => {
                return response;
            }).catch(error => {
                console.error(`Error getting user details for ${email}`, error);
            })
    }

    static getAll() {
        return http.get(`/zebedee/users`)
            .then(response => {
                return response;
            }).catch(error => {
                console.error(`Error getting all users`, error)
            })
    }

    static getPermissions(email) {
        return http.get(`/zebedee/permission?email=${email}`)
            .then(response => {
                return response;
            }).catch(error => {
                console.error(`Error getting user permissions for ${email}`, error);
        });
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

    static setUserState(user) {
        const email = user.email;
        let userType = '';
        if (user.editor) { userType = 'EDITOR'}
        if (user.admin) { userType = 'ADMIN'}
        if (!user.editor && !user.admin) { userType = 'VIEWER'}
        const isAdmin = !!user.admin;
        store.dispatch(userLoggedIn(email, userType, isAdmin));
        localStorage.setItem("loggedInAs", email);

        // Store the user type in localStorage. Used in old Florence
        // where views can depend on user type. e.g. Browse tree
        localStorage.setItem("userType", this.getOldUserType(user));
    }

    static login(email, password) {
        const body = {
            email,
            password
        }
        return http.post('/zebedee/login', body, true, true);
    }

    static logOut() {
        store.dispatch(userLoggedOut());
    }

    static updatePassword(email, newPassword, previousPassword) {
        const body = {
            email,
            password: newPassword,
            oldPassword: previousPassword
        };
        return http.post('/zebedee/password', body, true, true);
    }

    static checkEmailVerification(email, code) {
        const body = {
            email: `<verify>:${email}`,
            password: code
        };
        return http.post('/zebedee/login', body, true, true);
    }

}