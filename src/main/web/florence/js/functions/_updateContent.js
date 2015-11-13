function updateContent(collectionId, path, content, redirectToPath) {
  var redirect = redirectToPath;
  putContent(collectionId, path, content,
    success = function () {
      Florence.Editor.isDirty = false;
      if (redirect) {
        createWorkspace(redirect, collectionId, 'edit');
        return;
      } else {
        //createWorkspace(path, collectionId, 'edit');
        refreshPreview(path);
        loadPageDataIntoEditor(path, collectionId);
      }
    },
    error = function (response) {
      if (response.status === 409) {
        sweetAlert("Cannot edit this page", "It is already part of another collection.");
      } else {
        handleApiError(response);
      }
    }
  );
}
