import backoff from 'backoff';

const fibonacciBackoff = backoff.fibonacci({
    randomisationFactor: 0,
    initialDelay: 100,
    //maxDelay: 300
});

fibonacciBackoff.failAfter(4);

function PostError(response) {
    this.name = 'POST_ERR';
    this.message = response || {};
    this.stack = (new Error()).stack;
}
PostError.prototype = Object.create(Error.prototype);
PostError.prototype.constructor = PostError;

export function post(uri, body, reTry) {

    function doPost(resolve, reject, uri, body, reTry) {

        fetch(uri, {
            credentials: "include",
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify((body || {}))
        }).then(response => {
            if (response.headers.get('content-type').match(/application\/json/)) {
                return response.json().then(data => {
                    if (response.ok) {
                        fibonacciBackoff.reset();
                        return data;
                    } else {
                        reject({status: response.status, message: data.message});
                    }
                });
            }

            throw new PostError(response);

        }).then(responseJSON => {
            resolve(responseJSON);
        }).catch(fetchError => {

            if (reTry) {
                // retry post
                fibonacciBackoff.on('ready', function (number, delay) {
                    console.log(number + ' ' + delay + 'ms');
                    doPost(resolve, reject, uri, body);
                });

                // pass error back to caller when max number of retries is met
                fibonacciBackoff.on('fail', function() {

                    if (fetchError instanceof TypeError) {
                        // connection failed
                        reject({status: 'FETCH_ERR', error: fetchError});
                    } else if (fetchError instanceof PostError) {
                        // unexpected response
                        reject({status: 'RESPONSE_ERR', error: fetchError})
                    } else {
                        // unexpected error
                        reject({status: 'UNEXPECTED_ERR', error: fetchError})
                    }

                });

            }

        });

        fibonacciBackoff.backoff();

    }

    return new Promise(function(resolve, reject) {
        doPost(resolve, reject, uri, body, reTry);
    });

}
