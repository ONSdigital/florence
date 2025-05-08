function getCollection(collectionId, success, error) {
  return $.ajax({
    url: `${API_PROXY.VERSIONED_PATH}/collection/${collectionId}`,
    dataType: 'json',
    type: 'GET',
    success: function (response) {
      success(response);
    },
    error: function (response) {
      error(response);
    }
  });
}

function getCollectionDetails(collectionId, success, error) {
  return $.ajax({
    url: `${API_PROXY.VERSIONED_PATH}/collectionDetails/${collectionId}`,
    dataType: 'json',
    type: 'GET',
    success: function (response) {
      success(response);
    },
    error: function (response) {
      error(response);
    }
  });
}
