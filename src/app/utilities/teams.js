import { get } from '../utilities/get';

export default class teams {

    static getAll() {
        return get(`/zebedee/teams`)
            .then(response => {
                return response;
            }).catch(error => {
                console.log(`Error getting all teams \n${error}`);
        });
    }

}