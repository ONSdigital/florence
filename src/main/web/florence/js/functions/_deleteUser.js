function deleteUser(email) {
  $.ajax({
    url: "/zebedee/users?email=" + email,
    dataType: 'json',
    contentType: 'application/json',
    type: 'DELETE',
    success: function () {
      console.log('User deleted');
      sweetAlert('Deleted', "User '"  + email + "' has been deleted", 'success');
      viewController('users');
    },
    error: function (response) {
      if (response.status === 403 || response.status === 401) {
        sweetAlert("Error", "You are not permitted to delete users", "error")
      } else {
        handleApiError(response);
      }
    }
  });
}