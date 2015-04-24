function deleteContent(collectionName, path, success, error) {
  // send ajax call
  $.ajax({
    url: "/zebedee/content/" + collectionName + "?uri=" + path,
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