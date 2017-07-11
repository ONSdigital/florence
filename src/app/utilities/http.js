/**
 * High-level wrapper for the Fetch API (see this post for explanation - https://medium.com/@shahata/why-i-wont-be-using-fetch-api-in-my-apps-6900e6c6fe78#.o6k6ai5fj)
 *
 */

import request from './http-methods/request';

export default class http {
    
    /**
    * @param {string} uri - URI that the request is being sent to
    * @param {boolean} willRetry - boolean flag whether to retry request on failure
    *
    * @returns {Promise} which returns the response body in JSON format
    */
    static delete(uri, willRetry) {
        return request("DELETE", uri, willRetry);
    }

    /**
     * @param {string} uri - URI that the request is being sent to
     * @param {boolean} willRetry - boolean flag whether to retry request on failure
     * 
     * @returns {Promise} which returns the response body in JSON format
     */
    static get(uri, willRetry) {
        return request("GET", uri, willRetry);
    }

    /**
     * @param uri - URI that the request is being sent to
     * @param body - body contents of request
     * @param willRetry - boolean flag whether to retry request on failure
     * 
     * @returns {Promise} which returns the response body in JSON format
     */
    static post(uri, body, willRetry) {
        return request("POST", uri, willRetry, null, body)
    }
    
    /**
     * @param uri - URI that the request is being sent to
     * @param body - body contents of request
     * @param willRetry - boolean flag whether to retry request on failure
     * 
     * @returns {Promise} which returns the response body in JSON format
     */
    static put(uri, body, willRetry) {
        return request("PUT", uri, willRetry, body)
    }
    
    /**
     * @param uri - URI that the request is being sent to
     * @param willRetry - boolean flag whether to retry request on failure
     * 
     * @returns {Promise} which returns the response body in JSON format
     */
    static head(uri, body, willRetry) {
        return request("HEAD", uri, willRetry, body)
    }
}