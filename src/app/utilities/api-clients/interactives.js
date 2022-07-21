import axios from "axios";

const baseURL = "/api/v1";

export default class Interactives {
    static getAll() {
        return axios.get(`${baseURL}/interactives`);
    }

    static get(query) {
        return axios.get(`${baseURL}/interactives?${query}`);
    }

    static store(body) {
        return axios.post(`${baseURL}/interactives`, body, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
        });
    }

    static show(interactiveId) {
        return axios.get(`${baseURL}/interactives/${interactiveId}`);
    }

    static update = (interactiveId, body) => {
        return axios.put(`${baseURL}/interactives/${interactiveId}`, body, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
        });
    };

    static destroy = interactiveId => {
        return axios.delete(`${baseURL}/interactives/${interactiveId}`);
    };
}
