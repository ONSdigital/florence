function getPageData(collectionId, path, success, error) {
  checkPathSlashes(path);
  return $.ajax({
    url: "/zebedee/content/" + collectionId + "?uri=" + path,
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
