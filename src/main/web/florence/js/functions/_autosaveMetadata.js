function autoSaveMetadata(collectionId, data) {
  postContent(collectionId, data.uri, JSON.stringify(data),
    success = function () {
      Florence.Editor.isDirty = false;
    },
    error = function (response) {
      if (response.status === 400) {
        alert("Cannot edit this page. It is already part of another collection.");
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

