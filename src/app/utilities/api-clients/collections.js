import http from '../http';

export default class collections {

    static get(collectionID) {
        return http.get(`/zebedee/collectionDetails/${collectionID}`)
    }
    
    static getAll() {
        return http.get(`/zebedee/collections`)
            .then(response => {
                return response;
            })
    }

    static create(body) {
        return http.post(`/zebedee/collection`, body)
            .then(response => {
                return response;
            })
    }

    static approve(collectionID) {
        return http.post(`/zebedee/approve/${collectionID}`);
    }

    static delete(collectionID) {
        return http.delete(`/zebedee/collection/${collectionID}`);
    }

    static update(collectionID, body) {
        body.id = collectionID;
        return http.put(`/zebedee/collection/${collectionID}`, body);
    }

    static deletePage(collectionID, pageURI) {
        return http.delete(`/zebedee/page/${collectionID}?uri=${pageURI}`);
    }

    static cancelDelete(collectionID, pageURI) {
        return http.delete(`/zebedee/DeleteContent/${collectionID}?uri=${pageURI}`);
    }

    static addDataset(collectionID, datasetID) {
        const body = {state: "InProgress"};
        return http.put(`/zebedee/collections/${collectionID}/datasets/${datasetID}`, body , true)
            .then(response => {
                return response;
            });
    }

    static setDatasetStatusToComplete(collectionID, datasetID) {
        const body = {state: "Complete"};
        return http.put(`/zebedee/collections/${collectionID}/datasets/${datasetID}`, body , true)
            .then(response => {
                return response;
            });
    }

    static setDatasetStatusToReviewed(collectionID, datasetID) {
        const body = {state: "Reviewed"};
        return http.put(`/zebedee/collections/${collectionID}/datasets/${datasetID}`, body , true)
            .then(response => {
                return response;
            });
    }

    static removeDataset(collectionID, datasetID) {
        console.log(`/zebedee/collections/${collectionID}/datasets/${datasetID}`);
        // return http.delete(`/zebedee/collections/${collectionID}/datasets/${datasetID}`, true)
        //     .then(response => {
        //         return response;
        //     });
    }

    static addDatasetVersion(collectionID, datasetID, editionID, versionID) {
        const body = {state: "InProgress"};
        return http.put(`/zebedee/collections/${collectionID}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}`, body , true)
            .then(response => {
                return response;
            });
    }

    static setDatasetVersionStatusToComplete(collectionID, datasetID, editionID, versionID) {
        const body = {state: "Complete"};
        return http.put(`/zebedee/collections/${collectionID}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}`, body , true);
    }

    static setDatasetVersionStatusToReviewed(collectionID, datasetID, editionID, versionID) {
        const body = {state: "Reviewed"};
        return http.put(`/zebedee/collections/${collectionID}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}`, body , true);
    }

    static removeDatasetVersion(collectionID, datasetID, editionID, versionID) {
        console.log(`/zebedee/collections/${collectionID}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}`);
        // return http.delete(`/zebedee/collections/${collectionID}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}`, true)
        //     .then(response => {
        //         return response;
        //     });
    }

    static async checkContentIsInCollection(pageURI) {
        return http.get(`/zebedee/checkcollectionsforuri?uri=${pageURI}`)
    }

    static getInProgressContent(collectionID) {
        return http.get(`/zebedee/collectionDetails/${collectionID}`)
            .then(response => {
                return response.inProgress;
            })
    }

}
