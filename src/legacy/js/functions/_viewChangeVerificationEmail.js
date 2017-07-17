/**
 * Show the change verification email screen to change the verification email for the given login email.
 * @param loginEmail - The email address of the user to change the verification email for.
 */
function viewChangeVerificationEmail(loginEmail) {

  var viewModel = {
    email: "test@test.com"
  };
  
  $('body').append(templates.changeVerificationEmail(viewModel));

  $('.change-verification-email-overlay__inner input:first').focus(); // Put focus on first input

  $('#update-verification-email').on('click', function () {
    var newEmail = $('#email').val();
    updateUser(loginEmail, newEmail);
  });

  $('#update-verification-email-cancel').on('click', function () {
    $('.change-verification-email-overlay').stop().fadeOut(200).remove();
  });
}

