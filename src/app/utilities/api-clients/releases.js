import http from "../http";

export default class releases {
    static getUpcoming(pageNumber, query, size) {
        const parameters = [];

        if (pageNumber) {
            parameters.push("offset=" + (pageNumber - 1) * size);
        }

        if (query) {
            parameters.push("query=" + query);
        }

        if (size) {
            parameters.push("limit=" + size);
        }
        const URL = "/releasecalendar/data?release-type=type-upcoming&" + parameters.join("&");
        return http.get(URL);
    }
}
