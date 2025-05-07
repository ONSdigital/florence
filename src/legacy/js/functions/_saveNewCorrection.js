function saveNewCorrection (collectionId, path, success, error) {
  let safePath = checkPathSlashes(path);
  if (safePath === '/') {
    safePath = '';          // edge case for home
  }

  const url = `${API_PROXY.VERSIONED_PATH}/version/${collectionId}?uri=${safePath}`;

  // Update content
  $.ajax({
    url: url,
    dataType: 'json',
    contentType: 'application/json',
    type: 'POST',
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

