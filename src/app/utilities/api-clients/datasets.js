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

    static updateDimensionLabelAndDescription(instanceID, dimension, name, description) {
        const body = {
            "label": name,
            "description": description
        }

        return http.put(`/instances/${instanceID}/dimensions/${dimension}`, body, true)
            .then(response => {
                return response;
            });
    }

    static updateVersionMetadata(datasetID, edition, version, metadata) {
        if (typeof metadata !== "object") {
            return Promise.reject({status: 400});
        }
        return http.put(`/dataset/datasets/${datasetID}/editions/${edition}/versions/${version}`, metadata, true)
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

    static confirmEditionAndCreateVersion(instanceID, edition, metadata) {
        let body = {
          "edition": edition,
          "state": "edition-confirmed"
        }
        if (metadata && typeof metadata === "object") {
            body = {
                ...body,
                ...metadata
            }
        }
        return http.put(`/dataset/instances/${instanceID}`, body, true);
    }

    static updateDatasetMetadata(datasetID, metadata) {
        return http.put(`/dataset/datasets/${datasetID}`, metadata, true)
            .then(response => {
                return response;
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
        return http.get(`/dataset/instances?state=completed,edition-confirmed,associated`)
            .then(response => {
                return response;
            });
    }
}
