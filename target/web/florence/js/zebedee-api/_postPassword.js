/**
 * HTTP post to the zebedee API to set a new password
 * @param success - function to run on success
 * @param error - function to run on error
 * @param email - the email address of the user to change the password for
 * @param password - the password to set
 * @param oldPassword - the current password of the user if they are not already authenticated
 */
function postPassword(success, error, email, password, oldPassword) {
  $.ajax({
    url: "/zebedee/password",
    dataType: 'json',
    contentType: 'application/json',
    type: 'POST',
    data: JSON.stringify({
      password: password,
      email: email,
      oldPassword: oldPassword
    }),
    success: function () {
      if(success) {
        success();
      }
    },
    error: function (response) {
      if(error) {
        error(response);
      } else {
        handleApiError(response);
      }
    }
  });
}