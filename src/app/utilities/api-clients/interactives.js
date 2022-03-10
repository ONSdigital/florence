import http from "../http";

export default class interactives {
    static getAll() {
        return http.get(`/zebedee/v1/interactives`).then(response => {
            return response;
        });
    }

    static store(body) {
        // return http.post(`/zebedee/v1/interactives`, body).then(response => {
            return {
                "id": 11,
                "file": '/docs/file1.pdf',
                "metadata1": "metadata1 id 11",
                "metadata2": "metadata2 id 11",
                "metadata3": "metadata3 id 11",
            };
        // });
    };

    static show (interactiveId) {
        // return http.post(`/zebedee/v1/interactives/${interactiveId}`, body).then(response => {
            return {
                "id": 1,
                "file": '/docs/file1.pdf',
                "metadata1": "metadata1 id 11",
                "metadata2": "metadata2 id 11",
                "metadata3": "metadata3 id 11",
            };
        // });
    };

    static update = (interactiveId, body) => {
        // return http.put(`/zebedee/v1/interactives/${interactiveId}`, body).then(response => {
            return {
                "id" : 1,
                "file": '/docs/file1.pdf',
                "metadata1": "metadata1 id 11",
                "metadata2": "metadata2 id 11",
                "metadata3": "metadata3 id 11",
            };
        // });
    }
}
