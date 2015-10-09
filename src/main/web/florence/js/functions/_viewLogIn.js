function viewLogIn() {

  var login_form = templates.login;
  $('.section').html(login_form);

  $('.form-login').submit(function (e) {
    e.preventDefault();
    var email = $('.fl-user-and-access__email').val();
    var password = $('.fl-user-and-access__password').val();
    postLogin(email, password);
  });
}

