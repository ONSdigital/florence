/**
 * Post to the zebedee API permission endpoint.
 * Set permissions for the given email address.
 * @param success
 * @param error
 * @param email - The email of the user to set permissions for
 * @param admin - boolean true if the user should be given admin permissions
 * @param editor - boolean true if the user should be given editor permissions
 */
function postPermission(success, error, email, admin, editor) {
  $.ajax({
    url: "/zebedee/permission",
    dataType: 'json',
    contentType: 'application/json',
    type: 'POST',
    data: JSON.stringify({
      email: email,
      admin: admin,
      editor: editor
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
        if (response.status === 403 || response.status === 401) {
          sweetAlert("You are not permitted to update permissions.")
        } else {
          handleApiError(response);
        }
      }
    }
  });
}