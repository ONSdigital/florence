import http from "../http";

export default class taxonomy {
    static getAllProductPages = () => {
        return http.get("/allmethodologies/data").then(response => {
            return response.topics.results;
        });
    };
}
