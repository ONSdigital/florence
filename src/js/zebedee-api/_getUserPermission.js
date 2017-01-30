/**
 * Http post to the zebedee API to get a list of user permissions.
 * @param success
 * @param error
 * @param userId
 * @returns {*}
 */
function getUserPermission(success, error, userId) {

  var url = "/zebedee/permission?email=" + userId;


  return $.ajax({
    url: url,
    dataType: 'json',
    type: 'GET',
    success: function (response) {
      success(response);
    },
    error: function (response) {
      error(response);
    }
  });
}

