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