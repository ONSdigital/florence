function postContent(collectionId, path, content, success, error) {
  if (path.charAt(0) !== '/') {
    path = '/' + path;
  }
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