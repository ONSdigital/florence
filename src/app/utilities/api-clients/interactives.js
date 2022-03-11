import axios from 'axios'

const instance = axios.create({
    baseURL: '/interactives/v1/',
    // headers: {'X-Custom-Header': 'foobar'}
});

export default class interactives {
    static getAll() {
        return instance.get(`/interactives`)
    }

    static store(body) {
        return instance.post(`/interactives`, body, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    };

    static show (interactiveId) {
        return instance.get(`/interactives/${interactiveId}`).then(response => {
            return response;
        });
    };

    static update = (interactiveId, body) => {
        return instance.put(`/interactives/${interactiveId}`, body, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }

    static destroy = (interactiveId) => {
        return instance.delete(`/interactives/${interactiveId}`)
    }
}
