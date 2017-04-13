function deleteUnpublishedVersion (collectionId, path, success, error) {
  var url = "/zebedee/version/" + collectionId + "?uri=" + path;

  // Update content
  $.ajax({
    url: url,
    dataType: 'json',
    contentType: 'application/json',
    type: 'DELETE',
    success: function (response) {
      success(response);
    },
    error: function (response) {
      if (error) {
        error(response);
      } else {
        handleApiError(response);
      }
    }
  });
}

