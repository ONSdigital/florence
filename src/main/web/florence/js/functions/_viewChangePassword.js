/**
 * Show the change password screen to change the password for the given email.
 * @param email - The email address of the user to change the password for.
 * @param authenticate - true if the existing password for the user needs to be entered.
 */
function viewChangePassword(email, authenticate) {

  var viewModel = {
    authenticate: authenticate
  };
  
  $('body').append(templates.changePassword(viewModel));

  $('#update-password').on('click', function () {
    var oldPassword = $('#password-old').val();
    var newPassword = $('#password-new').val();
    var confirmPassword = $('#password-confirm').val();

    if(newPassword !== confirmPassword) {
      sweetAlert('The passphrases provided do not match', 'Please enter the new passphrase again and confirm it.');
    } else if(!newPassword.match(/.+\s.+\s.+\s.+/)) {
      sweetAlert('The passphrase does not have four words', 'Please enter a new passphrase and confirm it.');
    } else if(newPassword.length < 15) {
      sweetAlert('The passphrase is too short', 'Please make sure it has at least 15 characters (including spaces).');
    } else {
      submitNewPassword(newPassword, oldPassword);
    }
  });

  $('#update-password-cancel').on('click', function () {
    $('.change-password-overlay').stop().fadeOut(200).remove();
  });

  function submitNewPassword(newPassword, oldPassword) {
    postPassword(
      success = function () {
        console.log('Password updated');
        sweetAlert("Password updated", "", "success");
        $('.change-password-overlay').stop().fadeOut(200).remove();

        if(authenticate) {
          postLogin(email, newPassword);
        }
      },
      error = function (response) {
        if (response.status === 403 || response.status === 401) {
          if (authenticate) {
            sweetAlert('The password you entered is incorrect. Please try again');
          } else {
            sweetAlert('You are not authorised to change the password for this user');
          }
        }
      },
      email,
      newPassword,
      oldPassword);
  }
}

