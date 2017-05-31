import http from '../utilities/http';

export default class teams {

    static getAll() {
        return http.get(`/zebedee/teams`)
            .then(response => {
                return response.teams;
            }).catch(error => {
                console.error(`Error getting all teams \n${error}`);
            });
    }

    static get(teamName) {
        return http.get(`/zebedee/teams/${teamName}`)
            .then(response => {
                return response;
            }).catch(error => {
                console.error(`Error getting team '${teamName}' \n${error}`);
            })
    }

    static remove(teamName) {
        return http.delete(`/zebedee/teams/${teamName}`)
            .then(response => {
                return response;
            })
    }

    static addMember(teamName, email) {
        return http.post(`/zebedee/teams/${teamName}?email=${email}`)
            .then(response => {
                return response;
            })
    }
    
    static removeMember(teamName, email) {
        return http.delete(`/zebedee/teams/${teamName}?email=${email}`)
            .then(response => {
                return response;
            })
    }

}