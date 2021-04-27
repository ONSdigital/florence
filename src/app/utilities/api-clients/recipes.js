import http from "../http";

export default class recipes {
    static getAll() {
        return http.get("/recipes?limit=1000", true).then(response => {
            return response;
        });
    }

    static get(id) {
        return http.get(`/recipes/${id}`, true).then(response => {
            return response;
        });
    }
}
