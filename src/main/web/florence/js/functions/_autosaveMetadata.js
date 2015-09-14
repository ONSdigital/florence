function autoSaveMetadata (timeoutId, collectionId, data) {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(function() {
    // Runs 3 second (3000 ms) after the last change
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
  }, 3000);
}