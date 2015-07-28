function updateContent(collectionId, path, content, redirectToPath) {
  var redirect = redirectToPath;
  postContent(collectionId, path, content,
    success = function (response) {
      Florence.Editor.isDirty = false;
      if (redirect) {
        createWorkspace(redirect, collectionId, 'edit');
        return;
      } else {
        refreshPreview(path);
        if (path != Florence.pathTest) {
          alert('Please call Pastor if this happens. Florence needs a revision');
        }
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
