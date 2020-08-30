import http from "../http";

const imageAPIURL = "/image";

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

    static getImageDownload = (imageID, type) => {
        return http.get(`${imageAPIURL}/images/${imageID}/downloads/${type}`);
    };
}
