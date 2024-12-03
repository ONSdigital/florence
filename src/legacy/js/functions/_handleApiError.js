/**
 * Generic error handler method for ajax responses.
 * Apply your specific requirements for an error response and then call this method to take care of the rest.
 * @param response
 */
function handleApiError(response) {

    if (!response || response.status === 200)
        return;

    if (response.status === 401) {
        const authState = getAuthState();
        const refresh_expiry_time = new Date(authState.refresh_expiry_time);
        console.debug("[FLORENCE] Timers : requesting a new access_token");
        renewSession()
            .then(res => {
                if (res) {
                    console.debug("[FLORENCE] Updating access_token & session timer: ", res)
                    // update the authState, start the session timer with the next session response value
                    // & restart the refresh timer with the existing refresh value.
                    const expirationTime = convertUTCToJSDate(res.expirationTime);
                    setSessionExpiryTime(expirationTime, refresh_expiry_time);
                }
            })
            .catch(err => console.error("[FLORENCE]: ", err));

        return;
    }
    if (response.status === 403) {
        //sweetAlert('You are not logged in', 'Please refresh Florence and log back in.');
        // passing pathname through so the user can be brought back to the page once they log back in
        logout(window.location.pathname);
    } else if (response.status === 504) {
        sweetAlert('This task is taking longer than expected', "It will continue to run in the background.", "info");
    } else {
        var message = 'An error has occurred, please contact an administrator.';

        if (response.responseJSON) {
            message = response.responseJSON.message;

            if (response.responseJSON.data) {
                let kvs = [];
                for (let k in response.responseJSON.data) {
                    kvs.push(k + ": " + response.responseJSON.data[k]);
                }
                if (kvs.length > 0) {
                    message += "\n\n" + kvs.join("\n");
                }
            }
        }

        console.log(message);
        sweetAlert("Error", message, "error");
    }
}

/* Unique error handling for the login screen */
function handleLoginApiError(response) {

    if (!response || response.status === 200)
        return;

    if (response.status === 400) {
        sweetAlert("Please enter a valid username and password");
        logout();
    } else if (response.status === 403 || response.status === 401) {
        sweetAlert('Incorrect sign in details', 'These sign in credentials were not recognised. Please try again.', 'error');
        logout();
    } else {
        var message = 'An error has occurred, please contact an administrator.';

        if (response.responseJSON) {
            message = response.responseJSON.message;
        }

        console.log(message);
        sweetAlert("Error", message, "error");
    }
}
