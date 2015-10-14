function deleteUser(email) {
  $.ajax({
    url: "/zebedee/users?email=" + email,
    dataType: 'json',
    contentType: 'application/json',
    type: 'DELETE',
    success: function () {
      console.log('User deleted');
      alert('User deleted');
      viewController('users');
    },
    error: function (response) {
      if (response.status === 403 || response.status === 401) {
        alert("You are not permitted to delete users.")
      } else {
        handleApiError(response);
      }
    }
  });
}