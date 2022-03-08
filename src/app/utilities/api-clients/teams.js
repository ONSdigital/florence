import http from "../http";

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

    static createTeam(body) {
        return http.post(`/groups`, body).then(response => {
            return response;
        });
    }

    static addMemberToTeam(teamID, userID) {
        return http.post(`/groups/${teamID}/members`, { user_id: userID }).then(response => {
            return response;
        });
    }
    static removeMemberToTeam(teamID, userID) {
        return http.delete(`/groups/${teamID}/members/${userID}`).then(response => {
            return response;
        });
    }

    static updateGroup(teamID, name) {
        return http.put(`/groups/${teamID}`, { id: teamID, name: name, precedence: "10" }).then(response => {
            return response;
        });
    }
    static deleteGroup(groupID) {
        return http.delete(`/groups/${groupID}`).then(response => {
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
    static getGroups() {
        return http.get(`/groups`).then(response => {
            return response;
        });
    }

    static getGroup(id) {
        return http.get(`/groups/${id}`).then(response => {
            return response;
        });
    }

    static getGroupMembers(id) {
        return http.get(`/groups/${id}/members`).then(response => {
            return response;
        });
    }

    static addGroupsToUser(name, body) {
        return http.post(`/groups/${name}`, body).then(response => {
            return response;
        });
    }
}
