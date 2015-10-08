function postPassword(email, password) {
  $.ajax({
    url: "/zebedee/password",
    dataType: 'json',
    contentType: 'application/json',
    type: 'POST',
    data: JSON.stringify({
      password: password,
      email: email
    }),
    success: function () {
      console.log('Password set');
      alert("User created");
      viewController('users');
    },
    error: function (response) {
      handleApiError(response);
    }
  });
}