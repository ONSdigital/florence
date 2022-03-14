import axios from 'axios'

const path = require('path');
// const xhr = path.join(path.dirname(require.resolve('axios')),'lib/adapters/xhr');
// const lib = xhr.join(path.dirname(require.resolve('axios')),'lib/adapters/http');
const lib = path.join(path.dirname(require.resolve('axios')),'lib/adapters/http');
console.log('lib', lib)
const http = require(lib);

const instance = axios.create({
    baseURL: 'http://localhost:8081/interactives/v1',
    adapter: http,
    // adapter: require('axios/lib/adapters/xhr'),
});

export default class InteractivesTest {
    static getAll() {
        return instance.get(`/interactives`)
    }

    static store(body) {
        return instance.post(`/interactives`, body, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
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
