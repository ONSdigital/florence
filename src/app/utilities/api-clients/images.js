import http from "../http";
import { API_PROXY } from "./constants";

const imageAPIURL = `${API_PROXY.VERSIONED_PATH}`;

export default class image {
    static create = body => {
        return http.post(`${imageAPIURL}/images`, body);
    };

    static get = imageID => {
        return http.get(`${imageAPIURL}/images/${imageID}`);
    };

    static update = (imageID, body) => {
        return http.put(`${imageAPIURL}/images/${imageID}`, body);
    };

    static getDownloads = (imageID, type) => {
        return http.get(`${imageAPIURL}/images/${imageID}/downloads/${type}`);
    };
}
