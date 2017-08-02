import http from '../http';

export default class datasetImport {
    static create(recipeID) {
        const body = {
            recipe: recipeID
        };
        return http.post('/import/jobs', body , true)
            .then(response => {
                return response;
            })
    }

    static addFile(jobID, file) {
        return http.put(`/import/jobs/${jobID}/files`, file, true)
            .then(response => {
                return response;
            })
    }

    static getAll() {
        return http.get(`/import/jobs`, true)
            .then(response => {
                return response;
            })
    }

    static get(jobID) {
        return http.get(`/import/jobs/${jobID}`, true)
            .then(response => {
                return response;
            })
    }
}