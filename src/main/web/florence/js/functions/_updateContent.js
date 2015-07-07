function updateContent(collectionId, path, content) {
  postContent(collectionId, path, content,
    success = function (response) {
      //console.log("Updating completed " + response);
      Florence.Editor.isDirty = false;
      refreshPreview(path);
      loadPageDataIntoEditor(path, collectionId);
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
