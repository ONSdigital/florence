function postContent(collectionId, path, content, success, error) {
  var safePath = checkPathSlashes(path);
  if (safePath === '/') {
    safePath = '';          // edge case for home
  }

  if (Florence.globalVars.welsh) {
    var url = "/zebedee/content/" + collectionId + "?uri=" + safePath + "/data_cy.json";
    var toAddLang = JSON.parse(content);
    toAddLang.description.language = 'cy';
    content = JSON.stringify(toAddLang);
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
