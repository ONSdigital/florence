import http from "../http";

export default class collections {
    static get(collectionID) {
        return http.get(`/zebedee/collectionDetails/${collectionID}`);
    }

    static getAll() {
        return http.get(`/zebedee/collections`).then(response => {
            return response;
        });
    }

    static create(body) {
        return http.post(`/zebedee/collection`, body).then(response => {
            return response;
        });
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

    static getContentCollectionDetails(collectionID) {
        return http.get(`/zebedee/collection/${collectionID}`);
    }

    static setContentStatusToComplete(collectionID, contentURI) {
        return http.post(`/zebedee/complete/${collectionID}?uri=${contentURI}data.json`);
    }

    static async setPageContentAsReviewed(collectionID, contentURI) {
        return http.post(`/zebedee/review/${collectionID}?uri=${contentURI}data.json`);
    }

    static async savePageContent(collectionID, contentURI, body) {
        const response = await http.post(`/zebedee/content/${collectionID}?uri=${contentURI}data.json`, body, true);
        return response;
    }

    static deletePage(collectionID, pageURI) {
        return http.delete(`/zebedee/page/${collectionID}?uri=${pageURI}`);
    }

    static cancelDelete(collectionID, pageURI) {
        return http.delete(`/zebedee/DeleteContent/${collectionID}?uri=${pageURI}`);
    }

    static addDataset(collectionID, datasetID) {
        const body = { state: "InProgress" };
        return http.put(`/zebedee/collections/${collectionID}/datasets/${datasetID}`, body, true).then(response => {
            return response;
        });
    }

    static setDatasetStatusToComplete(collectionID, datasetID) {
        const body = { state: "Complete" };
        return http.put(`/zebedee/collections/${collectionID}/datasets/${datasetID}`, body, true).then(response => {
            return response;
        });
    }

    static setDatasetStatusToReviewed(collectionID, datasetID) {
        const body = { state: "Reviewed" };
        return http.put(`/zebedee/collections/${collectionID}/datasets/${datasetID}`, body, true).then(response => {
            return response;
        });
    }

    static getVersionsInCollectionByDatasetID(datasetID, collectionContent) {
        return collectionContent.find(page => {
            return page.type === "dataset_version" && page.datasetID === datasetID;
        });
    }

    static removeDatasetVersion(collectionID, datasetID, editionID, versionID) {
        return http.delete(`/zebedee/collections/${collectionID}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}`, true);
    }

    static removeDataset(collectionID, datasetID, collectionContent) {
        const versionInCollection = this.getVersionsInCollectionByDatasetID(datasetID, collectionContent);
        if (!versionInCollection) {
            return http.delete(`/zebedee/collections/${collectionID}/datasets/${datasetID}`, true);
        } else {
            return this.removeDatasetVersion(collectionID, datasetID, versionInCollection.edition, versionInCollection.version).then(() => {
                return http.delete(`/zebedee/collections/${collectionID}/datasets/${datasetID}`, true);
            });
        }
    }

    static addDatasetVersion(collectionID, datasetID, editionID, versionID) {
        const body = { state: "InProgress" };
        return http
            .put(`/zebedee/collections/${collectionID}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}`, body, true)
            .then(response => {
                return response;
            });
    }

    static setDatasetVersionStatusToComplete(collectionID, datasetID, editionID, versionID) {
        const body = { state: "Complete" };
        return http.put(`/zebedee/collections/${collectionID}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}`, body, true);
    }

    static setDatasetVersionStatusToReviewed(collectionID, datasetID, editionID, versionID) {
        const body = { state: "Reviewed" };
        return http.put(`/zebedee/collections/${collectionID}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}`, body, true);
    }

    static async checkContentIsInCollection(pageURI) {
        return http.get(`/zebedee/checkcollectionsforuri?uri=${pageURI}`);
    }

    static getInProgressContent(collectionID) {
        return http.get(`/zebedee/collectionDetails/${collectionID}`).then(response => {
            return response.inProgress;
        });
    }

    static getURLForVersionInCollection(datasetID, collectionContent) {
        const version = this.getVersionsInCollectionByDatasetID(datasetID, collectionContent);
        if (!version) {
            return null;
        }
        const versionURL = `/datasets/${datasetID}/editions/${version.edition}/versions/${version.version}`;
        return versionURL;
    }
    // to create policy we use put not post as we are 'forcing' it to have the collection id
    static createPolicy(id, body) {
        return http.put(`/api/v1/policies/${id}`, body).then(response => {
            return response;
        });
    }
    static getPolicy(id) {
        return http.get(`/api/v1/policies/${id}`).then(response => {
            return response;
        });
    }

    static updatePolicy(id, body) {
        return http.put(`/api/v1/policies/${id}`, body).then(response => {
            return response;
        });
    }
}
