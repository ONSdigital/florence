function postContent(collectionId, path, content, success, error) {
  $.ajax({
    url: "/zebedee/content/" + collectionId + "?uri=" + path + "/data.json",
    dataType: 'json',
    type: 'POST',
    data: content,
    success: function (response) {
      success(response);
    },
    error: function (response) {
      error(response);
    }
  });
}