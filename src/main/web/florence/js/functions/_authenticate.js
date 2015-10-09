function authenticate(email, password) {
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
      //console.log(response);
      document.cookie = "access_token=" + response + ";path=/";
      //localStorage.setItem("loggedInAs", email);
      Florence.Authentication.loggedInEmail = email;
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
