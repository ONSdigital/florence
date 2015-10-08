function postUser(name, email, password) {
  $.ajax({
    url: "/zebedee/users",
    dataType: 'json',
    contentType: 'application/json',
    type: 'POST',
    data: JSON.stringify({
      name: name,
      email: email
    }),
    success: function () {
      console.log('User created');
      postPassword(email, password);
    },
    error: function (response) {
      if (response.status === 403 || response.status === 401) {
        alert("You are not permitted to create users.")
      }
      else if (response.status === 409) {
        alert(response.responseJSON.message)
      } else {
        handleApiError(response);
      }
    }
  });
}