import http from "../http";

export default class homepage {
    static get(collectionID) {
        return http.get(`/zebedee/data/${collectionID}?uri=/`);
    }
}
