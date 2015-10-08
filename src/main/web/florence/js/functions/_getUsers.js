function getUsers(success, error, userId) {

  var url = "/zebedee/users";

  if(userId) {
    url += '?email=' + userId;
  }

  //console.log('Sending user request to api: ' + url);

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
