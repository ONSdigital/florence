import axios from 'axios'

const instance = axios.create({
    baseURL: '/interactives/v1/',
    // headers: {'X-Custom-Header': 'foobar'}
});

export default class interactives {
    static getAll() {
        return instance.get(`/interactives`).then(response => {
            return response;
        });
    }

    static store(body) {
        return instance.post(`/interactives/`, body).then(response => {
            return response;
        });
    };

    static show (interactiveId) {
        return instance.get(`/interactives/${interactiveId}`).then(response => {
            return response;
        });
    };

    static update = (interactiveId, body) => {
        return instance.put(`/interactives/${interactiveId}`, body).then(response => {
            return response;
        });
    }

    static destroy = (interactiveId) => {
        return instance.delete(`/interactives/${interactiveId}`).then(response => {
            return response;
        });
    }
}
