import http from '../http';

export default class collections {

    static create(body) {
        return http.post(`/zebedee/collection`, body)
            .then(response => {
                return response;
            })
    }



}