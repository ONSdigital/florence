function saveAndCompleteContent(collectionId, path, content) {
  postContent(collectionId, path, content,
    success = function (response) {
      Florence.Editor.isDirty = false;
      completeContent(collectionId, path);
    },
    error = function (response) {
      if (response.status === 400) {
        alert("Cannot edit this file. It is already part of another collection.");
      }
      else if (response.status == 401) {
        alert("You are not authorised to update content.");
      }
      else {
        handleApiError(response);
      }
    });
}

function completeContent(collectionId, path) {
  // Update content
  $.ajax({
    url: "/zebedee/complete/" + collectionId + "?uri=" + path + "/data.json",
    dataType: 'json',
    type: 'POST',
    success: function (message) {
      //console.log("Page is now marked as complete " + message);
      //alert("This content has now been submitted for internal review.")
      viewCollections(collectionId);
    },
    error: function (response) {
      handleApiError(response);
    }
  });
}
