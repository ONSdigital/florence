function updateContent(collectionName, path, content) {

  postContent(collectionName, path, content,
    success = function (response) {
      console.log("Updating completed" + response);
      refreshPreview();
    },
    error = function (response) {
      if (response.status == 400) {
        alert("Cannot edit this file. It is already part of another collection.");
      }
      else {
        handleApiError(response);
      }
    });
}
