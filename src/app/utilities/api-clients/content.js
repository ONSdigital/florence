import http from '../http';

export default class content {

    static getAllDeleted() {
        return http.get(`/zebedee/deletedContent`)
            .then(response => {
                return response;
            })
    }

    static restoreDeleted(deletedContentId, collectionId) {
        return http.post(`/zebedee/deletedcontent/${deletedContentId}?collectionid=${collectionId}`)
            .then(response => {
                return response;
            })
    }


}