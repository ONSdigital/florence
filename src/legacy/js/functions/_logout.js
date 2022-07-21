/**
 * Logout the current user and return to the login screen.
 */
async function logout(currentPath) {
    if (Florence.globalVars.config.enableNewSignIn) {
        const res = await fetch('/tokens/self', {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            }
        })
        if (res.status === 400) {
            sweetAlert("An error occurred during sign out 'InvalidToken', please contact a system administrator");
            console.error("Error occurred sending DELETE to /tokens/self - InvalidToken");
        } else if (res.status !== 204) {
            sweetAlert("Unexpected error occurred during sign out");
            console.error("Error occurred sending DELETE to /tokens/self");
        }
    }
    delete_cookie('access_token');
    delete_cookie('collection');
    removeAuthState();

    // Redirect to login page adding an address to return to on login if one provided.
    if (currentPath) {
        window.location.href = "/florence/login?redirect=" + currentPath;
    } else {
        window.location.pathname = "/florence/login";
    }
}

function delete_cookie(name) {
    document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}