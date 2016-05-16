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
            Florence.refreshAdminMenu();
            getUserPermission(
                function (permission) {
                    if (permission.admin || permission.editor) {
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
        url: "/zebedee/publishertype",
        dataType: 'json',
        contentType: 'application/json',
        type: 'GET',
        success: function (json) {
            console.log("PublisherType: " + json.publisherType);
            localStorage.setItem("PublisherType", json.publisherType);
        },
        error: function(json) {
            console.log("Error!");
        }
    });
}
