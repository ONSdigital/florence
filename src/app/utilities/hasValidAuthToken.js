/**
 * Checks whether the client has a valid access token stored in cookies
 *
 * @returns {Promise} which returns a boolean value
 */

import ping from "./api-clients/ping";
import cookies from "./cookies";

export function hasValidAuthToken() {
    return new Promise(function (resolve, reject) {
        if (!cookies.get("access_token")) {
            resolve(false);
            return;
        }

        ping()
            .then(response => {
                if (!response.hasSession) {
                    resolve(false);
                    return;
                }
                resolve(true);
            })
            .catch(fetchError => {
                reject(fetchError);
            });
    });
}
