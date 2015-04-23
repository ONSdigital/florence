function deleteContent(collectionName, path, success, error) {
  // little fiddle to account for home having a trailing slash
  if(path === '/') {
    uri = 'data.json';
    } else {
    uri = path + '/data.json';
    }
  // send ajax call
  $.ajax({
    url: "/zebedee/content/" + collectionName + "?uri=" + uri,
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

