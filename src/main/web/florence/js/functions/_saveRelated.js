function saveRelated (collectionId, path, data, templateData, field, idField) {
  postContent(collectionId, path, JSON.stringify(data),
    success = function (response) {
      console.log("Updating completed " + response);
      Florence.Editor.isDirty = false;
      refreshRelated(collectionId, data, templateData, field, idField);
      refreshPreview(path);
      var iframeEvent = document.getElementById('iframe').contentWindow;
      iframeEvent.addEventListener('click', Florence.Handler, true);
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

