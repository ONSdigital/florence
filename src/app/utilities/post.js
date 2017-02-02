export function post(uri, body) {

    return new Promise(function(resolve, reject) {

        fetch(uri, {
            credentials: "include",
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
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
