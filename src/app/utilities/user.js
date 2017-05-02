import { get } from '../utilities/get';

export default class user {

    static get(email) {
        return get(`/zebedee/permission?email=${email}`)
            .then(response => {
                return response;
            }).catch(error => {
                console.log(`Error getting user details for ${email} \n${error}`);
        });
    }

}