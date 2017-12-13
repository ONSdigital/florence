import http from '../http';

export default class collections {

    static getAll() {
        return http.get(`/zebedee/collections`)
            .then(response => {
                return response;
            })
    }

    static create(body) {
        return http.post(`/zebedee/collection`, body)
            .then(response => {
                return response;
            })
    }

}