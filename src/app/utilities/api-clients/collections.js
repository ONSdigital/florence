import http from '../http';

export default class collections {

    static getAll() {
        return http.get(`/zebedee/collections`)
            .then(response => {
                return response;
            })
    }

    static addDataset() {
        // return http.put(`/zebedee/collections/${collectionID}/dataset/${datasetID}`, body , true)
        //     .then(response => {
        //         return response;
        //     })

        // mocked ok response from Zebedee
        return new Promise(resolve => {
            setTimeout(() => { resolve(); }, 2000);
        })
    }

    static removeDataset() {
        // return http.delete(`/zebedee/collections/${collectionID}/dataset/${datasetID}`, true)
        //     .then(response => {
        //         return response;
        //     })

        // mocked ok response from Zebedee
        return new Promise(resolve => {
            setTimeout(() => { resolve(); }, 1000);
        })
    }

    static addVersion(collectionID, datasetID, edition, version) {
        // return http.put(`/zebedee/collections/${collectionID}/datasetID/${datasetID}/editions/${edition}/versions/${version}`, body , true)
        //     .then(response => {
        //         return response;
        //     })

        // mocked ok response from Zebedee
        return new Promise(resolve => {
            setTimeout(() => { resolve(); }, 2000);
        })
    }

    static removeVersion(collectionID, datasetID, edition, version) {
        // return http.delete(`/zebedee/collections/${collectionID}/datasetID/${datasetID}/editions/${edition}/versions/${version}`, true)
        //     .then(response => {
        //         return response;
        //     })

        // mocked ok response from Zebedee
        return new Promise(resolve => {
            setTimeout(() => { resolve(); }, 1000);
        })
    }

}
