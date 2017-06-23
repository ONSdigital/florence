/**
 * Http post to the zebedee API to authenticate a user.
 * @param email - the email of the user to authenticate
 * @param password - the password of the user
 * @returns {boolean}
 */
function postLogin(email, password) {
    $.ajax({
        url: "/zebedee/login",
        dataType: 'json',
        contentType: 'application/json',
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify({
            email: email,
            password: password
        }),
        success: function (response) {
            document.cookie = "access_token=" + response + ";path=/";
            localStorage.setItem("loggedInAs", email);
            getUserPermission(
                function (permission) {
                    // Only allow access to editors and admin
                    if (permission.admin || permission.editor) {
                        if(window.verificationAttempted) {
                            window.location.replace("/florence/index.html");
                            return;
                        }
                        getPublisherType(permission);
                        Florence.refreshAdminMenu();
                        viewController();
                    } else {
                        logout();
                        if(window.verificationAttempted) {
                            sweetAlert("Your email address has been verified. You can now login to Ermintrude.");
                            return;
                        }
                        sweetAlert("You do not have the permissions to enter here. Please contact an administrator");
                    }
                },
                function (error) {
                    logout();
                    sweetAlert("An error has occured, please try again.");
                },
                email
            );
        },
        error: function (response) {
            if (response.status === 417) {
                viewChangePassword(email, true, password);
            } else if (response.status == 403) {
                logout();
                sweetAlert("You need to verify your email address before continuing.");
            } else {
                handleLoginApiError(response);
            }
        }
    });
    return true;
}

function getPublisherType(permission) {
    // Store in localStorage publisher type
    if (permission.admin) {
        localStorage.setItem("userType", "PUBLISHING_SUPPORT");
    } else if (permission.editor && !permission.dataVisPublisher) {
        localStorage.setItem("userType", "PUBLISHING_SUPPORT");
    } else if (permission.editor && permission.dataVisPublisher) {
        localStorage.setItem("userType", "DATA_VISUALISATION");
    } else if (!permission.admin && !permission.editor && !permission.dataVisPublisher) {
        localStorage.setItem("userType", "VIEWER");
    }
}
