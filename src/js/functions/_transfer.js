function transfer(source, destination, uri) {
  var transferRequest = {
    source: source,
    destination: destination,
    uri: uri
  };
  $.ajax({
    url: "/zebedee/transfer",
    type: "POST",
    dataType: "json",
    contentType: 'application/json',
    data: JSON.stringify(transferRequest),
    success: function() {
      console.log(' file has been moved');
    },
    error: function() {
      console.log('error moving file');
    }
  });
}

