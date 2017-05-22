import { get } from '../utilities/get';

export default class teams {

    static getAll() {
        return get(`/zebedee/teams`)
            .then(response => {
                return response.teams;
            }).catch(error => {
                console.error(`Error getting all teams \n${error}`);
        });
    }

    static get(teamName) {
        return get(`/zebedee/teams/${teamName}`)
            .then(response => {
                return response
            }).catch(error => {
                console.error(`Error getting team '${teamName}' \n${error}`);
            })
    }

}