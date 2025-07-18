import http from "../http";
import { API_PROXY } from "./constants";

const publishingDatasetControllerURL = "/dataset-controller";

export default class datasets {
    static create = (datasetID, body) => {
        return http.post(`${API_PROXY.VERSIONED_PATH}/datasets/${datasetID}`, body).then(response => {
            return response;
        });
    };

    static get = datasetID => {
        return http.get(`${API_PROXY.VERSIONED_PATH}/datasets/${datasetID}`).then(response => {
            return response;
        });
    };

    static getAll() {
        return http.get(`${API_PROXY.VERSIONED_PATH}/datasets`).then(response => {
            return response;
        });
    }

    static getAllList() {
        return http.get(`${publishingDatasetControllerURL}/datasets`).then(response => {
            return response;
        });
    }

    static getInstance(instanceID) {
        return http.get(`${API_PROXY.VERSIONED_PATH}/instances/${instanceID}`).then(response => {
            return response;
        });
    }

    static getEdition(datasetID, editionID) {
        return http.get(`${API_PROXY.VERSIONED_PATH}/datasets/${datasetID}/editions/${editionID}`).then(response => {
            return response;
        });
    }

    static getEditions(datasetID) {
        return http.get(`${API_PROXY.VERSIONED_PATH}/datasets/${datasetID}/editions`).then(response => {
            return response;
        });
    }

    static getVersion(datasetID, edition, version) {
        return http.get(`${API_PROXY.VERSIONED_PATH}/datasets/${datasetID}/editions/${edition}/versions/${version}`).then(response => {
            return response;
        });
    }

    static getVersions(datasetID, edition) {
        return http.get(`${API_PROXY.VERSIONED_PATH}/datasets/${datasetID}/editions/${edition}/versions`).then(response => {
            return response;
        });
    }

    static getLatestVersionForEditions = async (datasetID, editionsList) => {
        return new Promise((resolve, reject) => {
            const versionFetches = editionsList.map(edition => {
                return http
                    .get(`${API_PROXY.VERSIONED_PATH}/datasets/${datasetID}/editions/${edition.id}/versions/${edition.latestVersion}`)
                    .then(response => {
                        return response;
                    })
                    .catch(error => {
                        reject(error);
                        return;
                    });
            });

            const allLatestVersions = Promise.all(versionFetches)
                .then(version => {
                    return version;
                })
                .catch(error => {
                    console.error(error);
                    reject(error);
                    return;
                });
            resolve(allLatestVersions);
        });
    };

    static getLatestVersion = async datasetID => {
        const datasetURL = `${API_PROXY.VERSIONED_PATH}/datasets/${datasetID}`;

        return new Promise((resolve, reject) => {
            const dataset = http.get(datasetURL).catch(error => reject(error));

            if (!dataset || !dataset.current || !dataset.current.links.latest_version) {
                resolve();
                return;
            }

            const latestVersionPath = dataset.current.links.latest_version.href.replace(dataset.current.links.self.href, "");
            const latestVersionURL = datasetURL + latestVersionPath;

            const latestVersion = http.get(latestVersionURL).catch(error => reject(error));
            resolve(latestVersion);
        });
    };

    static getLatestVersionURL = async datasetID => {
        const datasetURL = `${API_PROXY.VERSIONED_PATH}/datasets/${datasetID}`;
        return http
            .get(datasetURL)
            .then(response => {
                const dataset = response.next || response.current || response;
                return new URL(dataset.links.latest_version.href).pathname;
            })
            .catch(error => error);
    };

    static getVersionDimensions(datasetID, edition, version) {
        return http.get(`${API_PROXY.VERSIONED_PATH}/datasets/${datasetID}/editions/${edition}/versions/${version}/dimensions`).then(response => {
            return response;
        });
    }

    static updateInstanceDimensions(instanceID, dimensions) {
        const body = { dimensions };
        return http.put(`${API_PROXY.VERSIONED_PATH}/instances/${instanceID}`, body);
    }

    static updateDimensionLabelAndDescription(instanceID, dimension, name, description) {
        const body = {
            label: name,
            description: description,
        };

        return http.put(`${API_PROXY.VERSIONED_PATH}/instances/${instanceID}/dimensions/${dimension}`, body, true).then(response => {
            return response;
        });
    }

    static updateVersionMetadata(datasetID, edition, version, metadata) {
        if (typeof metadata !== "object") {
            return Promise.reject({ status: 400 });
        }
        return http
            .put(`${API_PROXY.VERSIONED_PATH}/datasets/${datasetID}/editions/${edition}/versions/${version}`, metadata, true)
            .then(response => {
                return response;
            });
    }

    static updateInstanceEdition(instanceID, edition) {
        const body = {
            edition: edition,
        };
        return http.put(`${API_PROXY.VERSIONED_PATH}/instances/${instanceID}`, body, true).then(response => {
            return response;
        });
    }

    static confirmEditionAndCreateVersion(instanceID, edition, metadata) {
        let body = {
            edition: edition,
            state: "edition-confirmed",
        };
        if (metadata && typeof metadata === "object") {
            body = {
                ...body,
                ...metadata,
            };
        }
        return http.put(`${API_PROXY.VERSIONED_PATH}/instances/${instanceID}`, body, true);
    }

    static updateDatasetMetadata(datasetID, metadata) {
        return http.put(`${API_PROXY.VERSIONED_PATH}/datasets/${datasetID}`, metadata, true).then(response => {
            return response;
        });
    }

    static getAllInstances() {
        return http.get(`${API_PROXY.VERSIONED_PATH}/instances`).then(response => {
            return response;
        });
    }

    static getCompletedInstancesForDataset(datasetID) {
        return http.get(`${API_PROXY.VERSIONED_PATH}/instances?dataset=${datasetID}&state=completed`).then(response => {
            return response;
        });
    }

    static getCompletedInstances() {
        return http.get(`${API_PROXY.VERSIONED_PATH}/instances?state=completed`).then(response => {
            return response;
        });
    }

    static getNewVersionsAndCompletedInstances() {
        return http.get(`${API_PROXY.VERSIONED_PATH}/instances?state=completed,edition-confirmed,associated`).then(response => {
            return response;
        });
    }

    static getEditMetadata(datasetID, editionID, versionID) {
        return http.get(`${publishingDatasetControllerURL}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}`).then(response => {
            return response;
        });
    }

    static getCantabularMetadata(datasetID, lang) {
        return http.get(`${API_PROXY.VERSIONED_PATH}/cantabular-metadata/dataset/${datasetID}/lang/${lang}`, false, false);
    }

    static putEditMetadata(datasetID, editionID, versionID, body) {
        return http
            .put(`${publishingDatasetControllerURL}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}`, body, true)
            .then(response => {
                return response;
            });
    }

    static putMetadata(datasetID, editionID, versionID, body) {
        return http.put(`${publishingDatasetControllerURL}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}/metadata`, body, true);
    }

    static getVersionsList(datasetID, editionID) {
        return http.get(`${publishingDatasetControllerURL}/datasets/${datasetID}/editions/${editionID}/versions`).then(response => {
            return response;
        });
    }

    static getEditionsList(datasetID) {
        return http.get(`${publishingDatasetControllerURL}/datasets/${datasetID}/editions`).then(response => {
            return response;
        });
    }
}
