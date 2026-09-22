import http from "../http";
import { API_PROXY } from "./constants";

export default class content {
    static get = (url, collectionID) => {
        return http.get(`${API_PROXY.VERSIONED_PATH}/data/${collectionID}?uri=${url}`);
    };
}
