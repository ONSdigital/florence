function postContent(collectionId, path, content, success, error) {
  checkPathSlashes(path);
  $.ajax({
    url: "/zebedee/content/" + collectionId + "?uri=" + path + "/data.json",
    dataType: 'json',
    type: 'POST',
    data: content,
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