function postContent(collectionId, path, content, success, error) {
  var safePath = checkPathSlashes(path);
  if (safePath != Florence.globalVars.pagePath) {
    alert('Please call Pastor if this happens. Florence needs a revision \nSaving to: '+ safePath + '\npathTest: '+Florence.globalVars.pagePath);
  }
  if (safePath === '/') {
    safePath = '';          // edge case for home
  }
  $.ajax({
    url: "/zebedee/content/" + collectionId + "?uri=" + safePath + "/data.json",
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