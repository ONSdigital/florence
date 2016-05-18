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
                    // Store in localStorage permission type
                    if (permission.admin) {
                        localStorage.setItem("userType", "admin");
                    } else if (permission.editor && !permission.dataVisPublisher) {
                        localStorage.setItem("userType", "publisher");
                    } else if (permission.editor && permission.dataVisPublisher) {
                        localStorage.setItem("userType", "dataVisPublisher");
                    }

                    // Only allow access to editors and admin
                    if (permission.admin || permission.editor) {
                        Florence.refreshAdminMenu();
                        getPublisherType();
                        viewController();
                    } else {
                        logout();
                        sweetAlert("You do not have the permissions to enter here. Please contact an administrator");
                    }
                },
                function (error) {
                    logout();
                    sweetAlert("There is a problem with permissions. Please contact an administrator");
                },
                email
            );
        },
        error: function (response) {
            if (response.status === 417) {
                viewChangePassword(email, true);
            } else {
                handleLoginApiError(response);
            }
        }
    });
    return true;
}

function getPublisherType() {
    $.ajax({
        url: "/zebedee/userpublishertype",
        dataType: 'json',
        contentType: 'application/json',
        type: 'GET',
        success: function (json) {
            localStorage.setItem("userPublisherType", json.userPublisherType);
        },
        error: function(json) {
            console.log("Error!");
        }
    });
}
