import http from "../http";

export default class content {
    static get = (url, collectionID) => {
        return http.get(`${API_PROXY.VERSIONED_PATH}/data/${collectionID}?uri=${url}`);
    };
    static getAllDeleted() {
        return http.get(`${API_PROXY.VERSIONED_PATH}/deletedContent`);
    }

    static restoreDeleted(deletedContentId, collectionId) {
        return http.post(`${API_PROXY.VERSIONED_PATH}/deletedcontent/${deletedContentId}?collectionid=${collectionId}`);
    }
}
