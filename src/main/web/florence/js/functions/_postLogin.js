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
      viewController();
    },
    error: function (response) {
      if (response.status === 417) {
        viewChangePassword(email, true);
      } else {
        handleApiError(response);
      }
    }
  });
  return true;
}
