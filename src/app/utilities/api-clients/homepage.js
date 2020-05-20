import http from "../http";

export default class collections {
    static get(collectionID) {
        return http.get(`/zebedee/data/${collectionID}?uri=/`);
    }
}
