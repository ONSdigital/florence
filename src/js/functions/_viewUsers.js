function viewUsers(view) {
    var loggedUser = localStorage.getItem('loggedInAs');
    getUsers(
        success = function (data) {
            //based on user permission will show the options to create different users
            getUserPermission(
                function (permission) {
                    populateUsersTable(data, permission);
                },
                function (error) {
                    handleApiError(error);
                },
                loggedUser
            );
        },
        error = function (jqxhr) {
            handleApiError(jqxhr);
        }
    );

    function populateUsersTable(data, permission) {
        var orderedUsers = _.sortBy(data, 'name');
        var dataTemplate = {data: orderedUsers, permission: permission};
        var usersHtml = templates.userList(dataTemplate);
        var isAdmin = false;
        var isDataVisPublisher = false;
        var isEditor = false;
        $('.section').html(usersHtml);


        $('.js-selectable-table tbody tr').click(function () {
            var userId = $(this).attr('data-id');
            viewUserDetails(userId, $(this));
        });

        $('.radioBtnDiv').change(function () {
            if ($('input:checked').val() === 'admin') {
                isAdmin = true;
                isEditor = true;
                isDataVisPublisher = false;
            }
            else if ($('input:checked').val() === 'publisher') {
                isAdmin = false;
                isEditor = true;
                isDataVisPublisher = false;
            }
            else if ($('input:checked').val() === 'dataVisPublisher') {
                isAdmin = false;
                isEditor = false;
                isDataVisPublisher = true;
            }
            else {
                isAdmin = false;
                isEditor = false;
                isDataVisPublisher = false;
            }
        });

        $('.form-create-user').submit(function (e) {
            e.preventDefault();

            var username = $('#create-user-username').val();
            var email = $('#create-user-email').val();
            var password = $('#create-user-password').val();

            if (username.length < 1) {
                sweetAlert("Please enter a user name.");
                return;
            }

            if (email.length < 1) {
                sweetAlert("Please enter a user name.");
                return;
            }

            if (password.length < 1) {
                sweetAlert("Please enter a password.");
                return;
            }
            postUser(username, email, password, isAdmin, isEditor, isDataVisPublisher);
            viewUsers();
        });
    }
}

