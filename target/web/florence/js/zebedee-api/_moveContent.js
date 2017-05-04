function moveContent(collectionId, path, newPath, success, error) {
  $.ajax({
    url: "/zebedee/contentmove/" + collectionId + "?uri=" + checkPathSlashes(path) + "&toUri=" + checkPathSlashes(newPath),
    type: 'POST',
    success: function (response) {
      if (success)
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

