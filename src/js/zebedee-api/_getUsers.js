/**
 * Http post to the zebedee API to get a list of users.
 * @param success
 * @param error
 * @param userId
 * @returns {*}
 */
function getUsers(success, error, userId) {

  var url = "/zebedee/users";

  if(userId) {
    url += '?email=' + userId;
  }

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
