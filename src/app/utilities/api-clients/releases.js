import http from '../http';

export default class releases {

    static getUpcoming(pageNumber, query, size) {
        const parameters = [];
        
        if (pageNumber) {
            parameters.push("page=" + pageNumber);
        }
        
        if (query) {
            parameters.push("query=" + query);
        }
        
        if (size) {
            parameters.push("size=" + size);
        }

        const URL = "/releasecalendar/data?view=upcoming&" + parameters.join("&");

        return http.get(URL)
    }

}