import http from "../http";

export default class content {
    static get = (url, collectionID) => {
        return http.get(`/zebedee/data/${collectionID}?uri=${url}`);
    };
    static getAllDeleted() {
        return http.get(`/zebedee/deletedContent`);
    }

    static restoreDeleted(deletedContentId, collectionId) {
        return http.post(`/zebedee/deletedcontent/${deletedContentId}?collectionid=${collectionId}`);
    }
}
