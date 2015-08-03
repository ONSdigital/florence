function getPageData(collectionId, path, success, error) {
  var safePath = checkPathSlashes(path);
  return $.ajax({
    url: "/zebedee/content/" + collectionId + "?uri=" + safePath,
    dataType: 'json',
    type: 'GET',
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
