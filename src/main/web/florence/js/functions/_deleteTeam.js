function deleteTeam(name) {
  $.ajax({
    url: "/zebedee/teams/" + name,
    dataType: 'json',
    contentType: 'application/json',
    type: 'DELETE',
    success: function () {
      sweetAlert('Deleted', "The team has been successfully deleted", 'success');
      viewController('teams');
    },
    error: function (response) {
      if (response.status === 403 || response.status === 401) {
        sweetAlert("Error", "You are not permitted to delete teams", "error");
      } else {
        handleApiError(response);
      }
    }
  });
}

function deleteTeamMember(name, email) {
  var encodedName = encodeURIComponent(name);
  $.ajax({
    url: "/zebedee/teams/" + encodedName + "?email=" + email,
    dataType: 'json',
    contentType: 'application/json',
    type: 'DELETE',
    success: function () {
      console.log('Team member deleted: ' + email);
    },
    error: function (response) {
      handleUserPostError(response);
    }
  });

  /**
   * Handle error response from creating the team.
   * @param response
   */
  function handleUserPostError(response) {
    if (response.status === 403 || response.status === 401) {
      sweetAlert("You are not permitted to delete users.");
    }
    else if (response.status === 409) {
      sweetAlert("Error", response.responseJSON.message, "error");
    } else {
      handleApiError(response);
    }
  }
}
