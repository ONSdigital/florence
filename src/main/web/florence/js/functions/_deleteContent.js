function deleteContent(collectionName, path, success, error) {
  $.ajax({
    url: "/zebedee/content/" + collectionName + "?uri=" + path + "/data.json",
    type: 'DELETE',
    success: function (response) {
      if (success)
        success(response);
    },
    error: function (response) {
      if (error)
        error(response);
    }
  });
}