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
      viewChangePassword(email, currentPasswordRequired);
    });

    $('.btn-user-delete').click(function () {
      var result = confirm("Are you sure you want to delete this user?");
      if (result === true) {
        deleteUser(email);
      }
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