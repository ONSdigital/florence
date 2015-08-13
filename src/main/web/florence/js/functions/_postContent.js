function postContent(collectionId, path, content, success, error) {
  var safePath = checkPathSlashes(path);
  if (safePath === '/') {
    safePath = '';          // edge case for home
  }

  if (Florence.globalVars.welsh) {
    var url = "/zebedee/content/" + collectionId + "?uri=" + safePath + "/data_cy.json";
  } else {
    var url = "/zebedee/content/" + collectionId + "?uri=" + safePath + "/data.json";
  }

  $.ajax({
    url: url,
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