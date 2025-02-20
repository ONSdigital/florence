import http from "../http";

const API_PROXY_PATH = `/api/${window.getEnv().apiRouterVersion}`;

export default class teams {
    static getAll() {
        return http.get(`/zebedee/teams`).then(response => {
            return response.teams;
        });
    }

    static get(teamName) {
        return http.get(`/zebedee/teams/${teamName}`).then(response => {
            return response;
        });
    }

    static add(teamName) {
        return http.post(`/zebedee/teams/${teamName}`).then(response => {
            return response;
        });
    }

    static remove(teamName) {
        return http.delete(`/zebedee/teams/${teamName}`).then(response => {
            return response;
        });
    }

    static addMember(teamName, email) {
        return http.post(`/zebedee/teams/${teamName}?email=${email}`).then(response => {
            return response;
        });
    }

    static removeMember(teamName, email) {
        return http.delete(`/zebedee/teams/${teamName}?email=${email}`).then(response => {
            return response;
        });
    }

    // TODO: new auth work

    static createTeam(body) {
        return http.post(`${API_PROXY_PATH}/groups`, body).then(response => {
            return response;
        });
    }

    static addMemberToTeam(id, userID) {
        return http.post(`${API_PROXY_PATH}/groups/${id}/members`, { user_id: userID }).then(response => {
            return response;
        });
    }

    static deleteMemberFromTeam(id, body) {
        return http.post(`${API_PROXY_PATH}/groups/${id}/members`, body).then(response => {
            return response;
        });
    }

    static getGroups() {
        return http.get(`${API_PROXY_PATH}/groups?sort=name:asc`).then(response => {
            return response;
        });
    }

    static getGroup(id) {
        return http.get(`${API_PROXY_PATH}/groups/${id}`).then(response => {
            return response;
        });
    }

    static updateGroup(id, body) {
        return http.put(`${API_PROXY_PATH}/groups/${id}`, body).then(response => {
            return response;
        });
    }

    static updateGroupMembers(id, body) {
        return http.put(`${API_PROXY_PATH}/groups/${id}/members`, body).then(response => {
            return response;
        });
    }

    static deleteGroup(id) {
        return http.delete(`${API_PROXY_PATH}/groups/${id}`).then(response => {
            return response;
        });
    }

    static getGroupMembers(id) {
        return http.get(`${API_PROXY_PATH}/groups/${id}/members?sort=forename:asc`).then(response => {
            return response;
        });
    }

    static addGroupsToUser(name, body) {
        return http.post(`${API_PROXY_PATH}/groups/${name}`, body).then(response => {
            return response;
        });
    }
}
