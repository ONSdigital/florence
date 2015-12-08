function postTeam(name) {

  $.ajax({
    url: "/zebedee/teams" + name,
    //dataType: 'json',
    //contentType: 'application/json',
    type: 'POST',
    //data: JSON.stringify({
    //  name: name
    //}),
    success: function () {
      console.log('Team created');
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
      sweetAlert("You are not permitted to create teams.");
    }
    else if (response.status === 409) {
      sweetAlert("Error", response.responseJSON.message, "error");
    } else {
      handleApiError(response);
    }
  }
}

function postTeamMember(name, email) {
  $.ajax({
    url: "/zebedee/teams" + name + "?email=" + email,
    //dataType: 'json',
    //contentType: 'application/json',
    type: 'POST',
    //data: JSON.stringify({
    //  name: name
    //}),
    success: function () {
      console.log('Team member added');
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
      sweetAlert("You are not permitted to add users.");
    }
    else if (response.status === 409) {
      sweetAlert("Error", response.responseJSON.message, "error");
    } else {
      handleApiError(response);
    }
  }
}
