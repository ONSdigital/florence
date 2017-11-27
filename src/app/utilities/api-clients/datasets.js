import http from '../http';

export default class datasets {

    static get(datasetID) {

        return http.get(`/dataset/datasets/${datasetID}`)
            .then(response => {
                return response;
            });
    }

    static getAll() {

        return http.get(`/dataset/datasets`)
            .then(response => {
                return response;
            });
    }

    static getInstance(instanceID) {
        return http.get(`/dataset/instances/${instanceID}`)
             .then(response => {
                 return response;
             });
    }

    static getVersion(datasetID, edition, version) {
        return http.get(`/dataset/datasets/${datasetID}/editions/${edition}/versions/${version}`)
             .then(response => {
                 return response;
             });
    }

    static getVersionDimensions(datasetID, edition, version) {
        return http.get(`/dataset/datasets/${datasetID}/editions/${edition}/versions/${version}/dimensions`)
             .then(response => {
                 return response;
             });
    }

    static updateVersion(datasetID, edition, version) {
        const body = {
          "edition": edition,
        }
        return http.put(`/dataset/datasets/${datasetID}/editions/${edition}/versions/${version}`, body, true)
            .then(response => {
                return response;
            });
    }

    static updateInstanceEdition(instanceID, edition) {
        const body = {
          "edition": edition,
        }
        return http.put(`/dataset/instances/${instanceID}`, body, true)
            .then(response => {
                return response;
            });
    }

    static confirmEditionAndCreateVersion(instanceID, edition) {
        const body = {
          "edition": edition,
          "state": "edition-confirmed",
        }
        return http.put(`/dataset/instances/${instanceID}`, body, true)
            .then(response => {
                return response;
            });
    }

    static approveInstance(instanceID) {
        // TODO unstub this once a version/instance can be reviewed and approved in the API
        return new Promise(resolve => {
            setTimeout(resolve, 2000);
        })
    }

    static updateDatasetMetadata(datasetID, metadata) {
        return http.put(`/dataset/datasets/${datasetID}`, metadata, true)
            .then(response => {
                return response;
            })
    }

    static approveDatasetMetadata(datasetID) {
        // TODO unstub this once dataset metadata can be reviewed and approved in the API
        return new Promise(resolve => {
            setTimeout(resolve, 2000);
        })
    }

    static getAllInstances() {
        return http.get(`/dataset/instances`)
            .then(response => {
                return response;
            });
    }

    static getCompletedInstances() {
         return http.get(`/dataset/instances?state=completed`)
             .then(response => {
                 return response;
             });
    }

    static getNewVersionsAndCompletedInstances() {
        return http.get(`/dataset/instances?state=completed,edition-confirmed`)
            .then(response => {
                return response;
            });
    }
}
