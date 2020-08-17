import http from "../http";

const imageAPIURL = "/image";

export default class image {
    static create = body => {
        return http.post(`${imageAPIURL}/images`, body);
    };

    static update = body => {
        return http.put(`${imageAPIURL}/images`, body);
    };
}
