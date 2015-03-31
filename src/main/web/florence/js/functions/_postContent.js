function postContent(collectionName, path, content, success, error) {
  $.ajax({
    url: "/zebedee/content/" + collectionName + "?uri=" + path + "/data.json",
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