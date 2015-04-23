function deleteCollection(collectionName, success, error) {
  $.ajax({
    url: "/zebedee/collection/" + collectionName,
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

