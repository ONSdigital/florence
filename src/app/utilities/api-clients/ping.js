import uuid from "uuid/v4";

export default function ping() {
    /* 
        We're using fetch instead of our request utility class because we want to set a specific log event
        rather than using the default 'REQUEST_XXXX' log event types. This allows us to filter out pings 
        from logs if necessary.
    */
    const fetchConfig = {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({}),
    };

    return fetch("/zebedee/ping", fetchConfig)
        .then(response => {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.error(error);
            return Promise.reject(error);
        });
}
