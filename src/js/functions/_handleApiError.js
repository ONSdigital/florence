/**
 * Generic error handler method for ajax responses.
 * Apply your specific requirements for an error response and then call this method to take care of the rest.
 * @param response
 */
function handleApiError(response) {

    if (!response || response.status === 200)
        return;

    if (response.status === 403 || response.status === 401) {
        //sweetAlert('You are not logged in', 'Please refresh Florence and log back in.');
        logout();
    } else if (response.status === 504) {
        sweetAlert('This task is taking longer than expected', "It will continue to run in the background.", "info");
    } else {
        var message = 'An error has occurred, please contact an administrator.';

        if (response.responseJSON) {
            message = response.responseJSON.message;
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
        sweetAlert('Incorrect login details', 'These login credentials were not recognised. Please try again.', 'error');
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
