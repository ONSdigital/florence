import http from "../http";
import { API_PROXY } from "./constants";

export default class recipes {
    static getAll() {
        return http.get(`${API_PROXY.VERSIONED_PATH}/recipes?limit=1000`, true).then(response => {
            return response;
        });
    }

    static get(id) {
        return http.get(`${API_PROXY.VERSIONED_PATH}/recipes/${id}`, true).then(response => {
            return response;
        });
    }
}
