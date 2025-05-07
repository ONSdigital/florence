function deleteCollection(collectionId, success, error) {
  $.ajax({
    url: `${API_PROXY.VERSIONED_PATH}/collection/${collectionId}`,
    type: 'DELETE',
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

