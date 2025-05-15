import http from "../http";
import { API_PROXY } from "./constants";

export default class collections {
    static get(collectionID) {
        return http.get(`${API_PROXY.VERSIONED_PATH}/collectionDetails/${collectionID}`);
    }

    static getAll() {
        return http.get(`${API_PROXY.VERSIONED_PATH}/collections`).then(response => {
            return response;
        });
    }

    static create(body) {
        return http.post(`${API_PROXY.VERSIONED_PATH}/collection`, body).then(response => {
            return response;
        });
    }

    static approve(collectionID) {
        return http.post(`${API_PROXY.VERSIONED_PATH}/approve/${collectionID}`);
    }

    static delete(collectionID) {
        return http.delete(`${API_PROXY.VERSIONED_PATH}/collection/${collectionID}`);
    }

    static update(collectionID, body) {
        body.id = collectionID;
        return http.put(`${API_PROXY.VERSIONED_PATH}/collection/${collectionID}`, body);
    }

    static getContentCollectionDetails(collectionID) {
        return http.get(`${API_PROXY.VERSIONED_PATH}/collection/${collectionID}`);
    }

    static setContentStatusToComplete(collectionID, contentURI) {
        return http.post(`${API_PROXY.VERSIONED_PATH}/complete/${collectionID}?uri=${contentURI}data.json`);
    }

    static async setPageContentAsReviewed(collectionID, contentURI) {
        return http.post(`${API_PROXY.VERSIONED_PATH}/review/${collectionID}?uri=${contentURI}data.json`);
    }

    static async savePageContent(collectionID, contentURI, body) {
        const response = await http.post(`${API_PROXY.VERSIONED_PATH}/content/${collectionID}?uri=${contentURI}data.json`, body, true);
        return response;
    }

    static deletePage(collectionID, pageURI) {
        return http.delete(`${API_PROXY.VERSIONED_PATH}/page/${collectionID}?uri=${pageURI}`);
    }

    static cancelDelete(collectionID, pageURI) {
        return http.delete(`${API_PROXY.VERSIONED_PATH}/DeleteContent/${collectionID}?uri=${pageURI}`);
    }

    static addDataset(collectionID, datasetID) {
        const body = { state: "InProgress" };
        return http.put(`${API_PROXY.VERSIONED_PATH}/collections/${collectionID}/datasets/${datasetID}`, body, true).then(response => {
            return response;
        });
    }

    static setDatasetStatusToComplete(collectionID, datasetID) {
        const body = { state: "Complete" };
        return http.put(`${API_PROXY.VERSIONED_PATH}/collections/${collectionID}/datasets/${datasetID}`, body, true).then(response => {
            return response;
        });
    }

    static setDatasetStatusToReviewed(collectionID, datasetID) {
        const body = { state: "Reviewed" };
        return http.put(`${API_PROXY.VERSIONED_PATH}/collections/${collectionID}/datasets/${datasetID}`, body, true).then(response => {
            return response;
        });
    }

    static getVersionsInCollectionByDatasetID(datasetID, collectionContent) {
        return collectionContent.find(page => {
            return page.type === "dataset_version" && page.datasetID === datasetID;
        });
    }

    static removeDatasetVersion(collectionID, datasetID, editionID, versionID) {
        return http.delete(
            `${API_PROXY.VERSIONED_PATH}/collections/${collectionID}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}`,
            true
        );
    }

    static removeDataset(collectionID, datasetID, collectionContent) {
        const versionInCollection = this.getVersionsInCollectionByDatasetID(datasetID, collectionContent);
        if (!versionInCollection) {
            return http.delete(`${API_PROXY.VERSIONED_PATH}/collections/${collectionID}/datasets/${datasetID}`, true);
        } else {
            return this.removeDatasetVersion(collectionID, datasetID, versionInCollection.edition, versionInCollection.version).then(() => {
                return http.delete(`${API_PROXY.VERSIONED_PATH}/collections/${collectionID}/datasets/${datasetID}`, true);
            });
        }
    }

    static addDatasetVersion(collectionID, datasetID, editionID, versionID) {
        const body = { state: "InProgress" };
        return http
            .put(
                `${API_PROXY.VERSIONED_PATH}/collections/${collectionID}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}`,
                body,
                true
            )
            .then(response => {
                return response;
            });
    }

    static setDatasetVersionStatusToComplete(collectionID, datasetID, editionID, versionID) {
        const body = { state: "Complete" };
        return http.put(
            `${API_PROXY.VERSIONED_PATH}/collections/${collectionID}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}`,
            body,
            true
        );
    }

    static setDatasetVersionStatusToReviewed(collectionID, datasetID, editionID, versionID) {
        const body = { state: "Reviewed" };
        return http.put(
            `${API_PROXY.VERSIONED_PATH}/collections/${collectionID}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}`,
            body,
            true
        );
    }

    static async checkContentIsInCollection(pageURI) {
        return http.get(`${API_PROXY.VERSIONED_PATH}/checkcollectionsforuri?uri=${pageURI}`);
    }

    static getInProgressContent(collectionID) {
        return http.get(`${API_PROXY.VERSIONED_PATH}/collectionDetails/${collectionID}`).then(response => {
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
