function deleteEquation(collectionId, path, success, error) {
  var safePath = checkPathSlashes(path);
  $.ajax({
    url: `${API_PROXY.VERSIONED_PATH}/equation/${collectionId}?uri=${safePath}`,
    type: 'DELETE',
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

