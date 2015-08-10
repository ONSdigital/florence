function getPageDataDescription(collectionId, path, success, error) {
  return $.ajax({
    url: "/zebedee/data/" + collectionId + "?uri=" + path + '&description',
    dataType: 'json',
    type: 'GET',
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

function getPageDataTitle(collectionId, path, success, error) {
  return $.ajax({
    url: "/zebedee/data/" + collectionId + "?uri=" + path + '&title',
    dataType: 'json',
    type: 'GET',
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

