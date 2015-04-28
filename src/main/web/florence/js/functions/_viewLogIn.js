function viewLogIn() {

  var login_form = templates.login;
  $('.section').html(login_form);

  $('.fl-panel--user-and-access__login').click(function () {
    var email = $('.fl-user-and-access__email').val();
    var password = $('.fl-user-and-access__password').val();
    authenticate(email, password);
  });
}

