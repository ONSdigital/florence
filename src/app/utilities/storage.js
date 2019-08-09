import uuid from "uuid/v4";
import minimongo from "minimongo";

class Storage {
    constructor() {
        this.database = null;
        this.DbIsInitialised = false;
        this.buffer = [];

        this.initialise();
    }

    initialise() {
        const indexedDB = minimongo.IndexedDb;
        this.database = new indexedDB(
            { namespace: "florence" },
            () => {
                this.database.addCollection("logs", () => {
                    this.getLatest().then(latestDocument => {
                        if (new Date(latestDocument.timestamp).toDateString() !== new Date().toDateString()) {
                            this.removeAll().then(() => {
                                this.DbIsInitialised = true;
                            });
                            return;
                        }
                        this.DbIsInitialised = true;
                    });
                    if (!this.buffer.length) {
                        return;
                    }
                    this.buffer.forEach(item => {
                        this.database.logs.upsert(item);
                    });
                });
            },
            () => {
                console.log("Error creating indexedDB");
            }
        );
    }

    /**
     * @returns {object} - returns an object with the structure `{used: integer, available: integer}`. Both values should be integers.
     */
    storageUsed() {
        return navigator.webkitTemporaryStorage.queryUsageAndQuota((used, available) => {
            return { used, available };
        });
    }

    /**
     * @param {*} data - Data that is being stored
     *
     * @returns {string} returns the unique key that the data has been stored at
     */
    add(data) {
        data.storageID = uuid();

        if (!this.DbIsInitialised) {
            this.buffer.push(data);
            return data.storageID;
        }

        this.database.logs.upsert(data);

        return data.storageID;
    }

    /**
     * @param {string|number} ID - The unique ID of the item that we want to retrieve
     *
     * @returns {Promise}
     */
    get(ID) {
        if (!ID) {
            console.warn("A key must be given when trying to access stored data");
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            this.database.logs.findOne(
                { storageID: ID },
                {},
                response => {
                    resolve(response);
                },
                error => {
                    reject(error);
                }
            );
        });
    }

    /**
     * @param {number} skip - (Optional) start point of the items we'd like to receive
     * @param {number} limit - (Optional) the number of items we'd like to receive
     * @param {number} requestTimestamp - (Optional) a Unix timestamp that
     *
     * @returns {Promise} resolves to an array of all items in storage (optionally filter by from and to parameters)
     */
    getAll(skip, limit, requestTimestamp) {
        return new Promise((resolve, reject) => {
            const query = {};

            if (requestTimestamp) {
                query.timestamp = {
                    $lte: requestTimestamp
                };
            }

            this.database.logs.find(query, { sort: [["timestamp", "desc"]], skip, limit }).fetch(
                response => {
                    resolve(response);
                },
                error => {
                    reject();
                    console.error("Error fetching all logs from local DB", error);
                }
            );
        });
    }

    /**
     * Only returns the latest document that was added to the database
     *
     * @returns {Promise} - resolves to the latest document
     */
    getLatest() {
        return new Promise((resolve, reject) => {
            this.database.logs.find({}, { sort: ["timestamp"], limit: 1 }).fetch(
                response => {
                    resolve(response[0]);
                },
                error => {
                    reject();
                    console.error("Error fetching all logs from local DB", error);
                }
            );
        });
    }

    /**
     * @param {string} key - The unique key of the item that we want to remove
     *
     * @returns {Promise}
     */
    remove(key) {
        return new Promise((resolve, reject) => {
            this.database.logs.remove(
                key,
                () => {
                    resolve();
                },
                () => {
                    reject();
                }
            );
        });
    }

    /**
     * @returns {Promise} - Which resolves to an integer
     */
    length() {
        return new Promise((resolve, reject) => {
            /* 
                NOTE: This will break if we have multiple collections or change the namespace of the DB
                
                minimongo doesn't currently support `collection.count()` so we have to access
                the florence collection directly in IndexedDB and get the count ourselves.
                
                If this does break and we want a better solution, a PR to add 'count()' to the API would be welcomed 
                by the creator and meet our needs (https://github.com/mWater/minimongo/issues/36).
            */
            const db = window.indexedDB.open("IDBWrapper-minimongo_florence", 1);

            db.onsuccess = () => {
                const transaction = db.result.transaction(["minimongo_florence"], "readonly");
                const objectStore = transaction.objectStore("minimongo_florence");
                const countRequest = objectStore.count();
                countRequest.onsuccess = () => {
                    resolve(countRequest.result);
                };
                countRequest.onerror = () => {
                    reject();
                };
            };
        });
    }

    /**
     * @returns {Promise}
     */
    removeAll() {
        return new Promise((resolve, reject) => {
            /*
                To remove a document we first have to set the state to 'removed' in the DB (with logs.remove())
                and then resolve that remove. This means to remove all we have to loop through
                each item before setting the state to 'removed' or else we'll get nothing back
                from 'getAll()' because it filters out 'removed' documents
            */
            this.getAll().then(
                logs => {
                    let removedCount = 0;
                    logs.forEach(log => {
                        this.database.logs.remove(log._id, () => {
                            this.database.logs.resolveRemove(log._id, () => {
                                removedCount++;
                                if (removedCount === logs.length) {
                                    resolve();
                                }
                            });
                        });
                    });
                },
                () => {
                    reject();
                }
            );
        });
    }
}

const storage = new Storage();
export default storage;
