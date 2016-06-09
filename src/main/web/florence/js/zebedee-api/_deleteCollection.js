function deleteCollection(collectionId, success, error) {
  $.ajax({
    url: "/zebedee/collection/" + collectionId,
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

