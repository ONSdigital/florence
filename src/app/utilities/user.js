import http from '../utilities/http';
import { store } from '../config/store';
import { userLoggedIn } from '../config/actions';

export default class user {

    static get(email) {
        return http.get(`/zebedee/users?email=${email}`)
            .then(response => {
                return response;
            }).catch(error => {
                console.error(`Error getting user details for ${email} \n${error}`);
            })
    }

    static getAll() {
        return http.get(`/zebedee/users`)
            .then(response => {
                return response;
            }).catch(error => {
                console.error(`Error getting all users \n${error}`)
            })
    }

    static getPermissions(email) {
        return http.get(`/zebedee/permission?email=${email}`)
            .then(response => {
                return response;
            }).catch(error => {
                console.error(`Error getting user permissions for ${email} \n${error}`);
        });
    }

    static setUserState(user) {
        const email = user.email;
        let userType = '';
        if (user.editor) {
            userType = 'EDITOR'
        } else {
            userType = 'DATA-VIS'
        }
        const isAdmin = !!user.admin;
        store.dispatch(userLoggedIn(email, userType, isAdmin));
        localStorage.setItem("loggedInAs", email);
    }

}