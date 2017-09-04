import localForage from 'localforage';
import uuid from 'uuid/v4';

// The localForage implementation of size is async, we're keeping our own counter
// so that we don't have to use a Promise where it feels unnecessary
let storageCount = 0;

export default class storage {
    /**
     * @param {*} data - Data that is being stored
     * @param {string|number} key - (Optional) key that the item is being stored at
     *
     * @returns {string} returns the unique key that the data has been stored at
     */
    static add(data, key) {
        // No key given, so create our own unique ID
        if (!key) {
            key = uuid();
        }

        // Key conflicts with one that already exists, so create out own unique ID
        if (localForage.getItem(key)) {
            key = uuid();
        }

        localForage.setItem(key, data).then(() => {
            storageCount++;
        });

        return key;
    }

    /**
     * @param {string|number} key - The unique key of the item that we want to retrieve
     *
     * @returns {Promise}
     */
    static get(key) {
        if (!key) {
            console.warn("A key must be given when trying to access stored data");
            return Promise.reject();
        }

        return localForage.getItem(key);
    }

    /**
     * @param {number} fromIndex - start point of the items we'd like
     * @param {number} toIndex - end point of the items we'd like
     * 
     * @returns {Promise} resolves to an array of all items in storage (optionally filter by from and to parameters)
     */
    static getAll(fromIndex, toIndex) {
        const allItems = [];
        return new Promise((resolve, reject) => {
            localForage.iterate((value, key, index) => {
                if (!fromIndex || index >= fromIndex) {
                    allItems.push({value, key});
                }
                if (toIndex && index === toIndex) {
                    return true;
                }
            }).then(() => {
                resolve(allItems);
            }).catch(error => {
                reject(error);
            })
        });
    }

    /**
     * @param {*} key - The unique key of the item that we want to remove
     * 
     * @returns {Promise}
     */
    static remove(key) {
        return localForage.removeItem(key).then(() => {
            storageCount--;
        });
    }

    /**
     * @returns {number} - The number of items held in storage
     */
    static length() {
        return storageCount;
    }
}