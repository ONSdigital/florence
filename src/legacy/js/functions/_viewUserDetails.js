/**
 * Display the details of the user with the given email.
 *
 * @param email
 * @param $this = jQuery object of selected table item
 */
function viewUserDetails(email, $this) {

    getUsers(
        success = function (user) {
            populateUserDetails(user, email, $this);
        },
        error = function (response) {
            handleApiError(response);
        },
        email
    );

    var isAdmin, isEditor;
    function populateUserDetails(user, email, $this) {
        getUserPermission(
            function (permission) {
                isAdmin = permission.admin;
                isEditor = permission.editor;

                addPermissionToJSON(user);

                var showPanelOptions = {
                    html: window.templates.userDetails(user)
                };
                showPanel($this, showPanelOptions);

                $('.btn-user-change-password').click(function () {
                    var currentPasswordRequired = false;

                    if (email == Florence.Authentication.loggedInEmail()) {
                        currentPasswordRequired = true;
                    }

                    viewChangePassword(email, currentPasswordRequired);
                });

                $('.btn-user-delete').click(function () {
                    swal({
                        title: "Confirm deletion",
                        text: "Please enter the email address of the user you want to delete",
                        type: "input",
                        inputPlaceHolder: "Email address",
                        showCancelButton: true,
                        closeOnConfirm: false,
                        confirmButtonText: "Delete",
                        animation: "slide-from-top"
                    }, function (result) {
                        console.log(result);
                        if (result) {
                            if (result === email) {
                                swal({
                                    title: "User deleted",
                                    text: "This user has been deleted",
                                    type: "success",
                                    timer: 2000
                                });
                                deleteUser(email);
                            } else {
                                sweetAlert("Oops!", 'The email you entered did not match the user you want to delete.')
                            }
                        }
                    });
                });

                $('.btn-user-cancel').click(function () {
                    hidePanel({});
                });
            },
            function (error) {handleApiError(error);},
            email
        );

    }

    /*
     * Add permissions object to JSON so accessible to handlebars template
     * @param user - JSON object
     */
    function addPermissionToJSON (user) {
        user['permission'] = permissionStr(isAdmin, isEditor);
    }


    /*
     * Logic to work out user role
     * @param isAdmin - true/false
     * @param isEditor - true/false
     * @return the user's role as string
     */
    function permissionStr (isAdmin, isEditor) {
        var permissionStr;
        if (!isAdmin && !isEditor) {permissionStr = 'viewer';}
        if (isEditor) {permissionStr = 'publisher';}
        if (isAdmin) {permissionStr = "admin";}

        return permissionStr;
    }
}