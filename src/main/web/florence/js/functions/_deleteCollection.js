function deleteCollection(collectionId, success, error) {
  $.ajax({
    url: "/zebedee/collection/" + collectionId,
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

