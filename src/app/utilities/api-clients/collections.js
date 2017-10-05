import http from '../http';

export default class collections {

    static getAll() {
        return http.get(`/zebedee/collections`)
            .then(response => {
                return response;
            })
    }

    static addDataset(collectionID, datasetID) {
        // return http.put(`/zebedee/collections/${collectionID}/dataset/${datasetID}`, body , true)
        //     .then(response => {
        //         return response;
        //     })

        // mocked ok response from Zebedee
        return new Promise(resolve => {
            setTimeout(() => { resolve(); }, 2000);
        })
    }

    static removeDataset(collectionID, datasetID) {
        // return http.delete(`/zebedee/collections/${collectionID}/dataset/${datasetID}`, true)
        //     .then(response => {
        //         return response;
        //     })

        // mocked ok response from Zebedee
        return new Promise(resolve => {
            setTimeout(() => { resolve(); }, 1000);
        })
    }

    static addInstance(collectionID, instanceID) {
        // return http.put(`/zebedee/collections/${collectionID}/instances/${instanceID}`, body , true)
        //     .then(response => {
        //         return response;
        //     })

        // mocked ok response from Zebedee
        return new Promise(resolve => {
            setTimeout(() => { resolve(); }, 2000);
        })
    }

    static removeInstance(collectionID, instanceID) {
        // return http.delete(`/zebedee/collections/${collectionID}/instances/${instanceID}`, true)
        //     .then(response => {
        //         return response;
        //     })

        // mocked ok response from Zebedee
        return new Promise(resolve => {
            setTimeout(() => { resolve(); }, 1000);
        })
    }

}
