function checkSaveContent(collectionId, uri, data) {
  if (!Florence.globalVars.welsh) {
    // check if the page exists
    var getUri = uri + '/data.json';
    getPageData(collectionId, getUri,
      success = function() {
        alert('This page already exists');
      },
      // if the page does not exist, create it
      error = function() {
        save(collectionId, uri, data);
      }
    );
  } else {
    save(collectionId, uri, data);
  }

  function save (collectionId, uri, data) {
    postContent(collectionId, uri, JSON.stringify(data),
      success = function (message) {
        console.log("Updating completed " + message);
        viewWorkspace(uri, collectionId, 'edit');
        refreshPreview(uri);
      },
      error = function (response) {
        if (response.status === 400) {
          alert("Cannot edit this file. It is already part of another collection.");
        }
        else if (response.status === 401) {
          alert("You are not authorised to update content.");
        }
        else {
          handleApiError(response);
        }
      }
    );
  }
}
