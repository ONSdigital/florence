import http from "../http";

export default class interactives {
    static getAll() {
        // return http.get(`/interactives`).then(response => {
            return [
                {
                    "id": 1,
                    "file": '/docs/file1.pdf',
                    "metadata1": "metadata1 id 1",
                    "metadata2": "metadata2 id 1",
                    "metadata3": "metadata3 id 1",
                }, {
                    "id": 2,
                    "file": '/docs/file2.pdf',
                    "metadata1": "metadata1 id 2",
                    "metadata2": "metadata2 id 2",
                    "metadata3": "metadata3 id 2",
                }, {
                    "id": 3,
                    "file": '/docs/file3.pdf',
                    "metadata1": "metadata1 id 3",
                    "metadata2": "metadata2 id 3",
                    "metadata3": "metadata3 id 3",
                }, {
                    "id": 4,
                    "file": '/docs/file4.pdf',
                    "metadata1": "metadata1 id 4",
                    "metadata2": "metadata2 id 4",
                    "metadata3": "metadata3 id 4",
                }, {
                    "id": 5,
                    "file": '/docs/file5.pdf',
                    "metadata1": "metadata1 id 5",
                    "metadata2": "metadata2 id 5",
                    "metadata3": "metadata3 id 5",
                }, {
                    "id": 6,
                    "file": '/docs/file6.pdf',
                    "metadata1": "metadata1 id 6",
                    "metadata2": "metadata2 id 6",
                    "metadata3": "metadata3 id 6",
                }, {
                    "id": 7,
                    "file": '/docs/file7.pdf',
                    "metadata1": "metadata1 id 7",
                    "metadata2": "metadata2 id 7",
                    "metadata3": "metadata3 id 7",
                }, {
                    "id": 8,
                    "file": '/docs/file8.pdf',
                    "metadata1": "metadata1 id 8",
                    "metadata2": "metadata2 id 8",
                    "metadata3": "metadata3 id 8",
                }, {
                    "id": 9,
                    "file": '/docs/file9.pdf',
                    "metadata1": "metadata1 id 9",
                    "metadata2": "metadata2 id 9",
                    "metadata3": "metadata3 id 9",
                }, {
                    "id": 10,
                    "file": '/docs/file10.pdf',
                    "metadata1": "metadata1 id 10",
                    "metadata2": "metadata2 id 10",
                    "metadata3": "metadata3 id 10",
                }
            ];
        // });
    }

    static store(body) {
        // return http.post(`/interactives`, body).then(response => {
            return {
                "id": 11,
                "file": '/docs/file1.pdf',
                "metadata1": "metadata1 id 11",
                "metadata2": "metadata2 id 11",
                "metadata3": "metadata3 id 11",
            };
        // });
    };

    static show (interactiveId) {
        // return http.post(`/interactives/${interactiveId}`, body).then(response => {
            return {
                "id": 1,
                "file": '/docs/file1.pdf',
                "metadata1": "metadata1 id 11",
                "metadata2": "metadata2 id 11",
                "metadata3": "metadata3 id 11",
            };
        // });
    };

    static update = (interactiveId, body) => {
        // return http.put(`/interactives/${interactiveId}`, body).then(response => {
            return {
                "id" : 1,
                "file": '/docs/file1.pdf',
                "metadata1": "metadata1 id 11",
                "metadata2": "metadata2 id 11",
                "metadata3": "metadata3 id 11",
            };
        // });
    }
}
