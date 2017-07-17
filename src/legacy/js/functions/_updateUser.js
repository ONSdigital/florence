function updateUser(email, verificationEmail) {

    var html = templates.loadingAnimation({dark: true, large: true});
    sweetAlert({
        title: "User being updated...",
        text: html,
        showConfirmButton: false,
        html: true
    });

    $.ajax({
        url: "/zebedee/users?email=" + email,
        dataType: 'json',
        contentType: 'application/json',
        type: 'PUT',
        data: JSON.stringify({
            verificationEmail: verificationEmail
        }),
        success: function () {
            console.log('User updated');
            sweetAlert("User updated", "User '" + email + "' has been updated", "success");
            $('.change-verification-email-overlay').stop().fadeOut(200).remove();
            viewController('users');
        },
        error: function (response) {
            handleUserPostError(response);
        }
    });

    /**
     * Handle error response from creating the user.
     * @param response
     */
    function handleUserPostError(response) {
        if (response.status === 403 || response.status === 401) {
            sweetAlert("You are not permitted to update users.");
        }
        else if (response.status === 409) {
            sweetAlert("Error", response.responseJSON.message, "error");
        } else {
            handleApiError(response);
        }
    }
}

