function transfer(source, destination, uri) {
  var transferRequest = {
    source: source,
    destination: destination,
    uri: uri
  }
  console.log(transferRequest);
  $.ajax({
    url: "/zebedee/transfer",
    type: "POST",
    dataType: "json",
    data: JSON.stringify(transferRequest),
    headers: {"X-Florence-Token": accessToken()},
    success: function(response) {
      console.log(' file has been moved');
    },
    error: function(response) {
      console.log('error moving file');
    }
  });
}

