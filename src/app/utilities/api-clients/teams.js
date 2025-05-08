import http from "../http";
import { API_PROXY } from "./constants";
export default class teams {
    static createTeam(body) {
        return http.post(`${API_PROXY.VERSIONED_PATH}/groups`, body).then(response => {
            return response;
        });
    }

    static addMemberToTeam(id, userID) {
        return http.post(`${API_PROXY.VERSIONED_PATH}/groups/${id}/members`, { user_id: userID }).then(response => {
            return response;
        });
    }

    static deleteMemberFromTeam(id, body) {
        return http.post(`${API_PROXY.VERSIONED_PATH}/groups/${id}/members`, body).then(response => {
            return response;
        });
    }

    static getGroups() {
        return http.get(`${API_PROXY.VERSIONED_PATH}/groups?sort=name:asc`).then(response => {
            return response;
        });
    }

    static getGroup(id) {
        return http.get(`${API_PROXY.VERSIONED_PATH}/groups/${id}`).then(response => {
            return response;
        });
    }

    static updateGroup(id, body) {
        return http.put(`${API_PROXY.VERSIONED_PATH}/groups/${id}`, body).then(response => {
            return response;
        });
    }

    static updateGroupMembers(id, body) {
        return http.put(`${API_PROXY.VERSIONED_PATH}/groups/${id}/members`, body).then(response => {
            return response;
        });
    }

    static deleteGroup(id) {
        return http.delete(`${API_PROXY.VERSIONED_PATH}/groups/${id}`).then(response => {
            return response;
        });
    }

    static getGroupMembers(id) {
        return http.get(`${API_PROXY.VERSIONED_PATH}/groups/${id}/members?sort=forename:asc`).then(response => {
            return response;
        });
    }

    static addGroupsToUser(name, body) {
        return http.post(`${API_PROXY.VERSIONED_PATH}/groups/${name}`, body).then(response => {
            return response;
        });
    }
}
