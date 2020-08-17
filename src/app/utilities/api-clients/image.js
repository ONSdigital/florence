import http from "../http";

const imageAPIURL = "/image";

export default class image {
    static create = body => {
        return http.post(`${imageAPIURL}/images`, body);
    };
}
