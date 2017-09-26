import http from '../http';

const stubbedDatasets =
    {
        "count": 0,
        "items": [
            {
                "id": "1234nshahb-ebggafsgsh",
                "contact": [
                    {
                        "email": "dave@ons.gov.uk",
                        "name": "Dave May",
                        "telephone": "01234 56473"
                    }
                ],
                "description": "The description is here",
                "links": {
                    "editions": {
                        "href": "http://localhost:8080/datasets/1234nshahb-ebggafsgsh/editions"
                    },
                    "latest_version": {
                        "id": "kshdgh1-2fdfsfsfsd-34dsfsf",
                        "href": "http://localhost:8080/datasets/1234nshahb-ebggafsgsh/editions/2017/versions/2"
                    },
                    "self": {
                        "href": ""
                    }
                },
                "next_release": "",
                "periodicity": ["Monthly","Annually"],
                "publisher": {
                    "name": "",
                    "type": "",
                    "href": ""
                },
                "state": "",
                "theme": "",
                "title": "CPI",
                "national_statistic": true,
                "keywords": ""
            },
            {
                "id": "nahas329u3n-blah-blah",
                "contact": [
                    {
                        "email": "",
                        "name": "",
                        "telephone": ""
                    }
                ],
                "description": "",
                "links": {
                    "editions": {
                        "href": "http://localhost:8080/datasets/nahas329u3n-blah-blah/editions"
                    },
                    "latest_version": {
                        "id": "nahas329u3n-blah-blah",
                        "href": "http://localhost:8080/datasets/nahas329u3n-blah-blah/editions/2017/versions/2"
                    },
                    "self": {
                        "href": ""
                    }
                },
                "next_release": "",
                "periodicity": "",
                "publisher": {
                    "name": "",
                    "type": "",
                    "href": ""
                },
                "state": "",
                "theme": "",
                "title": "Other thing"
            }
        ],
        "limit": 0,
        "offset": 0,
        "total_count": 0
    };

    const stubbedInstances = {
            items: [
                {
                    id: "46b5cf8d-af76-4b81-a02a-b6eed069bec4",
                    links: {
                        job: {
                            id: "78618222-93fe-45a2-8f2e-a1bab2b01720",
                            href: "http://localhost:21800/jobs/78618222-93fe-45a2-8f2e-a1bab2b01720"
                        }
                    },
                    state: "completed",
                    total_observations: 31554,
                    total_inserted_observations: 31554,
                    headers: [
                        "V4_0",
                        "Time_codelist",
                        "Time",
                        "Geography_codelist",
                        "Geography",
                        "cpi1dim1aggid",
                        "Aggregate"
                    ],
                    last_updated: "2017-09-18T10:33:33.29+01:00",
                    dataset_id: "1234nshahb-ebggafsgsh",
                    editions: ["Time series"]
                },
                {
                    id: "46b5cf8d-af76-4b81-a02a-b6eed069bec4",
                    links: {
                        job: {
                            id: "78618222-93fe-45a2-8f2e-a1bab2b01720",
                            href: "http://localhost:21800/jobs/78618222-93fe-45a2-8f2e-a1bab2b01720"
                        }
                    },
                    state: "created",
                    total_observations: 0,
                    total_inserted_observations: 0,
                    headers: [],
                    last_updated: "2017-09-18T10:33:33.29+01:00",
                    dataset_id: "1234nshahb-ebggafsgsh",
                    editions: ["Meh"]
                }
            ]
        }


export default class datasets {

    static get(datasetID) {
        //TODO - unstub once the API has dataset IDs in instance (we need to stub this response so our other stubs work)
        return Promise.resolve(stubbedDatasets.items.find(dataset => {
            return dataset.id === datasetID;
        }));

        // return http.get(`/dataset/datasets/${datasetID}`)
        //     .then(response => {
        //         return response;
        //     });
    }

    static getAll() {
        //TODO - unstub once the API shows unpublished datasets to authorised users
        return Promise.resolve(stubbedDatasets);

        // return http.get(`/dataset/datasets`)
        //     .then(response => {
        //         return response;
        //     });
    }

    static getInstance(instanceID) {
        // TODO - unstub once the API puts datasetIDs and editions in instances
        return Promise.resolve(stubbedInstances.items.find(instance => {
            return instance.id === instanceID;
        }));

        // return http.get(`/dataset/instances/${instanceID}`)
        //     .then(response => {
        //         return response;
        //     });
    }

    static updateInstanceEdition(instanceID, edition) {
        const body = {
            edition
        }
        return http.put(`/dataset/instances/${instanceID}`, body, true)
            .then(response => {
                return response;
            });
    }

    static getCompletedInstances() {
        // TODO - unstub once the API puts dataset IDs in instances
        const response = {
            items: stubbedInstances.items.filter(instance => {
                return instance.state === "completed";
            })
        }
        return Promise.resolve(response);

        // return http.get(`/dataset/instances?state=completed`)
        //     .then(response => {
        //         return response;
        //     });
    }
}
