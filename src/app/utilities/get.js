/**
 * High-level wrapper for the Fetch API (see this post for explanation - https://medium.com/@shahata/why-i-wont-be-using-fetch-api-in-my-apps-6900e6c6fe78#.o6k6ai5fj)
 *
 * @param uri - URI that the GET request is being sent to
 * @returns {Promise} which returns the response body in JSON format
 */

export function get(uri) {

    return new Promise(function(resolve, reject) {
        fetch(uri, {
            credentials: "include"
        }).then(response => {
            return response.json().then(data => {
                if (response.ok) {
                    return data
                } else {
                    reject({status: response.status, message: data.message})
                }
            });
        }).then(responseJSON => {
            resolve(responseJSON);
        }).catch(fetchError => {
            reject(fetchError);
        });
    });
}
