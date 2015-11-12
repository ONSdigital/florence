function saveRelated (collectionId, path, data, templateData, field, idField) {
  putContent(collectionId, path, JSON.stringify(data),
    success = function (response) {
      console.log("Updating completed " + response);
      Florence.Editor.isDirty = false;
      resolveTitle(collectionId, data, templateData, field, idField);
      refreshPreview(path);
      var iframeEvent = document.getElementById('iframe').contentWindow;
      iframeEvent.addEventListener('click', Florence.Handler, true);
    },
    error = function (response) {
      if (response.status === 400) {
        sweetAlert("Cannot edit this page", "It is already part of another collection.");
      }
      else {
        handleApiError(response);
      }
    }
  );
}

