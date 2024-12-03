/**
 * Logout the current user and return to the login screen.
 */
async function logout(currentPath) {
    const res = await fetch('/tokens/self', {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        }
    })
    if (res.status === 400) {
        console.warn("Error occurred sending DELETE to /tokens/self - InvalidToken");
    } else if (res.status !== 204) {
        console.warn("Error occurred sending DELETE to /tokens/self");
    }

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
