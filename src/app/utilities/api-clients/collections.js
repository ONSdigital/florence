import http from '../http';

export default class collections {

    static getAll() {
        return http.get(`/zebedee/collections`)
            .then(response => {
                return response;
            })
    }

    static addDataset(collectionID, datasetID) {
        const body = {state: "inProgress"};
        return http.put(`/zebedee/collections/${collectionID}/datasets/${datasetID}`, body , true)
            .then(response => {
                return response;
            });
    }

    static setDatasetStatusToComplete(collectionID, datasetID) {
        const body = {state: "complete"};
        return http.put(`/zebedee/collections/${collectionID}/datasets/${datasetID}`, body , true)
            .then(response => {
                return response;
            });
    }

    static setDatasetStatusToReviewed(collectionID, datasetID) {
        const body = {state: "reviewed"};
        return http.put(`/zebedee/collections/${collectionID}/datasets/${datasetID}`, body , true)
            .then(response => {
                return response;
            });
    }

    static removeDataset(collectionID, datasetID) {
        return http.delete(`/zebedee/collections/${collectionID}/datasets/${datasetID}`, true)
            .then(response => {
                return response;
            });
    }

    static addDatasetVersion(collectionID, datasetID, editionID, versionID) {
        const body = {state: "inProgress"};
        return http.put(`/zebedee/collections/${collectionID}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}`, body , true)
            .then(response => {
                return response;
            });
    }

    static setDatasetVersionStatusToComplete(collectionID, datasetID, editionID, versionID) {
        const body = {state: "complete"};
        return http.put(`/zebedee/collections/${collectionID}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}`, body , true)
            .then(response => {
                return response;
            });
    }

    static setDatasetVersionStatusToReviewed(collectionID, datasetID, editionID, versionID) {
        const body = {state: "reviewed"};
        return http.put(`/zebedee/collections/${collectionID}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}`, body , true)
            .then(response => {
                return response;
            });
    }

    static removeDatasetVersion(collectionID, datasetID, editionID, versionID) {
        return http.delete(`/zebedee/collections/${collectionID}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}`, true)
            .then(response => {
                return response;
            });
    }

}
