function deleteContent(collectionId, path, success, error) {
  var safePath = checkPathSlashes(path);
  // send ajax call
  $.ajax({
    url: "/zebedee/content/" + collectionId + "?uri=" + safePath,
    type: 'DELETE',
    success: function (response) {
      if (success)
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

