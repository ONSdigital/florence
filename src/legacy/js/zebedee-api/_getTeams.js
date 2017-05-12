/**
 * Http post to the zebedee API to get a list of teams.
 * @param success
 * @param error
 * @param name (to get specific details)
 * @returns {*}
 */
function getTeams(success, error, name) {

  var url = "/zebedee/teams";

  if(name) {
    url += '/' + name;
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

