function postContent(collectionId, path, content, success, error) {
  checkPathSlashes(path);
  if (path != Florence.globalVars.pagePath) {
    alert('Please call Pastor if this happens. Florence needs a revision \nSaving to: '+path+ '\npathTest: '+Florence.globalVars.pagePath);
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