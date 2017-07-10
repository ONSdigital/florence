function postUser(name, email, verify, isAdmin, isEditor, isDataVisPublisher) {

    var html = templates.loadingAnimation({dark: true, large: true});
    sweetAlert({
        title: "User being created...",
        text: html,
        showConfirmButton: false,
        html: true
    });

    $.ajax({
        url: "/zebedee/users",
        dataType: 'json',
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify({
            name: name,
            email: email,
            verificationEmail: verify
        }),
        success: function () {
            console.log('User created');
            setPermissions();
        },
        error: function (response) {
            handleUserPostError(response);
        }
    });

    /**
     * Once the user is created and the password is set, set the permissions for the user.
     */
    function setPermissions() {
        postPermission(
            success = function () {
                sweetAlert("User created", "User '" + email + "' has been created", "success");
                viewController('users');
            },
            error = null,
            email = email,
            admin = isAdmin,
            editor = isEditor,
            dataVisPublisher = isDataVisPublisher
            );
    }

    /**
     * Handle error response from creating the user.
     * @param response
     */
    function handleUserPostError(response) {
        if (response.status === 403 || response.status === 401) {
            sweetAlert("You are not permitted to create users.");
        }
        else if (response.status === 409) {
            sweetAlert("Error", response.responseJSON.message, "error");
        } else {
            handleApiError(response);
        }
    }
}

