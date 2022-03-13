import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:8081/interactives/v1',
});

export default class Interactives {
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
        return instance.get(`/interactives/${interactiveId}`)
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
