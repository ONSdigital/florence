import http from '../http';

export default class collections {

    static getAll() {
        return http.get(`/zebedee/collections`)
            .then(response => {
                return response;
            })
    }

    static addAPIDataset(collectionID, instanceID) {
        // return http.put(`/zebedee/collections/${collectionID}/dataset/${instanceID}`, body , true)
        //     .then(response => {
        //         return response;
        //     })

        // mocked ok response from Zebedee
        return new Promise(resolve => {
            setTimeout(() => { resolve(); }, 2000);
        })

    }

    static removeAPIDataset(collectionID, instanceID) {
        // return http.delete(`/zebedee/collections/${collectionID}/dataset/${instanceID}`, true)
        //     .then(response => {
        //         return response;
        //     })

        // mocked ok response from Zebedee
        return new Promise(resolve => {
            setTimeout(() => { resolve(); }, 1000);
        })


    }

}
