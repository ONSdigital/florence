function updateContent(collectionId, path, content, redirectToPath) {
  var redirect = redirectToPath;
  postContent(collectionId, path, content,
    success = function (response) {
      Florence.Editor.isDirty = false;
      if (redirect) {
        refreshPreview(path);
        viewWorkspace(redirect, collectionId, 'edit');
        return;
      } else {
        refreshPreview(path);
        loadPageDataIntoEditor(path, collectionId);
      }
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
