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
      setPassword();
    },
    error: function (response) {
      handleUserPostError(response);
    }
  });

  /**
   * Once the user is created do a seperate post to the zebedee API
   * to set the password.
   */
  function setPassword() {
    postPassword(
      success = function () {
        console.log('Password set');
        setPermissions()
      },
      error = null,
      email,
      password);
  }

  /**
   * Once the user is created and the password is set, set the permissions for the user.
   */
  function setPermissions() {
    postPermission(
      success = function () {
        sweetAlert("User created", "User '" + email + "' has been created", "success");
        viewController('users');
      },
      error = null,
      email = email,
      admin = false,
      editor = true);
  }

  /**
   * Handle error response from creating the user.
   * @param response
   */
  function handleUserPostError(response) {
    if (response.status === 403 || response.status === 401) {
      sweetAlert("You are not permitted to create users.")
    }
    else if (response.status === 409) {
      sweetAlert("Error", response.responseJSON.message, "error")
    } else {
      handleApiError(response);
    }
  }
}