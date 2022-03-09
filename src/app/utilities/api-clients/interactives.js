import http from "../http";

export default class interactives {
    static getAll() {
        return http.get(`/zebedee/v1/interactives`).then(response => {
            return response;
        });
    }

    static store(body) {
        return http.post(`/zebedee/v1/interactives`, body, true).then(response => {
            return response;
        });
    };

    static show (interactiveId) {
        return http.post(`/zebedee/v1/interactives/${interactiveId}`, body).then(response => {
            return response;
        });
    };

    static update = (interactiveId, body) => {
        return http.put(`/zebedee/v1/interactives/${interactiveId}`, body).then(response => {
            return response;
        });
    }
}
