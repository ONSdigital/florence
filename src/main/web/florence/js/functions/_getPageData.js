function getPageData(collectionName, path, success, error) {
  return $.ajax({
    url: "/zebedee/content/" + collectionName + "?uri=" + path,
    dataType: 'json',
    type: 'GET',
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
