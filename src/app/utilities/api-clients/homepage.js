import http from "../http";

export default class homepage {
    static get(collectionID) {
        return http.get(`${API_PROXY.VERSIONED_PATH}/data/${collectionID}?uri=/`);
    }
}
