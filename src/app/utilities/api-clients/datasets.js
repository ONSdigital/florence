import http from '../http';

export default class datasets {
    
    static getAll() {
        return http.get(`/dataset/datasets`)
            .then(response => {
                return response;
            });
    }
    
    static getCompleted() {
        return http.get(`/dataset/instances?state=completed`)
            .then(response => {
                return response;
            });
    }
}