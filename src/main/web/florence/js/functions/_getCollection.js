function getCollection(collectionName, success, error) {
  return $.ajax({
    url: "/zebedee/collection/" + collectionName,
    dataType: 'json',
    type: 'GET',
    success: function (response) {
      success(response);
    },
    error: function (response) {
      error(response)
    }
  });
}