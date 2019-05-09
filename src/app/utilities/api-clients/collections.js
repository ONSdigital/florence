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

    // In CMD we're using a new endpoint to delete pages (https://github.com/ONSdigital/zebedee/blob/cmd-develop/zebedee-cms/src/main/java/com/github/onsdigital/zebedee/api/Page.java)
    // which means that this method only works once Zebedee has been updated to CMD. For now, we need to be able to continue using the old
    // `deletePage` method so that we can still delete content before CMD is merged into prod Zebedee. This is why I've created this very
    // verbose and unusual method name, so our controllers can choose which one to use.
    static deletePageIncludingDatasetImport(collectionID, pageURI) {
        return http.delete(`/zebedee/page/${collectionID}?uri=${pageURI}`);
    }

    static deletePage(collectionID, pageURI) {
        return http.delete(`/zebedee/content/${collectionID}?uri=${pageURI}`);
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

    static getVersionsInCollectionByDatasetID(datasetID, collectionContent) {
        return collectionContent.find(page => {
            return page.type === "dataset_version" && page.datasetID === datasetID;
        })
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

    static async checkContentIsInCollection(pageURI) {
        return http.get(`/zebedee/checkcollectionsforuri?uri=${pageURI}`);
    }

    static getInProgressContent(collectionID) {
        return http.get(`/zebedee/collectionDetails/${collectionID}`)
            .then(response => {
                return response.inProgress;
            })
    }

    static getURLForVersionInCollection(datasetID, collectionContent) {
        const version = this.getVersionsInCollectionByDatasetID(datasetID, collectionContent);
        if (!version) {
            return null;
        }
        const versionURL = `/datasets/${datasetID}/editions/${version.edition}/versions/${version.version}`
        return versionURL;
    }

}
