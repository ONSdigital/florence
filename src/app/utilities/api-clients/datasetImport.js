import http from "../http";

import { API_PROXY } from "./constants";

export default class datasetImport {
    static create(recipeID) {
        const body = {
            recipe: recipeID,
        };
        return http.post(`${API_PROXY.VERSIONED_PATH}/jobs`, body, true).then(response => {
            return response;
        });
    }

    static addFile(jobID, fileAlias, fileURL) {
        const body = {
            alias_name: fileAlias,
            url: fileURL,
        };
        return http.put(`${API_PROXY.VERSIONED_PATH}/jobs/${jobID}/files`, body, true).then(response => {
            return response;
        });
    }

    static updateStatus(jobID, status, links = null) {
        if (!jobID) {
            console.warn("No job ID given to update status for. Request cancelled");
            return Promise.reject();
        }
        const body = {
            state: status,
        };

        if (links) {
            body.links = links;
        }

        return http.put(`${API_PROXY.VERSIONED_PATH}/jobs/${jobID}`, body, true).then(response => {
            return response;
        });
    }

    static getAll() {
        return http.get(`${API_PROXY.VERSIONED_PATH}/jobs`, true).then(response => {
            return response;
        });
    }

    static getCompleted() {
        return http.get(`${API_PROXY.VERSIONED_PATH}/jobs?state=completed`, true).then(response => {
            return response;
        });
    }

    static get(jobID) {
        return http.get(`${API_PROXY.VERSIONED_PATH}/jobs/${jobID}`, true).then(response => {
            return response;
        });
    }

    static getDimensions(instanceID) {
        /* Uncomment this is you need to stub this data */
        // return Promise.resolve([
        //     {
        //         dimension_id: `${instanceID}-time`,
        //         value: "Time",
        //         node_id: "id-thing"
        //     },
        //     {
        //         dimension_id: `${instanceID}-special-aggregate`,
        //         value: "Special aggregate",
        //         node_id: "id-thing-2"
        //     }
        // ])
        return http.get(`/dataset/instances/${instanceID}`, true).then(response => {
            return response.dimensions;
        });
    }
}
