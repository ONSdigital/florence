import uuid from 'uuid/v4';
import Dexie from 'dexie';
import log, {eventTypes} from './log';

class Storage {
    constructor() {
        this.dexieDatabase = undefined;
        this.DexieDbIsInitialised = false;
        this.dexieBuffer = [];

        this.initialise();
    }

    initialise() {
        console.log("Trying to open database...");
        this.dexieDatabase = new Dexie("florence-dexie");
        this.dexieDatabase.version(1).stores({
            logs: "++storageID,type,location,instanceID,created,timestamp"
        });
        this.dexieDatabase.open().then(() => {
            // TODO add a log line here
            console.log("Database has been opened");
            this.DexieDbIsInitialised = true;
            if (this.dexieBuffer.length) {
                this.dexieBuffer.forEach(item => {
                    this.dexieDatabase.logs.add(item);
                });
            }
            return this.getLatest();
        }).then(response => {
            const latestDocument = response[0];
            if (new Date(latestDocument.timestamp).toDateString() !== new Date().toDateString()) {
                this.removeAll().then();
                return;
            }
        }).catch(error => {
            // TODO add a log line here
            console.error("Error opening database" + error);
        });
    }
    
    /**
     * @returns {object} - returns an object with the structure `{used: integer, available: integer}`. Both values should be integers.
     */
    storageUsed() {
        return navigator.webkitTemporaryStorage.queryUsageAndQuota((used, available) => {
            return {used, available};
        });
    }

    /**
     * @param {*} data - Data that is being stored
     *
     * @returns {string} returns the unique key that the data has been stored at
     */
    add(data) {
        data.storageID = uuid();

        if (!this.DexieDbIsInitialised) {
            this.dexieBuffer.push(data);
            return data.storageID;
        }

        this.dexieDatabase.logs.add(data).catch(error => {
            log.add(eventTypes.unexpectedRuntimeError, {message: "Error adding item to client-side database" + JSON.stringify(error)})
            console.error("Error adding item to client-side database", error);
        });

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

        return this.dexieDatabase.logs.where('storageID').equals(ID);
    }

    /**
     * @param {integer} pageNumber - (Optional) start point of the items we'd like to receive
     * @param {integer} limit - (Optional) the number of items we'd like to receive
     * @param {integer} requestTimestamp - (Optional) a Unix timestamp that 
     * 
     * @returns {Promise} resolves to an array of all items in storage (optionally filter by from and to parameters)
     */
    getAll(pageNumber, limit, requestTimestamp) {
        const newLogs = this.dexieDatabase.logs
            .orderBy('timestamp')
            .reverse()
            .and(log => log.timestamp <= requestTimestamp)
            .offset((pageNumber-1) * limit)
            .limit(limit)
            .toArray();

        const count = this.dexieDatabase.logs.where('timestamp').belowOrEqual(requestTimestamp).count();
        const promises = [newLogs, count];

        return new Promise((resolve, reject) => {
            Promise.all(promises).then(responses => {
                const mappedResponse = {
                    results: responses[0],
                    count: responses[1],
                    pagination: {
                        resultsPerPage: limit,
                        pageCount: Math.floor(responses[1]/limit),
                        currentPage: pageNumber
                    }
                }
                resolve(mappedResponse);
            }).catch(error => {
                reject(error);
            });
        });
    }

    /**
     * Only returns the latest document that was added to the database
     * 
     * @returns {Promise} - resolves to an Array which contains the latest document
     */
    getLatest() {
        return this.dexieDatabase.logs.orderBy('timestamp').reverse().limit(1).toArray();
    }

    /**
     * @param {string} key - The unique key of the item that we want to remove
     * 
     * @returns {Promise}
     */
    remove(ID) {
        if (!ID) {
            console.warn("A key must be given when trying to delete stored data");
            return Promise.reject({status: 400, message: "A key must be given when trying to delete stored data"});
        }
        return this.dexieDatabase.logs.delete(ID);
    }

    /**
     * @returns {Promise} - Which resolves to an integer
     */
    length(timestamp) {
        if (timestamp) {
            return this.dexieDatabase.logs.where('timestamp').belowOrEqual(timestamp).count();
        }

        return this.dexieDatabase.logs.count();
    }

    /**
     * @returns {Promise}
     */
    removeAll() {
        return this.dexieDatabase.logs.clear();
    }
}

const storage = new Storage();
export default storage;