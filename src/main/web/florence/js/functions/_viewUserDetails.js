/**
 * Display the details of the user with the given email.
 * @param email
 */
function viewUserDetails(email) {

  getUsers(
    success = function (user) {
      populateUserDetails(user, email);
    },
    error = function (response) {
      handleApiError(response);
    },
    email
  );

  function populateUserDetails(user, email) {

    var html = window.templates.userDetails(user);
    $('.collection-selected').html(html).animate({right: "0%"}, 500);

    $('.btn-user-change-password').click(function () {
      var currentPasswordRequired = false;

      if(email == Florence.Authentication.loggedInEmail()) {
        currentPasswordRequired = true;
      }

      viewChangePassword(email, currentPasswordRequired);
    });

    $('.btn-user-delete').click(function () {
      swal ({
        title: "Confirm deletion",
        text: "Please enter the email address of the user you want to delete",
        type: "input",
        inputPlaceHolder: "Email address",
        showCancelButton: true,
        closeOnConfirm: false,
        confirmButtonText: "Delete",
        animation: "slide-from-top"
      }, function(result) {
        console.log(result);
        if (result) {
          if (result === email) {
            swal ({
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

    $('.collection-selected .btn-collection-cancel').click(function () {
      $('.collection-selected').stop().animate({right: "-50%"}, 500);
      $('.collections-select-table tbody tr').removeClass('selected');
      // Wait until the animation ends
      setTimeout(function () {
        //viewController('users');
      }, 500);
    });
  }
}