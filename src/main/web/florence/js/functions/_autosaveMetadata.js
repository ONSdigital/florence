/**
 * Saves data. Used to save metadata in a timeout
 * @param collectionId
 * @param data
 */
function autoSaveMetadata(collectionId, data) {
  putContent(collectionId, data.uri, JSON.stringify(data),
    success = function () {
      Florence.Editor.isDirty = false;
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

